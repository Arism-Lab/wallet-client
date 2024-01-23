import axios from 'axios'
import type * as P2P from '@/types/p2p'
import { kCombinations, thresholdSame } from '@/libs/arithmetic'
import { BN, N, H, C } from '@/common/index'
import { lagrangeInterpolation } from '@/libs/arithmetic'

const fetchNodes = async () => {
  const urls: string[] = []
  const publicKeys: { X: string; Y: string }[] = []
  const indices: number[] = []

  await axios.get(N.URLS[1]).then(() => {
    urls.push(N.URLS[1])
    publicKeys.push({
      X: 'bc38813a6873e526087918507c78fc3a61624670ee851ecfb4f3bef55d027b5a',
      Y: 'ac4b21229f662a0aefdfdac21cf17c3261a392c74a8790db218b34e3e4c1d56a',
    })
    indices.push(1)
  })

  await axios.get(N.URLS[2]).then(() => {
    urls.push(N.URLS[2])
    publicKeys.push({
      X: 'b56541684ea5fa40c8337b7688d502f0e9e092098962ad344c34e94f06d293fb',
      Y: '759a998cef79d389082f9a75061a29190eec0cac99b8c25ddcf6b58569dad55c',
    })
    indices.push(2)
  })

  await axios.get(N.URLS[3]).then(() => {
    urls.push(N.URLS[3])
    publicKeys.push({
      X: '4b5f33d7dd84ea0b7a1eb9cdefe33dbcc6822933cfa419c0112e9cbe33e84b26',
      Y: '7a7813bf1cbc2ee2c6fba506fa5de2af1601a093d93716a78ecec0e3e49f3a57',
    })
    indices.push(3)
  })

  if (urls.length < 2) throw new Error('Not enough s')

  return { urls, publicKeys, indices }
}

export const getAddress = async (
  input: P2P.GetAddressRequest
): Promise<{
  data?: P2P.GetAddressResponse
  error?: P2P.ErrorApi
}> => {
  let errorApi: P2P.ErrorApi | undefined

  const { urls } = await fetchNodes()

  for (const url of urls) {
    try {
      const { owner } = input
      const { data } = await axios.post<P2P.GetAddressResponse>(
        `${url}/wallets`,
        { owner }
      )
      return { data, error: undefined }
    } catch (error: any) {
      const errorMessage = error.response?.data.message
      const statusCode = error.response?.data.statusCode
      errorApi = { errorMessage, statusCode }
    }
  }
  return { data: undefined, error: errorApi }
}

export const constructPrivateKey = async (
  input: P2P.GetPrivateKeyRequest
): Promise<{ data?: P2P.GetPrivateKeyResponse; error?: P2P.ErrorApi }> => {
  try {
    const { tokenId, owner, verifier } = input
    await getAddress({ owner, verifier })

    const tempPrivateKey = C.generatePrivateKey()
    const tempPublicKey = C.getPublicKey(tempPrivateKey).toString('hex')
    const commitment = H.keccak256(tokenId)

    const { urls, indices } = await fetchNodes()
    const signatures = []

    for (const url in urls) {
      try {
        const p = await axios.post<P2P.CommitmentResponse>(
          `${url}/commitments`,
          {
            commitment,
            tempPublicKey,
            timestamp: (Date.now() + 60).toString(),
          }
        )
        signatures.push(p.data)
      } catch {}
    }

    if (signatures.length <= ~~(urls.length / 4) * 3 + 1) {
      return {
        data: undefined,
        error: { statusCode: '400', errorMessage: 'Invalid signature' },
      }
    }

    const shares: P2P.ShareResponse[] = []
    for (const url in urls) {
      try {
        const p = await axios.post<P2P.ShareResponse>(`${url}/shared-keys`, {
          signatures,
          verifier,
          owner,
          tokenId,
          tempPublicKey,
        })
        shares.push(p.data)
      } catch {}
    }

    const completedRequests = shares.filter((x) => x)
    const thresholdPublicKey = thresholdSame(
      shares.map((x) => x && x.publicKey),
      ~~(urls.length / 2) + 1
    )

    if (completedRequests.length >= ~~(urls.length / 2) + 1) {
      const sharePromises: Promise<undefined | Buffer>[] = []
      const shareIndices: BN[] = []

      for (let i = 0; i < shares.length; i += 1) {
        const key = shares[i]
        if (key) {
          if (key.metadata) {
            const metadata = {
              ephemPublicKey: Buffer.from(key.metadata.ephemPublicKey, 'hex'),
              iv: Buffer.from(key.metadata.iv, 'hex'),
              mac: Buffer.from(key.metadata.mac, 'hex'),
            }
            const shareDecrypt = C.decrypt(tempPrivateKey, {
              ...metadata,
              ciphertext: Buffer.from(key.share, 'hex'),
            })
            sharePromises.push(shareDecrypt)
          }
        } else {
          sharePromises.push(
            Promise.resolve(Buffer.from(key.share.padStart(66, '0'), 'hex'))
          )
        }
        shareIndices.push(BN.from(indices[i], 16))
      }

      const sharesResolved: (undefined | Buffer)[] = await Promise.all(
        sharePromises
      )

      const decryptedShares = sharesResolved.reduce((acc, curr, index) => {
        if (curr)
          acc.push({
            index: shareIndices[index],
            value: BN.from(curr, 'hex'),
          })
        return acc
      }, [] as { index: BN; value: BN }[])

      const allCombis = kCombinations(
        decryptedShares.length,
        ~~(urls.length / 2) + 1
      )
      let privateKey: BN | null = null

      for (let j = 0; j < allCombis.length; j += 1) {
        const currCombi = allCombis[j]
        const currCombiShares = decryptedShares.filter((_, index) =>
          currCombi.includes(index)
        )

        const currShares = currCombiShares.map((x) => x.value)
        const currIndices = currCombiShares.map((x) => x.index)
        const derivedPrivateKey = lagrangeInterpolation(
          currIndices,
          currShares,
          BN.ZERO
        )

        if (!derivedPrivateKey) {
          continue
        }

        const decryptedPublicKey = C.getPublicKey(
          Buffer.from(derivedPrivateKey.toString(16, 64), 'hex')
        ).toString('hex')

        if (thresholdPublicKey === decryptedPublicKey) {
          privateKey = derivedPrivateKey
        }
      }

      if (!privateKey) {
        return {
          data: undefined,
          error: {
            errorMessage: 'could not derive private key',
            statusCode: '400',
          },
        }
      }

      const address = C.privateKeyToAddress(privateKey)
      return {
        data: {
          address,
          privateKey: privateKey.toString('hex', 64),
        },
        error: undefined,
      }
    }
  } catch {}
  return {
    data: undefined,
    error: { statusCode: '400', errorMessage: 'Failed to get private key' },
  }
}

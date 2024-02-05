import { GetPrivateKeyResponse } from './p2p'

declare module 'next-page-transitions'
declare module 'react-scroll-progress-bar'

declare module 'next-auth' {
  interface Session {
    user: User
    token: JWT
    key?: GetPrivateKeyResponse
  }
}

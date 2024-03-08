import { PageSEO } from '@components/PageSEO'
import sideNavigation from '@data/sideNavigation'
import { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async (a) => {
  const siteInfo = sideNavigation.find((item) => item.path === '/dids')

  return {
    props: {
      title: siteInfo?.title,
      description: siteInfo?.description,
    },
  }
}

const DIDs = ({ title, description }: PageSEOProps) => {
  return (
    <>
      <PageSEO title={title} description={description} />
    </>
  )
}

export default DIDs

import { PageSEO } from '@components/PageSEO'
import sideNavigation from '@data/sideNavigation'
import { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async (a) => {
  const siteInfo = sideNavigation.find((item) => item.path === '/devices')

  return {
    props: {
      title: siteInfo?.title,
      description: siteInfo?.description,
    },
  }
}

const Devices = ({ title, description }: PageSEOProps) => {
  return (
    <>
      <PageSEO title={title} description={description} />
    </>
  )
}

export default Devices

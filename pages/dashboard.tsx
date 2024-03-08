import { PageSEO } from '@components/PageSEO'
import sideNavigation from '@data/sideNavigation'
import { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async () => {
  const siteInfo = sideNavigation.find((item) => item.path === '/dashboard')

  return {
    props: {
      title: siteInfo?.title,
      description: siteInfo?.description,
    },
  }
}

const Dashboard = ({ title, description }: PageSEOProps) => {
  return (
    <>
      <PageSEO title={title} description={description} />
    </>
  )
}

export default Dashboard

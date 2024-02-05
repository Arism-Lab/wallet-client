export {}

declare global {
  type PageSEOProps = {
    title: string
    description: string
  }

  type Wrapper = {
    children: React.ReactNode
    className?: string
  }
}

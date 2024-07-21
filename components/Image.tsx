import NextImage, { ImageProps } from 'next/image'

const Image = ({ ...rest }: ImageProps) => (
	<NextImage {...rest} placeholder="blur" priority blurDataURL="/static/placeholder.png" />
)

export default Image

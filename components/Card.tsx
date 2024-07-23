import React from 'react'

const Card = ({ className, children }) => {
	return (
		<div className="group relative flex cursor-pointer flex-wrap border border-zinc-300 bg-opacity-50 p-px transition duration-200 hover:scale-105">
			<div className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary-800 duration-200 group-hover:scale-x-100" />
			<div className="absolute bottom-0 left-0 h-full w-0.5 origin-bottom scale-y-0 bg-primary-800 duration-200 group-hover:scale-y-100" />
			<div className="absolute left-0 top-0 h-0.5 w-full origin-right scale-x-0 bg-primary-800 duration-200 group-hover:scale-x-100" />
			<div className="absolute bottom-0 right-0 h-full w-0.5 origin-top scale-y-0 bg-primary-800 duration-200 group-hover:scale-y-100" />
			<div className={className}>{children}</div>
		</div>
	)
}

export default Card

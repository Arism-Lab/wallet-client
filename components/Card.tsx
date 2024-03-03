import React from 'react'

const Card = ({ className, children }: Wrapper): JSX.Element => {
  return (
    <div className="group group relative flex transform cursor-pointer flex-wrap border border-gray-300 bg-opacity-50 p-px py-px transition duration-200 hover:scale-105 ">
      <div className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 transform bg-primary-800 duration-200 group-hover:scale-x-100" />
      <div className="absolute bottom-0 left-0 h-full w-0.5 origin-bottom scale-y-0 transform bg-primary-800 duration-200 group-hover:scale-y-100" />
      <div className="absolute left-0 top-0 h-0.5 w-full origin-right scale-x-0 transform bg-primary-800 duration-200 group-hover:scale-x-100" />
      <div className="absolute bottom-0 right-0 h-full w-0.5 origin-top scale-y-0 transform bg-primary-800 duration-200 group-hover:scale-y-100" />
      <div className={className}>{children}</div>
    </div>
  )
}

export default Card

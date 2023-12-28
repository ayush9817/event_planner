import React from 'react'

const DashHeader = ({title}) => {
  return (
    <header className="inner-head-bg bg-stone-200 text-white p-4 h-[72px] py-5 ">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        
      </div>
    </header>
  )
}

export default DashHeader
import React from 'react'
import {LoaderIcon} from "lucide-react"
import DecorativeBg from './DecorativeBg'
const PageLoader = () => {
  return (
    <div className='flex items-center bg-slate-900 overflow-hidden justify-center h-screen relative'>
         <DecorativeBg/>
        <LoaderIcon className="animate-spin size-10"/>
    </div>
  )
}

export default PageLoader
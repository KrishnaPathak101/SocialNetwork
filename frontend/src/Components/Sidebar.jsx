import React from 'react'

const Sidebar = () => {
  return (
    <div>
        <div className=' bg-black h-screen min-w-[200px]'>
         <div className=' ml-4'>
            <div className=' text-white text-xl'>CONVO</div>
         </div>
         {/* options */}
         <div className=' pl-2 px-2 py-2 mt-5 flex gap-2'>
          <div>
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" text-white w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
           </svg>
           </div>
           <div>
           <p className=' font-bold text-white'>Home</p>
           </div>
         </div>
         <div className=' pl-2 px-2 py-2 mt-5 flex gap-2'>
          <div>
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" text-white w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
           </svg>
           </div>
           <div>
           <p className=' font-bold text-white'>Home</p>
           </div>
         </div>
         <div className=' pl-2 px-2 py-2 mt-5 flex gap-2'>
          <div>
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" text-white w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
           </svg>
           </div>
           <div>
           <p className=' font-bold text-white'>Home</p>
           </div>
         </div>
        </div>
    </div>
  )
}

export default Sidebar
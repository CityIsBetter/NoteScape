import React from 'react'
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

export default function Footer() {
  return (
    <div className="flex flex-col mt-24">
        <div className='border-t-2 border-gray-200 flex flex-row py-12 px-32 justify-evenly'>
            <div className="flex flex-col">
                <div className="text-2xl font-bold underline">NoteScape</div>
                <p className='w-3/4 text-tcolor'>Make your thoughts actionable with NoteScape's dynamic workspace.</p>
            </div>
            <div className="flex flex-col">
            <div className="links flex flex-col">
                <p className='text-tcolor mb-12'>Creator's Links</p>
                <a href='https://linkedin.com/in/mahesh-paul' target='_blank' className='hover:text-blue-400'>LinkedIn</a>
                <a href='https://instagram.com/mahesh_paul_j' target='_blank' className='hover:text-red-400'>Instagram</a>
                <a href='https://github.com/CityIsBetter' target='_blank' className='hover:text-gray-400'>Github</a>
            </div>
            </div>
            <div className="links flex flex-col">
                <p className='text-tcolor mb-12'>NoteScape's Links</p>
                <a href='https://linkedin.com/in/mahesh-paul' target='_blank' className='hover:text-gray-400'>Home</a>
                <a href='https://linkedin.com/in/mahesh-paul' target='_blank' className='hover:text-blue-400'>Features</a>
                <a href='https://instagram.com/mahesh_paul_j' target='_blank' className='hover:text-red-400'>About</a>
            </div>
            <div className="links flex flex-row items-end">
            <p className='flex flex-row text-lg'>See how this website was&nbsp;<a href='https://github.com/CityIsBetter' target='_blank' className='hover:text-purple-400 flex flex-row font-semibold border-b-2 border-transparent hover:border-violet-500'> made&nbsp; <FaArrowUpRightFromSquare className='text-xs self-center'/></a></p>
            </div>
        </div>
        <div className="flex items-center justify-center mb-12">© 2024 Mahesh Paul</div>
    </div>
  )
}

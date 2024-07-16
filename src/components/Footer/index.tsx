import Link from 'next/link';
import React from 'react'
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import logo from '/public/logo.png';
import Image from 'next/image';

export default function Footer() {
  return (
    <div className="flex flex-col mt-24">
        <div className='border-t-2 border-gray-200 flex flex-row max-sm:flex-col gap-12 py-12 px-28 max-lg:px-24 max-sm:px-12 justify-between'>
            <div className="flex flex-col">
                <div className="text-2xl font-bold underline"><Image src={logo} alt='logo' className='w-12 h-12'/>NoteScape</div>
                <p className='w-3/4 text-tcolor'>Make your thoughts actionable with NoteScape&apos;s dynamic workspace.</p>
            </div>
            <div className="flex flex-row gap-12">
                <div className="links flex flex-col">
                    <p className='text-tcolor mb-12 max-sm:mb-0 underline'>Creator&apos;s Links</p>
                    <a href='https://linkedin.com/in/mahesh-paul' target='_blank' className='hover:text-blue-400 transition'>LinkedIn</a>
                    <a href='https://instagram.com/mahesh_paul_j' target='_blank' className='hover:text-red-400 transition'>Instagram</a>
                    <a href='https://github.com/CityIsBetter' target='_blank' className='hover:text-gray-400 transition'>Github</a>
                </div>
                <div className="links flex flex-col">
                    <p className='text-tcolor mb-12 max-sm:mb-0 underline'>NoteScape&apos;s Links</p>
                    <Link href={'/'} className='hover:text-gray-400 transition'>Home</Link>
                    <Link href={'/Features'} className='hover:text-blue-400 transition'>Features</Link>
                    <Link href={"/About"} className='hover:text-red-400 transition'>About</Link>
                </div>
            </div>
            <div className="flex flex-row items-end justify-start">
                <p className='text-md max-sm:flex max-sm:flex-row'>See how this website was&nbsp;<a href='https://t.ly/t0ryI' target='_blank' className='hover:text-purple-400 flex-row flex font-semibold border-b-2 border-transparent hover:underline'> made&nbsp; <FaArrowUpRightFromSquare className='text-xs self-center'/></a></p>
            </div>
        </div>
        <div className="flex items-center justify-center mb-12">© 2024 Mahesh Paul</div>
    </div>
  )
}

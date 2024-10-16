import Link from 'next/link';
import React from 'react'
import logo from '/public/logo.png';
import Image from 'next/image';

export default function Footer() {
  return (
    <div className="flex flex-col mt-24">
        <div className='border-t-2 border-border flex flex-row max-sm:flex-col gap-12 py-12 px-28 max-lg:px-24 max-sm:px-12 justify-between'>
            <div className="flex flex-col">
                <div className="text-2xl font-bold underline text-accent-foreground"><Image src={logo} alt='logo' className='w-12 h-12' draggable={false}/>NoteScape</div>
                <p className='w-3/4 text-text'>Make your thoughts actionable with NoteScape&apos;s dynamic workspace.</p>
            </div>
            <div className="flex flex-row gap-12">
                <div className="links flex flex-col">
                    <p className='text-text mb-12 max-sm:mb-0 underline'>Creator&apos;s Links</p>
                    <a href='https://linkedin.com/in/mahesh-paul' target='_blank' className='hover:text-blue-400 transition'>LinkedIn</a>
                    <a href='https://instagram.com/mahesh_paul_j' target='_blank' className='hover:text-red-400 transition'>Instagram</a>
                    <a href='https://github.com/CityIsBetter' target='_blank' className='hover:text-gray-400 transition'>Github</a>
                </div>
                <div className="links flex flex-col">
                    <p className='text-text mb-12 max-sm:mb-0 underline'>NoteScape&apos;s Links</p>
                    <Link href={'/'} className='hover:text-gray-400 transition'>Home</Link>
                    <Link href={'/Features'} className='hover:text-blue-400 transition'>Features</Link>
                    <Link href={"/About"} className='hover:text-red-400 transition'>About</Link>
                    <Link href={"https://t.ly/t0ryI"} className='hover:text-purple-400 trnasition'>Blog</Link>
                    <Link href={"/Home"} className='hover:text-yellow-400 transition'>Open App</Link>
                </div>
            </div>
            <div className="flex flex-row items-end justify-start">
                <a href="https://www.producthunt.com/posts/notescape?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-notescape" target="_blank">
                    <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=504150&theme=dark"  alt='NoteScape - Website&#0032;to&#0032;meet&#0032;your&#0032;note&#0032;taking&#0032;needs&#0033; | Product Hunt' width={250} height={54}/>
                </a>
            </div>
        </div>
        <div className="flex items-center justify-center mb-12">© 2024 Mahesh Paul</div>
    </div>
  )
}

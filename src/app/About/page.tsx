import Footer from '@/components/Footer'
import Link from 'next/link'
import React from 'react'
import logo from '/public/logo.png';
import Image from 'next/image';

export default function About() {
  return (
    <main className='flex flex-col'>
        <div className='flex flex-col w-full h-full items-center'>
        {/* Navbar */}
        <div className="navbar fixed top-0 left-0 right-0 flex flex-row items-center justify-between p-4 max-sm:p-2 border-b-2 border-gray-200 bg-white z-50">
          <Link className="logo text-4xl max-lg:text-3xl font-bold max-sm:text-xl flex flex-row items-center" href={"/"}><Image src={logo} alt='logo' className='w-12 h-12 max-lg:w-10 max-lg:h-10 max-sm:w-8 max-sm:h-8'/> NoteScape</Link>
          <div className="text-xl flex flex-wrap items-center justify-center gap-2">
            <Link href={"/Features"} className="p-2 max-sm:p-0 rounded-md hover:bg-gray-100 transition max-sm:text-sm">Features</Link>
            <Link href={"/About"} className="p-2 max-sm:p-0 rounded-md hover:bg-gray-100 transition max-sm:text-sm">About</Link>
            <Link href={"/SignIn"} className="p-2 max-sm:p-0 rounded-md hover:bg-gray-100 transition max-sm:hidden">Sign In</Link>
            <Link href={"/Home"}>
              <button className="rounded-xl p-2 border-2 border-violet-300 hover:text-white hover:bg-gradient-to-br from-purple-600 to-blue-500 text-gray-700 font-semibold hover:shadow-xl hover:scale-105 hover:shadow-violet-500 transition">Open App</button>
            </Link>
          </div>
        </div>
            <div className="flex flex-col w-1/2 max-md:w-5/6 max-sm:w-11/12 items-center justify-center  h-full pt-24 pb-12 mt-20 text-center">
                <h1 className="text-4xl font-extrabold mb-6">About <span className='text-transparent bg-clip-text bg-gradient-to-br from-violet-600 to-blue-500'>NoteScape</span></h1>
                <p className="text-xl mb-4">
                Hello! I&apos;m <strong>Mahesh Paul</strong>, and I created <strong>NoteScape</strong> to make note-taking simple and seamless. With powerful tools that make organizing your thoughts and ideas easier, NoteScape aims to enhance your productivity. ✍️✨
                </p>
                <p className="text-xl mb-4">
                <strong>NoteScape</strong> is built using <strong>Next.js</strong> and <strong>TypeScript</strong> for a robust and scalable frontend, and it leverages <strong>Firebase</strong> for real-time data synchronization and storage. The <strong>Novel.sh editor</strong> brings advanced note-taking features, making it easy to add todos, quotes, code blocks, headings, images, and more. 🛠️📚
                </p>
                <p className="text-xl mb-4">
                This is an <strong>open-source project</strong> and <strong>contributions are welcomed</strong>. Join me in making NoteScape better for everyone. Feel free to check out the code on <a href="https://github.com/CityIsBetter/NoteScape" className="text-blue-500 hover:underline">GitHub</a> and contribute! 🌟👩‍💻👨‍💻
                </p>
                <p>Links that helped me create the Logo: <a href="https://www.textstudio.com/" className='text-blue-400'>Font generator</a> and
                <a href="https://www.flaticon.com/free-icons/3d-notes" title="3d notes icons" className='text-blue-400'> 3d notes icons created by Freepik - Flaticon</a></p>
            </div>
            
            </div>
    <Footer />
    </main>
  )
}

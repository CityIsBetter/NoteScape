import Footer from '@/components/Footer'
import Link from 'next/link'
import React from 'react'

export default function About() {
  return (
    <main className='flex flex-col'>
        <div className='flex flex-col w-full h-full items-center'>
        {/* Navbar */}
        <div className="navbar fixed top-0 left-0 right-0 flex flex-row items-center justify-between p-4 max-sm:p-2 border-b-2 border-gray-200 bg-white z-50">
          <Link className="logo text-2xl font-bold max-sm:text-xl" href={"/"}>NoteScape</Link>
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
            </div>
            
            </div>
    <Footer />
    </main>
  )
}

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import mockup1 from '/public/assets/mockup1.png';
import mockup2 from '/public/assets/mockup1.png';  // Add more mockup images as needed

export default function Home() {
  return (
    <main className='flex flex-col w-full h-full'>
      {/* Navbar */}
      <div className="navbar fixed top-0 left-0 right-0 flex flex-row items-center justify-between p-4 border-b-2 border-gray-200 bg-white z-50">
        <div className="logo text-2xl font-bold">NoteScape</div>
        <div className="text-xl">
          <Link href={"/"} className="mr-4 p-2 rounded-md hover:bg-gray-100 transition">Features</Link>
          <Link href={"/"} className="mr-2 p-2 rounded-md hover:bg-gray-100 transition">About</Link>
          <Link href={"/SignIn"} className="ml-2 mr-4 p-2 rounded-md hover:bg-gray-100 transition">Sign In</Link>
          <Link href={"/Home"}><button className="rounded-xl p-2 border-2 border-violet-300 hover:text-white hover:bg-gradient-to-br from-purple-600 to-blue-500 text-gray-700 font-semibold hover:shadow-xl hover:scale-105 hover:shadow-violet-500 transition">Open App</button></Link>
        </div>
      </div>

      {/* Hero */}
      <div className="hero flex items-center justify-center flex-col text-center gap-12 mt-40 mb-40">
        <div className="heading text-7xl font-bold w-2/3">The Ultimate Note-Taking Experience</div>
        <div className="subheading text-xl text-gray-600">Simplify your workflow with NoteScape's all-in-one note-taking solution.</div>
        <Link href={"/Home"}><button className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4  origin-left hover:decoration-2 hover:text-gray-500 relative bg-gray-200 h-16 w-64 border-2 border-gray-200 text-left p-3 text-tcolor text-base font-bold rounded-lg  overflow-hidden  before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 after:h-20 after:content['']  after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">Start Taking Notes</button></Link>
        <Image src={mockup1} alt='mockup' className='w-2/3 rounded-2xl border-2 border-gray-200' />
      </div>

      {/* Features Section */}
      <div className="features flex flex-col items-center text-center gap-12 p-8">
        <div className="feature-heading text-5xl font-bold">Features</div>
        <div className="feature-description text-xl text-gray-600">NoteScape offers a wide range of features to enhance your note-taking experience.</div>

        <div className="feature-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          <div className="feature-item p-4 border-2 border-gray-200 rounded-lg shadow-lg h-40">
            <div className="feature-title text-2xl font-bold">Sync Across Devices</div>
            <div className="feature-text text-lg text-gray-600">Access your notes anywhere, anytime with Google Account sync.</div>
          </div>

          <div className="feature-item p-4 border-2 border-gray-200 rounded-lg shadow-lg h-40">
            <div className="feature-title text-2xl font-bold">Organize with Folders</div>
            <div className="feature-text text-lg text-gray-600">Keep your notes neatly organized with folders and favorites.</div>
          </div>

          <div className="feature-item p-4 border-2 border-gray-200 rounded-lg shadow-lg h-40">
            <div className="feature-title text-2xl font-bold">Set Reminders</div>
            <div className="feature-text text-lg text-gray-600">Never miss a task with our upcoming reminders feature.</div>
          </div>

          <div className="feature-item p-4 border-2 border-gray-200 rounded-lg shadow-lg h-40">
            <div className="feature-title text-2xl font-bold">Novel.sh Editor</div>
            <div className="feature-text text-lg text-gray-600">Experience seamless writing with Novel.sh, a layer on top of the TipTap editor.</div>
          </div>
        </div>

        <Image src={mockup2} alt='mockup' className='w-2/3 rounded-2xl border-2 border-gray-200 mt-12' />
        {/* Add more images as needed */}
      </div>
    </main>
  )
}

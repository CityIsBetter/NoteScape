import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import mockup1 from '/public/assets/mockup1.png';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className='flex flex-col w-full h-full'>
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

      {/* Hero */}
      <div className="hero flex flex-col items-center justify-center text-center gap-12 mt-40 mb-40 px-4 sm:px-8">
        <div className="heading w-full max-w-4xl">
          <p className='text-6xl sm:text-6xl lg:text-7xl font-bold'>
            The Ultimate <span className='bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-400 bg-clip-text text-transparent'>Note-Taking</span> Experience
          </p>
        </div>
        <div className="subheading w-full max-w-2xl">
          <p className='text-lg sm:text-xl text-gray-600'>Simplify your workflow with NoteScape&apos;s all-in-one note-taking solution.</p>
        </div>
        <Link href={"/Home"}>
          <button className="relative bg-gray-200 h-12 sm:h-16 w-48 sm:w-64 border-2 border-gray-200 text-left p-3 text-tcolor text-sm sm:text-base font-bold rounded-lg overflow-hidden transition group">
            <span className="relative z-10">Start Taking Notes</span>
            <span className="absolute right-1 top-1 w-8 h-8 sm:w-12 sm:h-12 bg-violet-500 rounded-full blur-lg group-hover:blur-md transition"></span>
            <span className="absolute right-8 top-3 w-12 h-12 sm:w-20 sm:h-20 bg-rose-300 rounded-full blur-lg group-hover:blur-md transition"></span>
          </button>
        </Link>
        <Image src={mockup1} alt='mockup' className='w-full max-w-3xl rounded-2xl border-2 border-gray-200' />
      </div>

      {/* Features Section */}
      <div className="features flex flex-col items-center text-center gap-8 p-4 sm:p-8">
        <div className="feature-description text-lg sm:text-xl text-gray-600">NoteScape offers a wide range of features to enhance your note-taking experience.</div>

        <div className="feature-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 w-full max-w-6xl">
          <div className="feature-item p-4 border-2 border-gray-200 rounded-lg shadow-lg h-40 flex flex-col justify-center">
            <div className="feature-title text-xl sm:text-2xl font-bold">Sync Across Devices📱</div>
            <div className="feature-text text-sm sm:text-lg text-gray-600">Access your notes anywhere, anytime with Google Account sync.</div>
          </div>

          <div className="feature-item p-4 border-2 border-gray-200 rounded-lg shadow-lg h-40 flex flex-col justify-center">
            <div className="feature-title text-xl sm:text-2xl font-bold">Organize with Folders📂</div>
            <div className="feature-text text-sm sm:text-lg text-gray-600">Keep your notes neatly organized with folders and favorites.</div>
          </div>

          <div className="feature-item p-4 border-2 border-gray-200 rounded-lg shadow-lg h-40 flex flex-col justify-center">
            <div className="feature-title text-xl sm:text-2xl font-bold">Set Reminders⏰</div>
            <div className="feature-text text-sm sm:text-lg text-gray-600">Never miss a task with our upcoming reminders feature.</div>
          </div>

          <div className="feature-item p-4 border-2 border-gray-200 rounded-lg shadow-lg h-40 flex flex-col justify-center lg:col-start-2">
            <div className="feature-title text-xl sm:text-2xl font-bold">Novel.sh Editor 📝</div>
            <div className="feature-text text-sm sm:text-lg text-gray-600">Experience seamless writing with Novel.sh, an editor with tons of features!</div>
          </div>
        </div>
        
        <div className="mt-8">
          <p>See more <span className='underline font-semibold text-violet-400 hover:text-purple-400 transition'><Link href={"/Features"}>Features</Link></span></p>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

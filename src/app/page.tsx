import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import mockup1 from '/public/assets/mockup1.png';
import Footer from '@/components/Footer';
import logo from '/public/logo.png';
import Head  from 'next/head';

export default function Home() {

  return (
    <>
    <Head>
      <title>Home</title>
      <meta name="google-site-verification" content="IVOjL--iVz33j73JnMvQT2vZsRoEje6C9GQGxF8BlxQ" />
    </Head>
    <main className='flex flex-col w-full h-full'>
      {/* Navbar */}
      <div className="navbar fixed top-0 left-0 right-0 flex flex-row items-center justify-between p-4 max-sm:p-2 border-b-2 border-border bg-background z-50">
        <Link className="logo text-4xl max-lg:text-3xl font-bold max-sm:text-xl flex flex-row items-center" href={"/"}><Image src={logo} alt='logo' className='w-12 h-12 max-lg:w-10 max-lg:h-10 max-sm:w-8 max-sm:h-8'/> NoteScape</Link>
        <div className="text-xl flex flex-wrap items-center justify-center gap-2">
          <Link href={"/Features"} className="p-2 max-sm:p-0 rounded-md hover:bg-secondary transition max-sm:text-sm">Features</Link>
          <Link href={"/About"} className="p-2 max-sm:p-0 rounded-md hover:bg-secondary transition max-sm:text-sm">About</Link>
          <Link href={"/SignIn"} className="p-2 max-sm:p-0 rounded-md hover:bg-secondary transition max-sm:hidden">Sign In</Link>
          <Link href={"/Home"}>
            <button className="rounded-xl p-2 border-2 border-violet-300 hover:text-white hover:bg-gradient-to-br from-purple-600 to-blue-500 text-foreground font-semibold hover:shadow-xl hover:scale-105 hover:shadow-violet-500 transition">Open App</button>
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
          <p className='text-lg sm:text-xl text-text'>Simplify your workflow with NoteScape&apos;s all-in-one note-taking solution.</p>
        </div>
        <Link href={"/Home"}>
        <Link href={"/Home"}><button className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4  origin-left hover:decoration-2 hover:text-text relative bg-background h-16 w-64 border-2 border-border text-left p-3 text-tcolor text-base font-bold rounded-lg  overflow-hidden  before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 after:h-20 after:content['']  after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">Start Taking Notes</button></Link>
        </Link>
        <Image src={mockup1} alt='mockup' className='w-full max-w-3xl' draggable='false'/>
      </div>

      {/* Features Section */}
      <div className="features flex flex-col items-center text-center gap-8 p-4 sm:p-8">
        <div className="feature-description text-lg sm:text-xl text-text">NoteScape offers a wide range of features to enhance your note-taking experience.</div>

        <div className="feature-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 w-full max-w-6xl">
          {/* <div className="feature-item p-4 border-2 border-border rounded-lg h-40 flex flex-col justify-center bg-secondary">
            <div className="feature-title text-xl sm:text-2xl font-bold">Sync Across Devices📱</div>
            <div className="feature-text text-sm sm:text-lg text-gray-500">Access your notes anywhere, anytime with Google Account sync.</div>
          </div> */}

          <div className="group relative justify-center h-40">
            <span className="absolute inset-0 border-2 border-dashed border-secondary-foreground"></span>
            <div className="relative flex h-full transform items-center border-2 border-secondary-foreground bg-secondary transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
              <div className="absolute p-4 group-hover:relative">
                <div className="feature-title text-xl sm:text-2xl font-bold">Sync Across Devices📱</div>
                <div className="feature-text text-sm sm:text-lg text-gray-500">Access your notes anywhere, anytime with Google Account sync.</div>
              </div>
            </div>
          </div>

          <div className="group relative justify-center h-40">
          <span className="absolute inset-0 border-2 border-dashed border-secondary-foreground"></span>
          <div className="relative flex h-full transform items-center border-2 border-secondary-foreground bg-secondary transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
            <div className="absolute p-4 group-hover:relative">
              <div className="feature-title text-xl sm:text-2xl font-bold">Organize with Folders📂</div>
              <div className="feature-text text-sm sm:text-lg text-gray-500">Keep your notes neatly organized with folders and favorites.</div>
            </div>
          </div>
          </div>

          <div className="group relative justify-center h-40">
          <span className="absolute inset-0 border-2 border-dashed border-secondary-foreground"></span>
          <div className="relative flex h-full transform items-center border-2 border-secondary-foreground bg-secondary transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
            <div className="absolute p-4 group-hover:relative">
              <div className="feature-title text-xl sm:text-2xl font-bold">Set Reminders⏰</div>
              <div className="feature-text text-sm sm:text-lg text-gray-500">Never miss a task with our upcoming reminders feature.</div>
            </div>
          </div>
          </div>

          <div className="group relative justify-center h-40">
          <span className="absolute inset-0 border-2 border-dashed border-secondary-foreground"></span>
          <div className="relative flex h-full transform items-center border-2 border-secondary-foreground bg-secondary transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
            <div className="absolute p-4 group-hover:relative">
              <div className="feature-title text-xl sm:text-2xl font-bold">Novel.sh Editor 📝</div>
              <div className="feature-text text-sm sm:text-lg text-gray-500">Experience seamless writing with Novel.sh, an editor with tons of features!</div>
            </div>
          </div>
          </div>

          <div className="group relative justify-center h-40">
          <span className="absolute inset-0 border-2 border-dashed border-secondary-foreground"></span>
          <div className="relative flex h-full transform items-center border-2 border-secondary-foreground bg-secondary transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
            <div className="absolute p-4 group-hover:relative">
              <div className="feature-title text-xl sm:text-2xl font-bold">AI Assistant🤖</div>
              <div className="feature-text text-sm sm:text-lg text-gray-500">Get answers to your questions and auto-complete sentences with &quot;++&quot; at the end.</div>
            </div>
          </div>
          </div>

          <div className="group relative justify-center h-40">
          <span className="absolute inset-0 border-2 border-dashed border-secondary-foreground"></span>
          <div className="relative flex h-full transform items-center border-2 border-secondary-foreground bg-secondary transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
            <div className="absolute p-4 group-hover:relative">
              <div className="feature-title text-xl sm:text-2xl font-bold">Image Upload🖼️</div>
              <div className="feature-text text-sm sm:text-lg text-gray-500">Upload images using &quot;/image&quot; or by dragging and dropping them into the editor.</div>
            </div>
          </div>
          </div>
        </div>

        
        <div className="mt-8">
          <p>See more <span className='underline font-semibold text-violet-400 hover:text-purple-400 transition'><Link href={"/Features"}>Features</Link></span></p>
        </div>
      </div>
      
      <Footer />
    </main>
    </>
  );
}
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

import favorite from '/public/assets/favorite.png';
import signin from '/public/assets/signin.png';
import folder from '/public/assets/folder.png';
import template from '/public/assets/template.png';
import note from '/public/assets/note.png';

import Footer from '@/components/Footer';

export default function Features() {
    const features = [
        {
          title: 'Seamless Sync Across Devices',
          description: 'Your notes are automatically synced with your Google account. Access them from any device, anytime. No more worrying about losing your notes. NoteScape ensures that you always have the latest version of your notes, whether you’re switching from your phone to your laptop or accessing your notes from a tablet. This seamless syncing capability allows you to stay productive and organized no matter where you are. 📱💻',
          img: signin,
        },
        {
          title: 'Organize with Folders',
          description: 'Group your notes into folders to keep everything organized. Easily find what you need, when you need it. Create custom folders for different projects, subjects, or ideas, and move your notes into the appropriate folders with just a few clicks. This feature helps you maintain a clutter-free workspace and quickly locate important information without wasting time searching through unorganized notes. 📂',
          img: folder,
        },
        {
          title: 'Favorite Notes',
          description: 'Mark important notes as favorites for quick access. Never lose track of your essential ideas and information. With the ability to favorite notes, you can prioritize and easily return to your most important thoughts and tasks. This feature is particularly useful for managing critical information that you need to refer back to frequently, ensuring that your key notes are always just a click away. ⭐',
          img: favorite,
        },
        {
          title: 'Kickstart with Templates',
          description: 'Use templates to start your notes quickly. Choose from a variety of pre-designed templates to suit your needs. Whether you’re drafting a project plan, creating a study guide, or brainstorming new ideas, our templates provide a structured starting point to help you get your thoughts down efficiently. Customize templates to fit your specific requirements and streamline your note-taking process. 📑',
          img: template,
        },
        {
          title: 'Enhanced Note-taking with Novel.sh Editor',
          description: 'Experience advanced note-taking features with the Novel.sh editor. Add todos, quotes, code blocks, headings, images, and more to your notes. The editor offers a rich array of tools to enhance your notes, making them more informative and visually appealing. Whether you’re compiling research, writing a detailed report, or organizing your thoughts, the Novel.sh editor helps you create professional and comprehensive notes with ease. 📝🖼️',
          img: note,
        },
      ];
      

  return (
    <main className="flex flex-col w-full h-full">
      {/* Navbar */}
      <div className="navbar fixed top-0 left-0 right-0 flex flex-row items-center justify-between p-4 border-b-2 border-gray-200 bg-white z-50">
        <Link className="logo text-2xl font-bold" href={"/"}>NoteScape</Link>
        <div className="text-xl">
          <Link href={"/Features"} className="mr-4 p-2 rounded-md hover:bg-gray-100 transition">Features</Link>
          <Link href={"/About"} className="mr-2 p-2 rounded-md hover:bg-gray-100 transition">About</Link>
          <Link href={"/SignIn"} className="ml-2 mr-4 p-2 rounded-md hover:bg-gray-100 transition">Sign In</Link>
          <Link href={"/Home"}>
            <button className="rounded-xl p-2 border-2 border-violet-300 hover:text-white hover:bg-gradient-to-br from-purple-600 to-blue-500 text-gray-700 font-semibold hover:shadow-xl hover:scale-105 hover:shadow-violet-500 transition">
              Open App
            </button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center h-screen bg-white text-center">
        <h1 className="text-6xl font-bold ">
          Discover NoteScape&apos;s <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500'>Features</span> 
        </h1>
        <p className="text-xl text-gray-600 mt-4">Maximize your productivity with our powerful tools.</p>
      </div>

      {/* Features Section */}
      <div className="flex flex-col items-center w-full">
        {features.map((feature, index) => (
          <div key={index} className={`flex w-4/5 py-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className="w-1/2 flex items-center justify-center">
              <Image src={feature.img} alt={`${feature.title} mockup`} className='rounded-2xl'/>
            </div>
            <div className="w-1/2 flex flex-col justify-center p-6">
              <h2 className="text-4xl font-bold mb-4">{feature.title}</h2>
              <p className="text-lg text-gray-700">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
      <Footer/>
    </main>
  );
}

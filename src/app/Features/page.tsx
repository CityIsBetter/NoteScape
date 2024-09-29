import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { cookies } from 'next/headers';

import favorite from '/public/assets/favorite.png';
import signin from '/public/assets/signin.png';
import folder from '/public/assets/folder.png';
import template from '/public/assets/template.png';
import note from '/public/assets/note.png';
import imageUpload from '/public/assets/imageUpload.gif';
import AIassistant from '/public/assets/AIassistant.gif';
import logo from '/public/logo.png';
import Reminders from '/public/assets/reminders.gif';
import TakingNote from '/public/assets/taking_note.png';

import Footer from '@/components/Footer';

export default function Features() {
  
  const user = cookies().get('user-notescape');

    const features = [
      {
        title: 'Seamless Sync Across Devices',
        description: 'Your notes are automatically synced with your Google account. Access them from any device, anytime. No more worrying about losing your notes. NoteScape ensures that you always have the latest version of your notes, whether you’re switching from your phone to your laptop or accessing your notes from a tablet. This seamless syncing capability allows you to stay productive and organized no matter where you are. 📱💻',
        img: signin,
      },
      {
        title: 'AI Assistant',
        description: 'Leverage the power of AI to enhance your note-taking experience. Our AI assistant can answer questions and provide relevant information, making your notes more informative and interactive. Additionally, by typing "++" at the end of a sentence or phrase, the AI can auto-complete your sentences, helping you to write more efficiently and effectively. 🤖💬',
        img: AIassistant,
      },
      {
        title: 'Reminders',
        description: 'Stay organized and never miss a deadline with our Reminders feature! Easily add tasks and set reminders to keep track of important events and deadlines. 🗓️⏰ Your upcoming reminders are conveniently displayed on the home page, ensuring you always stay on top of your schedule. Whether it’s a meeting, a project deadline, or a personal task, our Reminders feature helps you stay focused and productive. 💪📋',
        img: Reminders,
      },
      {
        title: 'Image Upload',
        description: 'Easily add visual elements to your notes with our image upload feature. You can upload images by using the "/image" command or simply drag and drop them into your notes. This feature allows you to enrich your notes with relevant images, making them more engaging and visually appealing. 🖼️📷',
        img: imageUpload,
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
      <div className="navbar fixed top-0 left-0 right-0 flex flex-row items-center justify-between p-4 max-sm:p-2 border-b-2 border-border bg-background z-50">
        <Link className="logo text-4xl max-lg:text-3xl font-bold max-sm:text-xl flex flex-row items-center" href={"/"}><Image src={logo} alt='logo' className='w-12 h-12 max-lg:w-10 max-lg:h-10 max-sm:w-8 max-sm:h-8'/> NoteScape</Link>
        <div className="text-xl flex flex-wrap items-center justify-center gap-2">
          <Link href={"/Features"} className="p-2 max-sm:p-0 rounded-md hover:bg-secondary transition max-sm:text-sm">Features</Link>
          <Link href={"/About"} className="p-2 max-sm:p-0 rounded-md hover:bg-secondary transition max-sm:text-sm">About</Link>
          <Link href={`${user ? "/Home" : "/SignIn"}`}>
            <button className="rounded-xl p-2 border-2 border-violet-300 hover:text-white hover:bg-gradient-to-br from-purple-600 to-blue-500 text-foreground font-semibold hover:shadow-xl hover:scale-[1.02] hover:shadow-violet-500 transition">{user ? "Open App" : "Sign In"}  </button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center h-screen bg-background text-center">
        <h1 className="text-6xl font-bold ">
          Discover NoteScape&apos;s <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500'>Features</span> 
        </h1>
        <p className="text-xl text-gray-500 mt-4 z-[1]">Maximize your productivity with our powerful tools.</p>
        <Image src={TakingNote} alt={'note-taking'} width={512} height={424} className='absolute bottom-0 right-0'/>
      </div>

      {/* Features Section */}
      <div className="flex flex-col items-center w-full">
        {features.map((feature, index) => (
          <div key={index} className={`flex w-4/5 max-md:w-11/12 py-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} max-sm:flex-col`}>
            <div className="w-1/2 max-sm:w-full flex items-center justify-center">
              <Image src={feature.img} alt={`${feature.title} mockup`} className='rounded-2xl' draggable='false'/>
            </div>
            <div className="w-1/2 max-sm:w-full flex flex-col justify-center p-6">
              <h2 className="text-4xl font-bold mb-4 max-sm:text-2xl">{feature.title}</h2>
              <p className="text-lg text-text max-md:text-md">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
      <Footer/>
    </main>
  );
}

"use client";
import React from 'react'
import {ThemeToggle} from '@/components/theme-toggle';
import Header from '@/components/Header';
// import ProtectedRoute from '@/components/ProtectedRoute';

import dynamic from 'next/dynamic';
const ProtectedRoute = dynamic(() => import('@/components/ProtectedRoute'), {ssr: false})

export default function Settings() {
    const logout = () => {
        localStorage.removeItem("email-notescape");
        localStorage.removeItem("user-notescape");
        localStorage.removeItem("pfp-notescape");
        window.location.reload();
      }
  return (
    <ProtectedRoute>
        <div className="flex flex-col justify-start items-center h-screen overflow-hidden">
            <Header title='Settings' onFavoriteToggle={function (): void {
                throw new Error('Function not implemented.');
            } } onDeleteClick={function (): void {
                throw new Error('Function not implemented.');
            } } />
            <div className="mt-24 max-sm:mt-6 bg-background p-12 border-2 border-border rounded-2xl w-1/2 max-md:w-3/4 overflow-y-auto">
                <div className="flex flex-row justify-start items-center">
                    <p className='text-xl'>Change Theme: </p>
                    <ThemeToggle />
                </div>
                <button onClick={()=>logout()} className="bg-red-600 text-red-100 border border-red-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                <span className="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                Logout
                </button>
            </div>
        </div>
    </ProtectedRoute>
  )
}

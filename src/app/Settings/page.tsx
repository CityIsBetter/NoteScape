"use client";
import React from 'react'
import {ThemeToggle} from '@/components/theme-toggle';
import dynamic from 'next/dynamic';
const ProtectedRoute = dynamic(() => import('@/components/ProtectedRoute'), {ssr: false})

export default function Settings() {
    const logout = () => {
        localStorage.removeItem("email-notescape");
        localStorage.removeItem("user-notescape");
        localStorage.removeItem("pfp-notescape");
        document.cookie = "favorites=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "folders=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "expandedFolderIds=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "user-notescape=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.reload();
      }
  return (
    <ProtectedRoute navUpdate={false} onFavoriteToggle={() => void{}} onDeleteClick={() => void{}} title='Settings'>
        <div className="flex flex-col justify-start items-center overflow-hidden w-full mt-6">
            <p className="text-4xl font-bold ml-6">Settings</p>
            <div className="mt-6 bg-secondary rounded-xl p-12 max-sm:p-2 w-1/2 max-md:w-3/4 overflow-y-auto scrollbar scrollbar-thumb-text">
                <div className="max-sm:px-4 flex flex-col gap-12">
                    <div className="flex flex-row justify-start items-center">
                        <p className='text-xl'>Change Theme: </p>
                        <ThemeToggle />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p>NoteScape version: <span className='font-bold'>v2.4.0</span></p>
                        <button onClick={()=>logout()} className="self-center bg-red-600 text-red-100 border border-red-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                        <span className="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                            Logout
                        </button>               
                    </div>
                </div>
            </div>
        </div>
    </ProtectedRoute>
  )
}

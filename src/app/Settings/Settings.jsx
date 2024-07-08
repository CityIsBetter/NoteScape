"use client";
import React from 'react'
import {ThemeToggle} from '../../components/theme-toggle';
import Header from '../../components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Page() {
    const logout = () => {
        localStorage.removeItem("email-notescape");
        localStorage.removeItem("user-notescape");
        localStorage.removeItem("pfp-notescape");
        window.location.reload();
      }
  return (
    <ProtectedRoute>
        <Header title='Settings'/>
        <div className="flex flex-row justify-center items-center h-full">
            <div className="bg-pcolor p-12 border-2 border-gray-200 rounded-2xl w-1/2">
                
                <div className="flex flex-row justify-start items-center">
                    <p>Change Theme: </p>
                    <ThemeToggle />
                </div>
                <a onClick={()=>logout()} className='text-red-300'>LogOut</a>

            </div>
        </div>
    </ProtectedRoute>
  )
}

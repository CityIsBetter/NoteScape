"use client";
import React, { useState, useEffect } from 'react';
import { auth, provider } from '../../lib/firebase';
import { signInWithPopup, UserCredential } from 'firebase/auth';
import GoogleButton from 'react-google-button';
import logo from '/public/logo.png';
import Image from 'next/image';
import Link from 'next/link';

export default function SignIn() {
    const [email, setEmail] = useState<string>('');

    // Redirect if email exists
    if (email) {
        window.location.href = "/Home";
    }

    // Function to set a cookie
    const setCookie = (name: string, value: string, days: number) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Set the expiration date
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/`; // Set cookie with expiration and path
    };

    // Function to get a cookie value by name
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const handleClick = async () => {
        signInWithPopup(auth, provider)
            .then((data: UserCredential) => {
                const userEmail = data.user?.email;
                const userName = data.user.displayName;
                const userPfp = data.user.photoURL;

                if (userEmail && userName && userPfp) {
                    setEmail(userEmail);
                    localStorage.setItem("email-notescape", userEmail);
                    localStorage.setItem("user-notescape", userName);
                    localStorage.setItem("pfp-notescape", userPfp);
                    setCookie("user-notescape", userName, 365 * 10);

                    window.location.href = "/Home";
                }
            })
            .catch((error) => {
                console.error('Error signing in with Google:', error);
            });
    };

    useEffect(() => {
        const storedEmail = getCookie('email-notescape');
        if (storedEmail) {
            setEmail(storedEmail); // Set email state from cookie
        }
    }, []);

    return (
        <div>
            <div className='flex flex-col w-screen h-screen items-center justify-center text-center'>
                <div className='p-12 w-1/2 max-lg:w-3/4 max-md:w-11/12 bg-secondary border-2 border-border rounded-2xl items-center justify-center flex flex-col shadow-sm gap-4'>
                    <Image src={logo} alt='logo' className='w-24 h-24'  draggable={false}/>
                    <h2 className='text-7xl font-bold max-lg:text-6xl max-sm:text-4xl'>
                        Welcome to <span className='bg-gradient-to-r from-violet-600 via-blue-500 to-indigo-400 bg-clip-text text-transparent'>NoteScape</span>
                    </h2>
                    <p className='text-2xl max-sm:text-xl'>Please sign in with your Google account to continue</p>
                    <GoogleButton onClick={() => handleClick()} />
                    <p className='text-xl self-end mt-12'>
                        go back to<Link href={"/"} className='hover:shadow active:scale-50 hover:bg-secondary-foreground p-2 rounded-full transition'>home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

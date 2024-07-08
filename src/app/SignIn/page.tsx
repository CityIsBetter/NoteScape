"use client";
import React, { useState, useEffect } from 'react';
import { auth, provider } from '../../lib/firebase';
import { signInWithPopup, UserCredential } from 'firebase/auth'
import GoogleButton from 'react-google-button'


export default function SignIn() {
    const [email, setEmail] = useState<string>('');

    if(email){
        window.location.href="/Home"
    }

    const handleClick = async() => {
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
                    window.location.href = "/Home";
                }
                console.log(data);
            })
            .catch((error) => {
                console.error('Error signing in with Google:', error);
            });
    };

    useEffect(() => {
        const storedEmail = localStorage.getItem('email-notescape');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);
  return (
    <div>
        <div className='flex flex-col w-screen h-screen items-center justify-center'>
            <div className='p-12 w-1/2 h-3/4 bg-pcolor border-2 border-gray-200 rounded-2xl items-center justify-center flex flex-col shadow-sm'>
                <h2 className='text-2xl'>Welcome to <span>NoteScape</span></h2>
                <p>Please sign in with your Google account to continue</p>
                <GoogleButton onClick={() => handleClick()} />
            </div>
        </div>
    </div>
  )
}

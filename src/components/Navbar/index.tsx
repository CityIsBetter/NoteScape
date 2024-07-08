"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import db from '@/lib/firebase';
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";

export default function Navbar() {
    const userName = window.localStorage.getItem('user-notescape');
    const userPfp = window.localStorage.getItem('pfp-notescape');
    const pathName = usePathname();
    const [favoriteNotes, setFavoriteNotes] = useState<any[]>([]);
    const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);

    useEffect(() => {
        const fetchFavoriteNotes = async () => {
            try {
                const userEmail = window.localStorage.getItem('email-notescape');
                if (userEmail) {
                    const notesCollection = collection(db, `users/${userEmail}/notes`);
                    const favoritesQuery = query(notesCollection, where("fav", "==", true));
                    const querySnapshot = await getDocs(favoritesQuery);
                    const favoriteNotesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setFavoriteNotes(favoriteNotesData);
                    console.log(favoriteNotes);
                }
            } catch (error) {
                console.error('Error fetching favorite notes:', error);
            }
        };

        fetchFavoriteNotes();
    }, []);

    const isActiveLink = (href: string) => {
        return pathName === href ? 'bg-phcolor' : '';
    };

    const handleRemoveFavorite = async (noteId: string) => {
        const userEmail = window.localStorage.getItem('email-notescape');
        if (userEmail) {
            try {
                const noteRef = doc(db, 'users', userEmail, 'notes', noteId);
                await updateDoc(noteRef, { fav: false });
                setFavoriteNotes(favoriteNotes.filter(note => note.id !== noteId));
                console.log('Favorite status updated!');
            } catch (error) {
                console.error('Error updating favorite status:', error);
            }
        }
    };

    return (
        <div className='flex flex-col bg-pcolor h-screen p-5 w-1/5 min-w-72 max-w-96 justify-start shadow-xs border-r-2 border-gray-200'>
            <div className="user flex flex-row justify-between items-center">
                <div className="flex-col">
                    <p className='text-gray-700 text-xs'>Logged in as...</p>
                    <p className='text-black text-xl'>{userName}</p>
                </div>
                {userPfp && <Image src={userPfp} alt='user Photo' height={50} width={50} className='rounded-full' />}
            </div>

            <div className="flex flex-col gap-1 pt-12">
                <p className='font-semibold border-b-2 border-gray-200 text-tcolor'>General</p>
                <Link href={"/Home"} className={`px-5 py-2 transition hover:bg-phcolor rounded-xl text-tcolor font-medium ${isActiveLink('/Home')}`}>
                    🏠Home
                </Link>
                <Link href={"/Reminders"} className={`px-5 py-2 transition hover:bg-phcolor rounded-xl text-tcolor font-medium ${isActiveLink('/Reminders')}`}>
                    ⏰Reminders
                </Link>
                <Link href={"/Settings"} className={`px-5 py-2 transition hover:bg-phcolor rounded-xl text-tcolor font-medium ${isActiveLink('/Settings')}`}>
                    ⚙️Settings
                </Link>
            </div>

            <div className='flex flex-col gap-3 pt-12'>
                <p className='font-semibold border-b-2 border-gray-200 text-tcolor'>Favorites</p>
                {favoriteNotes.map(note => (
                    <div
                        key={note.id}
                        className="flex items-center justify-between px-5 py-2 transition hover:bg-phcolor rounded-xl text-tcolor font-medium"
                        onMouseEnter={() => setHoveredNoteId(note.id)}
                        onMouseLeave={() => setHoveredNoteId(null)}
                    >
                        <Link href={`/Note/${note.id}`} className={`flex-1 ${isActiveLink(`/Note/${note.id}`)}`}>
                            {note.title}
                        </Link>
                        <button
                            className="ml-2 text-red-300 hover:text-red-700 text-lg"
                            onClick={() => handleRemoveFavorite(note.id)}
                        >
                            {hoveredNoteId === note.id ? <MdFavoriteBorder /> : <MdFavorite />}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

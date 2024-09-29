"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import db from '@/lib/firebase';
import Header from '@/components/Header';
import Link from 'next/link';
import { Timestamp } from 'firebase/firestore';

import dynamic from 'next/dynamic';
import { MdDelete, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
const ProtectedRoute = dynamic(() => import('@/components/ProtectedRoute'), { ssr: false })

type Note = {
  id: string;
  title: string;
  content: string[];
  lastEdited: Timestamp;
  fav?: boolean;
};

export default function AllNotes() {
  const userEmail = typeof window !== 'undefined' ? window.localStorage.getItem("email-notescape") : null;
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    const fetchAllNotes = async () => {
      if (userEmail) {
        try {
          const notesCollection = collection(db, `users/${userEmail}/notes`);
          const q = query(notesCollection, orderBy('lastEdited', 'desc'));
          const querySnapshot = await getDocs(q);

          let allNotesData: Note[] = [];
          querySnapshot.forEach((doc) => {
            allNotesData.push({ id: doc.id, ...doc.data() } as Note);
          });
          setAllNotes(allNotesData);
        } catch (error) {
          console.error('Error fetching all notes:', error);
        }
      }
    };

    fetchAllNotes();
  }, [userEmail]);

  const formatLastEditedDate = (lastEdited: Timestamp) => {
    const lastEditedDate = lastEdited.toDate();
    const now = new Date();
    const oneDayInMillis = 24 * 60 * 60 * 1000;
    
    if (now.toDateString() === lastEditedDate.toDateString()) {
      return 'Today';
    } else if (now.getTime() - lastEditedDate.getTime() <= oneDayInMillis) {
      return 'Yesterday';
    } else {
      return lastEditedDate.toLocaleDateString() + ' ' + lastEditedDate.toLocaleTimeString();
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleToggleFavorite = async (noteId: string, isFavorite: boolean) => {
    if (userEmail) {
      try {
        const noteRef = doc(db, 'users', userEmail, 'notes', noteId);
        await updateDoc(noteRef, { fav: !isFavorite });
        setAllNotes(prevNotes => 
          prevNotes.map(note => 
            note.id === noteId ? { ...note, fav: !isFavorite } : note
          )
        );
        setUpdated(!updated);        
      } catch (error) {
        console.error('Error updating favorite status:', error);
      }
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (userEmail) {
      try {
        const noteRef = doc(db, 'users', userEmail, 'notes', noteId);
        await deleteDoc(noteRef);
        setAllNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
        console.log('Note deleted!');
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const filteredNotes = allNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute navUpdate={updated} onFavoriteToggle={() => void{}} onDeleteClick={() => void{}} title='All Notes'>
      <div className="flex flex-col items-center justify-start w-full overflow-hidden">
        <div className="flex flex-col items-center justify-start overflow-y-auto scrollbar scrollbar-thumb-text w-full">
          <div className="mt-6 w-2/3 max-lg:w-4/5 max-md:w-11/12 max-w-4xl bg-background p-4 max-sm:p-2 rounded-2xl mb-20">
            <div className="text-4xl font-semibold">All Notes</div>
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="mt-4 p-2 w-full border-2 border-border rounded-2xl outline-none text-zinc-600 font-mono ring-1 ring-zinc-400 focus:ring-2 focus:ring-rose-400 duration-300 placeholder:text-zinc-600 placeholder:opacity-50  px-4 py-1 shadow-md focus:shadow-lg focus:shadow-rose-400"
            />

            <div className='flex flex-col mt-4 items-center justify-between gap-2'>
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => {
                  const formattedDate = formatLastEditedDate(note.lastEdited);
                  return (
                    <div key={note.id} className="w-full transition bg-secondary hover:bg-secondary-foreground flex justify-start text-7xl font-thin rounded-xl cursor-pointer">
                      
                        <div className="flex flex-row items-center justify-between text-sm w-full p-4">
                          <Link href={`/Note/${note.id}`} className='w-full' key={note.id}><div className="">
                            <p className='text-lg font-semibold'>{note.title ? note.title : note.id}</p>
                            <p className='text-sm mt-2'><span className='font-semibold'>Last Edited:</span> {formattedDate}</p>
                          </div></Link>
                          <div className="flex flex-row items-center gap-2">
                            <button className={`text-red-400 text-xl`} 
                              onClick={() => handleToggleFavorite(note.id, note.fav || false)}> {note.fav ? <MdFavorite  className='hover:text-red-500 transition'/> : <MdFavoriteBorder  className='hover:text-red-500 transition'/>} </button>
                            <button  className="text-xl text-text"
                              onClick={() => handleDeleteNote(note.id)}><MdDelete className='hover:text-red-500 transition'/></button>
                          </div>
                        </div>
                      
                    </div>
                  );
                })
              ) : (
                <div className="text-sm flex self-center p-4 bg-secondary w-40 rounded-xl text-text">No notes found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

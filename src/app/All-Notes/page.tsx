"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoMdOpen } from "react-icons/io";
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import db from '@/lib/firebase';
import Header from '@/components/Header';
import Link from 'next/link';
import { Timestamp } from 'firebase/firestore';

import dynamic from 'next/dynamic';
const ProtectedRoute = dynamic(() => import('@/components/ProtectedRoute'), { ssr: false })

type Note = {
  id: string;
  title: string;
  content: string[];
  lastEdited: Timestamp;
};

export default function AllNotes() {
  const router = useRouter();
  const userEmail = typeof window !== 'undefined' ? window.localStorage.getItem("email-notescape") : null;
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
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

  const filteredNotes = allNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-start w-full h-screen overflow-hidden">
        <Header
          title='All Notes'
          onFavoriteToggle={() => {}}
          onDeleteClick={() => {}}
        />
        <div className="flex flex-col items-center justify-start overflow-y-auto w-full">
          <div className="mt-24 max-sm:mt-6 w-2/3 max-lg:w-4/5 max-md:w-11/12 max-w-4xl bg-background p-4 rounded-2xl border-2 border-border mb-20">
            <div className="text-2xl font-semibold">📝 All Notes</div>
            
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="mt-4 p-2 w-full border border-border rounded-2xl outline-none"
            />

            <div className='flex flex-col mt-2 items-start justify-between gap-2'>
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => {
                  const formattedDate = formatLastEditedDate(note.lastEdited);
                  return (
                    <Link href={`/Note/${note.id}`} className='w-full' key={note.id}>
                      <div key={note.id} className="w-full transition bg-secondary hover:bg-secondary-foreground border-2 border-border flex justify-start text-7xl font-thin rounded-xl cursor-pointer">
                        <div className="flex flex-row items-center justify-between text-sm w-full p-4">
                          <div className="">
                              <p className='text-lg font-semibold'>{note.title ? note.title : note.id}</p>
                              <p className='text-sm mt-2'><span className='font-semibold'>Last Edited:</span> {formattedDate}</p>
                          </div>
                          <IoMdOpen />
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-sm flex self-start p-4 bg-secondary w-40 rounded-xl text-text">No notes found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

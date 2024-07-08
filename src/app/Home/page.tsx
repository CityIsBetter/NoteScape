"use client";

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { IoMdOpen } from "react-icons/io";
import { collection, getDocs, setDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import db from '@/lib/firebase';
import Header from '@/components/Header';
import Link from 'next/link';

type Note = {
  id: string;
  title: string;
  content: string[];
  lastEdited: Date;
};

export default function Page() {
  const router = useRouter();
  const userEmail = typeof window !== 'undefined' ? window.localStorage.getItem("email-notescape") : null;
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchRecentNotes = async () => {
      if (userEmail) {
        try {
          const notesCollection = collection(db, `users/${userEmail}/notes`);
          const q = query(notesCollection, orderBy('lastEdited', 'desc'), limit(5));
          const querySnapshot = await getDocs(q);

          let recentNotesData: Note[] = [];
          querySnapshot.forEach((doc) => {
            recentNotesData.push({ id: doc.id, ...doc.data() } as Note);
          });
          setRecentNotes(recentNotesData);
        } catch (error) {
          console.error('Error fetching recent notes:', error);
        }
      }
    };
    

    fetchRecentNotes();
    
  }, [userEmail]);

  const createNewNote = async () => {
    if (userEmail) {
      try {
        const notesCollection = collection(db, `users/${userEmail}/notes`);
        const notesSnapshot = await getDocs(notesCollection);
        const noteCount = notesSnapshot.size;
  
        const newNoteId = `note-${noteCount + 1}`;
  
        const newNoteContent = {
          json: {
            type: "doc",
            content: [],
          }
        };

        const currentDate = new Date();
        await setDoc(doc(db, `users/${userEmail}/notes/${newNoteId}`), {
          ...newNoteContent,
          lastEdited: currentDate,
        });
  
        router.push(`/Note/${newNoteId}`);
      } catch (error) {
        console.error('Error creating new note:', error);
      }
    } else {
      console.error('User email is not available');
    }
  };

  return (
      <ProtectedRoute>          
        <div className="flex flex-col items-center justify-start w-full h-screen overflow-hidden">
          <Header />
          <div className="flex flex-col items-center justify-start overflow-y-auto w-full ">
            <div className="mt-24 w-2/3 bg-pcolor p-4 rounded-2xl border-2 border-gray-200">
              <div className="text-2xl font-semibold">📝 Start a New Note </div>
              <div className="flex flex-row mt-2 justify-between text-sm">
                <div className="">
                  <div className="h-52 w-40 transition bg-white hover:bg-phcolor border-2 border-gray-200 flex items-center justify-center text-6xl font-thin rounded-xl cursor-pointer" onClick={createNewNote}>➕</div>
                  <p>New Note</p> 
                </div>
                <div className="">
                  <div className="h-52 w-40 transition bg-white hover:bg-phcolor border-2 border-gray-200 flex items-center justify-center text-7xl font-thin rounded-xl">🍅</div>
                  <p>Groceries List</p>
                </div>
                <div className="">
                  <div className="h-52 w-40 transition bg-white hover:bg-phcolor border-2 border-gray-200 flex items-center justify-center text-7xl font-thin rounded-xl">✅</div>
                  <p>To Do List</p>
                </div>
                <div className="">
                  <div className="h-52 w-40 transition bg-white hover:bg-phcolor border-2 border-gray-200 flex items-center justify-center text-7xl font-thin rounded-xl">📚</div>
                  <p>Study List</p>
                </div>
                <div className="">
                  <div className="h-52 w-40 transition bg-white hover:bg-phcolor border-2 border-gray-200 flex items-center justify-center text-7xl font-thin rounded-xl">🏖️</div>
                  <p>Vacation Planning</p>
                </div>
              </div>
            </div>
  
            {/* Recent Notes */}
            <div className="w-1/4 mt-24 mb-20 bg-pcolor p-4 rounded-2xl border-2 border-gray-200">
              <div className="text-2xl font-semibold">⌚ Your Recent Notes </div>
              <div className='flex flex-col mt-2 items-start justify-between gap-2'>
                {recentNotes.length > 0 ? (
                  recentNotes.map((note) => (
                    <div
                      key={note.id}
                      className="w-full transition bg-white hover:bg-phcolor border-2 border-gray-200 flex justify-start text-7xl font-thin rounded-xl cursor-pointer"
                    >
                      <div className="text-sm w-full p-4">
                        <Link href={`/Note/${note.id}`} className='flex flex-row items-center justify-between w-full'>
                        <p className='text-sm'>{note.title ? note.title : note.id}</p>
                        <IoMdOpen/></Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm flex self-start p-4 bg-gray-100 w-40 rounded-xl text-gray-400">No recent notes found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
  )
}

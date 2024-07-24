"use client";
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import db from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import dynamic from 'next/dynamic';
const ProtectedRoute = dynamic(() => import('@/components/ProtectedRoute'), { ssr: false })

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function AllNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    fetchNotes();
  }, [sortBy]);

  const getUserEmail = () => {
    return localStorage.getItem('email-notescape') || '';
  };

  const fetchNotes = async () => {
    try {
      const userEmail = getUserEmail();
      const notesRef = collection(db, 'users', userEmail, 'notes');
      const q = query(notesRef, orderBy(sortBy, 'desc'));
      const querySnapshot = await getDocs(q);
      const notesList: Note[] = [];
      querySnapshot.forEach((doc) => {
        notesList.push({ id: doc.id, ...doc.data() } as Note);
      });
      setNotes(notesList);
    } catch (error) {
      console.error("Error fetching notes: ", error);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-start w-full h-screen overflow-hidden">
        <Header title='All Notes' onFavoriteToggle={function (): void {
          throw new Error('Function not implemented.');
        } } onDeleteClick={function (): void {
          throw new Error('Function not implemented.');
        } } />
        <div className="flex flex-col items-center justify-start overflow-y-auto w-full">
          <div className="w-3/4 max-md:w-11/12 border-2 border-border rounded-2xl p-6 max-sm:p-2 mt-12 mb-12">
            <p className='text-4xl font-semibold'>All Notes</p>
            <div className="flex flex-row w-full gap-6 max-sm:gap-2 mt-6">
              <input
                type='text'
                placeholder='Search notes...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='p-4 outline-none rounded-2xl border-2 border-border w-full'
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='p-4 outline-none rounded-2xl border-2 border-border w-48'
              >
                <option value="createdAt">Sort by Created At</option>
                <option value="updatedAt">Sort by Updated At</option>
              </select>
            </div>
            <div className="border-2 border-border rounded-2xl p-6 max-sm:p-2 mt-6">
              {filteredNotes.length > 0 ? (
                filteredNotes.map(note => (
                  <Link key={note.id} href={`/notes/${note.id}`}>
                    <div className="flex flex-col border-l-4 border-blue-400 rounded-sm mt-4 px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                      <p className='font-semibold text-lg'>{note.title}</p>
                      <p className='truncate'>{note.content}</p>
                      <p className='text-gray-400 text-sm'>{new Date(note.updatedAt).toLocaleString()}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No notes found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoMdOpen } from "react-icons/io";
import { collection, getDocs, setDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import db from '@/lib/firebase';
import Header from '@/components/Header';
import Link from 'next/link';
import { newNote, study, geoceries, vacation, todo } from './default-values';

import dynamic from 'next/dynamic';
const ProtectedRoute = dynamic(() => import('@/components/ProtectedRoute'), { ssr: false })

type Note = {
  id: string;
  title: string;
  content: string[];
  lastEdited: Date;
};

type Reminder = {
  id?: string;
  title: string;
  date: string;
  allDay: boolean;
  createdAt: string;
};

export default function Home() {
  const router = useRouter();
  const userEmail = typeof window !== 'undefined' ? window.localStorage.getItem("email-notescape") : null;
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

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

    const fetchReminders = async () => {
      if (userEmail) {
        try {
          const remindersCollection = collection(db, `users/${userEmail}/reminders`);
          const q = query(remindersCollection, orderBy('date', 'asc'));
          const querySnapshot = await getDocs(q);

          let remindersData: Reminder[] = [];
          querySnapshot.forEach((doc) => {
            remindersData.push({ id: doc.id, ...doc.data() } as Reminder);
          });
          setReminders(remindersData);
        } catch (error) {
          console.error('Error fetching reminders:', error);
        }
      }
    };

    fetchRecentNotes();
    fetchReminders();
  }, [userEmail]);

  const createContent = (e: string, title: string) => {
    if (e === "new") {
      return {
        json: {
          type: "doc",
          content: newNote,
        },
        fav: false,
        title: title
      };
    } else if (e === "g") {
      return {
        json: {
          type: "doc",
          content: geoceries,
        },
        fav: false,
        title: "Groceries List🥕"
      };
    } else if (e === "s") {
      return {
        json: {
          type: "doc",
          content: study,
        },
        fav: false,
        title: "Study Plan📖"
      };
    } else if (e === "v") {
      return {
        json: {
          type: "doc",
          content: vacation,
        },
        fav: false,
        title: "Vacation Planning🛫"
      };
    } else if (e === "t") {
      return {
        json: {
          type: "doc",
          content: todo,
        },
        fav: false,
        title: "To Do List📃"
      };
    }
  }

  const createNewNote = async (e: string) => {
    if (userEmail) {
      try {
        const currentDate = new Date();
        const newNoteId = `note-${currentDate.getTime()}`;

        const newNoteContent = createContent(e, newNoteId);

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

  const categorizeReminders = () => {
    const today: Reminder[] = [];
    const tomorrow: Reminder[] = [];
    const thisWeek: Reminder[] = [];
    const others: Reminder[] = [];
  
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0)); // Start of today
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(todayStart.getDate() + 1); // Start of tomorrow
    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setDate(tomorrowStart.getDate() + 1); // End of tomorrow (Start of day after tomorrow)
  
    const endOfWeek = new Date(todayStart);
    endOfWeek.setDate(todayStart.getDate() + (7 - todayStart.getDay())); // End of the week
  
    reminders.forEach(reminder => {
      const reminderDate = new Date(reminder.date);
      
      if (reminderDate >= todayStart && reminderDate < tomorrowStart) {
        today.push(reminder);
      } else if (reminderDate >= tomorrowStart && reminderDate < tomorrowEnd) {
        tomorrow.push(reminder);
      } else if (reminderDate >= tomorrowEnd && reminderDate <= endOfWeek) {
        thisWeek.push(reminder);
      } else if (reminderDate > endOfWeek) {
        others.push(reminder);
      }
    });
  
    return { today, tomorrow, thisWeek, others };
  };


  const { today, tomorrow, thisWeek } = categorizeReminders();

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-start w-full h-screen overflow-hidden">
        <Header onFavoriteToggle={function (): void {
          throw new Error('Function not implemented.');
        }} onDeleteClick={function (): void {
          throw new Error('Function not implemented.');
        }} />
        <div className="flex flex-col items-center justify-start overflow-y-auto w-full">
          <div className="mt-24 max-sm:mt-6 w-2/3 max-lg:w-4/5 max-md:w-11/12 max-w-4xl bg-background p-4 rounded-2xl border-2 border-border">
            <div className="text-2xl font-semibold">📝 Start a New Note </div>
            <div className="flex flex-row mt-2 gap-2 justify-between text-sm w-full overflow-x-scroll">
              <div className="">
                <div className="h-52 w-40 transition bg-secondary hover:bg-secondary-foreground border-2 border-border flex items-center justify-center text-6xl font-thin rounded-xl cursor-pointer" onClick={() => createNewNote("new")}>➕</div>
                <p>New Note</p>
              </div>
              <div className="">
                <div className="h-52 w-40 transition bg-secondary hover:bg-secondary-foreground border-2 border-border flex items-center justify-center text-7xl font-thin rounded-xl cursor-pointer" onClick={() => createNewNote("g")}>🍅</div>
                <p>Groceries List</p>
              </div>
              <div className="">
                <div className="h-52 w-40 transition bg-secondary hover:bg-secondary-foreground border-2 border-border flex items-center justify-center text-7xl font-thin rounded-xl cursor-pointer" onClick={() => createNewNote("t")}>✅</div>
                <p>To Do List</p>
              </div>
              <div className="">
                <div className="h-52 w-40 transition bg-secondary hover:bg-secondary-foreground border-2 border-border flex items-center justify-center text-7xl font-thin rounded-xl cursor-pointer" onClick={() => createNewNote("s")}>📚</div>
                <p>Study Plan</p>
              </div>
              <div className="">
                <div className="h-52 w-40 transition bg-secondary hover:bg-secondary-foreground border-2 border-border flex items-center justify-center text-7xl font-thin rounded-xl cursor-pointer" onClick={() => createNewNote("v")}>🏖️</div>
                <p>Vacation Planning</p>
              </div>
            </div>
          </div>

          <div className="flex flex-row max-sm:flex-col max-sm:mb-40 mb-20 w-full items-start max-sm:items-center justify-center gap-4 mt-24 max-sm:mt-4">
            {/* Recent Notes */}
            <div className="max-w-lg w-1/2 max-lg:w-1/2 max-md:w-3/4 max-sm:w-11/12  bg-pcolor p-4 rounded-2xl border-2 border-border">
              <div className="text-2xl font-semibold">⌚ Your Recent Notes </div>
              <div className='flex flex-col mt-2 items-start justify-between gap-2'>
                {recentNotes.length > 0 ? (
                  recentNotes.map((note, key) => (
                    <Link href={`/Note/${note.id}`} className='w-full' key={key}>
                      <div key={note.id} className="w-full transition bg-secondary hover:bg-secondary-foreground border-2 border-border flex justify-start text-7xl font-thin rounded-xl cursor-pointer">
                        <div className="flex flex-row items-center justify-between text-sm w-full p-4">
                          <p className='text-sm'>{note.title ? note.title : note.id}</p>
                          <IoMdOpen />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-sm flex self-start p-4 bg-secondary w-40 rounded-xl text-text">No recent notes found</div>
                )}
              </div>
            </div>

            {/* Upcoming Reminders */}
            <div className="max-w-lg w-1/2 max-lg:w-1/2 max-md:w-3/4 max-sm:w-11/12 bg-pcolor p-4 rounded-2xl border-2 border-border">
              <div className="text-2xl font-semibold">⏰ Upcoming Reminders </div>
              {reminders.length > 0 ? 
              <div className='flex flex-col mt-2 items-start justify-between gap-2'>
                {today.length > 0 && (
                  <div className='w-full'>
                    <div className="font-semibold">Today</div>
                    {today.map(reminder => (
                      <div key={reminder.id} className="bg-secondary border-l-4 border-green-400 flex justify-start text-7xl font-thin rounded-2xl mb-2">
                        <div className="flex flex-row items-center justify-between text-sm w-full p-4">
                          <p>{reminder.title}</p>
                          <p>{new Date(reminder.date).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {tomorrow.length > 0 && (
                  <div className='w-full'>
                    <div className="font-semibold">Tomorrow</div>
                    {tomorrow.map(reminder => (
                      <div key={reminder.id} className="bg-secondary border-l-4 border-red-400 flex justify-start text-7xl font-thin rounded-2xl mb-2">
                        <div className="flex flex-row items-center justify-between text-sm w-full p-4">
                          <p>{reminder.title}</p>
                          <p>{new Date(reminder.date).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {thisWeek.length > 0 && (
                  <div className='w-full'>
                    <div className="font-semibold">This Week</div>
                    {thisWeek.map(reminder => (
                      <div key={reminder.id} className="bg-secondary border-l-4 border-yellow-400 flex justify-start text-7xl font-thin rounded-2xl mb-2">
                        <div className="flex flex-row items-center justify-between text-sm w-full p-4">
                          <p>{reminder.title}</p>
                          <p>{new Date(reminder.date).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              : <div className="m-4">No Upcoming Reminders</div>
            }
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

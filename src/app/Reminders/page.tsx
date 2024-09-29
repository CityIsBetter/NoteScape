"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import db from '@/lib/firebase';
import { addDoc, collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { MdDelete } from 'react-icons/md';

import dynamic from 'next/dynamic';
const ProtectedRoute = dynamic(() => import('@/components/ProtectedRoute'), { ssr: false })

interface Reminder {
  id?: string;
  title: string;
  date: string;
  allDay: boolean;
  createdAt: string;
}

export default function Page() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [overdueReminders, setOverdueReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    fetchReminders();
  }, []);

  const getUserEmail = () => {
    return localStorage.getItem('email-notescape') || '';
  };

  const fetchReminders = async () => {
    try {
      const userEmail = getUserEmail();
      const remindersRef = collection(db, 'users', userEmail, 'reminders');
      const q = query(remindersRef, orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      const remindersList: Reminder[] = [];
      querySnapshot.forEach((doc) => {
        remindersList.push({ id: doc.id, ...doc.data() } as Reminder);
      });

      const now = new Date();
      const upcoming = remindersList.filter(reminder => new Date(reminder.date) >= now);
      const overdue = remindersList.filter(reminder => new Date(reminder.date) < now);
      setReminders(upcoming);
      setOverdueReminders(overdue);
    } catch (error) {
      console.error("Error fetching reminders: ", error);
    }
  };

  const addReminder = async () => {
    const userEmail = getUserEmail();
    const reminderTime = allDay ? '23:59' : time;
    const reminderDate = `${date}T${reminderTime}:00`;
    const reminder: Reminder = {
      title,
      date: reminderDate,
      allDay,
      createdAt: new Date().toISOString()
    };

    try {
      const remindersRef = collection(db, 'users', userEmail, 'reminders');
      await addDoc(remindersRef, reminder);
      fetchReminders();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      const userEmail = getUserEmail();
      const reminderDoc = doc(db, 'users', userEmail, 'reminders', id);
      await deleteDoc(reminderDoc);
      fetchReminders();
    } catch (error) {
      console.error("Error deleting reminder: ", error);
    }
  };

  const handleAddReminder = async () => {
    if (!title || !date || (!time && !allDay)) {
      alert('Please fill out all required fields.');
      return;
    }
    await addReminder();
    setTitle('');
    setDate('');
    setTime('');
    setAllDay(false);
  };

  const handleDeleteReminder = async (id: string) => {
    await deleteReminder(id);
  };

  const handleMarkAsDone = async (id: string) => {
    await deleteReminder(id);
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

  const { today, tomorrow, thisWeek, others } = categorizeReminders();

  return (
    <ProtectedRoute navUpdate={false} onFavoriteToggle={() => void{}} onDeleteClick={() => void{}} title='Reminders'>
      <div className="flex flex-col items-center justify-start w-full h-screen overflow-hidden">
        <div className="flex flex-col items-center justify-start overflow-y-auto scrollbar scrollbar-thumb-text w-full">
          <div className="w-3/4 max-md:w-11/12 rounded-2xl p-6 max-sm:p-2 mt-6 mb-12">
            <p className='text-4xl font-semibold mb-4'>Reminders</p>
            <div className="flex flex-col gap-6 rounded-xl py-6 px-20 max-sm:px-2 bg-secondary shadow">
              <div className="flex flex-col">
                <label className='ml-6'>Reminder:</label>
                <input
                  type='text'
                  placeholder='What you want to be reminded about...'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className='p-4 outline-none rounded-full border-2 border-border focus:shadow-md focus:scale-[1.01] transition'
                /> 
              </div>
              <div className="flex flex-col">
                <label  className='ml-6'>Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className='p-4 outline-none rounded-full border-2 border-border focus:shadow-md focus:scale-[1.01] transition'
                />
              </div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col w-full">
                  <label className='ml-6'>Time:</label>
                  <input
                    type='time'
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    disabled={allDay}
                    required={!allDay}
                    className='p-4 outline-none rounded-full border-2 border-border focus:shadow-md focus:scale-[1.01] transition'
                  />
                </div>
                <div className={`cursor-pointer flex flex-row self-end items-center border-blue-400 hover:text-black hover:scale-[.99] active:scale-[.9]  border-2 transition rounded-full py-2 px-4 min-w-[88px] h-16 ${allDay ? 'bg-blue-400 text-black hover:bg-blue-500' : 'hover:bg-blue-200'}`} onClick={() => setAllDay(!allDay)}>
                  <p>All day</p>
                </div>
              </div>  
              <button onClick={handleAddReminder} className='w-42 px-4 py-2 border-4 border-violet-400 hover:bg-purple-400 transition  hover:scale-[.99] active:scale-[.9] rounded-full text-foreground font-semibold self-end text-lg'>+ Add Reminder</button>
            </div>
            <p className='text-4xl font-semibold mt-12 mb-4'>Upcoming Reminders</p>
            <div className="rounded-xl p-6 max-sm:p-2 bg-secondary  shadow">
              <h2 className='text-2xl font-semibold border-b-2 border-foreground'>Today</h2>
              {today.length > 0 ? (
                today.map(reminder => (
                  <div key={reminder.id} className="flex justify-between items-center border-l-8 bg-background border-green-400 rounded-2xl mt-4 p-2">
                    <div>
                      <p className='font-semibold text-lg'>{reminder.title}</p>
                      <p>{new Date(reminder.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <button onClick={() => handleDeleteReminder(reminder.id!)} className='text-red-400 hover:text-red-500 text-xl'><MdDelete /></button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nothing today</p>
              )}
              <h2 className='text-2xl font-semibold mt-12 border-b-2 border-foreground'>Tomorrow</h2>
              {tomorrow.length > 0 ? (
                tomorrow.map(reminder => (
                  <div key={reminder.id} className="flex justify-between items-center border-l-8 bg-background border-red-400 rounded-2xl mt-4 px-4 py-2">
                    <div>
                      <p className='font-semibold text-lg'>{reminder.title}</p>
                      <p>{new Date(reminder.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <button onClick={() => handleDeleteReminder(reminder.id!)} className='text-red-400 hover:text-red-500 text-xl'><MdDelete /></button>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-text'>Nothing tomorrow</p>
              )}
              <h2 className='text-2xl font-semibold mt-12 border-b-2 border-foreground'>This Week</h2>
              {thisWeek.length > 0 ? (
                thisWeek.map(reminder => (
                  <div key={reminder.id} className="flex justify-between items-center border-l-8 bg-background border-yellow-400 rounded-2xl mt-4 px-2">
                    <div>
                      <p className='font-semibold text-lg'>{reminder.title}</p>
                      <p>{new Date(reminder.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <button onClick={() => handleDeleteReminder(reminder.id!)} className='text-red-400 hover:text-red-500 text-xl'><MdDelete /></button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nothing this week</p>
              )}
              <h2 className='text-2xl font-semibold mt-12 border-b-2 border-foreground'>Others</h2>
              {others.length > 0 ? (
                others.map(reminder => (
                  <div key={reminder.id} className="flex justify-between items-center border-l-8 bg-background border-blue-400 rounded-2xl mt-4 px-2">
                    <div>
                      <p className='font-semibold text-lg'>{reminder.title}</p>
                      <p>{new Date(reminder.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <button onClick={() => handleDeleteReminder(reminder.id!)} className='text-red-400 hover:text-red-500 text-xl'><MdDelete /></button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nothing else</p>
              )}
            </div>
            <p className='text-4xl font-semibold mt-12 mb-4'>Overdue Reminders</p>
            <div className="bg-secondary shadow rounded-xl p-6 max-sm:p-2">
              {overdueReminders.length > 0 ? (
                overdueReminders.map(reminder => (
                  <div key={reminder.id} className="flex justify-between items-center border-b-2 bg-background border-red-400 rounded-2xl mt-4 px-4 py-2">
                    <div>
                      <p className='font-semibold text-lg'>{reminder.title}</p>
                      <p>{new Date(reminder.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <button onClick={() => handleDeleteReminder(reminder.id!)} className='text-green-400 border-2 border-green-400 rounded-2xl px-2 py-1 hover:bg-green-400 hover:text-gray-700'>Mark as Done</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nothing overdue</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

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
    const todayDate = new Date(now.setHours(0, 0, 0, 0));
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(todayDate.getDate() + 1);
    const endOfWeek = new Date(todayDate);
    endOfWeek.setDate(todayDate.getDate() + (7 - todayDate.getDay()));

    reminders.forEach(reminder => {
      const reminderDate = new Date(reminder.date);
      if (reminderDate >= todayDate && reminderDate < tomorrowDate) {
        today.push(reminder);
      } else if (reminderDate >= tomorrowDate && reminderDate < endOfWeek) {
        tomorrow.push(reminder);
      } else if (reminderDate >= endOfWeek) {
        others.push(reminder);
      } else {
        thisWeek.push(reminder);
      }
    });

    return { today, tomorrow, thisWeek, others };
  };

  const { today, tomorrow, thisWeek, others } = categorizeReminders();

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-start w-full h-screen overflow-hidden">
        <Header title='Reminders' onFavoriteToggle={function (): void {
          throw new Error('Function not implemented.');
        } } onDeleteClick={function (): void {
          throw new Error('Function not implemented.');
        } } />
        <div className="flex flex-col items-center justify-start overflow-y-auto w-full">
          <div className="w-3/4 max-md:w-11/12 border-2 border-border rounded-2xl p-6 max-sm:p-2 mt-12 mb-12">
            <p className='text-4xl font-semibold'>Reminders</p>
            <div className="flex flex-col gap-6 border-2 border-border rounded-2xl py-6 px-20 max-sm:px-2">
              <div className="flex flex-col">
                <label>Reminder</label>
                <input
                  type='text'
                  placeholder='What you want to be reminded about...'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className='p-4 outline-none rounded-2xl border-2 border-border'
                /> 
              </div>
              <div className="flex flex-row w-full gap-6 max-sm:gap-2">
                <div className="flex flex-col">
                  <label>Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className='p-4 outline-none rounded-2xl border-2 border-border'
                  />
                </div>
                <div className="flex flex-col">
                  <label>Time</label>
                  <input
                    type='time'
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    disabled={allDay}
                    required={!allDay}
                    className='p-4 outline-none rounded-2xl border-2 border-border'
                  />
                </div>
              </div>
              <div className={`cursor-pointer flex flex-row justify-center border-blue-400 hover:bg-secondary hover:text-foreground border-2 transition rounded-2xl py-2 px-4 w-24 text-text ${allDay ? 'bg-blue-400 text-black' : ''}`} onClick={() => setAllDay(!allDay)}>
                <p>All day</p>
              </div>
              <button onClick={handleAddReminder} className='w-42 px-4 py-2 border-4 border-violet-500 bg-purple-400 hover:border-violet-600 hover:bg-purple-500 transition rounded-2xl text-background self-end text-lg'>+ Add Reminder</button>
            </div>
            <p className='text-4xl font-semibold mt-12'>Upcoming Reminders</p>
            <div className="border-2 border-border rounded-2xl p-6 max-sm:p-2">
              <h2 className='text-2xl font-semibold border-b-2 border-gray-200 dark:border-gray-500'>Today</h2>
              {today.length > 0 ? (
                today.map(reminder => (
                  <div key={reminder.id} className="flex justify-between items-center border-l-4 border-green-400 rounded-sm mt-4 px-2">
                    <div>
                      <p className='font-semibold text-lg'>{reminder.title}</p>
                      <p>{new Date(reminder.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <button onClick={() => handleDeleteReminder(reminder.id!)} className='text-red-400'><MdDelete /></button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nothing today</p>
              )}
              <h2 className='text-2xl font-semibold mt-4 border-b-2 border-gray-200 dark:border-gray-500'>Tomorrow</h2>
              {tomorrow.length > 0 ? (
                tomorrow.map(reminder => (
                  <div key={reminder.id} className="flex justify-between items-center border-l-4 border-red-400 rounded-sm mt-4 px-2">
                    <div>
                      <p className='font-semibold text-lg'>{reminder.title}</p>
                      <p>{new Date(reminder.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <button onClick={() => handleDeleteReminder(reminder.id!)} className='text-red-400'><MdDelete /></button>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-text'>Nothing tomorrow</p>
              )}
              <h2 className='text-2xl font-semibold mt-4 border-b-2 border-gray-200 dark:border-gray-500'>This Week</h2>
              {thisWeek.length > 0 ? (
                thisWeek.map(reminder => (
                  <div key={reminder.id} className="flex justify-between items-center border-l-4 border-yellow-400 rounded-sm mt-4 px-2">
                    <div>
                      <p className='font-semibold text-lg'>{reminder.title}</p>
                      <p>{new Date(reminder.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <button onClick={() => handleDeleteReminder(reminder.id!)} className='text-red-400'><MdDelete /></button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nothing this week</p>
              )}
              <h2 className='text-2xl font-semibold mt-4 border-b-2 border-gray-200 dark:border-gray-500'>Others</h2>
              {others.length > 0 ? (
                others.map(reminder => (
                  <div key={reminder.id} className="flex justify-between items-center border-l-4 border-blue-400 rounded-sm mt-4 px-2">
                    <div>
                      <p className='font-semibold text-lg'>{reminder.title}</p>
                      <p>{new Date(reminder.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <button onClick={() => handleDeleteReminder(reminder.id!)} className='text-red-400'><MdDelete /></button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nothing else</p>
              )}
            </div>
            <p className='text-4xl font-semibold mt-12'>Overdue Reminders</p>
            <div className="border-2 border-border rounded-2xl p-6 max-sm:p-2">
              {overdueReminders.length > 0 ? (
                overdueReminders.map(reminder => (
                  <div key={reminder.id} className="flex justify-between items-center border-l-4 border-red-400 rounded-sm mt-4 px-2">
                    <div>
                      <p className='font-semibold text-lg'>{reminder.title}</p>
                      <p>{new Date(reminder.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <button onClick={() => handleDeleteReminder(reminder.id!)} className='text-red-400'><MdDelete /></button>
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

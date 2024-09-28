"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { collection, query, where, getDocs, getDoc, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import db from '@/lib/firebase';
import { MdFavoriteBorder, MdFavorite, MdExpandMore, MdDelete, MdAdd, MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { FiSidebar } from "react-icons/fi";
import { motion } from 'framer-motion';

interface Note {
    id: string;
    title: string;
    fav: boolean;
}

interface Folder {
    id: string;
    name: string;
    notes: string[]; // Note ids
}
interface SidebarProps {
    navUpdate: boolean;
    sidebar: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({navUpdate, sidebar, toggleSidebar} ) => {
    const userName = window.localStorage.getItem('user-notescape');
    const userPfp = window.localStorage.getItem('pfp-notescape');

    const setCookie = (name: string, value: string, days: number) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Set expiration
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/`;
        console.log('from func', value);
      };
    
      // Function to get cookie
      const getCookie = (name: string) => {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
      };

    const pathName = usePathname();

    const [allNotes, setAllNotes] = useState<Note[]>([]);
    // const [favNotes, setFavNotes] = useState<Note[]>([]);
    const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
    // const [folders, setFolders] = useState<Folder[]>([]);
    const [newFolderName, setNewFolderName] = useState<string>('');
    const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);
    const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
    // const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(new Set());
    const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);
    
    const [favNotes, setFavNotes] = useState<Note[]>(() => {
        const savedFavorites = getCookie("favorites");
        return savedFavorites ? JSON.parse(savedFavorites) : [];
      });
      const [folders, setFolders] = useState<Folder[]>(() => {
        const savedFolders = getCookie("folders");
        return savedFolders ? JSON.parse(savedFolders) : [];
      });
      const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(() => {
        const savedExpandedFolderIds = getCookie('expandedFolderIds');
        return savedExpandedFolderIds ? new Set(JSON.parse(savedExpandedFolderIds)) : new Set();
      });

    useEffect(() => {
        fetchAllNotes();
        fetchFolders();
        fetchFavNotes();
        console.log(favNotes);
    }, []);
    useEffect(() => {
        fetchAllNotes();
        fetchFolders();
        fetchFavNotes();
        console.log(favNotes);
    }, [navUpdate]);

    const fetchAllNotes = async () => {
        try {
            const userEmail = window.localStorage.getItem('email-notescape');
            if (userEmail) {
                const notesCollection = collection(db, `users/${userEmail}/notes`);
                const AllQuery = query(notesCollection);
                const querySnapshot = await getDocs(AllQuery);
                const AllNotesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Note[];
                setAllNotes(AllNotesData);
            }
        } catch (error) {
            console.error('Error fetching favorite notes:', error);
        }
    };
    
    const fetchFolders = async () => {
        try {
            const userEmail = window.localStorage.getItem('email-notescape');
            if (userEmail) {
                const foldersCollection = collection(db, `users/${userEmail}/folders`);
                const querySnapshot = await getDocs(foldersCollection);
                const foldersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Folder[];
                setFolders(foldersData);
                setCookie("folders", JSON.stringify(foldersData), 7);
            }
        } catch (error) {
            console.error('Error fetching folders:', error);
        }
    };    

    const isActiveLink = (href: string) => {
        return pathName === href ? 'bg-secondary-foreground' : '';
    };

    const fetchFavNotes = async () => {
        try {
            const userEmail = window.localStorage.getItem('email-notescape');
            if (userEmail) {
                const notesCollection = collection(db, `users/${userEmail}/notes`);
                const FavQuery = query(notesCollection, where("fav", "==", true));
                const querySnapshot = await getDocs(FavQuery);
                const FavNotesData = querySnapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title })) as Note[];
                setFavNotes(FavNotesData);
                setCookie("favorites", JSON.stringify(FavNotesData), 7);
            }
        } catch (error) {
            console.error('Error fetching favorite notes:', error);
        }
    };

    const handleRemoveFavorite = async (noteId: string) => {
        const userEmail = window.localStorage.getItem('email-notescape');
        if (userEmail) {
            try {
                const noteRef = doc(db, 'users', userEmail, 'notes', noteId);
                await updateDoc(noteRef, { fav: false });
                setFavNotes(favNotes.filter(note => note.id !== noteId));
                console.log('Favorite status updated!');
            } catch (error) {
                console.error('Error updating favorite status:', error);
            }
        }
    };

    const handleCreateFolder = async () => {
        const userEmail = window.localStorage.getItem('email-notescape');
        if (userEmail && newFolderName.trim()) {
            try {
                const foldersCollection = collection(db, `users/${userEmail}/folders`);
                await addDoc(foldersCollection, { name: newFolderName, notes: [] });
                setNewFolderName('');
                setIsCreatingFolder(false);
                fetchFolders();
            } catch (error) {
                console.error('Error creating folder:', error);
            }
        }
    };

    const handleRenameFolder = async (folderId: string, newName: string) => {
        const userEmail = window.localStorage.getItem('email-notescape');
        if (userEmail && newName.trim()) {
            try {
                const folderRef = doc(db, 'users', userEmail, 'folders', folderId);
                await updateDoc(folderRef, { name: newName });
                setEditingFolderId(null);
                fetchFolders();
            } catch (error) {
                console.error('Error renaming folder:', error);
            }
        }
    };

    const handleDeleteFolder = async (folderId: string) => {
        const userEmail = window.localStorage.getItem('email-notescape');
        if (userEmail) {
            try {
                const folderRef = doc(db, 'users', userEmail, 'folders', folderId);
                await deleteDoc(folderRef);
                setFolders(folders.filter(folder => folder.id !== folderId));
                console.log('Folder deleted!');
            } catch (error) {
                console.error('Error deleting folder:', error);
            }
        }
    };

    const handleToggleFolder = (folderId: string) => {
        setExpandedFolderIds(prev => {
          const newSet = new Set(prev);
          if (newSet.has(folderId)) {
            newSet.delete(folderId);
          } else {
            newSet.add(folderId);
          }

          setCookie('expandedFolderIds', JSON.stringify([...newSet]), 1);
          return newSet;
        });
      };

    const handleAddNoteToFolder = async (folderId: string, note: Note) => {
        const userEmail = window.localStorage.getItem('email-notescape');
        if (userEmail) {
            try {
                const folderRef = doc(db, 'users', userEmail, 'folders', folderId);
                const folderDoc = await getDoc(folderRef);
                const folderData = folderDoc.data() as Folder;
                const updatedNotes = [...folderData.notes, note.id];
                await updateDoc(folderRef, { notes: updatedNotes });
                setFolders(folders.map(folder => folder.id === folderId ? { ...folder, notes: updatedNotes } : folder));
                console.log('Note added to folder!');
                setIsDropdownOpen(null); // Close the dropdown after adding the note
            } catch (error) {
                console.error('Error adding note to folder:', error);
            }
        }
    };

    const handleRemoveNoteFromFolder = async (folderId: string, noteId: string) => {
        const userEmail = window.localStorage.getItem('email-notescape');
        if (userEmail) {
            try {
                const folderRef = doc(db, 'users', userEmail, 'folders', folderId);
                const folderDoc = await getDoc(folderRef);
                const folderData = folderDoc.data() as Folder;
                const updatedNotes = folderData.notes.filter(id => id !== noteId);
                await updateDoc(folderRef, { notes: updatedNotes });
                setFolders(folders.map(folder => folder.id === folderId ? { ...folder, notes: updatedNotes } : folder));
                console.log('Note removed from folder!');
            } catch (error) {
                console.error('Error removing note from folder:', error);
            }
        }
    };

    const availableNotes = (folderId: string) => {
        const folder = folders.find(f => f.id === folderId);
        if (folder) {
            return allNotes.filter(note => !folder.notes.includes(note.id));
        }
        return allNotes;
    };

    return (
        <motion.div initial={{ width: '350px', padding: '20px'}}
        animate={{
            width: sidebar ? '350px' : '0px',
            padding: sidebar ? '20px' : '0px' // Animate padding separately
          }}
          transition={{
            width: { duration: 0.3, ease: 'easeInOut' },
            padding: { duration: 0.1, ease: 'easeInOut', delay: sidebar ? 0 : 0.2 } // Delay padding when collapsing
          }}
        className={`flex flex-col  transition-transform ease-in-out duration-300 bg-secondary h-screen w-full justify-start overflow-hidden`}>
            <div className="user flex flex-row justify-between items-center">
                <div className="flex items-center gap-4">
                    {userPfp && <Image src={userPfp} alt='user Photo' height={50} width={50} className='rounded-full' draggable='false'/>}
                    <div className="flex-col">
                        <p className='text-foreground text-xl'>{userName}</p>
                    </div>                    
                </div>
                <FiSidebar className='text-text text-3xl cursor-pointer' onClick={toggleSidebar}/>
            </div>
            <div className="overflow-y-auto no-scrollbar">
                <div className="flex flex-col gap-1 pt-12 text-lg">
                    <p className='font-semibold border-b-2 border-border dark:border-gray-500 text-text text-xl'>General</p>
                    <Link href={"/Home"} className={`px-5 py-2 transition hover:bg-secondary-foreground rounded-xl text-text font-medium hover:scale-[.99] ${isActiveLink('/Home')}`}>
                        🏠Home
                    </Link>
                    <Link href={"/All-Notes"} className={`px-5 py-2 transition hover:bg-secondary-foreground rounded-xl text-text font-medium hover:scale-[.99] ${isActiveLink('/All-Notes')}`}>
                        📒All Notes
                    </Link>
                    <Link href={"/Reminders"} className={`px-5 py-2 transition hover:bg-secondary-foreground rounded-xl text-text font-medium hover:scale-[.99] ${isActiveLink('/Reminders')}`}>
                        ⏱️Reminders
                    </Link>
                    <Link href={"/Settings"} className={`px-5 py-2 transition hover:bg-secondary-foreground rounded-xl text-text font-medium hover:scale-[.99] ${isActiveLink('/Settings')}`}>
                        ⚙️Settings
                    </Link>
                </div>

                <div className='flex flex-col gap-3 pt-12  text-lg'>
                    <p className='font-semibold border-b-2 border-gray-200 dark:border-gray-500 text-text text-xl'>Favorites</p>
                    {favNotes.map(note => (
                        <div
                            key={note.id}
                            className={`flex items-center justify-between px-5 py-2 transition hover:bg-secondary-foreground rounded-xl text-text font-medium hover:scale-[.99] ${isActiveLink(`/Note/${note.id}`)}`}
                            
                        >
                            
                                <Link href={`/Note/${note.id}`} className='flex-1'>{note.title}</Link>
                        
                            <button
                                className="ml-2 text-red-300 hover:text-red-700 text-lg z-10"
                                onClick={() => handleRemoveFavorite(note.id)}
                                onMouseEnter={() => setHoveredNoteId(note.id)}
                                onMouseLeave={() => setHoveredNoteId(null)}
                            >
                                {hoveredNoteId === note.id ? <MdFavoriteBorder /> : <MdFavorite className='text-red-400' />}
                            </button>
                        </div>
                    ))}
                </div>

                <div className='flex flex-col gap-3 pt-12 pb-24'>
                    <div className="flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-500">
                        <p className='font-semibold  text-text text-xl'>Folders</p>
                        <button className="text-text hover:text-green-700 text-lg" onClick={() => setIsCreatingFolder(true)}>
                            <MdAdd />
                        </button>
                    </div>
                    {isCreatingFolder && (
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={newFolderName}
                                placeholder='Folder Name'
                                onChange={(e) => setNewFolderName(e.target.value)}
                                className="flex-1 rounded mx-2 px-2 py-1 focus:outline-none border-2 border-border w-3/4"
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                                onBlur={handleCreateFolder}
                                autoFocus
                            />
                            <button className='bg-red-500 hover:bg-red-600 rounded-md text-white p-1' onClick={()=>setIsCreatingFolder(false)}>Cancel</button>
                        </div>
                    )}
                    {folders.map(folder => (
                        <div key={folder.id} className="flex flex-col">
                            <div className="flex items-center justify-between px-2 py-2 transition hover:bg-secondary-foreground rounded-xl text-text font-medium  hover:scale-[.99]">
                                {editingFolderId === folder.id ? (
                                    <input
                                        type="text"
                                        defaultValue={folder.name}
                                        onBlur={(e) => handleRenameFolder(folder.id, e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleRenameFolder(folder.id, (e.target as HTMLInputElement).value)}
                                        autoFocus
                                        className='focus:outline-none border-b-2 border-gray-200 w-3/4'
                                    />
                                ) : (
                                    <div className="flex flex-row">
                                        <button
                                        className="text-text hover:text-foreground text-lg"
                                        onClick={() => handleToggleFolder(folder.id)}
                                    >
                                        {expandedFolderIds.has(folder.id) ? <MdExpandMore  /> : <MdExpandMore  className='-rotate-90'/>}
                                    </button>
                                        <div className="flex-1 cursor-pointer text-lg font-semibold" onClick={() => handleToggleFolder(folder.id)} onDoubleClick={() => setEditingFolderId(folder.id)}>{folder.name}</div>
                                    </div>
                                    
                                )}
                                <div className="flex items-center gap-2">
                                    <button
                                        className="text-green-500 hover:text-green-700 text-lg"
                                        onClick={() => setIsDropdownOpen(folder.id)}
                                    >
                                        <MdAdd />
                                    </button>
                                    <button
                                        className="text-red-400 hover:text-red-500 text-lg"
                                        onClick={() => handleDeleteFolder(folder.id)}
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            </div>
                            {expandedFolderIds.has(folder.id) && (
                                <div className="pl-8">
                                    {folder.notes.map(noteId => {
                                        const note = allNotes.find(note => note.id === noteId);
                                        return note ? (
                                            <div className={`flex px-5 py-2 transition hover:bg-secondary-foreground rounded-xl flex-row items-center justify-between hover:scale-[.99] ${isActiveLink(`/Note/${note.id}`)}`}>
                                                <Link key={note.id} href={`/Note/${note.id}`} className={`text-text font-medium `}>
                                                    {note.title}
                                                </Link>
                                                <MdDelete className="text-red-500 hover:text-red-600 cursor-pointer" onClick={() => handleRemoveNoteFromFolder(folder.id, noteId)} />
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            )}
                            {isDropdownOpen === folder.id && (
                                <div className="ml-8 flex flex-col gap-1 bg-background border-2 border-border z-10 rounded-2xl">
                                    {availableNotes(folder.id).map(note => (
                                        <button
                                            key={note.id}
                                            className="block px-5 py-2 transition hover:bg-secondary-foreground rounded-xl text-text font-medium"
                                            onClick={() => handleAddNoteToFolder(folder.id, note)}
                                        >
                                            {note.title}
                                        </button>
                                    ))}
                                    <button className='bg-red-500 hover:bg-red-600 rounded-2xl text-white p-2' onClick={()=>setIsDropdownOpen(null)}>Cancel</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default React.memo(Sidebar)
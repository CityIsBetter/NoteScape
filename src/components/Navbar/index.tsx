"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { collection, query, where, getDocs, getDoc, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import db from '@/lib/firebase';
import { MdFavoriteBorder, MdFavorite, MdExpandMore, MdDelete, MdAdd, MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

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

export default function Navbar() {
    const userName = window.localStorage.getItem('user-notescape');
    const userPfp = window.localStorage.getItem('pfp-notescape');
    const sidebar: boolean = localStorage.getItem('notescape-sidebar') === "false" && window.innerWidth > 1024 ? true : false;
    const pathName = usePathname();
    const [allNotes, setAllNotes] = useState<Note[]>([]);
    const [favNotes, setFavNotes] = useState<Note[]>([]);
    const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [newFolderName, setNewFolderName] = useState<string>('');
    const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);
    const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
    const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(new Set());
    const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(sidebar); // State to manage sidebar visibility

    useEffect(() => {
        fetchAllNotes();
        fetchFolders();
        fetchFavNotes();
    }, []);

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
            }
        } catch (error) {
            console.error('Error fetching folders:', error);
        }
    };    

    const isActiveLink = (href: string) => {
        return pathName === href ? 'bg-phcolor' : '';
    };

    const fetchFavNotes = async () => {
        try {
            const userEmail = window.localStorage.getItem('email-notescape');
            if (userEmail) {
                const notesCollection = collection(db, `users/${userEmail}/notes`);
                const FavQuery = query(notesCollection, where("fav", "==", true));
                const querySnapshot = await getDocs(FavQuery);
                const FavNotesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Note[];
                setFavNotes(FavNotesData);
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

    const availableNotes = (folderId: string) => {
        const folder = folders.find(f => f.id === folderId);
        if (folder) {
            return allNotes.filter(note => !folder.notes.includes(note.id));
        }
        return allNotes;
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
        localStorage.setItem('notescape-sidebar', JSON.stringify(isSidebarOpen));
        console.log(isSidebarOpen, localStorage.getItem('notescape-sidebar'));
    };

    return (
        <div className="">
        <div className={`flex flex-col ${isSidebarOpen ? '' : 'hidden'} transition-transform ease-in-out duration-300 bg-pcolor h-screen p-5 w-72 justify-start border-r-2 border-gray-200 overflow-hidden`}>
            <div className="user flex flex-row justify-between items-center">
                <div className="flex-col">
                    <p className='text-gray-700 text-xs'>Logged in as...</p>
                    <p className='text-black text-xl'>{userName}</p>
                </div>
                {userPfp && <Image src={userPfp} alt='user Photo' height={50} width={50} className='rounded-full' />}
            </div>
            <div className="overflow-y-auto no-scrollbar">
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
                    {favNotes.map(note => (
                        <div
                            key={note.id}
                            className={`flex items-center justify-between px-5 py-2 transition hover:bg-phcolor rounded-xl text-tcolor font-medium ${isActiveLink(`/Note/${note.id}`)}`}
                            onMouseEnter={() => setHoveredNoteId(note.id)}
                            onMouseLeave={() => setHoveredNoteId(null)}
                        >
                            <Link href={`/Note/${note.id}`} className='flex-1'>
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

                <div className='flex flex-col gap-3 pt-12'>
                    <div className="flex items-center justify-between border-b-2 border-gray-200">
                        <p className='font-semibold  text-tcolor'>Folders</p>
                        <button className="text-tcolor hover:text-green-700 text-lg" onClick={() => setIsCreatingFolder(true)}>
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
                                className="flex-1 rounded mx-2 px-2 py-1 focus:outline-none border-2 border-gray-200 w-3/4"
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                                onBlur={handleCreateFolder}
                                autoFocus
                            />
                            <button className='bg-red-500 hover:bg-red-600 rounded-md text-white p-1' onClick={()=>setIsCreatingFolder(false)}>Cancel</button>
                        </div>
                    )}
                    {folders.map(folder => (
                        <div key={folder.id} className="flex flex-col">
                            <div className="flex items-center justify-between px-2 py-2 transition hover:bg-phcolor rounded-xl text-tcolor font-medium">
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
                                        className="text-gray-500 hover:text-gray-700 text-lg"
                                        onClick={() => handleToggleFolder(folder.id)}
                                    >
                                        {expandedFolderIds.has(folder.id) ? <MdExpandMore  /> : <MdExpandMore  className='-rotate-90'/>}
                                    </button>
                                        <div className="flex-1" onClick={() => setEditingFolderId(folder.id)}>{folder.name}</div>
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
                                        className="text-red-500 hover:text-red-700 text-lg"
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
                                            <Link key={note.id} href={`/Note/${note.id}`} className={`block px-5 py-2 transition hover:bg-phcolor rounded-xl text-tcolor font-medium ${isActiveLink(`/Note/${note.id}`)}`}>
                                                {note.title}
                                            </Link>
                                        ) : null;
                                    })}
                                </div>
                            )}
                            {isDropdownOpen === folder.id && (
                                <div className="ml-8 flex flex-col gap-1 bg-white border-2 border-gray-200 z-10 rounded-2xl">
                                    {availableNotes(folder.id).map(note => (
                                        <button
                                            key={note.id}
                                            className="block px-5 py-2 transition hover:bg-phcolor rounded-xl text-tcolor font-medium"
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
            {/* Button to toggle sidebar visibility */}
            
        </div>
            <button className={`fixed z-10 top-1/2 ${isSidebarOpen ? 'left-72' : 'left-0'} bg-pcolor text-tcolor px-2 py-4 border-y-2 border-r-2 border-gray-200`} onClick={toggleSidebar}>
                {isSidebarOpen ? <MdArrowBackIosNew /> : <MdArrowForwardIos/>}
            </button>
        </div>
    );
}

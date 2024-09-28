"use client";
import Image from 'next/image';
import React, { useState } from 'react';

import logo from '/public/logo.png'

import { FiSidebar } from "react-icons/fi";

type HeaderProps = {
  title?: string;
  isFavorite?: boolean;
  onFavoriteToggle: () => void;
  onDeleteClick: () => void;
  threedots?: boolean,
  sidebar: boolean,
  toggleSidebar: () => void;
};

const Header: React.FC<HeaderProps> = ({ title, isFavorite, onFavoriteToggle, onDeleteClick, threedots, sidebar, toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleFavoriteClick = () => {
    onFavoriteToggle();
    closeDropdown();
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDeleteClick();
      closeDropdown();
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full">
    <div className="text-xl p-2 rounded-xl sticky bg-secondary-foreground z-10 mx-2 mt-2 text-center flex justify-between items-center">
      <div className='self-start flex flex-row items-center gap-2'>
        <FiSidebar className={` ${sidebar ? '' : 'hidden'} text-text text-3xl cursor-pointer`} onClick={toggleSidebar}/>
        <Image  src={logo} alt='logo' className='w-8 h-8' draggable='false'/>
        {title === 'Settings' || title === 'Reminders' || title === 'Home' || title === 'All Notes' ? (
          <p className='text-2xl'>
            <span>/</span>
            {title}
          </p>
        ) : title ? (
          <p className='text-xl'>
            <span className='text-lg'>NoteScape/Note/</span>
            {title}
          </p>
        ) : (
          'NoteScape'
        )}
      </div>
      {threedots && <div className="relative">
        <button className="focus:outline-none" onClick={toggleDropdown}>
          <span className="text-xl cursor-pointer">{!isDropdownOpen ? "···" : "x"}</span>
        </button>
        <div className={`absolute right-0 mt-2 w-40 bg-background border-2 border-border rounded-2xl shadow-lg p-2 ${isDropdownOpen ? '' : 'hidden'}`}>
          <div className="block px-4 py-2 text-sm text-text hover:bg-secondary cursor-pointer rounded-xl" onClick={handleFavoriteClick}>
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </div>
          <div className="block px-4 py-2 text-sm text-red-500 hover:bg-secondary cursor-pointer rounded-xl" onClick={handleDeleteClick}>
            Delete
          </div>
        </div>
      </div>}
    </div>
    </div>
  );
};

export default Header;

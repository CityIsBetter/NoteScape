"use client";
import Image from 'next/image';
import React, { useState } from 'react';

import logo from '/public/logo.png'

type HeaderProps = {
  title?: string;
  isFavorite?: boolean;
  onFavoriteToggle: () => void;
  onDeleteClick: () => void;
  threedots?: boolean;
};

const Header: React.FC<HeaderProps> = ({ title, isFavorite, onFavoriteToggle, onDeleteClick, threedots }) => {
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
    <div className="text-xl p-2 pl-4 pr-4 sticky top-0 bg-background z-10 w-full text-center border-b-2 border-border flex justify-between items-center">
      <div className='self-start flex flex-row items-center'><Image  src={logo} alt='logo' className='w-12 h-12' draggable='false'/>
        {title === 'Settings' || title === 'Reminders' ? (
          <p>
            <span className='text-sm'>NoteScape/</span>
            {title}
          </p>
        ) : title ? (
          <p>
            <span className='text-sm'>NoteScape/Note/</span>
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
  );
};

export default Header;

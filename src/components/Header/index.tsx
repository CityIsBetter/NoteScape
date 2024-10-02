"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion"; // Importing Framer Motion

import logo from "/public/logo.png";
import { FiSidebar } from "react-icons/fi";

type HeaderProps = {
  title?: string;
  isFavorite?: boolean;
  onFavoriteToggle: () => void;
  onDeleteClick: () => void;
  threedots?: boolean;
  sidebar: boolean;
  toggleSidebar: () => void,
  Html?: object;
};

const Header: React.FC<HeaderProps> = ({
  title,
  isFavorite,
  onFavoriteToggle,
  onDeleteClick,
  threedots,
  sidebar,
  toggleSidebar,
  Html
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [htmlContent, setHtmlContent] = useState<object | undefined>(Html);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleFavoriteClick = () => {
    onFavoriteToggle();
    closeDropdown();
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDeleteClick();
      closeDropdown();
    }
  };

  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      setIsDropdownVisible(true); // Show before opening
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
    setTimeout(() => {
      setIsDropdownVisible(false); // Hide after 0.3s (animation duration)
    }, 300);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    setHtmlContent(Html);
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const handleDownloadClick = async() => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(htmlContent),
      });

      if (!response.ok) {
        throw new Error('Failed to convert HTML to DOCX');
      }

      // Handle the response as a Blob (binary data)
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'note.docx'; // Specify the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  }

  return (
    <div className="w-full">
      <div className="text-xl p-2 rounded-xl sticky bg-secondary-foreground z-10 mx-2 mt-2 text-center flex justify-between items-center">
        <div className="self-start flex flex-row items-center gap-2 select-none">
          <motion.div
            initial={{ opacity: sidebar ? 1 : 0 }}
            animate={{ opacity: sidebar ? 1 : 0, width: sidebar ? "30px" : "0px" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiSidebar
              className={`text-text text-3xl cursor-pointer hover:scale-[.95] rounded transition`}
              onClick={toggleSidebar}
            />
          </motion.div>

          <Image src={logo} alt="logo" className="w-8 h-8 z-10" draggable="false" />
          {title === "Settings" || title === "Reminders" || title === "Home" || title === "All Notes" ? (
            <p className="text-2xl">
              <span>/</span>
              {title}
            </p>
          ) : title ? window.innerWidth > 768 ? (
            <p className="text-xl">
              <span className="text-lg">NoteScape/Note/</span>
              {title}
            </p>
          ) : ( 
            <p className="text-xl">
              <span className="text-lg">/</span>
              {title}
            </p>
            ) : (
            "NoteScape"
          )}
        </div>
        {threedots && (
          <div className="relative" ref={dropdownRef}>
            <button className="focus:outline-none mr-2" onClick={toggleDropdown}>
              <span className="text-xl cursor-pointer select-none">
                {!isDropdownOpen ? "···" : "X"}
              </span>
            </button>

            {isDropdownVisible && ( // Only render when dropdown is visible
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: isDropdownOpen ? 1 : 0, y: isDropdownOpen ? 0 : -10 }}
                exit={{ y: 10 }}
                transition={{ duration: 0.3 }}
                style={{ visibility: isDropdownOpen ? "visible" : "hidden" }} // Toggle visibility based on open state
                className={`absolute right-0 mt-2 w-40 bg-background border-2 border-border rounded-2xl shadow-lg p-2`}
              >
                <div
                  className="block px-4 py-2 text-sm text-text hover:bg-secondary cursor-pointer rounded-xl hover:scale-[.97] transition"
                  onClick={handleFavoriteClick}
                >
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </div>
                <div
                  className="block hover:scale-[.97] transition cursor-pointer"
                  onClick={handleDownloadClick}
                >
                  <p className="text-sm px-4 py-2 rounded-xl after:content-['BETA'] after:absolute after:text-xs after:-top-1 after:-right-2 after:bg-[#1E2036] after:p-0.5 after:px-1 after:rounded-md relative border-[#786CFF] border-opacity-40 text-[#786CFF] hover:bg-[#786CFF1e] hover:text-[#786CFF] dark:text-[#857aff] dark:hover:bg-[#786CFF1e] dark:hover:text-[#857aff]">Download as .Docx</p>
                </div>
                <div
                  className="block  hover:scale-[.97] transition cursor-pointer"
                  onClick={handleDeleteClick}
                >
                  <p className="px-4 py-2 text-sm text-red-500 hover:bg-red-200 dark:hover:bg-red-900  rounded-xl"> Delete</p>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

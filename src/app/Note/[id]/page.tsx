"use client";
import { debounce } from 'lodash';
import React, { useEffect, useState, useRef } from 'react';
import { setDoc, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { JSONContent } from '@tiptap/core';
import NovelEditor from '@/components/NovelEditor';
import ProtectedRoute from '@/components/ProtectedRoute';
import db from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { FaArrowDown, FaArrowUp, FaInfo } from "react-icons/fa";

type NoteProps = {
  params: { id: string };
};

// Helper function to sanitize content for Firebase
const sanitizeContent = (content: JSONContent): JSONContent => {
  if (!content || typeof content !== 'object') return {};

  return Object.entries(content).reduce((acc: any, [key, value]) => {
    // Skip undefined values
    if (value === undefined) return acc;

    // Handle arrays
    if (Array.isArray(value)) {
      acc[key] = value.map(item => 
        typeof item === 'object' ? sanitizeContent(item) : item
      ).filter(item => item !== undefined);
    }
    // Handle nested objects
    else if (value && typeof value === 'object') {
      acc[key] = sanitizeContent(value);
    }
    // Handle primitive values
    else {
      acc[key] = value;
    }

    return acc;
  }, {});
};

const Note: React.FC<NoteProps> = ({ params }) => {
  const router = useRouter();
  const [content, setContent] = useState<JSONContent[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState<string>(params.id);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const userEmail = typeof window !== 'undefined' ? window.localStorage.getItem('email-notescape') : null;

  const debouncedSaveContent = useRef(
    debounce(async (newContent: JSONContent[], newTitle: string, userEmail: string, noteId: string, isFavorite: boolean) => {
      try {
        // Sanitize the content before saving
        const sanitizedContent = newContent.map(item => sanitizeContent(item));
        
        const docData = {
          json: { content: sanitizedContent },
          title: newTitle,
          fav: isFavorite,
          lastEdited: new Date(),
        };

        await setDoc(doc(db, 'users', userEmail, 'notes', noteId), docData);
        console.log('Note successfully saved!');
      } catch (error) {
        console.error('Error saving note:', error);
      }
    }, 1000)
  ).current;

  useEffect(() => {
    const getData = async () => {
      if (userEmail) {
        try {
          const docRef = doc(db, 'users', userEmail, 'notes', params.id);
          const dataDB = await getDoc(docRef);
          if (dataDB.exists()) {
            const data = dataDB.data();
            setContent(data.json.content);
            data.title && setTitle(data.title);
            setIsFavorite(data.fav || false);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching note:', error);
        }
        setLoading(false);
      }
    };

    getData();
  }, [userEmail, params.id]);

  useEffect(() => {
    const handleDebounceSave = () => {
      if (content !== undefined && userEmail) {
        debouncedSaveContent(content, title, userEmail, params.id, isFavorite);
      }
    };

    handleDebounceSave();
  }, [content, title, isFavorite, userEmail, params.id, debouncedSaveContent]);

  const handleChange = (e: JSONContent) => {
    setContent([e]);
  };

  const handleTitleChange = (e: string) => {
    setTitle(e);
  };

  const handleFavoriteToggle = async () => {
    if (userEmail) {
      try {
        const noteRef = doc(db, 'users', userEmail, 'notes', params.id);
        await updateDoc(noteRef, { fav: !isFavorite });
        setIsFavorite(!isFavorite);
        console.log('Favorite status updated!');
      } catch (error) {
        console.error('Error updating favorite status:', error);
      }
    }
  };

  const handleDeleteClick = async () => {
    if (userEmail) {
      try {
        await deleteDoc(doc(db, 'users', userEmail, 'notes', params.id));
        console.log('Note successfully deleted!');
        router.push("/Home");
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const handleTitleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    if (userEmail && content !== undefined) {
      debouncedSaveContent(content, title, userEmail, params.id, isFavorite);
    }
  };

  const preprocessHtmlForDocx = (html: string) => {
    html = html.replace(
      /<li[^>]*data-checked="true"[^>]*>.*?<input[^>]+type="checkbox"[^>]*checked[^>]*>.*?<p>(.*?)<\/p>/gi,
      '<li><del>$1</del></li>'
    );
  
    html = html.replace(
      /<li[^>]*data-checked="false"[^>]*>.*?<input[^>]+type="checkbox"[^>]*>.*?<p>(.*?)<\/p>/gi,
      '<li>$1</li>'
    );
  
    html = html.replace(/<\/?(label|span|div)[^>]*>/gi, '');
    
    setHtmlContent(html);
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(true);

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      
      // Show scroll to top button if not at the top
      setShowScrollTop(scrollTop > 100);
      
      // Show scroll to bottom button if not at the bottom
      setShowScrollBottom(
        scrollTop + clientHeight < scrollHeight - 100
      );
    }
  };

  return (
    <ProtectedRoute 
      navUpdate={isFavorite} 
      onFavoriteToggle={handleFavoriteToggle} 
      onDeleteClick={handleDeleteClick} 
      title={title} 
      isFavorite={isFavorite} 
      threedots={true} 
      getHtml={{ title, htmlContent }}
    >
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="w-full overflow-y-auto scrollbar scrollbar-thumb-text h-screen relative"
      >
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button 
            onClick={scrollToTop}
            className="fixed top-20 right-4 z-50 bg-accent hover:bg-secondary text-accent-foreground active:scale-95 p-4 rounded-full shadow-lg transition-all"
          >
            <FaArrowUp className='text-accent-foreground text-xl'/>
          </button>
        )}

        {/* Scroll to Bottom Button */}
        {showScrollBottom && (
          <button 
            onClick={scrollToBottom}
            className="fixed bottom-4 right-4 z-50 bg-accent hover:bg-secondary text-accent-foreground active:scale-95 p-4 rounded-full shadow-lg transition-all"
          >
            <FaArrowDown className='text-xl'/>
          </button>
        )}

        <div className="flex flex-col m-2">
          <div className="flex flex-row max-md:flex-col max-md:items-center items-end justify-start w-full gap-2 p-2 border-b-2 border-border">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={handleTitleBlur}
                className="pt-4 font-bold text-4xl outline-none text-foreground bg-secondary"
                autoFocus
              />
            ) : (
              <span 
                onDoubleClick={handleTitleDoubleClick} 
                className="pt-4 font-bold text-4xl cursor-pointer text-foreground"
              >
                {title}
              </span>
            )}
            <div className="group relative bg-secondary p-2 rounded-full">
              <FaInfo />
              <div className="bg-foreground p-2 rounded-md group-hover:flex hidden absolute -bottom-2 translate-y-full left-1/2 -translate-x-1/2">
                <span className="text-background whitespace-nowrap">
                  Double click on the name to edit it.
                </span>
                <div className="bg-inherit rotate-45 p-1 absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2"></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-start w-full rounded-xl">
            {!loading && content !== undefined ? (
              <NovelEditor 
                initialValue={content[0]} 
                onChange={handleChange} 
                getHtml={(e) => preprocessHtmlForDocx(e)}
              />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Note;
"use client";
import { debounce } from 'lodash';
import React, { useEffect, useState, useRef } from 'react';
import { setDoc, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { JSONContent } from '@tiptap/core';
import NovelEditor from '@/components/NovelEditor';
import ProtectedRoute from '@/components/ProtectedRoute';
import db from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { FaInfo } from "react-icons/fa";

type NoteProps = {
  params: { id: string };
};

const Note: React.FC<NoteProps> = ({ params }) => {
  const router = useRouter();
  const [content, setContent] = useState<JSONContent[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState<string>(params.id);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false); // State to manage edit mode
  const [htmlContent, setHtmlContent] = useState<string>("");
  const userEmail = typeof window !== 'undefined' ? window.localStorage.getItem('email-notescape') : null;

  const debouncedSaveContent = useRef(
    debounce(async (newContent: JSONContent[], newTitle: string, userEmail: string, noteId: string, isFavorite: boolean) => {
      try {
        await setDoc(doc(db, 'users', userEmail, 'notes', noteId), {
          json: { content: newContent },
          title: newTitle,
          fav: isFavorite,
          lastEdited: new Date(),
        });
        console.log('Note successfully saved!');
      } catch (error) {
        console.error('Error saving note:', error);
      }
    }, 1000)
  ).current;

  useEffect(() => {
    const getData = async () => {
      if (userEmail) {
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
        setLoading(false);
      }
    };

    getData();
  }, [userEmail, params.id]);

  useEffect(() => {
    const handleDebounceSave = () => {
      if (content !== undefined) {
        debouncedSaveContent(content, title, userEmail!, params.id, isFavorite);
      }
    };

    handleDebounceSave();
  }, [content, title, isFavorite, userEmail, params.id, debouncedSaveContent]);

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

  const handleChange = (e: JSONContent) => {
    setContent([e]);
  };

  const handleTitleChange = (e: string) => {
    setTitle(e);
  };

  const handleTitleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    // Save the title when editing is done
    if (userEmail) {
      debouncedSaveContent(content!, title, userEmail!, params.id, isFavorite);
    }
  };
  const preprocessHtmlForDocx = (html: string) => {
    // Replace unchecked checkboxes with "[ ]"
    html = html.replace(
      /<li[^>]*data-checked="true"[^>]*>.*?<input[^>]+type="checkbox"[^>]*checked[^>]*>.*?<p>(.*?)<\/p>/gi,
      '<li><del>$1</del></li>'
    );
  
    // Leave unchecked items as plain text within <li> tags
    html = html.replace(
      /<li[^>]*data-checked="false"[^>]*>.*?<input[^>]+type="checkbox"[^>]*>.*?<p>(.*?)<\/p>/gi,
      '<li>$1</li>'
    );
  
    // Remove unnecessary tags like <label>, <span>, <div> but keep <li>
    html = html.replace(/<\/?(label|span|div)[^>]*>/gi, '');
    
    setHtmlContent(html);
  }  

  return (
    <ProtectedRoute navUpdate={isFavorite} onFavoriteToggle={handleFavoriteToggle} onDeleteClick={handleDeleteClick} title={title} isFavorite={isFavorite} threedots={true} getHtml={{ title, htmlContent }}>
      <div className="w-full overflow-y-auto scrollbar scrollbar-thumb-text h-screen">
        <div className="flex flex-col m-2 ">
          <div className="flex flex-row max-md:flex-col max-md:items-center items-end justify-start w-full gap-2 p-2 border-b-2 border-border">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={handleTitleBlur} // Save on blur
                className="pt-4 font-bold text-4xl outline-none text-foreground bg-secondary"
                autoFocus
              />
            ) : (
              <span onDoubleClick={handleTitleDoubleClick} className="pt-4 font-bold text-4xl cursor-pointer text-foreground">
                {title}
              </span>
            )}
              <div className="group relative bg-secondary p-2 rounded-full">
                <FaInfo />
                <div
                  className="bg-foreground p-2 rounded-md group-hover:flex hidden absolute -bottom-2 translate-y-full left-1/2 -translate-x-1/2"
                >
                  <span className="text-background whitespace-nowrap">Double click on the name to edit it.</span>
                  <div
                    className="bg-inherit rotate-45 p-1 absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2"
                  ></div>
                </div>
              </div>
          </div>
          <div className="flex flex-col items-center justify-start w-full rounded-xl">
            {!loading && content !== undefined ? (
              <NovelEditor initialValue={content[0]} onChange={handleChange} getHtml={(e) => preprocessHtmlForDocx(e)}/>
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

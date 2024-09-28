"use client";
import { debounce } from 'lodash';
import React, { useEffect, useState, useRef } from 'react';
import { setDoc, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { JSONContent } from '@tiptap/core';

import NovelEditor from '@/components/NovelEditor';
import ProtectedRoute from '@/components/ProtectedRoute';
import db from '@/lib/firebase';
import { useRouter } from 'next/navigation';

type NoteProps = {
  params: { id: string };
};

const Note: React.FC<NoteProps> = ({ params }) => {
  const router = useRouter();
  const [content, setContent] = useState<JSONContent[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState<string>(params.id);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
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
        if (window.confirm('Are you sure you want to delete this note?')) {
          await deleteDoc(doc(db, 'users', userEmail, 'notes', params.id));
          console.log('Note successfully deleted!');

          router.push("/Home");
        }
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

  return (
    <ProtectedRoute navUpdate={isFavorite} onFavoriteToggle={handleFavoriteToggle} onDeleteClick={handleDeleteClick} title={title} isFavorite={isFavorite} threedots={true}>
      <div className="w-full overflow-y-auto h-screen">
        <div className="flex flex-col m-2 ">
          <div className="flex flex-row items-center justify-start w-full p-2 border-b-2 border-border">
              <input
                type="text"
                value={title}
                onChange={(e) => {setTitle(e.target.value)}}
                className="pt-4 font-bold text-4xl outline-none text-foreground"
              />
          </div>
          <div className="flex flex-col items-center justify-start w-full rounded-xl">
                {!loading && content !== undefined ? (
                  <NovelEditor initialValue={content[0]} onChange={handleChange} />
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

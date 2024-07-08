"use client";
import { debounce } from 'lodash';
import React, { useEffect, useState, useCallback } from 'react';
import { setDoc, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { JSONContent } from '@tiptap/core';
import NovelEditor from '@/components/NovelEditor';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import db from '@/lib/firebase';

type NoteProps = {
  params: { id: string };
};

const Note: React.FC<NoteProps> = ({ params }) => {
  const [content, setContent] = useState<JSONContent[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState<string>(params.id);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const userEmail = typeof window !== 'undefined' ? window.localStorage.getItem('email-notescape') : null;

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

  const saveContent = useCallback(
    debounce(async (newContent: JSONContent[], newTitle: string) => {
      if (userEmail) {
        try {
          await setDoc(doc(db, 'users', userEmail, 'notes', params.id), {
            json: { content: newContent },
            title: newTitle,
            fav: isFavorite,
            lastEdited: new Date(),
          });
          console.log('Note successfully saved!');
        } catch (error) {
          console.error('Error saving note:', error);
        }
      }
    }, 1000), // Adjust the debounce delay as needed
    [userEmail, params.id, isFavorite]
  );

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
          // Redirect or handle deletion confirmation as needed
        }
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const handleChange = (e: JSONContent) => {
    setContent([e]);
    if (content !== undefined) {
      saveContent([e], title);
    }
  };

  const handleTitleChange = (e: string) => {
    setTitle(e);
    if (content !== undefined) {
      saveContent(content, e);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-start w-full h-screen overflow-hidden">
        <Header
          title={title}
          isFavorite={isFavorite}
          onFavoriteToggle={handleFavoriteToggle}
          onDeleteClick={handleDeleteClick}
          threedots={true}
        />
        <div className="flex flex-col w-full h-screen items-center justify-start overflow-y-auto p-12">
          <div className="flex self-center justify-center">
            {!loading && content !== undefined ? (
              <NovelEditor setContent={handleChange} topic={title} content={content} setTopic={handleTitleChange} />
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
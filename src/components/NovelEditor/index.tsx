"use client";
import React, { useState } from "react";
import { Editor } from "novel";
import { type Editor as TipTapEditor, JSONContent } from "@tiptap/core";
import { Card, CardContent } from "@/components/ui/card";

type NovelEditorProps = {
  setContent: (content: JSONContent) => void;
  setTopic: (content: string) => void;
  topic: string; // Use initialTitle as a prop
  content: JSONContent[] | undefined;
};

export default function NovelEditor({ setContent, content, setTopic, topic }: NovelEditorProps) {
  const [title, setTitle] = useState(topic);

  return (
    <Card className=" rounded-2xl min-w-128">
      <CardContent>
        <input
          type="text"
          value={title}
          onChange={(e) => {setTitle(e.target.value); setTopic(e.target.value)}}
          className="pt-4 font-bold text-2xl outline-none border-b-2 border-transparent text-black"
        />
        <Editor
          defaultValue={content || []}
          onDebouncedUpdate={(editor?: TipTapEditor) => {
            setContent(editor?.getJSON() as JSONContent);
            setTopic(title);
          }}
          disableLocalStorage={true}
          className="rounded-2xl border mt-4"
        />
      </CardContent>
    </Card>
  );
}

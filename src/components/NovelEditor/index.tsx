"use client";
import React, { useState } from "react";
import { Editor } from "novel";
import { type Editor as TipTapEditor, JSONContent } from "@tiptap/core";
import { Card, CardContent } from "@/components/ui/card";
import { LuPencil } from "react-icons/lu";

type NovelEditorProps = {
  setContent: (content: JSONContent) => void;
  setTopic: (content: string) => void;
  topic: string; // Use initialTitle as a prop
  content: JSONContent[] | undefined;
};

export default function NovelEditor({ setContent, content, setTopic, topic }: NovelEditorProps) {
  const [title, setTitle] = useState(topic);

  return (
    <Card className=" rounded-2xl min-w-128 max-sm:min-w-full border-border ">
      <CardContent>
        <div className="flex flex-row items-center">
        <input
          type="text"
          value={title}
          onChange={(e) => {setTitle(e.target.value); setTopic(e.target.value)}}
          style={{
            width:`${title.length * 14}px`
          }}
          className="pt-4 font-bold text-2xl outline-none border-b-2 border-foreground text-foreground max-w-full bg-background"
        />
        <LuPencil className="text-2xl self-end"/>
        </div>
        <Editor
          defaultValue={content || []}
          onDebouncedUpdate={(editor?: TipTapEditor) => {
            setContent(editor?.getJSON() as JSONContent);
            setTopic(title);
          }}
          disableLocalStorage={true}
          className="rounded-2xl border-2 border-border mt-4 bg-secondary"
        />
      </CardContent>
    </Card>
  );
}

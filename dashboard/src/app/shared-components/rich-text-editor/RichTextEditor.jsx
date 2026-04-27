import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import {TextStyle} from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Color } from "@tiptap/extension-color";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
export default function RichTextEditor({ value, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        excludeExtensions: ['Link', 'HorizontalRule'],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: placeholder || "Write something amazing...",
      }),
      Color,
      TextStyle,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      HorizontalRule,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const url = prompt("Enter URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const getCurrentHeadingLevel = () => {
    for (let level = 1; level <= 6; level++) {
      if (editor.isActive('heading', { level })) {
        return level.toString();
      }
    }
    return "";
  };

  return (
    <div className="border rounded-[1rem] p-4 bg-white shadow-sm w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4 border-b pb-3">
        {/* Headings */}
        <select
          value={getCurrentHeadingLevel()}
          onChange={(e) => {
            const level = parseInt(e.target.value);
            if (level) {
              editor.chain().focus().toggleHeading({ level }).run();
            } else {
              editor.chain().focus().setParagraph().run();
            }
          }}
          className="border px-2 py-1"
        >
          <option value="">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>

        {/* Text styles */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 border ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 border ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 border ${editor.isActive("underline") ? "bg-gray-200" : ""}`}
        >
          <u>U</u>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 border ${editor.isActive("strike") ? "bg-gray-200" : ""}`}
        >
          <s>S</s>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={`px-2 py-1 border ${editor.isActive("subscript") ? "bg-gray-200" : ""}`}
        >
          X<sub>2</sub>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={`px-2 py-1 border ${editor.isActive("superscript") ? "bg-gray-200" : ""}`}
        >
          X<sup>2</sup>
        </button>

        {/* Colors */}
        <input
          type="color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className="w-8 h-8 border"
          title="Text Color"
        />
        <input
          type="color"
          onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
          className="w-8 h-8 border"
          title="Highlight Color"
        />

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 border ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 border ${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}
        >
          1. List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`px-2 py-1 border ${editor.isActive("taskList") ? "bg-gray-200" : ""}`}
        >
          ☑ Task
        </button>

        {/* Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`px-2 py-1 border ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}`}
        >
          ⬅
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`px-2 py-1 border ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""}`}
        >
          ⬌
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`px-2 py-1 border ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}`}
        >
          ➡
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`px-2 py-1 border ${editor.isActive({ textAlign: "justify" }) ? "bg-gray-200" : ""}`}
        >
          ⬌⬅
        </button>

        {/* Blocks */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 border ${editor.isActive("blockquote") ? "bg-gray-200" : ""}`}
        >
          ❝
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-2 py-1 border ${editor.isActive("codeBlock") ? "bg-gray-200" : ""}`}
        >
          &lt;/&gt;
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="px-2 py-1 border">
          ―
        </button>
      

        {/* Media */}
        <button onClick={setLink} className="px-2 py-1 border">
          🔗
        </button>
        <button onClick={addImage} className="px-2 py-1 border">
          🖼️
        </button>

        {/* Actions */}
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()} className="px-2 py-1 border">
          Clear
        </button>
        <button onClick={() => editor.chain().focus().undo().run()} className="px-2 py-1 border">
          ↶
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} className="px-2 py-1 border">
          ↷
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="rich-text-editor-content w-full min-h-[360px] outline-none" />

      {/* Debug */}
      <div className="mt-3">
        <button
          onClick={() => console.warn(editor.getHTML())}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}
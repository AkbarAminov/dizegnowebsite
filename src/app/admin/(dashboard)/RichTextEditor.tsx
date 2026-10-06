"use client";

import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered } from "lucide-react";
import { focusRing } from "./ui";

const EMPTY_TOOLBAR_STATE = { bold: false, italic: false, bulletList: false, orderedList: false };

// Descriptions saved before this editor existed are bare text with no
// markup — split on blank lines so they read as paragraphs instead of
// collapsing into one run of text the first time they're opened here.
// Anything that already looks like HTML (every description saved through
// this editor) is left alone.
function legacyPlainTextToHtml(value: string): string {
  if (!value || /<[a-z][\s\S]*>/i.test(value)) return value;
  const escape = (line: string) => line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escape(line)}</p>`)
    .join("");
}

const editorClass =
  "min-h-32 w-full px-3 py-2 text-sm text-neutral-100 outline-none [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p:last-child]:mb-0 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5";

// A small WYSIWYG editor for project descriptions: bold/italic and real
// paragraph/list breaks, stored as HTML (sanitised server-side in
// src/lib/richText.ts) instead of a plain string a <textarea> would give.
// Keyed by locale in ProjectForm.tsx — switching tabs remounts it rather
// than reconciling editor state against a changed `value` prop.
export function RichTextEditor({
  id,
  value,
  onChange,
  placeholder,
}: {
  id?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      // Kept to the marks/nodes sanitizeRichText() (src/lib/richText.ts) allows
      // through on save — anything disabled here would otherwise let the
      // admin format text in a way that silently vanishes once saved.
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        strike: false,
        underline: false,
        link: false,
      }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: legacyPlainTextToHtml(value),
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        class: editorClass,
      },
    },
  });

  // isActive() reads live editor state, so the toolbar needs its own
  // subscription — useEditor() alone doesn't re-render on every transaction.
  const toolbar =
    useEditorState({
      editor,
      selector: ({ editor }) => ({
        bold: editor?.isActive("bold") ?? false,
        italic: editor?.isActive("italic") ?? false,
        bulletList: editor?.isActive("bulletList") ?? false,
        orderedList: editor?.isActive("orderedList") ?? false,
      }),
    }) ?? EMPTY_TOOLBAR_STATE;

  return (
    <div className="overflow-hidden rounded-md border border-white/15 bg-white/5 transition-colors focus-within:border-white/50 hover:border-white/25">
      <div className="flex items-center gap-1 border-b border-white/10 p-1.5">
        <ToolbarButton
          label="Bold"
          active={toolbar.bold}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={toolbar.italic}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={toolbar.bulletList}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={toolbar.orderedList}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={15} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  active,
  disabled,
  onClick,
  label,
  children,
}: {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      title={label}
      className={`rounded p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${focusRing} ${
        active ? "bg-white/15 text-white" : "text-neutral-400 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}

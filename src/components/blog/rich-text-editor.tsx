"use client";

import type { JSONContent } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { type ReactNode, useEffect, useId, useMemo, useRef } from "react";
import { cn } from "@/components/ui/pet-ui";

type RichTextEditorProps = {
  value: Record<string, unknown>;
  onChange(value: Record<string, unknown>): void;
  locale: "vi" | "en";
};

type EditorCopy = {
  toolbarLabel: string;
  editorLabel: string;
  editorDescription: string;
  placeholder: string;
  invalidLink: string;
  invalidImage: string;
  prompts: {
    link: string;
    image: string;
  };
  actions: {
    paragraph: string;
    heading2: string;
    heading3: string;
    bold: string;
    italic: string;
    underline: string;
    strike: string;
    bulletList: string;
    orderedList: string;
    blockquote: string;
    code: string;
    link: string;
    image: string;
    undo: string;
    redo: string;
  };
};

type ToolbarButtonProps = {
  label: string;
  pressed?: boolean;
  disabled?: boolean;
  onClick(): void;
  children: ReactNode;
};

const EMPTY_DOCUMENT: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

const COPY: Record<RichTextEditorProps["locale"], EditorCopy> = {
  vi: {
    toolbarLabel: "Thanh cong cu dinh dang bai viet",
    editorLabel: "Noi dung bai viet",
    editorDescription: "Trinh soan thao ho tro dinh dang van ban, lien ket va hinh anh.",
    placeholder: "Viet noi dung bai blog...",
    invalidLink: "Chi chap nhan lien ket bat dau bang http:// hoac https://.",
    invalidImage: "Chi chap nhan URL hinh anh bat dau bang http:// hoac https://.",
    prompts: {
      link: "Nhap lien ket http:// hoac https://",
      image: "Nhap URL hinh anh http:// hoac https://",
    },
    actions: {
      paragraph: "Doan van",
      heading2: "Tieu de H2",
      heading3: "Tieu de H3",
      bold: "In dam",
      italic: "In nghieng",
      underline: "Gach chan",
      strike: "Gach ngang",
      bulletList: "Danh sach dau dong",
      orderedList: "Danh sach danh so",
      blockquote: "Trich dan",
      code: "Doan ma",
      link: "Chen hoac sua lien ket",
      image: "Chen hinh anh",
      undo: "Hoan tac",
      redo: "Lam lai",
    },
  },
  en: {
    toolbarLabel: "Post formatting toolbar",
    editorLabel: "Post content",
    editorDescription: "Rich text editor with formatting, links, and images.",
    placeholder: "Write your blog post content...",
    invalidLink: "Only http:// or https:// links are allowed.",
    invalidImage: "Only http:// or https:// image URLs are allowed.",
    prompts: {
      link: "Enter an http:// or https:// link",
      image: "Enter an http:// or https:// image URL",
    },
    actions: {
      paragraph: "Paragraph",
      heading2: "Heading 2",
      heading3: "Heading 3",
      bold: "Bold",
      italic: "Italic",
      underline: "Underline",
      strike: "Strikethrough",
      bulletList: "Bullet list",
      orderedList: "Ordered list",
      blockquote: "Blockquote",
      code: "Code",
      link: "Insert or edit link",
      image: "Insert image",
      undo: "Undo",
      redo: "Redo",
    },
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeEditorValue(value: Record<string, unknown>): JSONContent {
  if (!isRecord(value) || Object.keys(value).length === 0) {
    return EMPTY_DOCUMENT;
  }

  return value as JSONContent;
}

function serializeEditorValue(value: JSONContent) {
  return JSON.stringify(value);
}

function normalizeHttpUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function ToolbarButton({ label, pressed, disabled = false, onClick, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={typeof pressed === "boolean" ? pressed : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-9 items-center justify-center rounded-[var(--bc-radius-pill)] border px-3 text-xs font-semibold transition duration-[var(--bc-motion-fast)] ease-[var(--bc-ease)]",
        "focus:outline-none focus:ring-4 focus:ring-sky-100",
        pressed
          ? "border-[var(--bc-accent)] bg-[var(--bc-accent)] text-white shadow-[0_10px_28px_rgba(0,113,227,0.18)]"
          : "border-[var(--bc-border)] bg-white/88 text-[var(--bc-ink-2)] hover:border-[var(--bc-accent)] hover:text-[var(--bc-accent)]",
        disabled && "cursor-not-allowed opacity-50 hover:border-[var(--bc-border)] hover:text-[var(--bc-ink-2)]",
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange, locale }: RichTextEditorProps) {
  const copy = useMemo(() => COPY[locale], [locale]);
  const labelId = useId();
  const descriptionId = useId();
  const normalizedValue = useMemo(() => normalizeEditorValue(value), [value]);
  const onChangeRef = useRef(onChange);
  const lastValueRef = useRef(serializeEditorValue(normalizedValue));

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
        StarterKit.configure({
          heading: {
            levels: [2, 3],
          },
          link: {
            autolink: false,
            linkOnPaste: false,
            openOnClick: false,
            defaultProtocol: "https",
            isAllowedUri: (url) => /^https?:\/\//i.test(url),
            HTMLAttributes: {
              class: "text-[var(--bc-accent)] underline decoration-[0.08em] underline-offset-[0.18em]",
              rel: "noopener noreferrer nofollow",
              target: "_blank",
            },
          },
        }),
      Image.configure({
        allowBase64: false,
        inline: false,
        HTMLAttributes: {
          class: "bc-editor-image",
        },
      }),
      Placeholder.configure({
        emptyEditorClass: "bc-editor-empty",
        emptyNodeClass: "bc-node-empty",
        placeholder: copy.placeholder,
      }),
    ],
    content: normalizedValue,
    editorProps: {
      attributes: {
        class: "bc-editor-content min-h-[18rem] px-4 py-4 text-sm leading-7 text-[var(--bc-ink)] outline-none",
        role: "textbox",
        "aria-labelledby": labelId,
        "aria-describedby": descriptionId,
        "aria-multiline": "true",
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      const nextValue = currentEditor.getJSON();
      const serialized = serializeEditorValue(nextValue);

      if (serialized === lastValueRef.current) {
        return;
      }

      lastValueRef.current = serialized;
      onChangeRef.current(nextValue as Record<string, unknown>);
    },
  }, [locale]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextSerialized = serializeEditorValue(normalizedValue);
    const currentSerialized = serializeEditorValue(editor.getJSON());

    if (nextSerialized === currentSerialized) {
      lastValueRef.current = nextSerialized;
      return;
    }

    editor.commands.setContent(normalizedValue, { emitUpdate: false });
    lastValueRef.current = nextSerialized;
  }, [editor, normalizedValue]);

  function promptForLink() {
    if (!editor) {
      return;
    }

    const activeHref = editor.getAttributes("link").href;
    const previousValue = typeof activeHref === "string" ? activeHref : "";
    const input = window.prompt(copy.prompts.link, previousValue);

    if (input === null) {
      return;
    }

    const nextUrl = normalizeHttpUrl(input);
    if (!nextUrl) {
      if (input.trim() === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }

      window.alert(copy.invalidLink);
      return;
    }

    if (editor.state.selection.empty && !editor.isActive("link")) {
      editor.chain().focus().setLink({ href: nextUrl }).insertContent(nextUrl).unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: nextUrl }).run();
  }

  function promptForImage() {
    if (!editor) {
      return;
    }

    const input = window.prompt(copy.prompts.image, "https://");
    if (input === null) {
      return;
    }

    const nextUrl = normalizeHttpUrl(input);
    if (!nextUrl) {
      if (input.trim() === "") {
        return;
      }

      window.alert(copy.invalidImage);
      return;
    }

    editor.chain().focus().setImage({ src: nextUrl, alt: "" }).run();
  }

  return (
    <div className="bc-rich-text-editor grid gap-3">
      <div id={labelId} className="sr-only">
        {copy.editorLabel}
      </div>
      <div id={descriptionId} className="sr-only">
        {copy.editorDescription}
      </div>

      <div
        role="toolbar"
        aria-label={copy.toolbarLabel}
        className="flex flex-wrap gap-2 rounded-[var(--bc-radius-md)] border border-[var(--bc-border-soft)] bg-[var(--bc-glass-strong)] p-3 shadow-[var(--bc-elev-ring)]"
      >
        <ToolbarButton
          label={copy.actions.paragraph}
          pressed={editor?.isActive("paragraph")}
          disabled={!editor?.can().chain().focus().setParagraph().run()}
          onClick={() => editor?.chain().focus().setParagraph().run()}
        >
          P
        </ToolbarButton>
        <ToolbarButton
          label={copy.actions.heading2}
          pressed={editor?.isActive("heading", { level: 2 })}
          disabled={!editor?.can().chain().focus().toggleHeading({ level: 2 }).run()}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          label={copy.actions.heading3}
          pressed={editor?.isActive("heading", { level: 3 })}
          disabled={!editor?.can().chain().focus().toggleHeading({ level: 3 }).run()}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          label={copy.actions.bold}
          pressed={editor?.isActive("bold")}
          disabled={!editor?.can().chain().focus().toggleBold().run()}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          label={copy.actions.italic}
          pressed={editor?.isActive("italic")}
          disabled={!editor?.can().chain().focus().toggleItalic().run()}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          label={copy.actions.underline}
          pressed={editor?.isActive("underline")}
          disabled={!editor?.can().chain().focus().toggleUnderline().run()}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          U
        </ToolbarButton>
        <ToolbarButton
          label={copy.actions.strike}
          pressed={editor?.isActive("strike")}
          disabled={!editor?.can().chain().focus().toggleStrike().run()}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          S
        </ToolbarButton>
        <ToolbarButton
          label={copy.actions.bulletList}
          pressed={editor?.isActive("bulletList")}
          disabled={!editor?.can().chain().focus().toggleBulletList().run()}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          label={copy.actions.orderedList}
          pressed={editor?.isActive("orderedList")}
          disabled={!editor?.can().chain().focus().toggleOrderedList().run()}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </ToolbarButton>
        <ToolbarButton
          label={copy.actions.blockquote}
          pressed={editor?.isActive("blockquote")}
          disabled={!editor?.can().chain().focus().toggleBlockquote().run()}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </ToolbarButton>
        <ToolbarButton
          label={copy.actions.code}
          pressed={editor?.isActive("code")}
          disabled={!editor?.can().chain().focus().toggleCode().run()}
          onClick={() => editor?.chain().focus().toggleCode().run()}
        >
          Code
        </ToolbarButton>
        <ToolbarButton label={copy.actions.link} pressed={editor?.isActive("link")} disabled={!editor} onClick={promptForLink}>
          Link
        </ToolbarButton>
        <ToolbarButton label={copy.actions.image} disabled={!editor} onClick={promptForImage}>
          Image
        </ToolbarButton>
        <ToolbarButton label={copy.actions.undo} disabled={!editor?.can().chain().focus().undo().run()} onClick={() => editor?.chain().focus().undo().run()}>
          Undo
        </ToolbarButton>
        <ToolbarButton label={copy.actions.redo} disabled={!editor?.can().chain().focus().redo().run()} onClick={() => editor?.chain().focus().redo().run()}>
          Redo
        </ToolbarButton>
      </div>

      <div className="overflow-hidden rounded-[var(--bc-radius-lg)] border border-[var(--bc-border)] bg-white/88 shadow-[var(--bc-elev-ring)] transition focus-within:border-[var(--bc-accent)] focus-within:ring-4 focus-within:ring-sky-100">
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .bc-rich-text-editor .bc-editor-content > *:first-child {
          margin-top: 0;
        }

        .bc-rich-text-editor .bc-editor-content > *:last-child {
          margin-bottom: 0;
        }

        .bc-rich-text-editor .bc-editor-content h2,
        .bc-rich-text-editor .bc-editor-content h3,
        .bc-rich-text-editor .bc-editor-content p,
        .bc-rich-text-editor .bc-editor-content ul,
        .bc-rich-text-editor .bc-editor-content ol,
        .bc-rich-text-editor .bc-editor-content blockquote {
          margin: 0 0 1rem;
        }

        .bc-rich-text-editor .bc-editor-content h2 {
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: var(--bc-ink);
        }

        .bc-rich-text-editor .bc-editor-content h3 {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--bc-ink);
        }

        .bc-rich-text-editor .bc-editor-content ul,
        .bc-rich-text-editor .bc-editor-content ol {
          padding-left: 1.5rem;
        }

        .bc-rich-text-editor .bc-editor-content blockquote {
          border-left: 4px solid color-mix(in oklab, var(--bc-accent), white 55%);
          padding-left: 1rem;
          color: var(--bc-ink-2);
        }

        .bc-rich-text-editor .bc-editor-content code {
          border-radius: 0.5rem;
          background: color-mix(in oklab, var(--bc-surface-soft), white 22%);
          padding: 0.1rem 0.35rem;
          font-family: var(--font-mono), "SF Mono", ui-monospace, monospace;
          font-size: 0.92em;
        }

        .bc-rich-text-editor .bc-editor-content img.bc-editor-image {
          display: block;
          max-width: 100%;
          border-radius: var(--bc-radius-md);
          margin: 1rem 0;
          box-shadow: var(--bc-elev-raised);
        }

        .bc-rich-text-editor .bc-editor-content .bc-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          height: 0;
          color: var(--bc-meta);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

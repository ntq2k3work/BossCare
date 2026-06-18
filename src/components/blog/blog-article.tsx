import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import type { BlogContent } from "@/lib/blog/types";

const extensions = [StarterKit, Image.configure({ allowBase64: false })];

export function BlogArticle({ content }: { content: BlogContent }) {
  return <div className="blog-prose">{renderToReactElement({ extensions, content })}</div>;
}

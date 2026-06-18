import { z } from "zod";
import type { BlogContent } from "./types";

const safeUrl = z
  .string()
  .trim()
  .url()
  .refine((value) => value.startsWith("https://") || value.startsWith("http://"), "Only HTTP(S) URLs are allowed");

const optionalSafeUrl = safeUrl.optional().or(z.literal("")).transform((value) => value || null);

export const blogInputSchema = z.object({
  title: z.string().trim().min(1).max(180),
  slug: z.string().trim().toLowerCase().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().min(1).max(320),
  contentJson: z.record(z.string(), z.unknown()),
  coverImageUrl: optionalSafeUrl,
  locale: z.enum(["vi", "en"]),
  status: z.enum(["draft", "published"]),
});

const allowedNodes = new Set(["doc", "paragraph", "text", "heading", "bulletList", "orderedList", "listItem", "blockquote", "codeBlock", "hardBreak", "horizontalRule", "image"]);
const allowedMarks = new Set(["bold", "italic", "underline", "strike", "code", "link"]);

export function parseBlogInput(input: unknown) {
  const parsed = blogInputSchema.parse(input);
  const serialized = JSON.stringify(parsed.contentJson);
  if (serialized.length > 200_000) throw new Error("content_too_large");
  validateNode(parsed.contentJson, true);
  return parsed;
}

export function blogContentHasText(content: BlogContent) {
  let found = false;
  walk(content, (node) => {
    if (typeof node.text === "string" && node.text.trim()) found = true;
  });
  return found;
}

function validateNode(value: unknown, root = false): void {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid_content");
  const node = value as Record<string, unknown>;
  if (typeof node.type !== "string" || !allowedNodes.has(node.type)) throw new Error("invalid_content_node");
  if (root && node.type !== "doc") throw new Error("invalid_content_root");
  if (node.type === "text" && typeof node.text !== "string") throw new Error("invalid_content_text");

  if (node.type === "image") {
    const src = (node.attrs as Record<string, unknown> | undefined)?.src;
    if (typeof src !== "string" || !safeHttpUrl(src)) throw new Error("invalid_image_url");
  }

  if (Array.isArray(node.marks)) {
    for (const rawMark of node.marks) {
      if (!rawMark || typeof rawMark !== "object") throw new Error("invalid_content_mark");
      const mark = rawMark as Record<string, unknown>;
      if (typeof mark.type !== "string" || !allowedMarks.has(mark.type)) throw new Error("invalid_content_mark");
      if (mark.type === "link") {
        const href = (mark.attrs as Record<string, unknown> | undefined)?.href;
        if (typeof href !== "string" || !safeHttpUrl(href)) throw new Error("invalid_link_url");
      }
    }
  }

  if (node.content !== undefined) {
    if (!Array.isArray(node.content)) throw new Error("invalid_content_children");
    for (const child of node.content) validateNode(child);
  }
}

function walk(value: unknown, visit: (node: Record<string, unknown>) => void) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const node = value as Record<string, unknown>;
  visit(node);
  if (Array.isArray(node.content)) node.content.forEach((child) => walk(child, visit));
}

function safeHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

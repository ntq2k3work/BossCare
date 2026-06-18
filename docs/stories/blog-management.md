# US-015 Blog Management And Public Publishing

## Status

in-progress

## Lane

normal

## Product Contract

Household owners can create, edit, publish, unpublish, and delete localized blog posts with a free rich-text editor. Public visitors can browse and read published posts only.

## Relevant Product Docs

- `SPEC.md`
- `docs/ARCHITECTURE.md`

## Acceptance Criteria

- Admin blog routes require an authenticated household owner.
- The editor supports headings, inline formatting, lists, links, images, quotes, code, and undo/redo using MIT-licensed Tiptap core.
- Draft posts never appear on public blog routes.
- Published posts expose SEO metadata and render structured editor JSON without injecting arbitrary HTML.
- Slugs are unique and links/images accept HTTP(S) URLs only.

## Design Notes

- Commands: create, update, publish/unpublish, delete.
- Queries: admin list/detail and public published list/detail.
- API: `/api/admin/blog`, `/api/admin/blog/:id`.
- Tables: `blog_posts`.
- Domain rules: owner-only writes, unique slug, safe structured content.
- UI surfaces: `/admin/blog`, `/admin/blog/new`, `/admin/blog/:id/edit`, `/blog`, `/blog/:slug`.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Blog validation and service tests |
| Integration | Admin blog API tests |
| E2E | Create, publish, and view public post |
| Platform | Next.js production build |
| Release | Existing verification suite remains green |

## Harness Delta

Adds a normal-lane story and blog-specific proof expectations.

## Evidence

Pending implementation validation.

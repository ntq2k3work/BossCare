import Link from "next/link";
import { BrandMark, ButtonLink } from "@/components/ui/pet-ui";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function PublicBlogHeader({ locale }: { locale: "vi" | "en" }) {
  return (
    <header className="sticky top-3 z-30 mx-auto flex w-[calc(100%-1.5rem)] max-w-7xl items-center justify-between gap-3 rounded-[var(--bc-radius-pill)] border border-white/70 bg-white/80 px-3 py-2 shadow-[var(--bc-glass-shadow)] backdrop-blur-2xl">
      <Link href="/" aria-label={locale === "vi" ? "Về trang chủ BossCare" : "Back to BossCare home"}><BrandMark compact /></Link>
      <nav className="hidden items-center gap-1 sm:flex" aria-label={locale === "vi" ? "Điều hướng blog" : "Blog navigation"}>
        <Link href="/" className="rounded-[var(--bc-radius-pill)] px-3 py-2 text-xs font-bold text-[var(--bc-muted)] hover:text-[var(--bc-accent)]">{locale === "vi" ? "Trang chủ" : "Home"}</Link>
        <Link href="/blog" className="rounded-[var(--bc-radius-pill)] bg-sky-50 px-3 py-2 text-xs font-bold text-[var(--bc-accent)]">Blog</Link>
      </nav>
      <div className="flex items-center gap-2"><LanguageSwitcher /><ButtonLink href="/register" className="hidden sm:inline-flex">{locale === "vi" ? "Bắt đầu miễn phí" : "Start free"}</ButtonLink></div>
    </header>
  );
}

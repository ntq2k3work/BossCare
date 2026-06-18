import Link from "next/link";
import type { ReactNode } from "react";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { getCopy } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import { AiCareWidget } from "./ai-care-widget";
import { BrandMark, avatarPhoto, cn, dogPhoto } from "./pet-ui";

const navKeys = [
  { id: "home", href: "/dashboard", key: "home" },
  { id: "pets", href: "/dashboard/pets", key: "pets" },
  { id: "health", href: "/dashboard/pets", key: "health" },
  { id: "vaccines", href: "/dashboard/pets", key: "vaccines" },
  { id: "checkins", href: "/dashboard/pets", key: "checkins" },
  { id: "reminders", href: "/dashboard/pets", key: "reminders" },
  { id: "ai", href: "/dashboard/care-guide", key: "ai" },
  { id: "billing", href: "/dashboard/billing", key: "billing" },
  { id: "admin", href: "/admin", key: "admin" },
  { id: "blog", href: "/admin/blog", key: "blog" },
  { id: "settings", href: "/dashboard/settings", key: "settings" },
] as const;

export async function AppShell({
  children,
  userName,
  actions,
  activePath,
  activeKey = "home",
}: {
  children: ReactNode;
  userName?: string;
  actions?: ReactNode;
  activePath?: string;
  activeKey?: string;
}) {
  const locale = await getRequestLocale();
  const copy = getCopy(locale);
  const auth = await getCurrentAuthContext();

  return (
    <main className="min-h-[100dvh] bg-[var(--bc-bg)] text-[var(--bc-ink)]">
      <div className="grid min-h-[100dvh] w-full grid-cols-1 xl:grid-cols-[256px_1fr]">
        <aside className="hidden border-r border-white/70 bg-white/58 px-4 py-8 shadow-[inset_-1px_0_0_rgba(255,255,255,0.72)] backdrop-blur-2xl xl:flex xl:flex-col">
          <BrandMark slogan={copy.brand.slogan} />
          <nav className="mt-8 grid gap-2">
            {navKeys.map((item) => (
              <Link
                key={`${item.href}-${item.key}`}
                href={item.href}
                className={cn(
                  "flex min-h-12 items-center gap-3 rounded-lg px-4 text-sm font-semibold text-[var(--bc-muted)] transition hover:bg-white/76 hover:text-[var(--bc-accent)]",
                  (activeKey === item.id || activePath === item.href) && "bg-white/90 text-[var(--bc-accent)] shadow-[var(--bc-elev-ring)]",
                )}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-[var(--bc-radius-sm)] bg-white text-[11px] font-black text-[var(--bc-accent)] shadow-[var(--bc-elev-ring)]">
                  {item.key === "ai" ? "AI" : item.key.charAt(0).toUpperCase()}
                </span>
                {copy.nav[item.key as keyof typeof copy.nav]}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-[var(--bc-radius-lg)] border border-white/70 bg-white/66 p-4 shadow-[var(--bc-glass-shadow)] backdrop-blur-xl">
            <p className="text-sm font-bold text-[var(--bc-accent)]">{copy.common.managePlan}</p>
            <p className="mt-2 text-xs leading-5 text-[var(--bc-muted)]">{copy.brand.dashboardDescription}</p>
            <Link
              href="/dashboard/billing"
              className="mt-4 inline-flex min-h-9 w-full items-center justify-center rounded-[var(--bc-radius-pill)] border border-[var(--bc-border)] bg-white text-xs font-bold text-[var(--bc-accent)]"
            >
              {copy.common.viewAll}
            </Link>
          </div>

          <div className="mt-6 border-t border-white/70 pt-6">
            <div className="flex items-center gap-3">
              <img src={avatarPhoto} alt={userName ?? copy.common.owner} className="h-10 w-10 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[var(--bc-ink)]">{userName ?? (locale === "vi" ? "Linh Nguyễn" : "Linh Nguyen")}</p>
                <p className="truncate text-xs text-[var(--bc-muted)]">linh.nguyen@email.com</p>
              </div>
            </div>
            {actions ? <div className="mt-4">{actions}</div> : null}
          </div>
        </aside>
        <div className="min-w-0">
          <header className="sticky top-0 z-10 border-b border-white/70 bg-white/62 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="xl:hidden">
                <BrandMark compact />
              </div>
              <div className="ml-auto flex items-center gap-3">
                <LanguageSwitcher />
                <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[var(--bc-border)] bg-white/88 text-lg font-bold text-[var(--bc-ink-2)] shadow-[var(--bc-elev-ring)]">
                  !
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--bc-danger)] text-[10px] text-white">
                    3
                  </span>
                </button>
                <div className="hidden min-h-12 min-w-48 items-center gap-3 rounded-[var(--bc-radius-pill)] border border-[var(--bc-border)] bg-white/86 px-3 shadow-[var(--bc-elev-ring)] sm:flex">
                  <img src={dogPhoto} alt={userName ?? (locale === "vi" ? "Ảnh đại diện" : "Avatar")} className="h-8 w-8 rounded-full object-cover shadow-sm" />
                  <p className="truncate text-sm font-bold text-[var(--bc-ink)]">{userName ?? (locale === "vi" ? "Người dùng" : "User")}</p>
                  <span className="ml-auto text-sm text-[var(--bc-muted)]">v</span>
                </div>
                {actions ? <div className="hidden sm:block xl:hidden">{actions}</div> : null}
              </div>
            </div>
            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 xl:hidden">
              {navKeys.map((item) => (
                <Link
                  key={`${item.href}-${item.key}`}
                  href={item.href}
                  className={cn(
                    "shrink-0 rounded-[var(--bc-radius-pill)] border border-[var(--bc-border)] bg-white/82 px-3 py-2 text-xs font-semibold text-[var(--bc-muted)]",
                    (activeKey === item.id || activePath === item.href) && "bg-white text-[var(--bc-accent)]",
                  )}
                >
                  {copy.nav[item.key as keyof typeof copy.nav]}
                </Link>
              ))}
            </nav>
          </header>
          <div className="mx-auto max-w-[1500px] px-4 pb-8 pt-6 sm:px-6 lg:px-8">{children}</div>
        </div>
      </div>
      <AiCareWidget
        planCode={auth?.entitlements.plan ?? "free"}
        quotaLimit={auth?.entitlements.aiSessionsPerMonth ?? 0}
        canChat={Boolean(auth?.activeHousehold)}
      />
    </main>
  );
}

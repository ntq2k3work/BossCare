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
    <main className="min-h-screen bg-[#fbfbff] text-slate-900">
      <div className="grid min-h-screen w-full grid-cols-1 xl:grid-cols-[256px_1fr]">
        <aside className="hidden border-r border-slate-200/80 bg-white/90 px-4 py-8 xl:flex xl:flex-col">
          <BrandMark slogan={copy.brand.slogan} />
          <nav className="mt-8 grid gap-2">
            {navKeys.map((item) => (
              <Link
                key={`${item.href}-${item.key}`}
                href={item.href}
                className={cn(
                  "flex min-h-12 items-center gap-3 rounded-lg px-4 text-sm font-semibold text-slate-500 transition hover:bg-violet-50 hover:text-violet-700",
                  (activeKey === item.id || activePath === item.href) && "bg-violet-50 text-violet-700 shadow-sm",
                )}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[11px] font-black text-violet-600 shadow-sm">
                  {item.key === "ai" ? "AI" : item.key.charAt(0).toUpperCase()}
                </span>
                {copy.nav[item.key as keyof typeof copy.nav]}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-lg bg-violet-50 p-4">
            <p className="text-sm font-bold text-violet-700">{copy.common.managePlan}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{copy.brand.dashboardDescription}</p>
            <Link
              href="/dashboard/billing"
              className="mt-4 inline-flex min-h-9 w-full items-center justify-center rounded-md border border-violet-300 bg-white text-xs font-bold text-violet-700"
            >
              {copy.common.viewAll}
            </Link>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-3">
              <img src={avatarPhoto} alt={userName ?? copy.common.owner} className="h-10 w-10 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-950">{userName ?? (locale === "vi" ? "Linh Nguyễn" : "Linh Nguyen")}</p>
                <p className="truncate text-xs text-slate-500">linh.nguyen@email.com</p>
              </div>
            </div>
            {actions ? <div className="mt-4">{actions}</div> : null}
          </div>
        </aside>
        <div className="min-w-0">
          <header className="sticky top-0 z-10 bg-white/85 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="xl:hidden">
                <BrandMark compact />
              </div>
              <div className="ml-auto flex items-center gap-3">
                <LanguageSwitcher />
                <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-bold text-slate-700 shadow-sm">
                  !
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    3
                  </span>
                </button>
                <div className="hidden min-h-12 min-w-48 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 shadow-sm sm:flex">
                  <img src={dogPhoto} alt={userName ?? (locale === "vi" ? "Ảnh đại diện" : "Avatar")} className="h-8 w-8 rounded-full object-cover shadow-sm" />
                  <p className="truncate text-sm font-bold text-slate-950">{userName ?? (locale === "vi" ? "Người dùng" : "User")}</p>
                  <span className="ml-auto text-sm text-slate-500">v</span>
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
                    "shrink-0 rounded-full border border-violet-100 bg-white px-3 py-2 text-xs font-semibold text-slate-600",
                    (activeKey === item.id || activePath === item.href) && "bg-violet-50 text-violet-700",
                  )}
                >
                  {copy.nav[item.key as keyof typeof copy.nav]}
                </Link>
              ))}
            </nav>
          </header>
          <div className="px-4 pb-8 sm:px-6 lg:px-8">{children}</div>
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

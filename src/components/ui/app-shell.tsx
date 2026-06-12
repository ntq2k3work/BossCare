import Link from "next/link";
import type { ReactNode } from "react";
import { BrandMark, avatarPhoto, cn, dogPhoto } from "./pet-ui";

const nav = [
  { id: "home", href: "/app", label: "Trang chủ", icon: "H" },
  { id: "pets", href: "/app/pets", label: "Thú cưng", icon: "P" },
  { id: "health", href: "/app/pets", label: "Nhật ký sức khỏe", icon: "N" },
  { id: "vaccines", href: "/app/pets", label: "Tiêm phòng", icon: "T" },
  { id: "checkins", href: "/app/pets", label: "Check-in & Khoảnh khắc", icon: "C" },
  { id: "reminders", href: "/app/pets", label: "Lịch nhắc", icon: "L" },
  { id: "ai", href: "/app/care-guide", label: "AI Care Guide", icon: "AI" },
  { id: "billing", href: "/app/billing", label: "Thanh toán", icon: "$" },
  { id: "settings", href: "/app/settings", label: "Cài đặt", icon: "S" },
];

export function AppShell({
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
  return (
    <main className="min-h-screen bg-[#fbfbff] text-slate-900">
      <div className="grid min-h-screen w-full grid-cols-1 xl:grid-cols-[256px_1fr]">
        <aside className="hidden border-r border-slate-200/80 bg-white/90 px-4 py-8 xl:flex xl:flex-col">
          <BrandMark />
          <nav className="mt-8 grid gap-2">
            {nav.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={cn(
                  "flex min-h-12 items-center gap-3 rounded-lg px-4 text-sm font-semibold text-slate-500 transition hover:bg-violet-50 hover:text-violet-700",
                  (activeKey === item.id || activePath === item.href) && "bg-violet-50 text-violet-700 shadow-sm",
                )}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[11px] font-black text-violet-600 shadow-sm">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-lg bg-violet-50 p-4">
            <p className="text-sm font-bold text-violet-700">Nâng cấp Premium</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">Mở rộng tính năng và giới hạn cho gia đình bạn.</p>
            <Link
              href="/app/billing"
              className="mt-4 inline-flex min-h-9 w-full items-center justify-center rounded-md border border-violet-300 bg-white text-xs font-bold text-violet-700"
            >
              Xem gói cước
            </Link>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-3">
              <img src={avatarPhoto} alt={userName ?? "User"} className="h-10 w-10 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-950">{userName ?? "Linh Nguyễn"}</p>
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
              <div className="ml-auto flex items-center gap-4">
                <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-bold text-slate-700 shadow-sm">
                  !
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">3</span>
                </button>
                <div className="hidden min-h-12 min-w-48 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 shadow-sm sm:flex">
                  <img src={dogPhoto} alt="Milo" className="h-8 w-8 rounded-full object-cover shadow-sm" />
                  <p className="truncate text-sm font-bold text-slate-950">Milo</p>
                  <span className="ml-auto text-sm text-slate-500">v</span>
                </div>
                {actions ? <div className="hidden sm:block xl:hidden">{actions}</div> : null}
              </div>
            </div>
            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 xl:hidden">
              {nav.map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className={cn(
                    "shrink-0 rounded-full border border-violet-100 bg-white px-3 py-2 text-xs font-semibold text-slate-600",
                    (activeKey === item.id || activePath === item.href) && "bg-violet-50 text-violet-700",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>
          <div className="px-4 pb-8 sm:px-6 lg:px-8">{children}</div>
        </div>
      </div>
    </main>
  );
}

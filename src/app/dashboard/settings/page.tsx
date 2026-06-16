import { redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { getCopy } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import { AppShell } from "@/components/ui/app-shell";
import { Button, Card, dogPhoto } from "@/components/ui/pet-ui";

export default async function SettingsPage() {
  const context = await getCurrentAuthContext();
  if (!context) redirect("/login");

  const locale = await getRequestLocale();
  const copy = getCopy(locale);

  const settingsTabs = copy.settings.tabs.map((label, index) => ({
    label,
    icon: ["U", "!", "#", "G", "^", "i"][index] ?? "•",
    active: index === 0,
  }));

  const accountRows = [
    { label: copy.labels.displayName, value: locale === "vi" ? "Linh Nguyễn" : "Linh Nguyen", action: copy.common.edit },
    { label: copy.labels.email, value: "linh.nguyen@email.com", action: copy.common.edit },
    { label: locale === "vi" ? "Số điện thoại" : "Phone", value: "0987 654 321", action: copy.common.edit },
    { label: copy.labels.password, value: "••••••••••", action: locale === "vi" ? "Đổi mật khẩu" : "Change password" },
  ];

  const options = copy.settings.options.map((option, index) => ({
    ...option,
    enabled: index === 1,
  }));

  return (
    <AppShell userName={context.user.displayName} activeKey="settings">
      <div className="mx-auto grid max-w-[1240px] gap-8 pt-2">
        <header>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">{copy.settings.title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{copy.settings.description}</p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)_304px] 2xl:grid-cols-[248px_minmax(0,1fr)_320px]">
          <Card className="h-fit p-5">
            <nav className="grid gap-2">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  className={[
                    "flex min-h-12 items-center gap-4 rounded-md px-4 text-left text-sm font-semibold transition",
                    tab.active ? "bg-violet-50 text-violet-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")}
                >
                  <span className="flex h-6 w-6 items-center justify-center text-sm font-black">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>

          <div className="grid gap-6">
            <Card className="p-6">
              <h2 className="text-base font-black text-slate-950">{copy.settings.accountTitle}</h2>

              <div className="mt-6 flex flex-wrap items-center gap-5">
                <img src={dogPhoto} alt={locale === "vi" ? "Ảnh đại diện" : "Avatar"} className="h-24 w-24 rounded-full object-cover shadow-sm" />
                <div>
                  <p className="text-lg font-black text-slate-950">{locale === "vi" ? "Linh Nguyễn" : "Linh Nguyen"}</p>
                  <p className="mt-1 text-sm text-slate-500">linh.nguyen@email.com</p>
                  <Button type="button" variant="secondary" className="mt-4 min-h-9 border-violet-200 px-3 text-xs text-violet-700">
                    {copy.settings.editProfileImage}
                  </Button>
                </div>
              </div>

              <div className="mt-7 overflow-hidden rounded-lg border border-slate-200">
                {accountRows.map((row, index) => (
                  <div
                    key={row.label}
                    className={[
                      "grid gap-3 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center",
                      index > 0 ? "border-t border-slate-200" : "",
                    ].join(" ")}
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-950">{row.label}</p>
                      <p className="mt-1 text-sm text-slate-500">{row.value}</p>
                    </div>
                    <Button type="button" variant="secondary" className="min-h-9 px-3 text-xs">
                      {row.action}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="text-base font-black text-slate-950">{copy.settings.optionsTitle}</h2>
              <div className="mt-5 divide-y divide-slate-200">
                {options.map((option) => (
                  <div key={option.title} className="flex items-center justify-between gap-5 py-4 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-bold text-slate-950">{option.title}</p>
                      <p className="mt-1 text-sm leading-5 text-slate-500">{option.description}</p>
                    </div>
                    <button
                      type="button"
                      aria-pressed={option.enabled}
                      className={[
                        "relative h-7 w-12 shrink-0 rounded-full transition",
                        option.enabled ? "bg-violet-600" : "bg-slate-300",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition",
                          option.enabled ? "left-6" : "left-1",
                        ].join(" ")}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <aside className="grid h-fit gap-5">
            <Card className="p-5">
              <h2 className="text-base font-black text-slate-950">{copy.settings.dataTitle}</h2>
              <p className="mt-5 text-sm leading-6 text-slate-500">{copy.settings.dataDescription}</p>
              <Button type="button" variant="secondary" className="mt-6 w-full border-violet-300 text-violet-700">
                {copy.settings.manageData}
              </Button>
            </Card>

            <Card className="p-5">
              <h2 className="text-base font-black text-red-600">{copy.settings.deleteAccountTitle}</h2>
              <p className="mt-5 text-sm leading-6 text-slate-500">{copy.settings.deleteAccountDescription}</p>
              <Button type="button" variant="secondary" className="mt-6 w-full border-red-300 text-red-600 hover:bg-red-50">
                {copy.settings.deleteAccount}
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

import { redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { AppShell } from "@/components/ui/app-shell";
import { Button, Card, dogPhoto } from "@/components/ui/pet-ui";

const settingsTabs = [
  { label: "Tài khoản", icon: "U", active: true },
  { label: "Thông báo", icon: "!", active: false },
  { label: "Bảo mật", icon: "#", active: false },
  { label: "Đơn vị & Ngôn ngữ", icon: "G", active: false },
  { label: "Sao lưu & Đồng bộ", icon: "^", active: false },
  { label: "Giới thiệu", icon: "i", active: false },
];

const accountRows = [
  { label: "Họ và tên", value: "Linh Nguyễn", action: "Chỉnh sửa" },
  { label: "Email", value: "linh.nguyen@email.com", action: "Chỉnh sửa" },
  { label: "Số điện thoại", value: "0987 654 321", action: "Chỉnh sửa" },
  { label: "Mật khẩu", value: "••••••••••", action: "Đổi mật khẩu" },
];

const options = [
  {
    title: "Chế độ tối",
    description: "Bật giao diện tối để giảm mỏi mắt khi sử dụng ban đêm.",
    enabled: false,
  },
  {
    title: "Nhắc nhở chăm sóc thú cưng",
    description: "Nhận thông báo nhắc nhở lịch tiêm phòng, uống thuốc và chăm sóc.",
    enabled: true,
  },
  {
    title: "Chia sẻ dữ liệu ẩn danh",
    description: "Giúp PetHealthy cải thiện dịch vụ bằng cách chia sẻ dữ liệu sử dụng ẩn danh.",
    enabled: false,
  },
];

export default async function SettingsPage() {
  const context = await getCurrentAuthContext();
  if (!context) redirect("/login");

  return (
    <AppShell userName={context.user.displayName} activeKey="settings">
      <div className="mx-auto grid max-w-[1240px] gap-8 pt-2">
        <header>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">Cài đặt</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">Quản lý tài khoản và tùy chỉnh trải nghiệm của bạn.</p>
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
              <h2 className="text-base font-black text-slate-950">Thông tin tài khoản</h2>

              <div className="mt-6 flex flex-wrap items-center gap-5">
                <img src={dogPhoto} alt="Ảnh đại diện" className="h-24 w-24 rounded-full object-cover shadow-sm" />
                <div>
                  <p className="text-lg font-black text-slate-950">Linh Nguyễn</p>
                  <p className="mt-1 text-sm text-slate-500">linh.nguyen@email.com</p>
                  <Button type="button" variant="secondary" className="mt-4 min-h-9 border-violet-200 px-3 text-xs text-violet-700">
                    Đổi ảnh đại diện
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
              <h2 className="text-base font-black text-slate-950">Tùy chọn</h2>
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
              <h2 className="text-base font-black text-slate-950">Dữ liệu của bạn</h2>
              <p className="mt-5 text-sm leading-6 text-slate-500">Xem, xuất hoặc xóa dữ liệu cá nhân liên quan đến tài khoản của bạn.</p>
              <Button type="button" variant="secondary" className="mt-6 w-full border-violet-300 text-violet-700">
                Quản lý dữ liệu
              </Button>
            </Card>

            <Card className="p-5">
              <h2 className="text-base font-black text-red-600">Xóa tài khoản</h2>
              <p className="mt-5 text-sm leading-6 text-slate-500">Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu. Hành động này không thể hoàn tác.</p>
              <Button type="button" variant="secondary" className="mt-6 w-full border-red-300 text-red-600 hover:bg-red-50">
                Xóa tài khoản
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

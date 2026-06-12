import Link from "next/link";
import { BrandMark, ButtonLink, Card, Panel, catPhoto, dogPhoto } from "@/components/ui/pet-ui";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7ff] text-slate-900">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_420px]">
        <div className="space-y-8">
          <BrandMark />
          <div className="max-w-2xl space-y-5">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl">
              Cham soc thu cung khoa hoc, tien loi va an tam.
            </h1>
            <p className="text-lg leading-8 text-slate-600">
              Luu ho so suc khoe, tiem phong, check-in va thanh toan goi dich vu trong mot dashboard gon gang.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/register">Bat dau mien phi</ButtonLink>
            <ButtonLink href="/login" variant="secondary">
              Dang nhap
            </ButtonLink>
          </div>
          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
            {["Ho so suc khoe", "Lich tiem phong", "Check-in hang ngay"].map((item) => (
              <Panel key={item} className="bg-white">
                <p className="font-semibold text-slate-950">{item}</p>
                <p className="mt-1 text-xs">Theo doi ro rang cho tung be.</p>
              </Panel>
            ))}
          </div>
        </div>
        <Card className="overflow-hidden p-0">
          <div className="grid grid-cols-2 gap-3 p-4">
            <img src={dogPhoto} alt="Cho canh vang" className="h-56 rounded-lg object-cover" />
            <img src={catPhoto} alt="Meo vang" className="h-56 rounded-lg object-cover" />
          </div>
          <div className="border-t border-violet-100 p-5">
            <p className="text-sm font-bold text-slate-950">Dashboard san sang</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Pet cards, nhat ky, tiem phong, check-in va goi thanh toan duoc sap xep nhu mot app chuyen nghiep.
            </p>
          </div>
        </Card>
        <Link href="/login" className="sr-only">
          Sign in
        </Link>
      </section>
    </main>
  );
}

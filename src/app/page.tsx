import Link from "next/link";
import { BrandMark, ButtonLink, Card, Panel, catPhoto, dogPhoto } from "@/components/ui/pet-ui";
import { getCopy } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";

export default async function Home() {
  const locale = await getRequestLocale();
  const copy = getCopy(locale);

  return (
    <main className="min-h-screen bg-[#f7f7ff] text-slate-900">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_420px]">
        <div className="space-y-8">
          <BrandMark showSlogan slogan={copy.brand.slogan} />
          <div className="max-w-2xl space-y-5">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl">{copy.home.heroTitle}</h1>
            <p className="text-lg leading-8 text-slate-600">{copy.home.heroDescription}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/register">{copy.home.primaryCta}</ButtonLink>
            <ButtonLink href="/login" variant="secondary">
              {copy.home.secondaryCta}
            </ButtonLink>
          </div>
          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
            {copy.home.features.map((item) => (
              <Panel key={item.title} className="bg-white">
                <p className="font-semibold text-slate-950">{item.title}</p>
                <p className="mt-1 text-xs">{item.description}</p>
              </Panel>
            ))}
          </div>
        </div>
        <Card className="overflow-hidden p-0">
          <div className="grid grid-cols-2 gap-3 p-4">
            <img src={dogPhoto} alt={locale === "vi" ? "Chó cưng vàng" : "Golden dog"} className="h-56 rounded-lg object-cover" />
            <img src={catPhoto} alt={locale === "vi" ? "Mèo vàng" : "Golden cat"} className="h-56 rounded-lg object-cover" />
          </div>
          <div className="border-t border-violet-100 p-5">
            <p className="text-sm font-bold text-slate-950">{copy.home.dashboardTitle}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{copy.home.dashboardDescription}</p>
          </div>
        </Card>
        <Link href="/login" className="sr-only">
          {copy.home.signInAlt}
        </Link>
      </section>
    </main>
  );
}

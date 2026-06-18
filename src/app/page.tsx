import Link from "next/link";
import type { Metadata } from "next";
import { ContactForm } from "@/components/ui/contact-form";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { BrandMark, ButtonLink, Card, Panel } from "@/components/ui/pet-ui";
import { getCopy, type Locale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";

export const metadata: Metadata = {
  title: "BossCare - Hồ sơ sức khỏe, lịch nhắc và AI Care Guide cho thú cưng",
  description:
    "BossCare giúp gia đình nuôi thú cưng quản lý hồ sơ pet, lịch tiêm, health logs, check-ins, AI Care Guide và thanh toán gói trong một dashboard an toàn.",
  keywords: [
    "BossCare",
    "quản lý thú cưng",
    "hồ sơ sức khỏe thú cưng",
    "lịch tiêm thú cưng",
    "AI chăm sóc thú cưng",
    "pet care dashboard",
    "pet health records",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BossCare - Chăm boss khỏe, cả nhà an tâm",
    description:
      "Gom hồ sơ pet, lịch nhắc, nhật ký chăm sóc, AI Care Guide và thanh toán gói vào một dashboard rõ ràng cho cả gia đình.",
    url: "/",
    siteName: "BossCare",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "BossCare - Pet care dashboard cho gia đình",
    description: "Quản lý hồ sơ, lịch nhắc, AI Care Guide và thanh toán gói cho thú cưng trong một nơi.",
  },
};

const content = {
  vi: {
    eyebrow: "BossCare cho người nuôi bận rộn",
    headline: "Đừng để sức khỏe của boss nằm rải rác trong trí nhớ, tin nhắn và giấy hẹn.",
    subhead:
      "BossCare gom hồ sơ, lịch nhắc, nhật ký chăm sóc, AI Care Guide và thanh toán gói vào một không gian rõ ràng cho cả gia đình.",
    primary: "Tạo hồ sơ pet đầu tiên",
    secondary: "Xem cách hoạt động",
    signIn: "Đăng nhập",
    proof: "Thiết kế cho chủ nuôi bận, gia đình nhiều pet và người mới bắt đầu.",
    nav: { pain: "Vấn đề", solution: "Giải pháp", aeo: "Hỏi đáp", contact: "Liên hệ" },
    trust: ["Không thay bác sĩ thú y", "AI chỉ trong phạm vi pet-care", "Dữ liệu theo household", "Thanh toán SePay"],
    painTitle: "Những điểm yếu đang làm việc chăm boss trở nên căng thẳng",
    pains: [
      {
        title: "Quên lịch tiêm và tái khám",
        text: "Ngày hẹn nằm trong ảnh chụp, giấy khám hoặc một đoạn chat cũ. Đến lúc nhớ ra thì đã trễ.",
      },
      {
        title: "Hồ sơ mỗi nơi một mảnh",
        text: "Cân nặng, dị ứng, thuốc, vaccine, ảnh check-in và hóa đơn không nằm cùng một chỗ.",
      },
      {
        title: "Cả nhà chăm nhưng không cùng dữ liệu",
        text: "Người đưa đi khám, người cho ăn, người trả tiền; mỗi người biết một phần và dễ bỏ sót.",
      },
      {
        title: "Không biết dấu hiệu nào cần đi thú y",
        text: "Người mới nuôi pet thường hoang mang giữa lời khuyên trên mạng và tình huống thật của boss.",
      },
    ],
    solutionTitle: "Giải pháp: một trung tâm chăm sóc boss có kiểm soát",
    solutionIntro:
      "BossCare không thay bác sĩ thú y. BossCare giúp bạn giữ dữ liệu đúng chỗ, nhắc đúng việc và hỏi đúng câu trước khi ra quyết định.",
    solutions: [
      "Hồ sơ pet theo hộ gia đình, chỉ thành viên mới xem được dữ liệu riêng.",
      "Health logs, vaccine reminders và check-ins nằm trong cùng timeline.",
      "AI Care Guide chỉ trả lời chủ đề chăm sóc pet, chặn câu hỏi ngoài phạm vi và cảnh báo tình huống khẩn cấp.",
      "Gói dịch vụ, quota AI, thanh toán SePay và review giao dịch được theo dõi rõ ràng.",
    ],
    flowTitle: "Từ hỗn loạn đến rõ ràng trong 4 bước",
    flow: ["Tạo tài khoản", "Thêm pet", "Ghi nhận chăm sóc", "Theo dõi nhắc hẹn"],
    audienceTitle: "Một dashboard cho mọi kiểu gia đình nuôi pet",
    audiences: [
      { label: "Chủ nuôi bận rộn", value: "Lịch nhắc và nhật ký ngắn giúp không bỏ lỡ việc quan trọng." },
      { label: "Nhà nhiều pet", value: "Mỗi bé có hồ sơ riêng, nhưng cả nhà nhìn chung một nguồn dữ liệu." },
      { label: "Người mới nuôi", value: "AI Care Guide giúp đặt câu hỏi ban đầu an toàn hơn, không thay khám thú y." },
    ],
    finalTitle: "Bắt đầu bằng một hồ sơ pet. Phần còn lại để BossCare nhắc bạn.",
    finalText: "Miễn phí để thử. Khi cần thêm pet, thành viên, media và quota AI, bạn có thể nâng cấp sau.",
    aeoTitle: "Câu trả lời nhanh cho người đang tìm cách chăm boss có hệ thống",
    aeoAnswers: [
      {
        question: "BossCare là gì?",
        answer:
          "BossCare là dashboard chăm sóc thú cưng cho gia đình. Ứng dụng gom hồ sơ pet, lịch tiêm, health logs, check-ins, AI Care Guide và trạng thái thanh toán vào một nơi để cả nhà cùng theo dõi.",
      },
      {
        question: "Làm sao để không quên lịch tiêm cho chó mèo?",
        answer:
          "Bạn tạo hồ sơ pet, ghi vaccine và ngày đến hạn tiếp theo. BossCare biến dữ liệu đó thành lịch nhắc trong app để bạn không phải tìm lại giấy hẹn hoặc tin nhắn cũ.",
      },
      {
        question: "App nào lưu hồ sơ sức khỏe thú cưng cho cả gia đình?",
        answer:
          "BossCare lưu hồ sơ theo household. Mỗi pet có timeline riêng, còn thành viên trong nhà có thể cùng xem dữ liệu chăm sóc đã được chia sẻ.",
      },
      {
        question: "AI Care Guide có thay bác sĩ thú y không?",
        answer:
          "Không. AI Care Guide chỉ hỗ trợ thông tin giáo dục về chăm sóc pet, chặn câu hỏi ngoài phạm vi, từ chối tư vấn liều thuốc nguy hiểm và khuyến nghị đi thú y khi có dấu hiệu khẩn cấp.",
      },
    ],
    howToTitle: "Cách bắt đầu quản lý hồ sơ thú cưng với BossCare",
    howToSteps: [
      "Tạo tài khoản và household cho gia đình.",
      "Thêm hồ sơ pet đầu tiên với thông tin cơ bản.",
      "Ghi health log, vaccine, check-in và những lưu ý quan trọng.",
      "Theo dõi nhắc hẹn, quota AI và nâng cấp gói khi cần.",
    ],
    contactTitle: "Muốn triển khai BossCare cho gia đình, cộng đồng hoặc phòng khám?",
    contactText:
      "Gửi nhu cầu của bạn. BossCare sẽ mở email với nội dung đã điền sẵn để bạn liên hệ nhanh, không cần backend trong MVP.",
    contact: {
      name: "Tên của bạn",
      email: "Email",
      role: "Bạn quan tâm vì",
      message: "Nhu cầu hoặc vấn đề muốn giải quyết",
      submit: "Gửi yêu cầu tư vấn",
      success: "Đã mở email để bạn gửi yêu cầu tới BossCare.",
      helper: "Form dùng mailto fallback tới contact@bosscare.app.",
    },
    faq: [
      {
        question: "BossCare có thay bác sĩ thú y không?",
        answer: "Không. BossCare giúp lưu dữ liệu, nhắc lịch và hỗ trợ câu hỏi chăm sóc pet ban đầu; tình huống khẩn cấp vẫn cần bác sĩ thú y.",
      },
      {
        question: "Gia đình nhiều người có dùng chung được không?",
        answer: "Có. BossCare tổ chức dữ liệu theo household để các thành viên được mời cùng xem hồ sơ và lịch chăm sóc.",
      },
      {
        question: "Có thể bắt đầu miễn phí không?",
        answer: "Có. Bạn có thể tạo hồ sơ đầu tiên miễn phí rồi nâng cấp khi cần thêm pet, thành viên, media hoặc quota AI.",
      },
    ],
  },
  en: {
    eyebrow: "BossCare for busy pet families",
    headline: "Stop keeping pet health inside memory, chat threads, and paper reminders.",
    subhead:
      "BossCare brings records, reminders, care logs, AI Care Guide, and plan payments into one controlled workspace for the whole household.",
    primary: "Create first pet profile",
    secondary: "See how it works",
    signIn: "Sign in",
    proof: "Built for busy owners, multi-pet families, and first-time pet parents.",
    nav: { pain: "Problems", solution: "Solution", aeo: "Answers", contact: "Contact" },
    trust: ["Does not replace veterinarians", "Pet-care-only AI", "Household-scoped data", "SePay payments"],
    painTitle: "The weak spots that make pet care stressful",
    pains: [
      { title: "Missed vaccine dates", text: "Appointments hide in photos, paper notes, or old chats until they become overdue." },
      { title: "Records scattered everywhere", text: "Weight, allergies, medicine, vaccines, check-ins, and invoices live in different places." },
      { title: "Households share care, not context", text: "One person visits the clinic, one feeds, one pays; everyone sees only part of the story." },
      { title: "Unclear when to call the vet", text: "New owners often have to choose between generic internet advice and real symptoms." },
    ],
    solutionTitle: "The solution: a controlled care hub for your pet",
    solutionIntro:
      "BossCare does not replace veterinarians. It keeps the right data in one place, reminds you at the right time, and helps you ask safer first questions.",
    solutions: [
      "Household-scoped pet records, visible only to members.",
      "Health logs, vaccine reminders, and check-ins in one care timeline.",
      "Pet-only AI Care Guide that blocks off-topic prompts and flags emergencies.",
      "Plans, AI quota, SePay payments, and manual review in one billing flow.",
    ],
    flowTitle: "From scattered to clear in 4 steps",
    flow: ["Create account", "Add pet", "Log care", "Track reminders"],
    audienceTitle: "One dashboard for every pet household",
    audiences: [
      { label: "Busy owners", value: "Short logs and reminders keep important care from slipping." },
      { label: "Multi-pet homes", value: "Each pet gets a profile while the household shares one source of truth." },
      { label: "First-time owners", value: "AI Care Guide helps frame safer first questions without replacing a vet." },
    ],
    finalTitle: "Start with one pet profile. BossCare handles the reminders after that.",
    finalText: "Try it free. Upgrade later when you need more pets, members, media, and AI quota.",
    aeoTitle: "Fast answers for people looking for a more organized way to care for pets",
    aeoAnswers: [
      {
        question: "What is BossCare?",
        answer:
          "BossCare is a pet-care dashboard for households. It brings pet profiles, vaccine reminders, health logs, check-ins, AI Care Guide answers, and payment status into one shared workspace.",
      },
      {
        question: "How can I avoid forgetting dog or cat vaccine dates?",
        answer:
          "Create a pet profile, record the vaccine, and add the next due date. BossCare turns that record into an in-app reminder so you do not rely on paper notes or old messages.",
      },
      {
        question: "Which app stores pet health records for a household?",
        answer:
          "BossCare stores records by household. Each pet gets its own timeline, while invited household members can share the same care context.",
      },
      {
        question: "Does AI Care Guide replace a veterinarian?",
        answer:
          "No. AI Care Guide is educational only. It blocks off-topic prompts, refuses unsafe medication dosage advice, and points users toward veterinary care for emergency symptoms.",
      },
    ],
    howToTitle: "How to start managing pet health records with BossCare",
    howToSteps: [
      "Create an account and household workspace.",
      "Add the first pet profile with basic health details.",
      "Log health notes, vaccines, check-ins, and important care context.",
      "Track reminders, AI quota, and upgrade the plan when needed.",
    ],
    contactTitle: "Want BossCare for a family, community, or clinic workflow?",
    contactText:
      "Tell us what you need. The form opens a prefilled email so you can contact BossCare quickly without adding backend infrastructure in the MVP.",
    contact: {
      name: "Your name",
      email: "Email",
      role: "I am interested as",
      message: "Need or problem to solve",
      submit: "Send consultation request",
      success: "Email opened so you can send your request to BossCare.",
      helper: "This form uses a mailto fallback to contact@bosscare.app.",
    },
    faq: [
      {
        question: "Does BossCare replace veterinarians?",
        answer: "No. BossCare keeps records, reminders, and safer first care questions organized; emergencies still need a veterinarian.",
      },
      {
        question: "Can a multi-person household use it together?",
        answer: "Yes. BossCare organizes data by household so invited members can share records and care context.",
      },
      {
        question: "Can I start free?",
        answer: "Yes. Start with a free first profile, then upgrade when you need more pets, members, media, or AI quota.",
      },
    ],
  },
} satisfies Record<Locale, unknown>;

export default async function Home() {
  const locale = await getRequestLocale();
  const copy = getCopy(locale);
  const page = content[locale] as typeof content.vi;
  const jsonLd = buildJsonLd(locale, page);

  return (
    <main className="min-h-[100dvh] overflow-hidden text-[var(--bc-ink)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="fixed left-3 right-3 top-3 z-30 mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-[var(--bc-radius-pill)] border border-white/70 bg-white/76 px-3 py-2 shadow-[var(--bc-glass-shadow)] backdrop-blur-2xl sm:left-5 sm:right-5">
        <BrandMark compact />
        <nav className="hidden items-center gap-1 md:flex" aria-label={locale === "vi" ? "Điều hướng landing page" : "Landing page navigation"}>
          <a href="#pain-points" className="rounded-[var(--bc-radius-pill)] px-3 py-2 text-xs font-bold text-[var(--bc-muted)] transition hover:bg-sky-50 hover:text-[var(--bc-accent)]">
            {page.nav.pain}
          </a>
          <a href="#how-it-works" className="rounded-[var(--bc-radius-pill)] px-3 py-2 text-xs font-bold text-[var(--bc-muted)] transition hover:bg-sky-50 hover:text-[var(--bc-accent)]">
            {page.nav.solution}
          </a>
          <a href="#faq" className="rounded-[var(--bc-radius-pill)] px-3 py-2 text-xs font-bold text-[var(--bc-muted)] transition hover:bg-sky-50 hover:text-[var(--bc-accent)]">
            {page.nav.aeo}
          </a>
          <a href="#contact" className="rounded-[var(--bc-radius-pill)] px-3 py-2 text-xs font-bold text-[var(--bc-muted)] transition hover:bg-sky-50 hover:text-[var(--bc-accent)]">
            {page.nav.contact}
          </a>
          <Link href="/blog" className="rounded-[var(--bc-radius-pill)] px-3 py-2 text-xs font-bold text-[var(--bc-muted)] transition hover:bg-sky-50 hover:text-[var(--bc-accent)]">
            Blog
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ButtonLink href="/register" className="hidden min-h-10 px-4 sm:inline-flex">
            {page.primary}
          </ButtonLink>
        </div>
      </header>
      <section className="relative mx-auto grid min-h-[100dvh] w-full max-w-7xl items-center gap-12 px-5 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="pointer-events-none absolute left-[8%] top-10 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-[6%] h-96 w-96 rounded-full bg-white/80 blur-3xl" />

        <div className="relative z-[1] space-y-9">
          <BrandMark showSlogan slogan={copy.brand.slogan} />
          <div className="max-w-4xl space-y-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--bc-accent)]">{page.eyebrow}</p>
            <h1 className="text-5xl font-black leading-[0.94] tracking-[-0.065em] text-[var(--bc-ink)] sm:text-7xl">
              {page.headline}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--bc-muted)]">{page.subhead}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href="/register" className="min-h-12 px-6">
              {page.primary}
            </ButtonLink>
            <ButtonLink href="#how-it-works" variant="secondary" className="min-h-12 px-6">
              {page.secondary}
            </ButtonLink>
            <Link href="/login" className="text-sm font-bold text-[var(--bc-accent)] underline-offset-4 hover:underline">
              {page.signIn}
            </Link>
            <p className="max-w-xs text-sm leading-6 text-[var(--bc-muted)]">{page.proof}</p>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {page.trust.map((item) => (
              <span key={item} className="rounded-[var(--bc-radius-pill)] border border-[var(--bc-border)] bg-white/72 px-3 py-1.5 text-xs font-bold text-[var(--bc-ink-2)] shadow-[var(--bc-elev-ring)]">
                {item}
              </span>
            ))}
          </div>
        </div>

        <HeroProductPanel locale={locale} />
      </section>

      <section id="pain-points" className="mx-auto grid w-full max-w-7xl scroll-mt-24 gap-8 px-5 py-20 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <div className="max-w-xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--bc-accent)]">Pain points</p>
          <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.055em] text-[var(--bc-ink)] sm:text-5xl">
            {page.painTitle}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {page.pains.map((item, index) => (
            <Panel key={item.title} className={index % 2 ? "md:translate-y-8" : ""}>
              <p className="text-xs font-black text-[var(--bc-accent)]">0{index + 1}</p>
              <h3 className="mt-4 text-xl font-black tracking-[-0.035em] text-[var(--bc-ink)]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--bc-muted)]">{item.text}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto grid w-full max-w-7xl scroll-mt-8 gap-8 px-5 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <Card className="overflow-hidden p-8 lg:p-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--bc-accent)]">Solution</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black leading-none tracking-[-0.055em] text-[var(--bc-ink)] sm:text-5xl">
            {page.solutionTitle}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--bc-muted)]">{page.solutionIntro}</p>
          <div className="mt-10 grid gap-3">
            {page.solutions.map((item) => (
              <div key={item} className="grid grid-cols-[32px_1fr] items-start gap-4 rounded-[var(--bc-radius-md)] bg-white/72 p-4 shadow-[var(--bc-elev-ring)]">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--bc-accent)]" />
                <p className="text-sm leading-6 text-[var(--bc-ink-2)]">{item}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid content-start gap-4">
          <Panel className="bg-[var(--bc-accent)] p-7 text-white">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">Outcome</p>
            <p className="mt-8 text-5xl font-black tracking-[-0.06em]">1</p>
            <p className="mt-2 text-sm leading-6 text-white/78">source of truth for care, family, AI guidance, and payment status.</p>
          </Panel>
          <Panel className="p-7">
            <h3 className="text-2xl font-black tracking-[-0.045em] text-[var(--bc-ink)]">{page.flowTitle}</h3>
            <div className="mt-6 grid gap-3">
              {page.flow.map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-[var(--bc-radius-sm)] bg-white/76 px-4 py-3 shadow-[var(--bc-elev-ring)]">
                  <span className="font-mono text-xs font-black text-[var(--bc-accent)]">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-sm font-bold text-[var(--bc-ink)]">{step}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--bc-accent)]">Who it helps</p>
          <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.055em] text-[var(--bc-ink)] sm:text-5xl">
            {page.audienceTitle}
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.9fr_1.05fr]">
          {page.audiences.map((item, index) => (
            <Card key={item.label} className={index === 1 ? "lg:mt-12" : ""}>
              <p className="text-sm font-black text-[var(--bc-accent)]">{item.label}</p>
              <p className="mt-5 text-2xl font-black leading-tight tracking-[-0.045em] text-[var(--bc-ink)]">{item.value}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto grid w-full max-w-7xl scroll-mt-8 gap-8 px-5 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className="max-w-xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--bc-accent)]">AEO answers</p>
          <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.055em] text-[var(--bc-ink)] sm:text-5xl">
            {page.aeoTitle}
          </h2>
          <p className="mt-5 text-sm leading-6 text-[var(--bc-muted)]">
            {locale === "vi"
              ? "Các câu trả lời được viết theo dạng ngắn, rõ, dễ trích dẫn cho công cụ tìm kiếm và AI agents."
              : "Short, direct answers designed for search engines and AI agents to cite accurately."}
          </p>
        </div>
        <div className="grid gap-4">
          {page.aeoAnswers.map((item) => (
            <Panel key={item.question} className="p-6">
              <h3 className="text-xl font-black tracking-[-0.035em] text-[var(--bc-ink)]">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--bc-muted)]">{item.answer}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <Card className="p-8 lg:p-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--bc-accent)]">How-to</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black leading-none tracking-[-0.055em] text-[var(--bc-ink)] sm:text-5xl">
            {page.howToTitle}
          </h2>
          <div className="mt-10 grid gap-3">
            {page.howToSteps.map((step, index) => (
              <div key={step} className="grid grid-cols-[44px_1fr] items-center gap-4 rounded-[var(--bc-radius-md)] bg-white/72 p-4 shadow-[var(--bc-elev-ring)]">
                <span className="font-mono text-sm font-black text-[var(--bc-accent)]">{String(index + 1).padStart(2, "0")}</span>
                <p className="text-sm font-semibold leading-6 text-[var(--bc-ink-2)]">{step}</p>
              </div>
            ))}
          </div>
        </Card>
        <Panel className="content-center p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--bc-accent)]">Agent-ready</p>
          <h3 className="mt-4 text-3xl font-black leading-none tracking-[-0.05em] text-[var(--bc-ink)]">
            {locale === "vi" ? "Có llms.txt cho AI agents đọc nhanh." : "Includes llms.txt for AI agents."}
          </h3>
          <p className="mt-5 text-sm leading-7 text-[var(--bc-muted)]">
            {locale === "vi"
              ? "File /llms.txt tóm tắt BossCare, đối tượng sử dụng, câu trả lời có thể trích dẫn và các lưu ý an toàn khi nói về AI Care Guide."
              : "/llms.txt summarizes BossCare, target users, citable answers, and safety notes for describing AI Care Guide."}
          </p>
        </Panel>
      </section>

      <section id="contact" className="mx-auto grid w-full max-w-7xl scroll-mt-24 gap-8 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="max-w-xl content-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--bc-accent)]">Contact</p>
          <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.055em] text-[var(--bc-ink)] sm:text-5xl">
            {page.contactTitle}
          </h2>
          <p className="mt-5 text-sm leading-7 text-[var(--bc-muted)]">{page.contactText}</p>
          <div className="mt-8 grid gap-3 text-sm text-[var(--bc-ink-2)]">
            <p className="rounded-[var(--bc-radius-md)] bg-white/72 p-4 shadow-[var(--bc-elev-ring)]">
              contact@bosscare.app
            </p>
            <p className="rounded-[var(--bc-radius-md)] bg-white/72 p-4 shadow-[var(--bc-elev-ring)]">
              {locale === "vi" ? "Phù hợp cho gia đình nhiều pet, cộng đồng nuôi pet và phòng khám muốn thử workflow chăm sóc số." : "Useful for multi-pet families, pet communities, and clinics exploring digital care workflows."}
            </p>
          </div>
        </div>
        <Card className="p-6 lg:p-8">
          <ContactForm copy={page.contact} locale={locale} />
        </Card>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-20 lg:px-8">
        <Card className="grid gap-8 overflow-hidden p-8 lg:grid-cols-[1fr_auto] lg:p-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--bc-accent)]">Start now</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black leading-none tracking-[-0.055em] text-[var(--bc-ink)] sm:text-5xl">
              {page.finalTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--bc-muted)]">{page.finalText}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <ButtonLink href="/register" className="min-h-12 px-6">
              {page.primary}
            </ButtonLink>
            <ButtonLink href="/login" variant="secondary" className="min-h-12 px-6">
              {page.signIn}
            </ButtonLink>
          </div>
        </Card>
        <Link href="/login" className="sr-only">
          {copy.home.signInAlt}
        </Link>
      </section>
    </main>
  );
}

function buildJsonLd(locale: Locale, page: typeof content.vi) {
  const baseUrl = "https://bosscare.app";
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "BossCare",
      url: baseUrl,
      logo: `${baseUrl}/bosscare-logo.svg`,
      slogan: locale === "vi" ? "Chăm boss khỏe, cả nhà an tâm." : "Healthier pets, calmer households.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "contact@bosscare.app",
        availableLanguage: ["Vietnamese", "English"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "BossCare",
      url: baseUrl,
      inLanguage: locale === "vi" ? "vi-VN" : "en-US",
      potentialAction: {
        "@type": "RegisterAction",
        target: `${baseUrl}/register`,
        name: page.primary,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "BossCare",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      url: baseUrl,
      description: page.subhead,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "VND",
        availability: "https://schema.org/InStock",
      },
      featureList: page.solutions,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [...page.aeoAnswers, ...page.faq].map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: page.howToTitle,
      description: page.finalText,
      totalTime: "PT10M",
      step: page.howToSteps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step,
        text: step,
      })),
    },
  ];
}

function HeroProductPanel({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  return (
    <div className="relative min-h-[620px]">
      <div className="absolute right-0 top-4 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      <Card className="absolute right-0 top-4 w-full max-w-[560px] overflow-hidden p-0">
        <div className="border-b border-[var(--bc-border-soft)] bg-white/68 px-6 py-5 backdrop-blur">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--bc-muted)]">BossCare workspace</p>
          <p className="mt-2 text-sm leading-6 text-[var(--bc-muted)]">
            {vi ? "Một màn hình để biết hôm nay cần làm gì cho từng bé." : "One screen to know what each pet needs today."}
          </p>
        </div>
        <div className="grid gap-4 p-5">
          <Panel className="grid grid-cols-[64px_1fr_auto] items-center gap-4">
            <div className="h-16 w-16 rounded-[22px] bg-[linear-gradient(135deg,#dff1ff,#ffffff)] shadow-[var(--bc-elev-ring)]" />
            <div>
              <p className="font-black text-[var(--bc-ink)]">Milo</p>
              <p className="text-sm text-[var(--bc-muted)]">{vi ? "Corgi · vaccine sắp đến hạn" : "Corgi · vaccine due soon"}</p>
            </div>
            <span className="rounded-[var(--bc-radius-pill)] bg-sky-50 px-3 py-1 text-xs font-bold text-[var(--bc-accent)]">
              {vi ? "Theo dõi" : "Tracked"}
            </span>
          </Panel>
          <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
            <Panel>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--bc-muted)]">Care timeline</p>
              <div className="mt-5 grid gap-3">
                <div className="h-2 w-11/12 rounded-full bg-sky-100" />
                <div className="h-2 w-8/12 rounded-full bg-slate-100" />
                <div className="h-2 w-10/12 rounded-full bg-slate-100" />
              </div>
            </Panel>
            <Panel className="bg-[var(--bc-accent)] text-white">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/75">AI guide</p>
              <p className="mt-5 text-3xl font-black tracking-[-0.05em]">5</p>
              <p className="mt-1 text-xs text-white/75">{vi ? "lượt còn lại" : "sessions left"}</p>
            </Panel>
          </div>
        </div>
      </Card>
      <Card className="absolute bottom-0 left-0 w-[min(430px,92vw)] p-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            ["02", vi ? "Bé" : "Pets"],
            ["18", vi ? "Ghi chú" : "Logs"],
            ["01", vi ? "Gói" : "Plan"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-[var(--bc-radius-md)] bg-white/72 p-4 shadow-[var(--bc-elev-ring)]">
              <p className="text-2xl font-black tracking-[-0.05em] text-[var(--bc-ink)]">{value}</p>
              <p className="mt-1 text-xs font-semibold text-[var(--bc-muted)]">{label}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

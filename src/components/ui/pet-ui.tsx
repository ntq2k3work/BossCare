import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type ClassName = {
  className?: string;
};

export const BRAND_NAME = "BossCare";
export const BRAND_SLOGAN = "Chăm boss khỏe, cả nhà an tâm.";
export const BRAND_LOGO_SRC = "/bosscare-logo.svg";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function BrandMark({
  compact = false,
  showSlogan = false,
  slogan = BRAND_SLOGAN,
}: {
  compact?: boolean;
  showSlogan?: boolean;
  slogan?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <img src="/icon.svg" alt="" className="h-10 w-10 rounded-[var(--bc-radius-sm)] shadow-[var(--bc-elev-ring)]" />
      {!compact ? (
        <div className="leading-tight">
          <p className="text-xl font-black tracking-[-0.03em] text-[var(--bc-ink)]">
            Boss<span className="text-[var(--bc-accent)]">Care</span>
          </p>
          {showSlogan ? <p className="text-xs font-semibold text-[var(--bc-muted)]">{slogan}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

export function Card({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "rounded-[var(--bc-radius-lg)] border border-[var(--bc-border-soft)] bg-[var(--bc-glass-strong)] p-6 shadow-[var(--bc-elev-raised)] backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-[var(--bc-motion)] ease-[var(--bc-ease)]",
        className,
      )}
      {...props}
    />
  );
}

export function Panel({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[var(--bc-radius-md)] border border-[var(--bc-border-soft)] bg-white/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-md",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({
  tone = "neutral",
  className,
  children,
}: ClassName & { tone?: "neutral" | "good" | "warn" | "danger" | "violet"; children: ReactNode }) {
  const tones = {
    neutral: "border-[var(--bc-border)] bg-white/72 text-[var(--bc-muted)]",
    good: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warn: "border-amber-200 bg-amber-50 text-amber-800",
    danger: "border-rose-200 bg-rose-50 text-rose-700",
    violet: "border-sky-200 bg-sky-50 text-sky-700",
  };
  return (
    <span className={cn("inline-flex items-center rounded-[var(--bc-radius-pill)] border px-3 py-1 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  ...props
}: ComponentProps<typeof Link> & { variant?: "primary" | "secondary" | "ghost" }) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ComponentProps<"button"> & { variant?: "primary" | "secondary" | "ghost" }) {
  return <button className={buttonClass(variant, className)} {...props} />;
}

export function buttonClass(variant: "primary" | "secondary" | "ghost" = "primary", className?: string) {
  const variants = {
    primary: "bg-[var(--bc-accent)] text-white shadow-[0_10px_28px_rgba(0,113,227,0.20)] hover:bg-[var(--bc-accent-hover)]",
    secondary: "border border-[var(--bc-border)] bg-white/82 text-[var(--bc-accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.84)] hover:bg-white",
    ghost: "text-[var(--bc-muted)] hover:bg-white/72 hover:text-[var(--bc-ink)]",
  };
  return cn(
    "inline-flex min-h-10 items-center justify-center rounded-[var(--bc-radius-pill)] px-4 py-2 text-sm font-semibold transition duration-[var(--bc-motion-fast)] ease-[var(--bc-ease)] active:translate-y-px disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    className,
  );
}

export const fieldClass =
  "min-h-11 w-full rounded-[var(--bc-radius-sm)] border border-[var(--bc-border)] bg-white/86 px-3 py-2 text-sm text-[var(--bc-ink)] outline-none transition duration-[var(--bc-motion-fast)] ease-[var(--bc-ease)] placeholder:text-[var(--bc-meta)] focus:border-[var(--bc-accent)] focus:ring-4 focus:ring-sky-100";

export const labelClass = "grid gap-2 text-sm font-semibold text-[var(--bc-ink-2)]";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-5">
      <div className="min-w-0">
        {eyebrow ? <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--bc-accent)]">{eyebrow}</div> : null}
        <h1 className="text-3xl font-black tracking-[-0.045em] text-[var(--bc-ink)] sm:text-4xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--bc-muted)]">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function StatCard({ label, value, note }: { label: string; value: ReactNode; note?: ReactNode }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--bc-muted)]">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-[-0.04em] text-[var(--bc-ink)]">{value}</p>
      {note ? <p className="mt-2 text-xs text-[var(--bc-muted)]">{note}</p> : null}
    </Card>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <Card className="grid min-h-44 place-items-center text-center">
      <div className="max-w-sm">
        <p className="text-lg font-black text-[var(--bc-ink)]">{title}</p>
        <p className="mt-2 text-sm leading-6 text-[var(--bc-muted)]">{description}</p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </Card>
  );
}

export function PetPhoto({ name, imageUrl, className }: { name: string; imageUrl?: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[var(--bc-radius-md)] bg-sky-50", className)}>
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full min-h-28 w-full items-center justify-center bg-[linear-gradient(135deg,#eef6ff,#ffffff)] text-3xl font-black text-[var(--bc-accent)]">
          {name.slice(0, 1).toUpperCase()}
        </div>
      )}
    </div>
  );
}

export const dogPhoto =
  "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=640&q=80";
export const catPhoto =
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=640&q=80";
export const corgiPhoto =
  "https://images.unsplash.com/photo-1612536057832-2ff7ead58194?auto=format&fit=crop&w=640&q=80";
export const avatarPhoto =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80";

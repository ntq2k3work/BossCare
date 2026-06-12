import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type ClassName = {
  className?: string;
};

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-sm font-black text-violet-600">
        P+
      </span>
      {!compact ? (
        <p className="text-xl font-black tracking-tight text-slate-950">
          Pet<span className="text-violet-600">Healthy</span>
        </p>
      ) : null}
    </div>
  );
}

export function Card({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "rounded-lg border border-slate-200/80 bg-white p-5 shadow-[0_18px_55px_rgba(67,56,202,0.08)]",
        className,
      )}
      {...props}
    />
  );
}

export function Panel({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-lg border border-slate-200/80 bg-white/80 p-4", className)}
      {...props}
    />
  );
}

export function Badge({ tone = "neutral", className, children }: ClassName & { tone?: "neutral" | "good" | "warn" | "danger" | "violet"; children: ReactNode }) {
  const tones = {
    neutral: "border-slate-200 bg-slate-50 text-slate-600",
    good: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warn: "border-amber-200 bg-amber-50 text-amber-700",
    danger: "border-rose-200 bg-rose-50 text-rose-700",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}

export function ButtonLink({ className, variant = "primary", ...props }: ComponentProps<typeof Link> & { variant?: "primary" | "secondary" | "ghost" }) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}

export function Button({ className, variant = "primary", ...props }: ComponentProps<"button"> & { variant?: "primary" | "secondary" | "ghost" }) {
  return <button className={buttonClass(variant, className)} {...props} />;
}

export function buttonClass(variant: "primary" | "secondary" | "ghost" = "primary", className?: string) {
  const variants = {
    primary: "bg-violet-600 text-white shadow-sm hover:bg-violet-700",
    secondary: "border border-violet-200 bg-white text-violet-700 hover:bg-violet-50",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
  };
  return cn(
    "inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    className,
  );
}

export const fieldClass =
  "min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100";

export const labelClass = "grid gap-2 text-sm font-medium text-slate-700";

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
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? <div className="mb-2 text-sm font-semibold text-violet-600">{eyebrow}</div> : null}
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function StatCard({ label, value, note }: { label: string; value: ReactNode; note?: ReactNode }) {
  return (
    <Card className="p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
      {note ? <p className="mt-1 text-xs text-slate-500">{note}</p> : null}
    </Card>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <Card className="grid min-h-44 place-items-center text-center">
      <div className="max-w-sm">
        <p className="text-lg font-bold text-slate-950">{title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </Card>
  );
}

export function PetPhoto({ name, imageUrl, className }: { name: string; imageUrl?: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-violet-50", className)}>
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full min-h-28 w-full items-center justify-center bg-gradient-to-br from-amber-100 to-violet-100 text-3xl font-bold text-violet-500">
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

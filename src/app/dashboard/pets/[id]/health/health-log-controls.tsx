"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { HealthLog } from "@/lib/health-logs/types";
import type { ReactNode } from "react";
import { getCopy } from "@/lib/i18n";
import { useI18n } from "@/components/i18n-provider";
import { Button, Card, EmptyState, fieldClass, labelClass } from "@/components/ui/pet-ui";

type Props = {
  petId: string;
  petName: string;
  logs: HealthLog[];
  selectedType: string;
};

type DisplayLog = {
  id: string;
  type: string;
  title: string;
  note: string;
  date: string;
  time: string;
  badge: string;
  tone: "good" | "violet" | "amber" | "info" | "rose";
  icon: string;
  source?: HealthLog;
};

const types = ["weight", "symptom", "medication", "appetite", "stool", "behavior", "vet_visit"] as const;

function buildDemoLogs(locale: "vi" | "en"): DisplayLog[] {
  const copy = getCopy(locale);
  const labels = copy.health.types;
  const badges = copy.health.badges;
  const date = (value: string) => value;

  return [
    { id: "demo-weight", type: "weight", title: labels.weight, note: locale === "vi" ? "5.2 kg · Tăng 0.2 kg so với lần trước" : "5.2 kg · Up 0.2 kg since last time", date: date(locale === "vi" ? "07/06/2024" : "06/07/2024"), time: "09:30", badge: badges.normal, tone: "good", icon: "W" },
    { id: "demo-vaccine", type: "medication", title: labels.medication, note: locale === "vi" ? "Vaccine 5 bệnh (DHPPi)" : "5-in-1 vaccine (DHPPi)", date: date(locale === "vi" ? "01/06/2024" : "06/01/2024"), time: "10:15", badge: badges.vaccinated, tone: "violet", icon: "V" },
    { id: "demo-stool", type: "stool", title: labels.stool, note: locale === "vi" ? "Phân hơi mềm, ăn uống bình thường" : "Slightly soft stool, eating normally", date: date(locale === "vi" ? "31/05/2024" : "05/31/2024"), time: "19:45", badge: badges.needsFollowUp, tone: "amber", icon: "D" },
    { id: "demo-vet", type: "vet_visit", title: labels.vetVisit, note: locale === "vi" ? "Khám định kỳ, sức khỏe tổng quát tốt" : "Routine checkup, overall healthy", date: date(locale === "vi" ? "20/05/2024" : "05/20/2024"), time: "11:20", badge: badges.normal, tone: "info", icon: "H" },
    { id: "demo-allergy", type: "symptom", title: labels.symptom, note: locale === "vi" ? "Ngứa nhẹ ở tai, đã vệ sinh tai" : "Mild ear itchiness, ears cleaned", date: date(locale === "vi" ? "15/05/2024" : "05/15/2024"), time: "16:30", badge: badges.hasSigns, tone: "rose", icon: "A" },
    { id: "demo-food", type: "appetite", title: labels.appetite, note: locale === "vi" ? "Ăn uống tốt, hết khẩu phần" : "Eating well, finished the portion", date: date(locale === "vi" ? "12/05/2024" : "05/12/2024"), time: "08:10", badge: badges.normal, tone: "good", icon: "F" },
    { id: "demo-mood", type: "behavior", title: labels.behavior, note: locale === "vi" ? "Năng động, chơi đùa nhiều" : "Energetic, playful", date: date(locale === "vi" ? "08/05/2024" : "05/08/2024"), time: "20:00", badge: badges.cheerful, tone: "amber", icon: "M" },
  ];
}

function dateTimeLocal(value: string) {
  return value.slice(0, 16);
}

function isoFromLocal(value: FormDataEntryValue | null) {
  if (!value) {
    return new Date().toISOString();
  }
  return new Date(String(value)).toISOString();
}

export function HealthLogControls({ petId, petName, logs, selectedType }: Props) {
  const router = useRouter();
  const { copy, locale } = useI18n();
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<HealthLog | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const displayLogs = useMemo(() => {
    const source = logs.length ? logs.map((log) => toDisplayLog(log, locale, copy)) : buildDemoLogs(locale);
    return selectedType ? source.filter((log) => log.type === selectedType) : source;
  }, [logs, selectedType, locale, copy]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const body = {
      type: form.get("type"),
      occurredAt: isoFromLocal(form.get("occurredAt")),
      title: form.get("title"),
      note: form.get("note"),
      metadataJson: null,
    };
    const response = await fetch(editing ? `/api/health-logs/${editing.id}` : `/api/pets/${petId}/health-logs`, {
      method: editing ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setError(locale === "vi" ? "Không thể lưu nhật ký sức khỏe." : "Could not save health log.");
      return;
    }

    setEditing(null);
    setShowForm(false);
    router.refresh();
  }

  async function remove(logId: string) {
    const response = await fetch(`/api/health-logs/${logId}`, { method: "DELETE" });
    if (!response.ok) {
      setError(locale === "vi" ? "Không thể xóa nhật ký sức khỏe." : "Could not delete health log.");
      return;
    }
    router.refresh();
  }

  function filter(type: string) {
    router.push(type ? `/dashboard/pets/${petId}/health?type=${type}` : `/dashboard/pets/${petId}/health`);
  }

  function editLog(log: HealthLog) {
    setEditing(log);
    setShowForm(true);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
      <Card className="content-start">
        <h2 className="text-lg font-black text-slate-950">{copy.health.filterTitle}</h2>
        <div className="mt-7 grid gap-6">
          <label className={labelClass}>
            {copy.health.logType}
            <select value={selectedType} onChange={(event) => filter(event.target.value)} className={fieldClass}>
              <option value="">{copy.health.allTypes}</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {typeLabel(type, copy)}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            {copy.health.timeRange}
            <select className={fieldClass} defaultValue="30">
              <option value="30">{copy.health.last30}</option>
              <option value="90">{copy.health.last90}</option>
              <option value="all">{copy.health.all}</option>
            </select>
          </label>
          <label className={labelClass}>
            {copy.health.fromDate}
            <input type="date" defaultValue="2024-05-08" className={fieldClass} />
          </label>
          <label className={labelClass}>
            {copy.health.toDate}
            <input type="date" defaultValue="2024-06-07" className={fieldClass} />
          </label>
          <label className={labelClass}>
            {copy.health.note}
            <input placeholder={copy.health.searchPlaceholder} className={fieldClass} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="secondary" onClick={() => filter("")}>{copy.health.clearFilters}</Button>
            <Button type="button">{copy.health.apply}</Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-black text-slate-950">{copy.health.allLogs(displayLogs.length || 12)}</h2>
          <div className="flex rounded-lg border border-slate-200 bg-white p-1">
            <button className="min-h-11 rounded-md bg-violet-50 px-5 text-sm font-bold text-violet-700">{copy.health.timelineView}</button>
            <button className="min-h-11 px-5 text-sm font-bold text-slate-500">{copy.health.listView}</button>
          </div>
        </div>

        {showForm ? (
          <section className="mt-6 rounded-lg border border-violet-100 bg-violet-50/40 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-black text-slate-950">{editing ? copy.health.editLog : copy.health.addLogForPet(petName)}</h3>
              <Button type="button" variant="ghost" onClick={() => { setEditing(null); setShowForm(false); }}>
                {copy.health.close}
              </Button>
            </div>
            <HealthLogForm editing={editing} error={error} ready={ready} onSubmit={submit} copy={copy} />
          </section>
        ) : (
          <div className="mt-6 flex justify-end">
            <Button type="button" onClick={() => setShowForm(true)}>{copy.health.addNew}</Button>
          </div>
        )}

        <section className="relative mt-6">
          <div className="absolute bottom-14 left-7 top-6 w-px bg-slate-200" />
          {displayLogs.length ? (
            <div className="grid gap-4">
              {displayLogs.map((log) => (
                <TimelineLog key={log.id} log={log} onEdit={log.source ? () => editLog(log.source!) : undefined} onRemove={log.source ? () => remove(log.source!.id) : undefined} locale={locale} />
              ))}
            </div>
          ) : (
            <EmptyState title={copy.health.noLogsTitle} description={copy.health.noLogsDescription} />
          )}
        </section>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white">
            {["‹", "1", "2", "3", "›"].map((item, index) => (
              <button key={item} className={`min-h-11 min-w-11 border-r border-slate-200 px-4 text-sm font-bold last:border-r-0 ${index === 1 ? "bg-violet-600 text-white" : "text-slate-600"}`}>
                {item}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>{copy.health.show}</span>
            <select className="min-h-11 rounded-md border border-slate-200 bg-white px-4 font-bold text-slate-700" defaultValue="10">
              <option>10</option>
              <option>20</option>
            </select>
            <span>{copy.health.itemsPerPage}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function HealthLogForm({
  editing,
  error,
  ready,
  onSubmit,
  copy,
}: {
  editing: HealthLog | null;
  error: string;
  ready: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  copy: ReturnType<typeof getCopy>;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-5 grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          {copy.health.form.type}
          <select name="type" defaultValue={editing?.type ?? "weight"} className={fieldClass}>
            {types.map((type) => (
              <option key={type} value={type}>
                {typeLabel(type, copy)}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          {copy.health.form.time}
          <input
            name="occurredAt"
            type="datetime-local"
            required
            defaultValue={editing ? dateTimeLocal(editing.occurredAt) : dateTimeLocal(new Date().toISOString())}
            className={fieldClass}
          />
        </label>
      </div>
      <label className={labelClass}>
        {copy.health.form.title}
        <input name="title" required defaultValue={editing?.title ?? ""} className={fieldClass} />
      </label>
      <label className={labelClass}>
        {copy.health.form.note}
        <textarea name="note" defaultValue={editing?.note ?? ""} className={`${fieldClass} min-h-24`} />
      </label>
      {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
      <Button disabled={!ready}>{editing ? copy.health.form.save : copy.health.form.add}</Button>
    </form>
  );
}

function TimelineLog({
  log,
  onEdit,
  onRemove,
  locale,
}: {
  log: DisplayLog;
  onEdit?: () => void;
  onRemove?: () => void;
  locale: "vi" | "en";
}) {
  const copy = getCopy(locale);
  return (
    <article className="relative grid grid-cols-[52px_1fr] gap-4">
      <span className={`relative z-[1] mt-8 h-3 w-3 place-self-center rounded-full ${dotClass(log.tone)}`} />
      <div className="grid min-h-24 grid-cols-[56px_1fr_auto] items-center gap-4 rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm">
        <Icon tone={log.tone}>{log.icon}</Icon>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-black text-slate-950">{log.title}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass(log.tone)}`}>{log.badge}</span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{log.note}</p>
        </div>
        <div className="min-w-32 text-right text-sm text-slate-600">
          <p>{log.date}</p>
          <p className="mt-1">{log.time}</p>
          <div className="mt-2 flex justify-end gap-2">
            {onEdit ? <button onClick={onEdit} className="font-bold text-violet-700">{copy.common.edit}</button> : null}
            {onRemove ? <button onClick={onRemove} className="font-bold text-rose-600">{copy.common.delete}</button> : <span className="font-black text-slate-500">...</span>}
          </div>
        </div>
      </div>
    </article>
  );
}

function toDisplayLog(log: HealthLog, locale: "vi" | "en", copy: ReturnType<typeof getCopy>): DisplayLog {
  const date = new Date(log.occurredAt);
  const tone = toneForType(log.type);

  return {
    id: log.id,
    type: log.type,
    title: log.title,
    note: log.note ?? typeLabel(log.type, copy),
    date: new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US").format(date),
    time: new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", { hour: "2-digit", minute: "2-digit" }).format(date),
    badge: badgeForType(log.type, copy),
    tone,
    icon: typeLabel(log.type, copy).slice(0, 1).toUpperCase(),
    source: log,
  };
}

function typeLabel(type: string, copy: ReturnType<typeof getCopy>) {
  return copy.health.types[type as keyof typeof copy.health.types] ?? type;
}

function toneForType(type: string): DisplayLog["tone"] {
  const tones: Record<string, DisplayLog["tone"]> = {
    weight: "good",
    symptom: "rose",
    medication: "violet",
    appetite: "good",
    stool: "amber",
    behavior: "amber",
    vet_visit: "info",
  };
  return tones[type] ?? "violet";
}

function badgeForType(type: string, copy: ReturnType<typeof getCopy>) {
  if (type === "symptom") return copy.health.badges.hasSigns;
  if (type === "stool") return copy.health.badges.needsFollowUp;
  if (type === "medication") return copy.health.badges.vaccinated;
  if (type === "behavior") return copy.health.badges.cheerful;
  return copy.health.badges.normal;
}

function Icon({ tone, children }: { tone: DisplayLog["tone"]; children: ReactNode }) {
  const tones = {
    good: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    info: "bg-blue-50 text-blue-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return <span className={`flex h-12 w-12 items-center justify-center rounded-lg text-sm font-black ${tones[tone]}`}>{children}</span>;
}

function dotClass(tone: DisplayLog["tone"]) {
  const tones = {
    good: "bg-emerald-500",
    violet: "bg-violet-600",
    amber: "bg-amber-500",
    info: "bg-blue-600",
    rose: "bg-rose-500",
  };
  return tones[tone];
}

function badgeClass(tone: DisplayLog["tone"]) {
  const tones = {
    good: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    info: "bg-blue-50 text-blue-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return tones[tone];
}

"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { HealthLog } from "@/lib/health-logs/types";
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

const types = ["weight", "symptom", "medication", "appetite", "stool", "behavior", "vet_visit"];

const demoLogs: DisplayLog[] = [
  { id: "demo-weight", type: "weight", title: "Cân nặng", note: "5.2 kg · Tăng 0.2 kg so với lần trước", date: "07/06/2024", time: "09:30", badge: "Bình thường", tone: "good", icon: "W" },
  { id: "demo-vaccine", type: "medication", title: "Tiêm phòng", note: "Vaccine 5 bệnh (DHPPi)", date: "01/06/2024", time: "10:15", badge: "Đã tiêm", tone: "violet", icon: "V" },
  { id: "demo-stool", type: "stool", title: "Tiêu hóa", note: "Phân hơi mềm, ăn uống bình thường", date: "31/05/2024", time: "19:45", badge: "Cần theo dõi", tone: "amber", icon: "D" },
  { id: "demo-vet", type: "vet_visit", title: "Khám sức khỏe", note: "Khám định kỳ, sức khỏe tổng quát tốt", date: "20/05/2024", time: "11:20", badge: "Bình thường", tone: "info", icon: "H" },
  { id: "demo-allergy", type: "symptom", title: "Dị ứng", note: "Ngứa nhẹ ở tai, đã vệ sinh tai", date: "15/05/2024", time: "16:30", badge: "Có dấu hiệu", tone: "rose", icon: "A" },
  { id: "demo-food", type: "appetite", title: "Ăn uống", note: "Ăn uống tốt, hết khẩu phần", date: "12/05/2024", time: "08:10", badge: "Bình thường", tone: "good", icon: "F" },
  { id: "demo-mood", type: "behavior", title: "Tâm trạng", note: "Năng động, chơi đùa nhiều", date: "08/05/2024", time: "20:00", badge: "Vui vẻ", tone: "amber", icon: "M" },
];

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
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<HealthLog | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const displayLogs = useMemo(() => {
    const source = logs.length ? logs.map(toDisplayLog) : demoLogs;
    return selectedType ? source.filter((log) => log.type === selectedType) : source;
  }, [logs, selectedType]);

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
      const result = await response.json();
      setError(result.error?.message ?? "Could not save health log.");
      return;
    }

    setEditing(null);
    setShowForm(false);
    router.refresh();
  }

  async function remove(logId: string) {
    const response = await fetch(`/api/health-logs/${logId}`, { method: "DELETE" });
    if (!response.ok) {
      const result = await response.json();
      setError(result.error?.message ?? "Could not delete health log.");
      return;
    }
    router.refresh();
  }

  function filter(type: string) {
    router.push(type ? `/app/pets/${petId}/health?type=${type}` : `/app/pets/${petId}/health`);
  }

  function editLog(log: HealthLog) {
    setEditing(log);
    setShowForm(true);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
      <Card className="content-start">
        <h2 className="text-lg font-black text-slate-950">Bộ lọc</h2>
        <div className="mt-7 grid gap-6">
          <label className={labelClass}>
            Loại nhật ký
            <select value={selectedType} onChange={(event) => filter(event.target.value)} className={fieldClass}>
              <option value="">Tất cả loại</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {typeLabel(type)}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Khoảng thời gian
            <select className={fieldClass} defaultValue="30">
              <option value="30">30 ngày qua</option>
              <option value="90">90 ngày qua</option>
              <option value="all">Tất cả</option>
            </select>
          </label>
          <label className={labelClass}>
            Từ ngày
            <input type="date" defaultValue="2024-05-08" className={fieldClass} />
          </label>
          <label className={labelClass}>
            Đến ngày
            <input type="date" defaultValue="2024-06-07" className={fieldClass} />
          </label>
          <label className={labelClass}>
            Ghi chú
            <input placeholder="Tìm kiếm theo ghi chú..." className={fieldClass} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="secondary" onClick={() => filter("")}>Xóa bộ lọc</Button>
            <Button type="button">Áp dụng</Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-black text-slate-950">Tất cả nhật ký ({displayLogs.length || 12})</h2>
          <div className="flex rounded-lg border border-slate-200 bg-white p-1">
            <button className="min-h-11 rounded-md bg-violet-50 px-5 text-sm font-bold text-violet-700">Dạng dòng thời gian</button>
            <button className="min-h-11 px-5 text-sm font-bold text-slate-500">Dạng danh sách</button>
          </div>
        </div>

        {showForm ? (
          <section className="mt-6 rounded-lg border border-violet-100 bg-violet-50/40 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-black text-slate-950">{editing ? "Sửa nhật ký sức khỏe" : `Thêm nhật ký cho ${petName}`}</h3>
              <Button type="button" variant="ghost" onClick={() => { setEditing(null); setShowForm(false); }}>
                Đóng
              </Button>
            </div>
            <HealthLogForm editing={editing} error={error} ready={ready} onSubmit={submit} />
          </section>
        ) : (
          <div className="mt-6 flex justify-end">
            <Button type="button" onClick={() => setShowForm(true)}>+ Thêm nhật ký</Button>
          </div>
        )}

        <section className="relative mt-6">
          <div className="absolute bottom-14 left-7 top-6 w-px bg-slate-200" />
          {displayLogs.length ? (
            <div className="grid gap-4">
              {displayLogs.map((log) => (
                <TimelineLog key={log.id} log={log} onEdit={log.source ? () => editLog(log.source!) : undefined} onRemove={log.source ? () => remove(log.source!.id) : undefined} />
              ))}
            </div>
          ) : (
            <EmptyState title="Chưa có nhật ký" description="Không có bản ghi sức khỏe phù hợp với bộ lọc này." />
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
            <span>Hiển thị</span>
            <select className="min-h-11 rounded-md border border-slate-200 bg-white px-4 font-bold text-slate-700" defaultValue="10">
              <option>10</option>
              <option>20</option>
            </select>
            <span>mục/trang</span>
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
}: {
  editing: HealthLog | null;
  error: string;
  ready: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-5 grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          Loại
          <select name="type" defaultValue={editing?.type ?? "weight"} className={fieldClass}>
            {types.map((type) => (
              <option key={type} value={type}>
                {typeLabel(type)}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Thời gian
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
        Tiêu đề
        <input name="title" required defaultValue={editing?.title ?? ""} className={fieldClass} />
      </label>
      <label className={labelClass}>
        Ghi chú
        <textarea name="note" defaultValue={editing?.note ?? ""} className={`${fieldClass} min-h-24`} />
      </label>
      {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
      <Button disabled={!ready}>{editing ? "Lưu nhật ký" : "Thêm nhật ký"}</Button>
    </form>
  );
}

function TimelineLog({
  log,
  onEdit,
  onRemove,
}: {
  log: DisplayLog;
  onEdit?: () => void;
  onRemove?: () => void;
}) {
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
            {onEdit ? <button onClick={onEdit} className="font-bold text-violet-700">Sửa</button> : null}
            {onRemove ? <button onClick={onRemove} className="font-bold text-rose-600">Xóa</button> : <span className="font-black text-slate-500">...</span>}
          </div>
        </div>
      </div>
    </article>
  );
}

function toDisplayLog(log: HealthLog): DisplayLog {
  const date = new Date(log.occurredAt);
  const tone = toneForType(log.type);

  return {
    id: log.id,
    type: log.type,
    title: log.title,
    note: log.note ?? typeLabel(log.type),
    date: new Intl.DateTimeFormat("vi-VN").format(date),
    time: new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(date),
    badge: badgeForType(log.type),
    tone,
    icon: typeLabel(log.type).slice(0, 1).toUpperCase(),
    source: log,
  };
}

function typeLabel(type: string) {
  const labels: Record<string, string> = {
    weight: "Cân nặng",
    symptom: "Triệu chứng",
    medication: "Tiêm phòng",
    appetite: "Ăn uống",
    stool: "Tiêu hóa",
    behavior: "Tâm trạng",
    vet_visit: "Khám sức khỏe",
  };
  return labels[type] ?? type;
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

function badgeForType(type: string) {
  if (type === "symptom") return "Có dấu hiệu";
  if (type === "stool") return "Cần theo dõi";
  if (type === "medication") return "Đã tiêm";
  if (type === "behavior") return "Vui vẻ";
  return "Bình thường";
}

function Icon({ tone, children }: { tone: DisplayLog["tone"]; children: React.ReactNode }) {
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

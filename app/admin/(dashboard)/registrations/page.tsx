"use client";

import { useEffect, useState } from "react";
import type { Registration } from "@/src/types/registration";
import type { Training } from "@/src/types/training";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-white/[0.06] ${className}`} />;
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filterTraining, setFilterTraining] = useState("all");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/registrations").then((r) => r.json()),
      fetch("/api/admin/trainings").then((r) => r.json()),
    ]).then(([regs, trns]) => {
      setRegistrations(regs);
      setTrainings(trns);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette inscription ?")) return;
    setDeleting(id);
    await fetch(`/api/admin/registrations/${id}`, { method: "DELETE" });
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
    setDeleting(null);
  };

  const filtered = filterTraining === "all"
    ? registrations
    : registrations.filter((r) => r.trainingId === filterTraining);

  const getTrainingName = (id: string) =>
    trainings.find((t) => t.id === id)?.titleFr || "Formation inconnue";

  // Collect all unique field keys across registrations
  const allFieldKeys = Array.from(
    new Set(filtered.flatMap((r) => Object.keys(r.data)))
  );

  // Get field labels from trainings
  const getFieldLabel = (key: string) => {
    for (const t of trainings) {
      const field = t.formFields?.find((f) => f.name === key);
      if (field) return field.labelFr;
    }
    return key;
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-white">Inscriptions</h1>
          <p className="mt-1 text-[14px] text-gray-500">
            {registrations.length} inscription{registrations.length !== 1 ? "s" : ""} au total
          </p>
        </div>
      </div>

      {/* Filter by training */}
      <div className="mb-6">
        <label className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-gray-500">Filtrer par formation</label>
        <select
          value={filterTraining}
          onChange={(e) => setFilterTraining(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-[14px] text-white outline-none focus:border-[#1F6FEB]/50"
        >
          <option value="all" className="bg-[#0a0a0a]">Toutes les formations</option>
          {trainings.map((t) => {
            const count = registrations.filter((r) => r.trainingId === t.id).length;
            return (
              <option key={t.id} value={t.id} className="bg-[#0a0a0a]">
                {t.titleFr} ({count})
              </option>
            );
          })}
        </select>
      </div>

      {/* Stats */}
      {!loading && trainings.length > 0 && (
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trainings.map((t) => {
            const count = registrations.filter((r) => r.trainingId === t.id).length;
            return (
              <div
                key={t.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <p className="text-[12px] text-gray-500 truncate">{t.titleFr}</p>
                <p className="mt-1 text-[24px] font-bold text-white">{count}</p>
                <p className="text-[11px] text-gray-600">inscription{count !== 1 ? "s" : ""}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] py-16 text-center">
          <p className="text-[14px] text-gray-500">Aucune inscription pour le moment.</p>
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-white/[0.06]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">Formation</th>
                  {allFieldKeys.map((key) => (
                    <th key={key} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      {getFieldLabel(key)}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((reg) => (
                  <tr key={reg.id} className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-[13px] font-medium text-white">
                      {getTrainingName(reg.trainingId)}
                    </td>
                    {allFieldKeys.map((key) => (
                      <td key={key} className="px-4 py-3 text-[13px] text-gray-400">
                        {reg.data[key] || "—"}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-[12px] text-gray-500">
                      {new Date(reg.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(reg.id)}
                        disabled={deleting === reg.id}
                        className="rounded-lg border border-white/[0.06] px-3 py-1.5 text-[11px] font-medium text-gray-400 transition-colors hover:border-red-500/30 hover:text-red-400 disabled:opacity-50"
                      >
                        {deleting === reg.id ? "..." : "Supprimer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

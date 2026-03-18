"use client";

import { useEffect, useState } from "react";
import type { Registration } from "@/src/types/registration";
import type { Training } from "@/src/types/training";
import { getTrainingStatus } from "@/src/types/training";

const trainingStatusConfig: Record<string, { bg: string; text: string; label: string }> = {
  upcoming: { bg: "bg-blue-500/10", text: "text-blue-400", label: "À venir" },
  ongoing: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "En cours" },
  past: { bg: "bg-gray-500/10", text: "text-gray-400", label: "Terminée" },
};

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-white/[0.06] ${className}`} />;
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);

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

  const getCountForTraining = (id: string) =>
    registrations.filter((r) => r.trainingId === id).length;

  const selectedRegistrations = selectedTraining
    ? registrations
        .filter((r) => r.trainingId === selectedTraining.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  const selectedFieldKeys = selectedTraining?.formFields?.sort((a, b) => a.order - b.order) || [];

  const totalRegistrations = registrations.length;

  // --- DETAIL VIEW ---
  if (selectedTraining) {
    return (
      <div>
        {/* Back + Header */}
        <div className="mb-8">
          <button
            onClick={() => setSelectedTraining(null)}
            className="mb-3 flex items-center gap-1.5 text-[13px] text-gray-500 transition-colors hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Retour aux formations
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[28px] font-bold text-white">{selectedTraining.titleFr}</h1>
              <div className="mt-2 flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${trainingStatusConfig[getTrainingStatus(selectedTraining.startDate)].bg} ${trainingStatusConfig[getTrainingStatus(selectedTraining.startDate)].text}`}>
                  {trainingStatusConfig[getTrainingStatus(selectedTraining.startDate)].label}
                </span>
                <span className="text-[13px] text-gray-500">
                  {new Date(selectedTraining.startDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[36px] font-bold text-[#1F6FEB]">{selectedRegistrations.length}</span>
              <span className="text-[13px] text-gray-500">inscription{selectedRegistrations.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        {/* Empty */}
        {selectedRegistrations.length === 0 && (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] py-16 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="text-[14px] text-gray-500">Aucune inscription pour cette formation.</p>
          </div>
        )}

        {/* Registration cards */}
        {selectedRegistrations.length > 0 && (
          <div className="space-y-3">
            {selectedRegistrations.map((reg, index) => (
              <div
                key={reg.id}
                className="group overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:border-white/[0.10]"
              >
                <div className="flex items-start justify-between p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1F6FEB]/10 text-[14px] font-bold text-[#1F6FEB]">
                      {index + 1}
                    </div>
                    {/* Fields */}
                    <div className="space-y-1.5">
                      {selectedFieldKeys.map((field) => {
                        const value = reg.data[field.name];
                        if (!value) return null;
                        return (
                          <div key={field.id} className="flex items-baseline gap-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-600 min-w-[80px]">
                              {field.labelFr}
                            </span>
                            <span className="text-[14px] text-white">{value}</span>
                          </div>
                        );
                      })}
                      {/* Fallback for fields not in formFields */}
                      {Object.entries(reg.data).map(([key, value]) => {
                        if (selectedFieldKeys.find((f) => f.name === key)) return null;
                        return (
                          <div key={key} className="flex items-baseline gap-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-600 min-w-[80px]">{key}</span>
                            <span className="text-[14px] text-white">{value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-600">
                      {new Date(reg.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <button
                      onClick={() => handleDelete(reg.id)}
                      disabled={deleting === reg.id}
                      className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- TRAINING LIST VIEW ---
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-white">Inscriptions</h1>
        <p className="mt-1 text-[14px] text-gray-500">
          {totalRegistrations} inscription{totalRegistrations !== 1 ? "s" : ""} au total · Cliquez sur une formation pour voir les détails
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <Skeleton className="mb-3 h-5 w-3/4" />
              <Skeleton className="mb-4 h-8 w-16" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Training cards */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trainings.map((training) => {
            const count = getCountForTraining(training.id);
            const status = getTrainingStatus(training.startDate);
            const sc = trainingStatusConfig[status];

            return (
              <button
                key={training.id}
                onClick={() => setSelectedTraining(training)}
                className="group overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] text-left transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                {/* Top accent */}
                <div className="h-1 w-full" style={{ backgroundColor: count > 0 ? "#1F6FEB" : "#1E2632" }} />

                <div className="p-5">
                  {/* Status badge */}
                  <div className="mb-3 flex items-center justify-between">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${sc.bg} ${sc.text}`}>
                      {sc.label}
                    </span>
                    <span className="text-[11px] text-gray-600">
                      {new Date(training.startDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-4 text-[15px] font-bold text-white group-hover:text-[#1F6FEB] transition-colors">
                    {training.titleFr}
                  </h3>

                  {/* Count */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[32px] font-bold leading-none text-white">{count}</p>
                      <p className="mt-1 text-[12px] text-gray-500">
                        inscription{count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {/* Arrow */}
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-gray-600 transition-all group-hover:bg-[#1F6FEB]/10 group-hover:text-[#1F6FEB]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          {trainings.length === 0 && (
            <div className="col-span-full rounded-xl border border-white/[0.06] bg-white/[0.02] py-16 text-center">
              <p className="text-[14px] text-gray-500">Aucune formation créée.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

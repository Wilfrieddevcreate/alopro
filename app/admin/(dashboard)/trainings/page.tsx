"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Training } from "@/src/types/training";
import { getTrainingStatus } from "@/src/types/training";

const statusColors: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  published: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    label: "Publié",
  },
  draft: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Brouillon" },
};

const trainingStatusColors: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  upcoming: { bg: "bg-blue-500/10", text: "text-blue-400", label: "À venir" },
  ongoing: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    label: "En cours",
  },
  past: { bg: "bg-gray-500/10", text: "text-gray-400", label: "Terminée" },
};

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-white/[0.06] ${className}`} />
  );
}

export default function AdminTrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "upcoming" | "ongoing" | "past">(
    "all",
  );
  const [shareOpen, setShareOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/trainings")
      .then((r) => r.json())
      .then((data) => {
        setTrainings(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette formation ?")) return;
    setDeleting(id);
    await fetch(`/api/admin/trainings/${id}`, { method: "DELETE" });
    setTrainings((prev) => prev.filter((t) => t.id !== id));
    setDeleting(null);
  };

  const toggleStatus = async (training: Training) => {
    const newStatus = training.status === "published" ? "draft" : "published";
    await fetch(`/api/admin/trainings/${training.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setTrainings((prev) =>
      prev.map((t) => (t.id === training.id ? { ...t, status: newStatus } : t)),
    );
  };

  const filtered = trainings.filter((t) => {
    if (filter === "all") return true;
    return getTrainingStatus(t.startDate) === filter;
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-white">Formations</h1>
          <p className="mt-1 text-[14px] text-gray-500">
            {trainings.length} formation{trainings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/trainings/new"
          className="flex items-center gap-2 rounded-lg bg-[#1F6FEB] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#1a5fd4]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouvelle formation
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {(["all", "upcoming", "ongoing", "past"] as const).map((f) => {
          const labels = {
            all: "Toutes",
            upcoming: "À venir",
            ongoing: "En cours",
            past: "Terminées",
          };
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                filter === f
                  ? "bg-[#1F6FEB]/15 text-[#1F6FEB]"
                  : "text-gray-500 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {labels[f]}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <Skeleton className="mb-3 h-36 w-full rounded-lg" />
              <Skeleton className="mb-2 h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] py-16 text-center">
          <p className="text-[14px] text-gray-500">
            {filter === "all"
              ? "Aucune formation. Ajoutez votre première formation !"
              : "Aucune formation dans cette catégorie."}
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((training) => {
            const st = statusColors[training.status];
            const ts =
              trainingStatusColors[getTrainingStatus(training.startDate)];
            return (
              <div
                key={training.id}
                className="group overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:border-white/[0.10]"
              >
                {/* Image */}
                <div className="relative h-40 bg-white/[0.03]">
                  {training.image ? (
                    <img
                      src={training.image}
                      alt={training.titleFr}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-700"
                      >
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute right-2 top-2 flex gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${ts.bg} ${ts.text}`}
                    >
                      {ts.label}
                    </span>
                    <button
                      onClick={() => toggleStatus(training)}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${st.bg} ${st.text}`}
                    >
                      {st.label}
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <p className="mb-0.5 text-[12px] text-gray-500">
                    {new Date(training.startDate).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="mb-1 text-[15px] font-bold text-white">
                    {training.titleFr}
                  </h3>
                  <p className="text-[12px] text-gray-500">
                    {training.titleEn}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 border-t border-white/[0.06] pt-3">
                    <Link
                      href={`/admin/trainings/${training.id}/edit`}
                      className="rounded-lg border border-white/[0.06] px-3 py-1.5 text-[12px] font-medium text-gray-400 transition-colors hover:border-white/[0.12] hover:text-white"
                    >
                      Modifier
                    </Link>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShareOpen(
                            shareOpen === training.id ? null : training.id,
                          )
                        }
                        className="rounded-lg border border-white/[0.06] px-3 py-1.5 text-[12px] font-medium text-gray-400 transition-colors hover:border-[#1F6FEB]/30 hover:text-[#1F6FEB]"
                      >
                        Partager
                      </button>
                      {shareOpen === training.id && (
                        <div className="absolute bottom-full left-0 z-10 mb-2 w-48 rounded-lg border border-white/[0.08] bg-[#141414] p-2 shadow-xl">
                          {[
                            {
                              name: "Facebook",
                              url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : ""}/departments/training`)}`,
                              color: "#1877F2",
                            },
                            {
                              name: "LinkedIn",
                              url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : ""}/departments/training`)}`,
                              color: "#0A66C2",
                            },
                            {
                              name: "WhatsApp",
                              url: `https://wa.me/?text=${encodeURIComponent(`${training.titleFr} — ${typeof window !== "undefined" ? window.location.origin : ""}/departments/training`)}`,
                              color: "#25D366",
                            },
                            {
                              name: "X / Twitter",
                              url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : ""}/departments/training`)}&text=${encodeURIComponent(training.titleFr)}`,
                              color: "#000",
                            },
                          ].map((s) => (
                            <a
                              key={s.name}
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 rounded-md px-3 py-2 text-[12px] font-medium text-gray-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                            >
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: s.color }}
                              />
                              {s.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(training.id)}
                      disabled={deleting === training.id}
                      className="rounded-lg border border-white/[0.06] px-3 py-1.5 text-[12px] font-medium text-gray-400 transition-colors hover:border-red-500/30 hover:text-red-400 disabled:opacity-50"
                    >
                      {deleting === training.id ? "..." : "Supprimer"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

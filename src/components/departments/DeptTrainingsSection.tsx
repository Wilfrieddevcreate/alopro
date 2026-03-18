"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { SectionHeader } from "@/src/components/departments/SectionHeader";
import { RegistrationForm } from "@/src/components/RegistrationForm";
import type { Department } from "@/src/constants/departments";
import type { Training } from "@/src/types/training";
import { getTrainingStatus, type TrainingStatus } from "@/src/types/training";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const PAGE_SIZE = 6;

interface Props {
  dept: Department;
}

const statusConfig: Record<TrainingStatus, { labelFr: string; labelEn: string; color: string; dot: boolean }> = {
  upcoming: { labelFr: "À venir", labelEn: "Upcoming", color: "#3B82F6", dot: true },
  ongoing: { labelFr: "En cours", labelEn: "Ongoing", color: "#059669", dot: true },
  past: { labelFr: "Terminée", labelEn: "Completed", color: "#6B7280", dot: false },
};

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.06] dark:bg-white/[0.02]">
      <div className="h-2 w-full animate-pulse bg-white/[0.06]" />
      <div className="h-44 animate-pulse bg-white/[0.04]" />
      <div className="p-6">
        <div className="mb-4 h-6 w-24 animate-pulse rounded-full bg-white/[0.06]" />
        <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-white/[0.06]" />
        <div className="space-y-1.5">
          <div className="h-3 w-full animate-pulse rounded bg-white/[0.04]" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-white/[0.04]" />
        </div>
      </div>
    </div>
  );
}

export function DeptTrainingsSection({ dept }: Props) {
  const { locale } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | TrainingStatus>("all");
  const [registerTraining, setRegisterTraining] = useState<Training | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/trainings")
      .then((r) => r.json())
      .then((data: Training[]) => {
        setTrainings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = trainings.filter((t) => {
    if (filter === "all") return true;
    return getTrainingStatus(t.startDate) === filter;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filter]);

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore) {
        setVisibleCount((prev) => prev + PAGE_SIZE);
      }
    },
    [hasMore]
  );

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const filters = [
    { key: "all" as const, labelFr: "Toutes", labelEn: "All" },
    { key: "upcoming" as const, labelFr: "À venir", labelEn: "Upcoming" },
    { key: "ongoing" as const, labelFr: "En cours", labelEn: "Ongoing" },
    { key: "past" as const, labelFr: "Terminées", labelEn: "Completed" },
  ];

  return (
    <section ref={ref} className="bg-[#12121C] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeader
          badge={locale === "fr" ? "Nos formations" : "Our trainings"}
          title={locale === "fr" ? "Formations" : "Training"}
          titleHighlight={locale === "fr" ? "proposées" : "programs"}
          accentColor={dept.color}
          isInView={isInView}
        />

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.25, ease }}
          className="mt-10 flex flex-wrap gap-2"
        >
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-4 py-2 text-[13px] font-semibold transition-all duration-200 ${
                filter === f.key
                  ? "text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.04] dark:hover:text-white"
              }`}
              style={filter === f.key ? { backgroundColor: dept.color } : {}}
            >
              {locale === "fr" ? f.labelFr : f.labelEn}
              <span className="ml-1.5 text-[11px] opacity-60">
                {f.key === "all" ? trainings.length : trainings.filter((t) => getTrainingStatus(t.startDate) === f.key).length}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 rounded-2xl border border-gray-200 bg-white py-16 text-center dark:border-white/[0.06] dark:bg-white/[0.02]"
          >
            <p className="text-[15px] text-gray-500 dark:text-gray-400">
              {locale === "fr" ? "Aucune formation dans cette catégorie." : "No training in this category."}
            </p>
          </motion.div>
        )}

        {/* Grid */}
        {!loading && visible.length > 0 && (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((training, i) => {
              const status = getTrainingStatus(training.startDate);
              const sc = statusConfig[status];
              const title = locale === "fr" ? training.titleFr : training.titleEn;
              const desc = locale === "fr" ? training.descriptionFr : training.descriptionEn;
              const dateStr = new Date(training.startDate).toLocaleDateString(
                locale === "fr" ? "fr-FR" : "en-US",
                { day: "numeric", month: "long", year: "numeric" }
              );

              return (
                <motion.div
                  key={training.id}
                  initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.5, delay: (i % PAGE_SIZE) * 0.08, ease }}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-colors duration-200 hover:border-gray-300 dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-white/[0.12]"
                >
                  <div className="relative h-2" style={{ background: `linear-gradient(90deg, ${sc.color}, ${sc.color}88)` }} />

                  {training.image ? (
                    <div className="relative h-44 overflow-hidden">
                      <img src={training.image} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-gray-50 dark:bg-white/[0.03]">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: sc.color + "12", color: sc.color }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]"
                        style={{ backgroundColor: sc.color + "15", color: sc.color }}
                      >
                        {sc.dot && <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: sc.color }} />}
                        {locale === "fr" ? sc.labelFr : sc.labelEn}
                      </span>
                      <span className="text-[12px] text-gray-400">{dateStr}</span>
                    </div>

                    <h4 className="mb-2 text-[18px] font-bold text-gray-900 dark:text-white">{title}</h4>
                    <p className="text-[14px] leading-[1.7] text-gray-500 dark:text-gray-400">{desc}</p>

                    {training.formFields && training.formFields.length > 0 && status === "upcoming" && (
                      <button
                        onClick={() => setRegisterTraining(training)}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[14px] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
                        style={{ backgroundColor: dept.color }}
                      >
                        {locale === "fr" ? "S'inscrire" : "Register"}
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Infinite scroll trigger */}
        {hasMore && (
          <div ref={loaderRef} className="mt-8 flex justify-center">
            <div className="flex items-center gap-2 text-[13px] text-gray-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              {locale === "fr" ? "Chargement..." : "Loading..."}
            </div>
          </div>
        )}
      </div>

      {registerTraining && (
        <RegistrationForm training={registerTraining} onClose={() => setRegisterTraining(null)} />
      )}
    </section>
  );
}

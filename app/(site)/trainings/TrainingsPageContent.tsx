"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { RegistrationForm } from "@/src/components/RegistrationForm";
import type { Training } from "@/src/types/training";
import { getTrainingStatus, type TrainingStatus } from "@/src/types/training";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const PAGE_SIZE = 9;

const statusConfig: Record<TrainingStatus, { labelFr: string; labelEn: string; color: string; dot: boolean }> = {
  upcoming: { labelFr: "À venir", labelEn: "Upcoming", color: "#3B82F6", dot: true },
  ongoing: { labelFr: "En cours", labelEn: "Ongoing", color: "#059669", dot: true },
  past: { labelFr: "Terminée", labelEn: "Completed", color: "#6B7280", dot: false },
};

function StatusIcon({ status }: { status: TrainingStatus }) {
  const sc = statusConfig[status];
  if (status === "ongoing") {
    return (
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: sc.color }} />
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: sc.color }} />
      </span>
    );
  }
  return null;
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
      <div className="h-2 w-full animate-pulse bg-white/[0.06]" />
      <div className="h-44 animate-pulse bg-white/[0.04]" />
      <div className="p-6">
        <div className="mb-3 flex gap-2">
          <div className="h-5 w-20 animate-pulse rounded-full bg-white/[0.06]" />
          <div className="h-5 w-28 animate-pulse rounded-full bg-white/[0.06]" />
        </div>
        <div className="mb-2 h-5 w-4/5 animate-pulse rounded bg-white/[0.06]" />
        <div className="space-y-1.5">
          <div className="h-3 w-full animate-pulse rounded bg-white/[0.04]" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-white/[0.04]" />
        </div>
      </div>
    </div>
  );
}

export function TrainingsPageContent() {
  const { locale } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
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

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filter]);

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
    <section ref={ref} className="bg-gray-50 pt-28 pb-16 dark:bg-[#12121C] sm:pt-36 sm:pb-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Breadcrumb */}
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}
            className="mb-6 flex items-center gap-2 text-[13px] text-gray-500 dark:text-gray-500"
          >
            <Link href="/" className="transition-colors hover:text-gray-900 dark:hover:text-white">
              {locale === "fr" ? "Accueil" : "Home"}
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">
              {locale === "fr" ? "Formations" : "Trainings"}
            </span>
          </motion.div>

          {/* Title */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease } } }}
            className="flex items-center gap-3"
          >
            <span className="h-px w-8 bg-[#1F6FEB]" />
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#1F6FEB]">
              {locale === "fr" ? "Nos formations" : "Our trainings"}
            </p>
          </motion.div>
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 30, filter: "blur(6px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease } } }}
            className="mt-4 text-[clamp(32px,4vw,52px)] font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-white"
          >
            {locale === "fr" ? "Toutes nos " : "All our "}
            <span className="text-[#1F6FEB]">{locale === "fr" ? "formations" : "trainings"}</span>
          </motion.h1>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
            className="mt-5 max-w-2xl text-[17px] leading-[1.7] text-gray-500 dark:text-gray-400"
          >
            {locale === "fr"
              ? "Développement web, intelligence artificielle, graphisme, bureautique et plus encore. Trouvez la formation qui correspond à vos objectifs."
              : "Web development, artificial intelligence, graphic design, office computing and more. Find the training that matches your goals."}
          </motion.p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35, ease }}
          className="mt-10 flex flex-wrap items-center gap-2"
        >
          {filters.map((f) => {
            const count = f.key === "all" ? trainings.length : trainings.filter((t) => getTrainingStatus(t.startDate) === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                  filter === f.key
                    ? "bg-[#1F6FEB] text-white shadow-lg shadow-[#1F6FEB]/20"
                    : "text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-white/[0.06] dark:hover:text-white"
                }`}
              >
                {locale === "fr" ? f.labelFr : f.labelEn}
                <span className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  filter === f.key ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600 dark:bg-white/[0.08] dark:text-gray-400"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease }}
          className="mt-8 h-px origin-left bg-gray-200 dark:bg-white/[0.06]"
        />

        {/* Loading */}
        {loading && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white py-20 text-center dark:border-white/[0.06] dark:bg-white/[0.02]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F6FEB]/10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F6FEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <p className="text-[16px] font-medium text-gray-500 dark:text-gray-400">
              {locale === "fr" ? "Aucune formation dans cette catégorie." : "No training in this category."}
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && visible.length > 0 && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                  transition={{ duration: 0.5, delay: (i % PAGE_SIZE) * 0.06, ease }}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-lg dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-white/[0.12] dark:hover:shadow-none"
                >
                  <div className="relative h-2" style={{ background: `linear-gradient(90deg, ${sc.color}, ${sc.color}88)` }} />

                  {training.image ? (
                    <div className="relative h-48 overflow-hidden">
                      <img src={training.image} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-gray-50 dark:bg-white/[0.03]">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: sc.color + "12", color: sc.color }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em]"
                        style={{ backgroundColor: sc.color + "12", color: sc.color }}
                      >
                        {sc.dot && <StatusIcon status={status} />}
                        {locale === "fr" ? sc.labelFr : sc.labelEn}
                      </span>
                      <span className="text-[12px] text-gray-400 dark:text-gray-500">{dateStr}</span>
                    </div>

                    <h3 className="mb-2 text-[18px] font-bold text-gray-900 dark:text-white">{title}</h3>
                    <p className="line-clamp-3 text-[14px] leading-[1.7] text-gray-500 dark:text-gray-400">{desc}</p>

                    {/* Actions */}
                    <div className="mt-5 flex items-center gap-3">
                      {training.formFields && training.formFields.length > 0 && status === "upcoming" && (
                        <button
                          onClick={() => setRegisterTraining(training)}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#1F6FEB] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#1a5fd4]"
                        >
                          {locale === "fr" ? "S'inscrire" : "Register"}
                        </button>
                      )}
                      <Link
                        href="/departments/training"
                        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1F6FEB] transition-colors duration-150 hover:text-[#1a5fd4]"
                      >
                        {locale === "fr" ? "En savoir plus" : "Learn more"}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-150 group-hover:translate-x-0.5">
                          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Infinite scroll trigger */}
        {hasMore && (
          <div ref={loaderRef} className="mt-10 flex justify-center">
            <div className="flex items-center gap-2 text-[13px] text-gray-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              {locale === "fr" ? "Chargement..." : "Loading..."}
            </div>
          </div>
        )}

        {/* End message */}
        {!loading && !hasMore && filtered.length > PAGE_SIZE && (
          <p className="mt-10 text-center text-[13px] text-gray-400 dark:text-gray-600">
            {locale === "fr"
              ? `${filtered.length} formation${filtered.length > 1 ? "s" : ""} affichée${filtered.length > 1 ? "s" : ""}`
              : `${filtered.length} training${filtered.length > 1 ? "s" : ""} displayed`}
          </p>
        )}
      </div>

      {registerTraining && (
        <RegistrationForm training={registerTraining} onClose={() => setRegisterTraining(null)} />
      )}
    </section>
  );
}

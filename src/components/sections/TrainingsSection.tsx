"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { RegistrationForm } from "@/src/components/RegistrationForm";
import type { Training } from "@/src/types/training";
import { getTrainingStatus, type TrainingStatus } from "@/src/types/training";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const statusConfig: Record<
  TrainingStatus,
  { labelFr: string; labelEn: string; color: string; icon: string }
> = {
  upcoming: {
    labelFr: "À venir",
    labelEn: "Upcoming",
    color: "#3B82F6",
    icon: "calendar",
  },
  ongoing: {
    labelFr: "En cours",
    labelEn: "Ongoing",
    color: "#059669",
    icon: "play",
  },
  past: {
    labelFr: "Terminée",
    labelEn: "Completed",
    color: "#6B7280",
    icon: "check",
  },
};

function StatusIcon({ status }: { status: TrainingStatus }) {
  const sc = statusConfig[status];
  if (status === "upcoming") {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke={sc.color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }
  if (status === "ongoing") {
    return (
      <span className="relative flex h-2 w-2">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
          style={{ backgroundColor: sc.color }}
        />
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ backgroundColor: sc.color }}
        />
      </span>
    );
  }
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke={sc.color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
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

export function TrainingsSection() {
  const { locale } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [registerTraining, setRegisterTraining] = useState<Training | null>(
    null,
  );

  useEffect(() => {
    fetch("/api/trainings")
      .then((r) => r.json())
      .then((data: Training[]) => {
        setTrainings(data.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section
      id="trainings"
      ref={ref}
      className="bg-gray-50 py-16 dark:bg-[#0a0a0a] sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end"
        >
          <div className="max-w-xl">
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.5, ease },
                },
              }}
              className="flex items-center gap-3"
            >
              <motion.span
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
                className="h-px w-8 origin-left bg-[#1F6FEB]"
              />
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#1F6FEB]">
                {locale === "fr" ? "Nos formations" : "Our trainings"}
              </p>
            </motion.div>
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.6, ease },
                },
              }}
              className="mt-4 text-[clamp(28px,3.5vw,44px)] font-bold leading-[1.15] tracking-tight text-gray-900 dark:text-white"
            >
              {locale === "fr" ? "Développez vos " : "Develop your "}
              <span className="text-[#1F6FEB]">
                {locale === "fr" ? "compétences" : "skills"}
              </span>
            </motion.h2>
          </div>
          <div>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease },
                },
              }}
              className="max-w-sm text-[16px] leading-[1.7] text-gray-500 dark:text-gray-400 lg:text-right"
            >
              {locale === "fr"
                ? "Formations gratuites et payantes pour maîtriser les outils numériques et développer vos compétences."
                : "Free and paid training programs to master digital tools and develop your skills."}
            </motion.p>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: 0.1, ease },
                },
              }}
              className="mt-4 lg:text-right"
            >
              <Link
                href="/trainings"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-[13px] font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 dark:border-white/[0.08] dark:text-gray-300 dark:hover:border-white/[0.15] dark:hover:text-white"
              >
                {locale === "fr"
                  ? "Voir toutes les formations"
                  : "View all trainings"}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease }}
          className="mt-12 h-px origin-left bg-gray-200 dark:bg-white/[0.06]"
        />

        {/* Loading */}
        {loading && (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Trainings grid */}
        {!loading && (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trainings.map((training, i) => {
              const status = getTrainingStatus(training.startDate);
              const sc = statusConfig[status];
              const title =
                locale === "fr" ? training.titleFr : training.titleEn;
              const desc =
                locale === "fr"
                  ? training.descriptionFr
                  : training.descriptionEn;
              const dateStr = new Date(training.startDate).toLocaleDateString(
                locale === "fr" ? "fr-FR" : "en-US",
                { day: "numeric", month: "long", year: "numeric" },
              );

              return (
                <motion.div
                  key={training.id}
                  initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                  animate={
                    isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
                  }
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.12, ease }}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-lg dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-white/[0.12] dark:hover:shadow-none"
                >
                  {/* Header gradient bar */}
                  <div
                    className="relative h-2"
                    style={{
                      background: `linear-gradient(90deg, ${sc.color}, ${sc.color}88)`,
                    }}
                  />

                  {/* Image */}
                  {training.image ? (
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={training.image}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-gray-50 dark:bg-white/[0.03]">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{
                          backgroundColor: sc.color + "12",
                          color: sc.color,
                        }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Status + Date */}
                    <div className="mb-4 flex items-center gap-3">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em]"
                        style={{
                          backgroundColor: sc.color + "12",
                          color: sc.color,
                        }}
                      >
                        <StatusIcon status={status} />
                        {locale === "fr" ? sc.labelFr : sc.labelEn}
                      </span>
                      <span className="text-[12px] text-gray-400 dark:text-gray-500">
                        {dateStr}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 text-[18px] font-bold text-gray-900 dark:text-white">
                      {title}
                    </h3>

                    {/* Description */}
                    <p className="line-clamp-3 text-[14px] leading-[1.7] text-gray-500 dark:text-gray-400">
                      {desc}
                    </p>

                    {/* Actions */}
                    <div className="mt-5 flex items-center gap-3">
                      {training.formFields &&
                        training.formFields.length > 0 &&
                        status === "upcoming" && (
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
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-transform duration-150 group-hover:translate-x-0.5"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Empty state */}
            {trainings.length === 0 && (
              <div className="col-span-full rounded-2xl border border-gray-200 bg-white py-16 text-center dark:border-white/[0.06] dark:bg-white/[0.02]">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1F6FEB]/10">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1F6FEB"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <p className="text-[15px] font-medium text-gray-500 dark:text-gray-400">
                  {locale === "fr"
                    ? "Nos formations arrivent bientôt !"
                    : "Our trainings are coming soon!"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Registration modal */}
      {registerTraining && (
        <RegistrationForm
          training={registerTraining}
          onClose={() => setRegisterTraining(null)}
        />
      )}
    </section>
  );
}

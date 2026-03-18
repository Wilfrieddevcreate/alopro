"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { SectionHeader } from "@/src/components/departments/SectionHeader";
import type { Department } from "@/src/constants/departments";
import type { Project } from "@/src/types/project";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const categoryColors: Record<string, string> = {
  web: "#1F6FEB",
  mobile: "#059669",
  design: "#EA580C",
  ai: "#8B5CF6",
};

const categoryLabels: Record<string, Record<string, string>> = {
  web: { fr: "Web", en: "Web" },
  mobile: { fr: "Mobile", en: "Mobile" },
  design: { fr: "Design", en: "Design" },
  ai: { fr: "IA", en: "AI" },
};

interface Props {
  dept: Department;
}

export function DeptProjectsSection({ dept }: Props) {
  const { t, locale } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const isDevDept = dept.slug === "dev";
  const [apiProjects, setApiProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(isDevDept);

  useEffect(() => {
    if (!isDevDept) return;
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: Project[]) => {
        setApiProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isDevDept]);

  return (
    <section ref={ref} className="bg-[#0a0a0a] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t(`${dept.translationPrefix}.projects.badge`)}
          title={t(`${dept.translationPrefix}.projects.title`)}
          titleHighlight={t(
            `${dept.translationPrefix}.projects.titleHighlight`,
          )}
          accentColor={dept.color}
          isInView={isInView}
        />

        {/* Dev department: API-driven projects */}
        {isDevDept && (
          <>
            {loading ? (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/[0.06]"
                  >
                    <div className="h-48 animate-pulse bg-gray-100 dark:bg-white/[0.04]" />
                    <div className="p-6 space-y-3">
                      <div className="h-3 w-20 animate-pulse rounded bg-gray-100 dark:bg-white/[0.06]" />
                      <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100 dark:bg-white/[0.06]" />
                      <div className="h-3 w-full animate-pulse rounded bg-gray-100 dark:bg-white/[0.06]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : apiProjects.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-12 text-center text-gray-500 dark:text-gray-400"
              >
                {locale === "fr"
                  ? "Aucun projet pour le moment."
                  : "No projects yet."}
              </motion.p>
            ) : (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {apiProjects.map((project, i) => {
                  const color = categoryColors[project.category] ?? dept.color;
                  const catLabel =
                    categoryLabels[project.category]?.[locale] ??
                    project.category;
                  const title =
                    locale === "fr" ? project.titleFr : project.titleEn;
                  const description =
                    locale === "fr"
                      ? project.descriptionFr
                      : project.descriptionEn;

                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                      animate={
                        isInView
                          ? { opacity: 1, y: 0, filter: "blur(0px)" }
                          : {}
                      }
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease }}
                      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-colors duration-200 hover:border-gray-300 dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-white/[0.12]"
                    >
                      {/* Image */}
                      {project.image && (
                        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-white/[0.04]">
                          <Image
                            src={project.image}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        {/* Category badge */}
                        <div className="mb-3 flex items-center gap-2">
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]"
                            style={{
                              backgroundColor: color + "12",
                              color: color,
                            }}
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            {catLabel}
                          </span>
                        </div>

                        <h4 className="mb-2 text-[18px] font-bold text-gray-900 dark:text-white">
                          {title}
                        </h4>

                        <p className="mb-4 text-[14px] leading-[1.7] text-gray-500 dark:text-gray-400 line-clamp-3">
                          {description}
                        </p>

                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:opacity-80"
                            style={{ color }}
                          >
                            {locale === "fr"
                              ? "Voir le projet"
                              : "View project"}
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Other departments: static projects */}
        {!isDevDept && (
          <>
            {/* Current Projects */}
            {dept.currentProjects.length > 0 && (
              <>
                <motion.h3
                  initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                  animate={
                    isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
                  }
                  transition={{ duration: 0.5, delay: 0.3, ease }}
                  className="mt-12 mb-8 text-[22px] font-bold text-gray-900 dark:text-white"
                >
                  {t("dept.currentProjects")}
                </motion.h3>

                <div className="grid gap-5 md:grid-cols-2">
                  {dept.currentProjects.map((project, i) => (
                    <motion.div
                      key={project.key}
                      initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                      animate={
                        isInView
                          ? { opacity: 1, y: 0, filter: "blur(0px)" }
                          : {}
                      }
                      transition={{
                        duration: 0.6,
                        delay: 0.4 + i * 0.12,
                        ease,
                      }}
                      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-colors duration-200 hover:border-gray-300 dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-white/[0.12]"
                    >
                      <div
                        className="h-[3px] w-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <div className="p-6">
                        <div className="mb-4 flex items-center gap-2">
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]"
                            style={{
                              backgroundColor: dept.color + "12",
                              color: dept.color,
                            }}
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: dept.color }}
                            />
                            {t("dept.inProgress")}
                          </span>
                        </div>
                        <h4 className="mb-2 text-[18px] font-bold text-gray-900 dark:text-white">
                          {t(
                            `${dept.translationPrefix}.projects.current.${project.key}.title`,
                          )}
                        </h4>
                        <p className="text-[14px] leading-[1.7] text-gray-500 dark:text-gray-400">
                          {t(
                            `${dept.translationPrefix}.projects.current.${project.key}.desc`,
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* Completed Projects */}
            {dept.completedProjects.length > 0 && (
              <>
                <motion.h3
                  initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                  animate={
                    isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + dept.currentProjects.length * 0.12 + 0.2,
                    ease,
                  }}
                  className="mt-16 mb-8 text-[22px] font-bold text-gray-900 dark:text-white"
                >
                  {t("dept.completedProjects")}
                </motion.h3>

                <div className="grid gap-5 md:grid-cols-3">
                  {dept.completedProjects.map((project, i) => {
                    const baseDelay =
                      0.5 + dept.currentProjects.length * 0.12 + 0.3;
                    return (
                      <motion.div
                        key={project.key}
                        initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                        animate={
                          isInView
                            ? { opacity: 1, y: 0, filter: "blur(0px)" }
                            : {}
                        }
                        transition={{
                          duration: 0.6,
                          delay: baseDelay + i * 0.12,
                          ease,
                        }}
                        className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-colors duration-200 hover:border-gray-300 dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-white/[0.12]"
                      >
                        <div
                          className="h-[3px] w-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <div className="p-6">
                          <p
                            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em]"
                            style={{ color: project.color }}
                          >
                            {t(
                              `${dept.translationPrefix}.projects.completed.${project.key}.date`,
                            )}
                          </p>
                          <h4 className="mb-2 text-[18px] font-bold text-gray-900 dark:text-white">
                            {t(
                              `${dept.translationPrefix}.projects.completed.${project.key}.title`,
                            )}
                          </h4>
                          <p className="text-[14px] leading-[1.7] text-gray-500 dark:text-gray-400">
                            {t(
                              `${dept.translationPrefix}.projects.completed.${project.key}.desc`,
                            )}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Upcoming Projects (domain names only) */}
            {dept.upcomingProjects && dept.upcomingProjects.length > 0 && (
              <>
                <motion.h3
                  initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                  animate={
                    isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + dept.currentProjects.length * 0.12 + 0.2,
                    ease,
                  }}
                  className="mt-16 mb-8 text-[22px] font-bold text-gray-900 dark:text-white"
                >
                  {t("dept.upcomingProjects")}
                </motion.h3>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  {dept.upcomingProjects.map((project, i) => {
                    const baseDelay =
                      0.5 + dept.currentProjects.length * 0.12 + 0.3;
                    return (
                      <motion.div
                        key={project.key}
                        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                        animate={
                          isInView
                            ? { opacity: 1, y: 0, filter: "blur(0px)" }
                            : {}
                        }
                        transition={{
                          duration: 0.5,
                          delay: baseDelay + i * 0.1,
                          ease,
                        }}
                        className="group relative flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 transition-colors duration-200 hover:border-gray-300 dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-white/[0.12]"
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: project.color }}
                        />
                        <h4 className="text-[16px] font-semibold text-gray-900 dark:text-white">
                          {t(
                            `${dept.translationPrefix}.projects.upcoming.${project.key}.title`,
                          )}
                        </h4>
                        <span
                          className="ml-auto text-[11px] font-semibold uppercase tracking-[0.08em] shrink-0"
                          style={{ color: project.color }}
                        >
                          {t("dept.upcoming")}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}

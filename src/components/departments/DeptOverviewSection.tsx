"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { SectionHeader } from "./SectionHeader";
import type { Department } from "@/src/constants/departments";
import type { Training } from "@/src/types/training";
import { getTrainingStatus } from "@/src/types/training";
import type { Registration } from "@/src/types/registration";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ---- Animated counter ---- */

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  inView,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const safeValue = isNaN(value) ? 0 : value;
    if (!inView || hasAnimated.current || safeValue === 0) {
      if (safeValue === 0) setCount(0);
      return;
    }
    hasAnimated.current = true;

    const duration = 1200;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.round(progress * safeValue));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [inView, value]);

  return (
    <>
      {prefix}
      {count}
      {suffix}
    </>
  );
}

/* ---- Component ---- */

interface DeptOverviewSectionProps {
  dept: Department;
}

export function DeptOverviewSection({ dept }: DeptOverviewSectionProps) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const prefix = dept.translationPrefix;
  const isTrainingDept = dept.slug === "training";

  const [dynamicStats, setDynamicStats] = useState<
    { value: number; suffix: string; label: string }[] | null
  >(null);

  useEffect(() => {
    if (!isTrainingDept) return;

    async function fetchStats() {
      try {
        const [trainingsRes, registrationsRes] = await Promise.all([
          fetch("/api/trainings"),
          fetch("/api/admin/registrations"),
        ]);

        const trainings: Training[] = trainingsRes.ok
          ? await trainingsRes.json()
          : [];
        let registrations: Registration[] = [];
        if (registrationsRes.ok) {
          const data = await registrationsRes.json();
          registrations = Array.isArray(data) ? data : [];
        }

        const past = trainings.filter(
          (tr) => getTrainingStatus(tr.startDate) === "past",
        ).length;
        const upcoming = trainings.filter(
          (tr) => getTrainingStatus(tr.startDate) === "upcoming",
        ).length;
        const totalRegs = registrations.length;

        setDynamicStats([
          {
            value: past,
            suffix: "",
            label: t(`${prefix}.overview.stat1.label`),
          },
          {
            value: upcoming,
            suffix: "",
            label: t(`${prefix}.overview.stat2.label`),
          },
          {
            value: totalRegs,
            suffix: "",
            label: t(`${prefix}.overview.stat3.label`),
          },
        ]);
      } catch {
        setDynamicStats([
          { value: 0, suffix: "", label: t(`${prefix}.overview.stat1.label`) },
          { value: 0, suffix: "", label: t(`${prefix}.overview.stat2.label`) },
          { value: 0, suffix: "", label: t(`${prefix}.overview.stat3.label`) },
        ]);
      }
    }

    fetchStats();
  }, [isTrainingDept, t, prefix]);

  const defaultStats = isTrainingDept
    ? [
        { value: 0, suffix: "", label: t(`${prefix}.overview.stat1.label`) },
        { value: 0, suffix: "", label: t(`${prefix}.overview.stat2.label`) },
        { value: 0, suffix: "", label: t(`${prefix}.overview.stat3.label`) },
      ]
    : (() => {
        function parseStat(raw: string): {
          value: number;
          prefix: string;
          suffix: string;
        } {
          const match = raw.match(/(\d+)/);
          const num = match ? parseInt(match[1]) : 0;
          const idx = match ? match.index! : 0;
          const prefix = raw.slice(0, idx);
          const suffix = raw.slice(idx + (match ? match[0].length : 0));
          return { value: num, prefix, suffix };
        }

        const items = [
          {
            ...parseStat(t(`${prefix}.overview.stat1.value`)),
            label: t(`${prefix}.overview.stat1.label`),
          },
          {
            ...parseStat(t(`${prefix}.overview.stat2.value`)),
            label: t(`${prefix}.overview.stat2.label`),
          },
          {
            ...parseStat(t(`${prefix}.overview.stat3.value`)),
            label: t(`${prefix}.overview.stat3.label`),
          },
        ];
        const stat4Key = `${prefix}.overview.stat4.value`;
        const stat4Val = t(stat4Key);
        if (stat4Val !== stat4Key) {
          items.push({
            ...parseStat(stat4Val),
            label: t(`${prefix}.overview.stat4.label`),
          });
        }
        return items;
      })();

  const stats = dynamicStats || defaultStats;

  return (
    <section className="bg-[#0a0a0a] py-16 sm:py-24">
      <div ref={ref} className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader
          badge={t(`${prefix}.overview.badge`)}
          title={t(`${prefix}.overview.title`)}
          titleHighlight={t(`${prefix}.overview.titleHighlight`)}
          subtitle={t(`${prefix}.overview.subtitle`)}
          accentColor={dept.color}
          isInView={isInView}
          align="left"
        />

        {/* Separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease }}
          className="mt-12 h-px origin-left bg-gray-200 dark:bg-white/[0.06]"
        />

        {/* Text blocks */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease }}
          className="mt-12 max-w-3xl space-y-6"
        >
          <p className="text-[16px] leading-[1.8] text-gray-600 dark:text-gray-400">
            {t(`${prefix}.overview.text1`)}
          </p>
          <p className="text-[16px] leading-[1.8] text-gray-600 dark:text-gray-400">
            {t(`${prefix}.overview.text2`)}
          </p>
        </motion.div>

        {/* Stat cards — hidden for training dept */}
        {!isTrainingDept && (
          <div
            className={`mt-14 grid gap-5 sm:grid-cols-2 ${stats.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
                animate={
                  isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
                }
                transition={{
                  duration: 0.6,
                  delay: 0.7 + i * 0.15,
                  ease,
                }}
                className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-8 text-center dark:border-white/[0.06] dark:bg-white/[0.02]"
              >
                <p
                  className="text-[36px] font-bold tracking-tight"
                  style={{ color: dept.color }}
                >
                  <AnimatedNumber
                    value={stat.value}
                    prefix={
                      "prefix" in stat
                        ? (stat as { prefix: string }).prefix
                        : ""
                    }
                    suffix={stat.suffix}
                    inView={isInView}
                  />
                </p>
                <p className="mt-2 text-[14px] text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

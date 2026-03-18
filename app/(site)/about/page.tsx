"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { StatsSection } from "@/src/components/sections/StatsSection";
import { CTASection } from "@/src/components/sections/CTASection";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const values = [
  {
    titleKey: "why.innovation.title",
    descKey: "why.innovation.desc",
    number: "01",
    color: "#1F6FEB",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    ),
  },
  {
    titleKey: "why.expertise.title",
    descKey: "why.expertise.desc",
    number: "02",
    color: "#1F6FEB",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    titleKey: "why.tailored.title",
    descKey: "why.tailored.desc",
    number: "03",
    color: "#059669",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

const team = [
  {
    name: "Valentin NOUGBOLONI",
    roleKey: "about.team.valentin.role",
    dept: "dev",
    color: "#1F6FEB",
  },
  {
    name: "Josiane DADAKPETE",
    roleKey: "about.team.josiane.role",
    dept: "dev",
    color: "#1F6FEB",
  },
  {
    name: "Epaphrodite NOUGBOLONI",
    roleKey: "about.team.epaphrodite.role",
    dept: "dev",
    color: "#1F6FEB",
  },
  {
    name: "Wilfried HELOUSSATO",
    roleKey: "about.team.wilfried.role",
    dept: "dev",
    color: "#1F6FEB",
  },
  {
    name: "Geoffroy ZANNOU",
    roleKey: "about.team.geoffroy.role",
    dept: "research",
    color: "#1F6FEB",
  },
  {
    name: "Serge NOUGBOLONI",
    roleKey: "about.team.serge.role",
    dept: "training",
    color: "#059669",
  },
  {
    name: "Merveille HOUNSOU",
    roleKey: "about.team.merveille.role",
    dept: "training",
    color: "#059669",
  },
];

export default function AboutPage() {
  const { t, locale } = useLanguage();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#000814] pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="absolute inset-0">
          <Image
            src="/images/herosection.jpg"
            alt=""
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#000814]/40 via-[#000814]/60 to-[#0a0a0a]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1F6FEB]/20 bg-[#1F6FEB]/[0.06] px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1F6FEB]" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#1F6FEB]">
                {t("about.badge")}
              </span>
            </div>

            <h1 className="text-[clamp(32px,5vw,56px)] font-bold leading-[1.1] tracking-tight text-white">
              {t("about.hero.title")}{" "}
              <span className="text-[#1F6FEB]">
                {t("about.hero.titleHighlight")}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-[1.7] text-gray-400">
              {t("about.hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-[#0a0a0a] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#1F6FEB]" />
                <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#1F6FEB]">
                  {t("about.mission.badge")}
                </p>
              </div>
              <h2 className="text-[clamp(26px,3vw,40px)] font-bold leading-[1.15] tracking-tight text-white">
                {t("about.mission.title")}{" "}
                <span className="text-[#1F6FEB]">
                  {t("about.mission.titleHighlight")}
                </span>
              </h2>
              <p className="mt-6 text-[16px] leading-[1.8] text-gray-400">
                {t("about.mission.desc1")}
              </p>
              <p className="mt-4 text-[16px] leading-[1.8] text-gray-400">
                {t("about.mission.desc2")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                {
                  value: "3",
                  label: locale === "fr" ? "Départements" : "Departments",
                  color: "#1F6FEB",
                },
                {
                  value: "7+",
                  label: locale === "fr" ? "Experts" : "Experts",
                  color: "#1F6FEB",
                },
                {
                  value: "50+",
                  label: locale === "fr" ? "Projets" : "Projects",
                  color: "#059669",
                },
                {
                  value: "100%",
                  label: locale === "fr" ? "Engagement" : "Commitment",
                  color: "#EA580C",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center"
                >
                  <p className="text-[36px] font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[13px] text-gray-400">{stat.label}</p>
                  <div
                    className="mx-auto mt-3 h-[2px] w-8 rounded-full"
                    style={{ backgroundColor: stat.color }}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#0a0a0a] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="mb-14 max-w-2xl"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#1F6FEB]" />
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#1F6FEB]">
                {t("why.badge")}
              </p>
            </div>
            <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold leading-[1.15] tracking-tight text-white">
              {t("why.title")}{" "}
              <span className="text-[#1F6FEB]">{t("why.titleHighlight")}</span>
            </h2>
            <p className="mt-4 max-w-lg text-[16px] leading-[1.7] text-gray-400">
              {t("why.subtitle")}
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {values.map((value, i) => (
              <motion.div
                key={value.titleKey}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.15, ease }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all duration-300 hover:border-[#1F6FEB]/20 lg:p-10"
              >
                <span className="pointer-events-none absolute -top-4 -right-2 text-[120px] font-black leading-none text-white/[0.03] group-hover:text-[#1F6FEB]/[0.06] lg:text-[140px]">
                  {value.number}
                </span>
                <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1F6FEB]/[0.08] text-[#1F6FEB]">
                  {value.icon}
                </div>
                <p className="relative mb-3 text-[13px] font-bold uppercase tracking-[0.15em] text-[#1F6FEB]">
                  {value.number}
                </p>
                <h3 className="relative mb-3 text-[20px] font-bold tracking-tight text-white lg:text-[22px]">
                  {t(value.titleKey)}
                </h3>
                <p className="relative text-[15px] leading-[1.8] text-gray-400 lg:text-[16px]">
                  {t(value.descKey)}
                </p>
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#1F6FEB]/30" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-[#000814] sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="mb-14 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-3">
              <span className="h-px w-8 bg-[#1F6FEB]" />
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#1F6FEB]">
                {t("about.team.badge")}
              </p>
              <span className="h-px w-8 bg-[#1F6FEB]" />
            </div>
            <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold leading-[1.15] tracking-tight text-gray-900 dark:text-white">
              {t("about.team.title")}{" "}
              <span className="text-[#1F6FEB]">
                {t("about.team.titleHighlight")}
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[16px] leading-[1.7] text-gray-500 dark:text-gray-400">
              {t("about.team.subtitle")}
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                {/* Dept tag */}
                <div className="mb-4 flex justify-center">
                  <span
                    className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white"
                    style={{
                      backgroundColor: member.color + "20",
                      color: member.color,
                    }}
                  >
                    {member.dept === "dev"
                      ? locale === "fr"
                        ? "Développement"
                        : "Development"
                      : member.dept === "research"
                        ? locale === "fr"
                          ? "Recherche"
                          : "Research"
                        : "Formation"}
                  </span>
                </div>

                {/* Avatar */}
                <div
                  className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl text-[22px] font-bold text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${member.color}, ${member.color}99)`,
                  }}
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div className="text-center">
                  <h3 className="text-[16px] font-bold text-white">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-[13px] text-gray-400">
                    {t(member.roleKey)}
                  </p>
                </div>

                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-full"
                  style={{ backgroundColor: member.color + "40" }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatsSection />

      {/* CTA */}
      <CTASection />
    </>
  );
}

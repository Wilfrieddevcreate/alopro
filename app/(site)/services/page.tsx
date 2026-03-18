"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { ProcessSection } from "@/src/components/sections/ProcessSection";
import { CTASection } from "@/src/components/sections/CTASection";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const departments = [
  {
    id: "dev",
    titleKey: "services.dev.title",
    descKey: "services.dev.desc",
    tagKey: "services.dev.tag",
    items: [
      "services.dev.item1",
      "services.dev.item2",
      "services.dev.item3",
      "services.dev.item4",
    ],
    color: "#1F6FEB",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "research",
    titleKey: "services.research.title",
    descKey: "services.research.desc",
    tagKey: "services.research.tag",
    items: [
      "services.research.item1",
      "services.research.item2",
      "services.research.item3",
      "services.research.item4",
    ],
    color: "#1F6FEB",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    id: "training",
    titleKey: "services.training.title",
    descKey: "services.training.desc",
    tagKey: "services.training.tag",
    items: [
      "services.training.item1",
      "services.training.item2",
      "services.training.item3",
      "services.training.item4",
    ],
    color: "#059669",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
];

export default function ServicesPage() {
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
          <div className="absolute inset-0 bg-gradient-to-b from-[#000814]/40 via-[#000814]/60 to-[#12121C]" />
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
                {t("servicesPage.badge")}
              </span>
            </div>

            <h1 className="text-[clamp(32px,5vw,56px)] font-bold leading-[1.1] tracking-tight text-white">
              {t("servicesPage.hero.title")}{" "}
              <span className="text-[#1F6FEB]">{t("servicesPage.hero.titleHighlight")}</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-[1.7] text-gray-400">
              {t("servicesPage.hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Departments */}
      <section className="bg-[#12121C] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {departments.map((dept, i) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease }}
                className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-300 hover:border-white/[0.1]"
              >
                <div className="p-8 sm:p-10 lg:p-12">
                  <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
                    {/* Left: Icon + Info */}
                    <div className="flex-1">
                      <div className="mb-6 flex items-center gap-4">
                        <div
                          className="flex h-16 w-16 items-center justify-center rounded-2xl"
                          style={{ backgroundColor: dept.color + "12", color: dept.color }}
                        >
                          {dept.icon}
                        </div>
                        <div>
                          <p
                            className="text-[11px] font-bold uppercase tracking-[0.2em]"
                            style={{ color: dept.color }}
                          >
                            {t(dept.tagKey)}
                          </p>
                          <h2 className="text-[24px] font-bold text-white sm:text-[28px]">
                            {t(dept.titleKey)}
                          </h2>
                        </div>
                      </div>

                      <p className="mb-8 max-w-xl text-[15px] leading-[1.8] text-gray-400">
                        {t(dept.descKey)}
                      </p>

                      <Link
                        href={`/departments/${dept.id}`}
                        className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-[14px] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
                        style={{ backgroundColor: dept.color }}
                      >
                        {locale === "fr" ? "Découvrir ce département" : "Discover this department"}
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>
                    </div>

                    {/* Right: Items */}
                    <div className="lg:w-80">
                      <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                        {locale === "fr" ? "Ce que nous proposons" : "What we offer"}
                      </p>
                      <ul className="space-y-3">
                        {dept.items.map((key) => (
                          <li key={key} className="flex items-start gap-3">
                            <span
                              className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                              style={{ backgroundColor: dept.color + "12", color: dept.color }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                            <span className="text-[14px] leading-[1.6] text-gray-300">
                              {t(key)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="h-[2px] w-full" style={{ backgroundColor: dept.color + "30" }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <ProcessSection />

      {/* CTA */}
      <CTASection />
    </>
  );
}

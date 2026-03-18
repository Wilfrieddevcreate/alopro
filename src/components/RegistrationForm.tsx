"use client";

import { useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";
import type { FormField } from "@/src/types/registration";
import type { Training } from "@/src/types/training";

interface Props {
  training: Training;
  onClose: () => void;
}

export function RegistrationForm({ training, onClose }: Props) {
  const { locale } = useLanguage();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fields = training.formFields || [];

  const set = (name: string, value: string) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainingId: training.id, data: formData }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const err = await res.json();
        setError(err.error || (locale === "fr" ? "Erreur lors de l'inscription" : "Registration error"));
      }
    } catch {
      setError(locale === "fr" ? "Erreur de connexion" : "Connection error");
    }
    setSubmitting(false);
  };

  if (fields.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#0a0e17]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-5 dark:border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#1F6FEB]">
                {locale === "fr" ? "Inscription" : "Registration"}
              </p>
              <h3 className="mt-1 text-[18px] font-bold text-gray-900 dark:text-white">
                {locale === "fr" ? training.titleFr : training.titleEn}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/[0.06] dark:hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
          {success ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h4 className="text-[18px] font-bold text-gray-900 dark:text-white">
                {locale === "fr" ? "Inscription confirmée !" : "Registration confirmed!"}
              </h4>
              <p className="mt-2 text-[14px] text-gray-500 dark:text-gray-400">
                {locale === "fr"
                  ? "Votre inscription a bien été enregistrée. Nous vous contacterons prochainement."
                  : "Your registration has been recorded. We will contact you shortly."}
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-lg bg-[#1F6FEB] px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#1a5fd4]"
              >
                {locale === "fr" ? "Fermer" : "Close"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields
                .sort((a, b) => a.order - b.order)
                .map((field) => {
                  const label = locale === "fr" ? field.labelFr : field.labelEn;
                  return (
                    <div key={field.id}>
                      <label className="mb-1.5 block text-[13px] font-medium text-gray-700 dark:text-gray-300">
                        {label}
                        {field.required && <span className="ml-1 text-red-500">*</span>}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          value={formData[field.name] || ""}
                          onChange={(e) => set(field.name, e.target.value)}
                          required={field.required}
                          rows={3}
                          className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[14px] text-gray-900 outline-none focus:border-[#1F6FEB] dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-white dark:focus:border-[#1F6FEB]"
                        />
                      ) : field.type === "select" ? (
                        <select
                          value={formData[field.name] || ""}
                          onChange={(e) => set(field.name, e.target.value)}
                          required={field.required}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[14px] text-gray-900 outline-none focus:border-[#1F6FEB] dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-white dark:focus:border-[#1F6FEB]"
                        >
                          <option value="">{locale === "fr" ? "Sélectionner..." : "Select..."}</option>
                          {(field.options || []).map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={formData[field.name] || ""}
                          onChange={(e) => set(field.name, e.target.value)}
                          required={field.required}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[14px] text-gray-900 outline-none focus:border-[#1F6FEB] dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-white dark:focus:border-[#1F6FEB]"
                        />
                      )}
                    </div>
                  );
                })}

              {error && (
                <p className="rounded-lg bg-red-500/10 px-4 py-2 text-[13px] font-medium text-red-500">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-[#1F6FEB] py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#1a5fd4] disabled:opacity-50"
              >
                {submitting
                  ? (locale === "fr" ? "Inscription en cours..." : "Registering...")
                  : (locale === "fr" ? "S'inscrire" : "Register")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

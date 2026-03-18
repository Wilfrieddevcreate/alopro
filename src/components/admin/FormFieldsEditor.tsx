"use client";

import { useState } from "react";
import type { FormField } from "@/src/types/registration";

interface Props {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

const fieldTypes: { value: FormField["type"]; label: string }[] = [
  { value: "text", label: "Texte" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Téléphone" },
  { value: "textarea", label: "Zone de texte" },
  { value: "select", label: "Liste déroulante" },
];

export function FormFieldsEditor({ fields, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addField = () => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      name: `field_${Date.now()}`,
      labelFr: "",
      labelEn: "",
      type: "text",
      required: false,
      order: fields.length,
    };
    onChange([...fields, newField]);
    setExpandedId(newField.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeField = (id: string) => {
    onChange(fields.filter((f) => f.id !== id));
  };

  const moveField = (index: number, direction: -1 | 1) => {
    const newFields = [...fields];
    const target = index + direction;
    if (target < 0 || target >= fields.length) return;
    [newFields[index], newFields[target]] = [newFields[target], newFields[index]];
    newFields.forEach((f, i) => (f.order = i));
    onChange(newFields);
  };

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[16px] font-bold text-white">
          <span className="rounded bg-purple-500/15 px-2 py-0.5 text-[11px] font-bold text-purple-400">FORM</span>
          Formulaire d&apos;inscription
        </h2>
        <button
          onClick={addField}
          className="flex items-center gap-1.5 rounded-lg bg-[#1F6FEB]/10 px-3 py-1.5 text-[12px] font-semibold text-[#1F6FEB] transition-colors hover:bg-[#1F6FEB]/20"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Ajouter un champ
        </button>
      </div>

      {fields.length === 0 && (
        <p className="py-8 text-center text-[13px] text-gray-500">
          Aucun champ. Ajoutez des champs pour permettre les inscriptions à cette formation.
        </p>
      )}

      <div className="space-y-3">
        {fields
          .sort((a, b) => a.order - b.order)
          .map((field, index) => (
            <div
              key={field.id}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] transition-colors"
            >
              {/* Header */}
              <div
                className="flex cursor-pointer items-center justify-between px-4 py-3"
                onClick={() => setExpandedId(expandedId === field.id ? null : field.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); moveField(index, -1); }}
                      disabled={index === 0}
                      className="rounded p-0.5 text-gray-600 transition-colors hover:text-white disabled:opacity-30"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveField(index, 1); }}
                      disabled={index === fields.length - 1}
                      className="rounded p-0.5 text-gray-600 transition-colors hover:text-white disabled:opacity-30"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                  </div>
                  <span className="text-[13px] font-medium text-white">
                    {field.labelFr || "Nouveau champ"}
                  </span>
                  <span className="rounded bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-gray-400">
                    {fieldTypes.find((t) => t.value === field.type)?.label}
                  </span>
                  {field.required && (
                    <span className="rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400">Requis</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
                    className="rounded p-1 text-gray-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-gray-500 transition-transform ${expandedId === field.id ? "rotate-180" : ""}`}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {/* Expanded */}
              {expandedId === field.id && (
                <div className="border-t border-white/[0.06] px-4 py-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-medium text-gray-500">Nom du champ (machine)</label>
                      <input
                        value={field.name}
                        onChange={(e) => updateField(field.id, { name: e.target.value.replace(/\s/g, "_").toLowerCase() })}
                        className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[13px] text-white outline-none focus:border-[#1F6FEB]/50"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] font-medium text-gray-500">Type</label>
                      <select
                        value={field.type}
                        onChange={(e) => updateField(field.id, { type: e.target.value as FormField["type"] })}
                        className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[13px] text-white outline-none focus:border-[#1F6FEB]/50"
                      >
                        {fieldTypes.map((t) => (
                          <option key={t.value} value={t.value} className="bg-[#0a0a0a]">{t.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-medium text-gray-500">Label FR</label>
                      <input
                        value={field.labelFr}
                        onChange={(e) => updateField(field.id, { labelFr: e.target.value })}
                        placeholder="Nom complet"
                        className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[13px] text-white placeholder-gray-600 outline-none focus:border-[#1F6FEB]/50"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] font-medium text-gray-500">Label EN</label>
                      <input
                        value={field.labelEn}
                        onChange={(e) => updateField(field.id, { labelEn: e.target.value })}
                        placeholder="Full name"
                        className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[13px] text-white placeholder-gray-600 outline-none focus:border-[#1F6FEB]/50"
                      />
                    </div>
                  </div>
                  {field.type === "select" && (
                    <div>
                      <label className="mb-1.5 block text-[11px] font-medium text-gray-500">Options (une par ligne)</label>
                      <textarea
                        value={(field.options || []).join("\n")}
                        onChange={(e) => updateField(field.id, { options: e.target.value.split("\n").filter(Boolean) })}
                        rows={3}
                        placeholder={"Option 1\nOption 2\nOption 3"}
                        className="w-full resize-y rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[13px] text-white placeholder-gray-600 outline-none focus:border-[#1F6FEB]/50"
                      />
                    </div>
                  )}
                  <label className="flex items-center gap-2 text-[13px] text-gray-400">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                      className="rounded border-white/20"
                    />
                    Champ obligatoire
                  </label>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Blog } from "@/src/types/blog";

interface VisitorStats {
  today: number;
  yesterday: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
  uniqueToday: number;
  uniqueTotal: number;
  topPages: { page: string; count: number }[];
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  published: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Publié" },
  draft: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Brouillon" },
};

const categoryLabels: Record<string, string> = {
  dev: "Développement",
  research: "Recherche",
  training: "Formation",
  news: "Actualités",
};

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-white/[0.06] ${className}`} />;
}

const pageLabels: Record<string, string> = {
  "/": "Accueil",
  "/about": "À propos",
  "/services": "Services",
  "/projects": "Projets",
  "/blog": "Blog",
  "/contact": "Contact",
  "/trainings": "Formations",
};

export default function AdminDashboardPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);

  const fetchBlogs = async () => {
    const res = await fetch("/api/admin/blogs");
    const data = await res.json();
    setBlogs(data);
    setLoading(false);
  };

  const fetchVisitorStats = async () => {
    try {
      const res = await fetch("/api/admin/visitors");
      if (res.ok) {
        const data = await res.json();
        setVisitorStats(data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchVisitorStats();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    setDeleting(id);
    await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    setDeleting(null);
  };

  const toggleStatus = async (blog: Blog) => {
    const newStatus = blog.status === "published" ? "draft" : "published";
    await fetch(`/api/admin/blogs/${blog.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setBlogs((prev) =>
      prev.map((b) => (b.id === blog.id ? { ...b, status: newStatus } : b))
    );
  };

  const todayChange = visitorStats
    ? visitorStats.yesterday > 0
      ? Math.round(((visitorStats.today - visitorStats.yesterday) / visitorStats.yesterday) * 100)
      : visitorStats.today > 0
        ? 100
        : 0
    : 0;

  return (
    <div>
      {/* Visitor Stats */}
      <div className="mb-8">
        <h1 className="mb-6 text-[28px] font-bold text-white">Dashboard</h1>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {/* Today */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1F6FEB]/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F6FEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="text-[24px] font-bold text-white sm:text-[28px]">
              {visitorStats ? visitorStats.today : <Skeleton className="h-7 w-12" />}
            </div>
            <p className="mt-1 text-[12px] text-gray-500">Visiteurs aujourd&apos;hui</p>
            {visitorStats && (
              <p className={`mt-1 text-[11px] font-medium ${todayChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {todayChange >= 0 ? "+" : ""}{todayChange}% vs hier
              </p>
            )}
          </div>

          {/* This week */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div className="text-[24px] font-bold text-white sm:text-[28px]">
              {visitorStats ? visitorStats.thisWeek : <Skeleton className="h-7 w-12" />}
            </div>
            <p className="mt-1 text-[12px] text-gray-500">Cette semaine</p>
          </div>

          {/* This month */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="text-[24px] font-bold text-white sm:text-[28px]">
              {visitorStats ? visitorStats.thisMonth : <Skeleton className="h-7 w-12" />}
            </div>
            <p className="mt-1 text-[12px] text-gray-500">Ce mois-ci</p>
          </div>

          {/* Total unique */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="text-[24px] font-bold text-white sm:text-[28px]">
              {visitorStats ? visitorStats.uniqueTotal : <Skeleton className="h-7 w-12" />}
            </div>
            <p className="mt-1 text-[12px] text-gray-500">Visiteurs uniques (total)</p>
          </div>
        </div>

        {/* Top pages */}
        {visitorStats && visitorStats.topPages.length > 0 && (
          <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
            <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wider text-gray-500">
              Pages les plus visitées
            </h3>
            <div className="space-y-2">
              {visitorStats.topPages.map((p) => (
                <div key={p.page} className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-300">
                    {pageLabels[p.page] || p.page}
                  </span>
                  <span className="text-[13px] font-medium text-[#1F6FEB]">
                    {p.count} visites
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Blog section */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-white">Blog</h2>
          <p className="mt-1 text-[14px] text-gray-500">
            {blogs.length} article{blogs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 rounded-lg bg-[#1F6FEB] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#1a5fd4]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouvel article
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500 sm:px-5">
                Article
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500 sm:px-5">
                Catégorie
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500 sm:px-5">
                Statut
              </th>
              <th className="hidden px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500 sm:table-cell sm:px-5">
                Date
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500 sm:px-5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-white/[0.04]">
                  <td className="px-4 py-4 sm:px-5"><Skeleton className="h-4 w-36 sm:w-48" /></td>
                  <td className="px-4 py-4 sm:px-5"><Skeleton className="h-4 w-20 sm:w-24" /></td>
                  <td className="px-4 py-4 sm:px-5"><Skeleton className="h-5 w-16 sm:w-20" /></td>
                  <td className="hidden px-4 py-4 sm:table-cell sm:px-5"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-4 sm:px-5"><Skeleton className="ml-auto h-4 w-20" /></td>
                </tr>
              ))}

            {!loading && blogs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-[14px] text-gray-500">
                  Aucun article. Créez votre premier article !
                </td>
              </tr>
            )}

            {blogs.map((blog) => {
              const st = statusColors[blog.status];
              return (
                <tr
                  key={blog.id}
                  className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-4 sm:px-5">
                    <p className="text-[13px] font-medium text-white sm:text-[14px]">{blog.titleFr}</p>
                    <p className="mt-0.5 hidden text-[12px] text-gray-500 sm:block">{blog.titleEn}</p>
                  </td>
                  <td className="px-4 py-4 sm:px-5">
                    <span className="text-[12px] text-gray-400 sm:text-[13px]">
                      {categoryLabels[blog.category] || blog.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 sm:px-5">
                    <button
                      onClick={() => toggleStatus(blog)}
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:px-2.5 sm:py-1 sm:text-[11px] ${st.bg} ${st.text}`}
                    >
                      {st.label}
                    </button>
                  </td>
                  <td className="hidden px-4 py-4 text-[13px] text-gray-500 sm:table-cell sm:px-5">
                    {new Date(blog.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-4 text-right sm:px-5">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <Link
                        href={`/admin/blogs/${blog.id}/edit`}
                        className="rounded-lg border border-white/[0.06] px-2 py-1 text-[11px] font-medium text-gray-400 transition-colors hover:border-white/[0.12] hover:text-white sm:px-3 sm:py-1.5 sm:text-[12px]"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        disabled={deleting === blog.id}
                        className="rounded-lg border border-white/[0.06] px-2 py-1 text-[11px] font-medium text-gray-400 transition-colors hover:border-red-500/30 hover:text-red-400 disabled:opacity-50 sm:px-3 sm:py-1.5 sm:text-[12px]"
                      >
                        {deleting === blog.id ? "..." : "Supprimer"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

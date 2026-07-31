"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { formatPrice, propertyUrl, cldOptimize } from "@/lib/utils";
import { GitCompareArrows, Printer, RotateCcw, X, Check } from "lucide-react";

const ROWS = [
  { label: "Price", get: (p) => formatPrice(p.price) },
  { label: "Location", get: (p) => `${p.area}, ${p.city}` },
  { label: "Property Type", get: (p) => p.propertyType || "—", capitalize: true },
  { label: "BHK", get: (p) => (p.bhk ? `${p.bhk} BHK` : "—") },
  { label: "Bathrooms", get: (p) => p.bathrooms || "—" },
  { label: "Area", get: (p) => (p.areaSize ? `${p.areaSize} sqft` : "—") },
  { label: "Furnishing", get: (p) => p.furnishing || "—", capitalize: true },
  { label: "Developer", get: (p) => p.developerName || "—" },
  {
    label: "Possession",
    get: (p) =>
      p.possessionStatus
        ? p.possessionStatus.replace(/-/g, " ") + (p.possessionPercent != null ? ` (${p.possessionPercent}%)` : "")
        : "—",
    capitalize: true,
  },
  { label: "Status", get: (p) => (p.status === "sale" ? "For Sale" : "Sold"), capitalize: true },
];

export default function PropertyCompare({ currentProperty }) {
  const [mode, setMode] = useState("closed"); // closed | select | table
  const [allProperties, setAllProperties] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [compareList, setCompareList] = useState([]);

  async function openSelector() {
    setMode("select");
    setSelectedIds([]);
    setLoadingList(true);
    try {
      const { data } = await api.get("/property", { params: { limit: 100 } });
      const others = (data.properties || []).filter((p) => p._id !== currentProperty._id);
      setAllProperties(others);
    } catch (err) {
      setAllProperties([]);
    } finally {
      setLoadingList(false);
    }
  }

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev; // current property + up to 2 more = 3 total
      return [...prev, id];
    });
  }

  function generateTable() {
    const others = allProperties.filter((p) => selectedIds.includes(p._id));
    setCompareList([currentProperty, ...others]);
    setMode("table");
  }

  function refresh() {
    setSelectedIds([]);
    setCompareList([]);
    setMode("closed");
  }

  if (mode === "closed") {
    return (
      <div className="mt-10 flex flex-col items-center gap-3 rounded-sm border border-dashed border-ink-800/20 px-6 py-8 text-center">
        <GitCompareArrows size={22} className="text-brass-500" />
        <p className="text-sm text-ink-800/70">Compare this property side-by-side with up to 2 others.</p>
        <button
          onClick={openSelector}
          className="rounded-sm bg-ink-900 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-paper-50 hover:bg-ink-800"
        >
          Compare Properties
        </button>
      </div>
    );
  }

  if (mode === "select") {
    return (
      <div className="mt-10 rounded-sm border border-ink-800/10 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg text-ink-950">Select up to 2 properties to compare</h2>
            <p className="mt-1 text-xs text-ink-800/50">
              &quot;{currentProperty.title}&quot; is already included — pick {2 - selectedIds.length} more.
            </p>
          </div>
          <button onClick={refresh} aria-label="Close" className="text-ink-800/40 hover:text-rust-500">
            <X size={18} />
          </button>
        </div>

        {loadingList ? (
          <p className="mt-6 text-center text-sm text-ink-800/50">Loading properties...</p>
        ) : allProperties.length === 0 ? (
          <p className="mt-6 text-center text-sm text-ink-800/50">No other properties available right now.</p>
        ) : (
          <div className="mt-4 grid max-h-96 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
            {allProperties.map((p) => {
              const checked = selectedIds.includes(p._id);
              const disabled = !checked && selectedIds.length >= 2;
              return (
                <button
                  key={p._id}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleSelect(p._id)}
                  className={`flex items-center gap-3 rounded-sm border p-2.5 text-left transition-colors ${
                    checked
                      ? "border-brass-500 bg-brass-500/5"
                      : disabled
                      ? "border-ink-800/10 opacity-40"
                      : "border-ink-800/10 hover:border-brass-500/40"
                  }`}
                >
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-sm bg-ink-900">
                    {p.images?.[0] && (
                      <img src={cldOptimize(p.images[0], 100)} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink-900">{p.title}</p>
                    <p className="text-xs text-ink-800/50">{formatPrice(p.price)}</p>
                  </div>
                  {checked && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brass-500 text-white">
                      <Check size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={refresh}
            className="rounded-sm border border-ink-800/20 px-4 py-2.5 font-mono text-xs uppercase tracking-widest hover:border-rust-500"
          >
            Cancel
          </button>
          <button
            onClick={generateTable}
            disabled={selectedIds.length === 0}
            className="rounded-sm bg-brass-500 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-ink-950 hover:bg-brass-400 disabled:opacity-40"
          >
            Generate Comparison
          </button>
        </div>
      </div>
    );
  }

  // mode === "table"
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-ink-950">Property Comparison</h2>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-sm border border-ink-800/20 px-3 py-2 font-mono text-xs uppercase tracking-widest hover:border-brass-500"
          >
            <Printer size={14} /> Print
          </button>
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 rounded-sm border border-ink-800/20 px-3 py-2 font-mono text-xs uppercase tracking-widest hover:border-rust-500"
          >
            <RotateCcw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div id="compare-print-area" className="mt-4 overflow-x-auto rounded-sm border border-ink-800/10">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-32 border-b border-ink-800/10 bg-paper-100/60 p-3 text-left font-mono text-[10px] uppercase tracking-widest text-ink-800/50">
                Property
              </th>
              {compareList.map((p) => (
                <th key={p._id} className="border-b border-ink-800/10 bg-paper-100/60 p-3 text-left align-top">
                  <div className="relative aspect-[4/3] w-full max-w-[160px] overflow-hidden rounded-sm bg-ink-900">
                    {p.images?.[0] && (
                      <img src={cldOptimize(p.images[0], 300)} alt={p.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <p className="mt-2 max-w-[160px] text-sm font-medium text-ink-950">{p.title}</p>
                  <Link
                    href={propertyUrl(p)}
                    className="mt-1 inline-block font-mono text-[10px] uppercase tracking-widest text-brass-600 hover:underline print:hidden"
                  >
                    View property
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-b border-ink-800/10 last:border-b-0">
                <td className="p-3 font-mono text-[10px] uppercase tracking-widest text-ink-800/50">{row.label}</td>
                {compareList.map((p) => (
                  <td key={p._id} className={`p-3 text-ink-900 ${row.capitalize ? "capitalize" : ""}`}>
                    {row.get(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
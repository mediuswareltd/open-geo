"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { Map, Download, FileText, Activity, Layers } from "lucide-react";
import type { Property, FilterState } from "@/types";
import { properties as allProperties, reports } from "@/data/mockData";
import SearchSidebar from "./Sidebar/SearchSidebar";
import PropertyPanel from "./Panel/PropertyPanel";
import { exportListToPDF, exportDetailToPDF } from "@/utils/exportPDF";
import { exportToCSV } from "@/utils/exportCSV";

const MapView = dynamic(() => import("./Map/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-slate-800 gap-3">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-slate-500">Loading map…</span>
    </div>
  ),
});

const DEFAULT_FILTERS: FilterState = { type: "all", status: "all", maxPrice: 20000 };

export default function Dashboard() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState<"details" | "report">("details");

  const filteredProperties = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return allProperties.filter((p) => {
      if (
        q &&
        !p.address.toLowerCase().includes(q) &&
        !p.owner.toLowerCase().includes(q) &&
        !String(p.id).includes(q)
      ) {
        return false;
      }
      if (filters.type !== "all" && p.type !== filters.type) return false;
      if (filters.status !== "all" && p.status !== filters.status) return false;
      if (p.price > filters.maxPrice) return false;
      return true;
    });
  }, [searchQuery, filters]);

  const selectedReport = useMemo(
    () => (selectedProperty ? (reports.find((r) => r.propertyId === selectedProperty.id) ?? null) : null),
    [selectedProperty]
  );

  const handleSelectProperty = useCallback((p: Property) => {
    setSelectedProperty(p);
    setActiveTab("details");
  }, []);

  const handleExportPDF = useCallback(() => {
    if (selectedProperty) {
      exportDetailToPDF(selectedProperty, selectedReport);
    } else {
      exportListToPDF(filteredProperties);
    }
  }, [selectedProperty, selectedReport, filteredProperties]);

  const handleExportCSV = useCallback(() => {
    exportToCSV(filteredProperties);
  }, [filteredProperties]);

  const statusCounts = useMemo(
    () => ({
      available: filteredProperties.filter((p) => p.status === "Available").length,
      sold: filteredProperties.filter((p) => p.status === "Sold").length,
      rented: filteredProperties.filter((p) => p.status === "Rented").length,
    }),
    [filteredProperties]
  );

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-700/60 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <Map size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-none tracking-tight">OpenGeo</h1>
            <p className="text-slate-500 text-xs mt-0.5">OpenStreetMap · U.S. Property Intelligence</p>
          </div>
        </div>

        {/* Status pills */}
        <div className="hidden md:flex items-center gap-2">
          <StatPill color="bg-green-400" label="Available" count={statusCounts.available} />
          <StatPill color="bg-red-400" label="Sold" count={statusCounts.sold} />
          <StatPill color="bg-yellow-400" label="Rented" count={statusCounts.rented} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-400 border border-slate-700/60">
            <Activity size={11} className="text-green-400" />
            <span>{filteredProperties.length} properties</span>
          </div>
          <button
            onClick={handleExportCSV}
            title="Export filtered list as CSV"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-xs font-medium transition-colors"
          >
            <Download size={13} />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            title={selectedProperty ? "Export this property as PDF" : "Export filtered list as PDF"}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-medium transition-colors"
          >
            <FileText size={13} />
            <span>PDF Report</span>
          </button>
        </div>
      </header>

      {/* ── Main layout ─────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <SearchSidebar
          properties={filteredProperties}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
          selectedProperty={selectedProperty}
          onSelectProperty={handleSelectProperty}
        />

        {/* Map (center, fills all remaining space) */}
        <div className="flex-1 relative overflow-hidden">
          <MapView
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onSelectProperty={handleSelectProperty}
          />

          {/* Map legend overlay */}
          <div className="absolute bottom-6 left-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700/60 rounded-lg px-3 py-2 z-[1000] flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Layers size={11} className="text-slate-500" />
              <span className="text-xs text-slate-500">Legend</span>
            </div>
            <LegendDot color="#22c55e" label="Available" />
            <LegendDot color="#ef4444" label="Sold" />
            <LegendDot color="#f59e0b" label="Rented" />
          </div>
        </div>

        {/* Right panel */}
        <PropertyPanel
          property={selectedProperty}
          report={selectedReport}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onExportPDF={handleExportPDF}
        />
      </div>
    </div>
  );
}

function StatPill({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <div className="flex items-center gap-1.5 bg-slate-800/60 rounded px-2 py-1 border border-slate-700/40">
      <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-xs font-bold text-slate-300">{count}</span>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}

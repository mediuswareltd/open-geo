"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import type { Property, FilterState } from "@/types";
import { properties as allProperties } from "@/data/mockData";
import PropertyCard from "./PropertyCard";

const STATUS_DOT: Record<string, string> = {
  Available: "bg-green-400",
  Sold: "bg-red-400",
  Rented: "bg-yellow-400",
};

interface Props {
  properties: Property[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  selectedProperty: Property | null;
  onSelectProperty: (p: Property) => void;
}

export default function SearchSidebar({
  properties,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  selectedProperty,
  onSelectProperty,
}: Props) {
  const [showFilters, setShowFilters] = useState(false);

  const counts = {
    Available: allProperties.filter((p) => p.status === "Available").length,
    Sold: allProperties.filter((p) => p.status === "Sold").length,
    Rented: allProperties.filter((p) => p.status === "Rented").length,
  };

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-700/60 flex flex-col overflow-hidden shrink-0">
      {/* Sidebar header */}
      <div className="px-4 py-3 border-b border-slate-700/60 bg-slate-800/40">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Property Search
        </h2>
      </div>

      {/* Search input */}
      <div className="p-3 border-b border-slate-700/60 space-y-2">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by address, owner or ID…"
            className="w-full bg-slate-800 border border-slate-600 rounded-md pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors"
          />
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center justify-between w-full px-2 py-1 text-xs text-slate-400 hover:text-slate-200 rounded transition-colors hover:bg-slate-800"
        >
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={11} />
            <span>Filters</span>
          </div>
          {showFilters ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>

        {showFilters && (
          <div className="space-y-3 pt-1 pb-1">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Property Type</label>
              <select
                value={filters.type}
                onChange={(e) => onFiltersChange({ ...filters, type: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Rented">Rented</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Max Price: ${filters.maxPrice.toLocaleString()}/mo
              </label>
              <input
                type="range"
                min={1000}
                max={20000}
                step={500}
                value={filters.maxPrice}
                onChange={(e) => onFiltersChange({ ...filters, maxPrice: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-600 mt-0.5">
                <span>$1k</span>
                <span>$20k</span>
              </div>
            </div>

            <button
              onClick={() =>
                onFiltersChange({ type: "all", status: "all", maxPrice: 20000 })
              }
              className="w-full text-xs text-slate-500 hover:text-blue-400 py-1 transition-colors"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="px-3 py-2 border-b border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin size={10} />
          <span>{properties.length} shown</span>
        </div>
        <div className="flex items-center gap-3">
          {Object.entries(counts).map(([status, count]) => (
            <div key={status} className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
              <span className="text-xs text-slate-500">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Property list */}
      <div className="flex-1 overflow-y-auto">
        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-600 text-sm gap-2">
            <Search size={20} />
            <span>No properties match</span>
          </div>
        ) : (
          properties.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              isSelected={selectedProperty?.id === p.id}
              onClick={() => onSelectProperty(p)}
            />
          ))
        )}
      </div>
    </aside>
  );
}

"use client";

import {
  MapPin,
  User,
  DollarSign,
  Layers,
  Calendar,
  Star,
  AlertTriangle,
  FileText,
  ChevronRight,
  Home,
} from "lucide-react";
import type { Property, Report } from "@/types";

const CONDITION_STYLES: Record<string, string> = {
  Excellent: "text-green-400 bg-green-950",
  Good: "text-blue-400 bg-blue-950",
  Fair: "text-yellow-400 bg-yellow-950",
  Poor: "text-red-400 bg-red-950",
};

const STATUS_STYLES: Record<string, string> = {
  Available: "bg-green-900 text-green-300",
  Sold: "bg-red-900 text-red-300",
  Rented: "bg-yellow-900 text-yellow-300",
};

interface Props {
  property: Property | null;
  report: Report | null;
  activeTab: "details" | "report";
  onTabChange: (tab: "details" | "report") => void;
  onExportPDF: () => void;
}

export default function PropertyPanel({
  property,
  report,
  activeTab,
  onTabChange,
  onExportPDF,
}: Props) {
  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-700/60 flex flex-col overflow-hidden shrink-0">
      {property ? (
        <>
          {/* Property header */}
          <div className="p-4 border-b border-slate-700/60 bg-slate-800/50">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs text-slate-500 font-mono">#{property.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[property.status]}`}>
                    {property.status}
                  </span>
                  <span className="text-xs text-slate-500">{property.type}</span>
                </div>
                <h2 className="text-sm font-semibold text-slate-100 leading-snug">
                  {property.address}
                </h2>
                <p className="text-xs text-slate-500 mt-1">{property.owner}</p>
              </div>
              <button
                onClick={onExportPDF}
                title="Export PDF report"
                className="shrink-0 p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                <FileText size={14} />
              </button>
            </div>

            {/* Price badge */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 bg-slate-900 rounded-lg px-3 py-2 text-center">
                <div className="text-xs text-slate-500">Monthly Price</div>
                <div className="text-lg font-bold text-blue-400">
                  ${property.price.toLocaleString()}
                </div>
              </div>
              <div className="flex-1 bg-slate-900 rounded-lg px-3 py-2 text-center">
                <div className="text-xs text-slate-500">Area</div>
                <div className="text-sm font-bold text-slate-200">
                  {property.area.toLocaleString()} <span className="text-xs font-normal text-slate-500">sqft</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-700/60 shrink-0">
            {(["details", "report"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  activeTab === tab
                    ? "text-blue-400 border-b-2 border-blue-400 bg-slate-800/50"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab === "details" ? "Details" : "Inspection"}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "details" ? (
              <DetailsTab property={property} />
            ) : (
              <ReportTab report={report} />
            )}
          </div>
        </>
      ) : (
        <EmptyState />
      )}
    </aside>
  );
}

function DetailsTab({ property }: { property: Property }) {
  const rows = [
    { icon: User, label: "Owner", value: property.owner },
    { icon: MapPin, label: "Coordinates", value: `${property.lat.toFixed(4)}, ${property.lng.toFixed(4)}` },
    { icon: Layers, label: "Zone", value: property.zone },
    { icon: Calendar, label: "Year Built", value: property.yearBuilt.toString() },
    { icon: Home, label: "Area", value: `${property.area.toLocaleString()} sqft` },
    { icon: DollarSign, label: "Price / mo", value: `$${property.price.toLocaleString()}` },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Description */}
      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/40">
        <p className="text-sm text-slate-300 leading-relaxed">{property.description}</p>
      </div>

      {/* Detail rows */}
      <div className="space-y-1">
        {rows.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 py-2 border-b border-slate-800/80 last:border-0"
          >
            <Icon size={13} className="text-slate-600 shrink-0" />
            <span className="text-xs text-slate-500 w-24 shrink-0">{label}</span>
            <span className="text-sm text-slate-200 font-medium truncate">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportTab({ report }: { report: Report | null }) {
  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-slate-600 text-sm gap-2 p-4">
        <FileText size={20} />
        <span>No inspection report available</span>
      </div>
    );
  }

  const condition = report.condition;
  const conditionStyle = CONDITION_STYLES[condition] ?? "text-slate-400 bg-slate-800";

  return (
    <div className="p-4 space-y-4">
      {/* Report header card */}
      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/40 space-y-2">
        <h3 className="font-semibold text-slate-200 text-sm">{report.title}</h3>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{report.date}</span>
          <span>·</span>
          <span>{report.inspector}</span>
        </div>
        {/* Stars */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={12}
              className={i < report.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-700"}
            />
          ))}
          <span className="text-xs text-slate-500 ml-1">{report.rating}/5</span>
        </div>
      </div>

      {/* Condition badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Condition:</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${conditionStyle}`}>
          {condition}
        </span>
      </div>

      {/* Notes */}
      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Inspector Notes
        </h4>
        <p className="text-sm text-slate-300 bg-slate-800/50 rounded-lg p-3 border border-slate-700/40 leading-relaxed">
          {report.notes}
        </p>
      </div>

      {/* Issues */}
      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
          {report.issues.length > 0 ? (
            <AlertTriangle size={11} className="text-yellow-400" />
          ) : null}
          Issues ({report.issues.length})
        </h4>
        {report.issues.length === 0 ? (
          <p className="text-xs text-green-400 bg-green-950/40 rounded-lg px-3 py-2 border border-green-900/40">
            No issues found — property is in good standing.
          </p>
        ) : (
          <ul className="space-y-2">
            {report.issues.map((issue, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-300 bg-slate-800/30 rounded px-2 py-1.5"
              >
                <ChevronRight size={12} className="text-yellow-500 mt-0.5 shrink-0" />
                {issue}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
        <MapPin size={24} className="text-slate-600" />
      </div>
      <p className="text-sm font-medium text-slate-400 mb-1">No property selected</p>
      <p className="text-xs text-slate-600 leading-relaxed">
        Click a marker on the map or a property in the list to view details and inspection reports.
      </p>
    </div>
  );
}

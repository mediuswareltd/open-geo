import type { Property } from "@/types";

function escape(value: string | number): string {
  if (typeof value === "number") return String(value);
  return `"${value.replace(/"/g, '""')}"`;
}

export function exportToCSV(properties: Property[]) {
  const headers = [
    "ID",
    "Address",
    "Owner",
    "Price (USD/mo)",
    "Type",
    "Status",
    "Area (sqft)",
    "Year Built",
    "Zone",
    "Latitude",
    "Longitude",
    "Description",
  ];

  const rows = properties.map((p) => [
    p.id,
    escape(p.address),
    escape(p.owner),
    p.price,
    escape(p.type),
    escape(p.status),
    p.area,
    p.yearBuilt,
    escape(p.zone),
    p.lat,
    p.lng,
    escape(p.description),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `georeport-properties-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Property, Report } from "@/types";

function addHeader(doc: jsPDF, subtitle: string) {
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 40, "F");

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(248, 250, 252);
  doc.text("OpenGeo", 14, 16);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(subtitle, 14, 24);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 31);

  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.8);
  doc.line(0, 40, 210, 40);
}

export function exportListToPDF(items: Property[]) {
  const doc = new jsPDF({ orientation: "landscape" });
  addHeader(doc, `Property List Report — ${items.length} properties`);

  autoTable(doc, {
    startY: 46,
    head: [["ID", "Address", "Owner", "Price ($/mo)", "Type", "Status", "Area (sqft)", "Year"]],
    body: items.map((p) => [
      `#${p.id}`,
      p.address,
      p.owner,
      p.price.toLocaleString(),
      p.type,
      p.status,
      p.area.toLocaleString(),
      p.yearBuilt,
    ]),
    theme: "grid",
    headStyles: { fillColor: [30, 58, 138], textColor: [248, 250, 252], fontSize: 9, fontStyle: "bold" },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [30, 41, 59], fontSize: 8 },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: 55 } },
  });

  doc.save(`georeport-properties-${Date.now()}.pdf`);
}

export function exportDetailToPDF(property: Property, report: Report | null) {
  const doc = new jsPDF();
  addHeader(doc, `Property Detail Report — #${property.id}`);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Property Information", 14, 52);

  autoTable(doc, {
    startY: 57,
    head: [["Field", "Value"]],
    body: [
      ["Property ID", `#${property.id}`],
      ["Address", property.address],
      ["Owner", property.owner],
      ["Price", `$${property.price.toLocaleString()} / month`],
      ["Type", property.type],
      ["Status", property.status],
      ["Area", `${property.area.toLocaleString()} sq ft`],
      ["Year Built", property.yearBuilt.toString()],
      ["Zone", property.zone],
      ["Coordinates", `${property.lat.toFixed(6)}, ${property.lng.toFixed(6)}`],
      ["Description", property.description],
    ],
    theme: "grid",
    headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontSize: 10 },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [30, 41, 59], fontSize: 9 },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 45 } },
    showHead: "firstPage",
  });

  if (report) {
    const finalY: number = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Inspection Report", 14, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      head: [["Field", "Details"]],
      body: [
        ["Report Title", report.title],
        ["Inspection Date", report.date],
        ["Inspector", report.inspector],
        ["Condition", report.condition],
        ["Rating", `${report.rating} / 5 stars`],
        ["Inspector Notes", report.notes],
        ["Issues Found", report.issues.length > 0 ? report.issues.join("\n") : "No issues found"],
      ],
      theme: "grid",
      headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontSize: 10 },
      bodyStyles: { fillColor: [255, 255, 255], textColor: [30, 41, 59], fontSize: 9 },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 45 } },
      showHead: "firstPage",
    });
  }

  doc.save(`georeport-property-${property.id}-${Date.now()}.pdf`);
}

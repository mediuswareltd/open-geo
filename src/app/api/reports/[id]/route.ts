import { NextResponse } from "next/server";
import { reports } from "@/data/mockData";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const propertyId = parseInt(params.id);
  const propertyReports = reports.filter((r) => r.propertyId === propertyId);
  return NextResponse.json({ data: propertyReports, total: propertyReports.length });
}

import { NextResponse } from "next/server";
import { properties } from "@/data/mockData";

export async function GET() {
  return NextResponse.json({ data: properties, total: properties.length });
}

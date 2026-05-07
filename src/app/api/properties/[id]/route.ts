import { NextResponse } from "next/server";
import { properties } from "@/data/mockData";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const property = properties.find((p) => p.id === parseInt(params.id));
  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }
  return NextResponse.json({ data: property });
}

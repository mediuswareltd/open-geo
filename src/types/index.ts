export type PropertyStatus = "Available" | "Sold" | "Rented";
export type PropertyType = "Residential" | "Commercial" | "Industrial" | "Mixed";
export type ConditionType = "Excellent" | "Good" | "Fair" | "Poor";

export interface Property {
  id: number;
  address: string;
  lat: number;
  lng: number;
  price: number;
  owner: string;
  type: PropertyType;
  area: number;
  status: PropertyStatus;
  description: string;
  zone: string;
  yearBuilt: number;
}

export interface Report {
  id: number;
  propertyId: number;
  title: string;
  date: string;
  inspector: string;
  condition: ConditionType;
  notes: string;
  rating: number;
  issues: string[];
}

export interface FilterState {
  type: string;
  status: string;
  maxPrice: number;
}

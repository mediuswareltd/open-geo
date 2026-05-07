import type { Property } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  Available: "bg-green-950 text-green-300",
  Sold: "bg-red-950 text-red-300",
  Rented: "bg-yellow-950 text-yellow-300",
};

const TYPE_COLORS: Record<string, string> = {
  Residential: "text-blue-400",
  Commercial: "text-purple-400",
  Industrial: "text-orange-400",
  Mixed: "text-teal-400",
};

interface Props {
  property: Property;
  isSelected: boolean;
  onClick: () => void;
}

export default function PropertyCard({ property, isSelected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 border-b border-slate-800 transition-colors hover:bg-slate-800/60 ${
        isSelected ? "bg-slate-800 border-l-2 border-l-blue-500 pl-[10px]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs text-slate-500">#{property.id}</span>
            <span className={`text-xs font-medium ${TYPE_COLORS[property.type] ?? "text-slate-400"}`}>
              {property.type}
            </span>
          </div>
          <p className="text-sm text-slate-200 font-medium truncate leading-snug">
            {property.address}
          </p>
          <p className="text-xs text-slate-500 truncate mt-0.5">{property.owner}</p>
        </div>
        <div className="shrink-0 text-right space-y-1">
          <div className="text-sm font-bold text-blue-400">
            ${property.price.toLocaleString()}
          </div>
          <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${STATUS_STYLES[property.status]}`}>
            {property.status}
          </span>
        </div>
      </div>
    </button>
  );
}

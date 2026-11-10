# Guide

A Next.js 14 property map dashboard with Leaflet/OpenStreetMap, filters, inspection reports, and CSV/PDF export.

](https://mediuswareltd.github.io/open-geo/)

A full-stack GIS-style property dashboard built with **Next.js 14**, **Leaflet.js / OpenStreetMap**, **TailwindCSS**, and a mock REST API. Suitable for portfolio and client demonstrations.

## Features

| Feature | Details |
|---|---|
| Interactive Map | OpenStreetMap tiles via Leaflet.js, colour-coded CircleMarkers by status |
| Property Search | Real-time search by address, owner, or ID |
| Dynamic Filters | Filter by property type, status, and max price |
| Property Details | Full details panel (owner, price, area, zone, year built, coordinates) |
| Inspection Reports | Per-property inspection reports with condition rating, notes, and issues list |
| PDF Export | Single-property detail PDF or filtered-list PDF via jsPDF |
| CSV Export | Download filtered property list as CSV |
| REST API | Mock Next.js API routes: `GET /api/properties`, `GET /api/properties/:id`, `GET /api/reports/:id` |

## Tech Stack

- **Frontend**: Next.js 14 (App Router) · TypeScript · TailwindCSS
- **Map**: Leaflet.js · react-leaflet · OpenStreetMap tiles
- **Icons**: lucide-react
- **Export**: jsPDF · jspdf-autotable
- **Backend**: Next.js API Routes (mock data)

## UI Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER  GeoReport Dashboard           [CSV]  [PDF Report]          │
├──────────────┬──────────────────────────────┬───────────────────────┤
│  SEARCH      │                              │  PROPERTY DETAILS     │
│  SIDEBAR     │   LEAFLET MAP (OSM tiles)    │  · Address / Owner    │
│              │                              │  · Price / Area       │
│  [Filters]   │   ● Available (green)        │  · Coordinates        │
│  [List]      │   ● Sold (red)               │                       │
│              │   ● Rented (amber)           │  INSPECTION REPORT    │
│              │                              │  · Condition / Rating │
│              │   [Legend]                   │  · Notes / Issues     │
└──────────────┴──────────────────────────────┴───────────────────────┘
```

## Getting Started (Local)

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

## Deployment (Linux)

```bash
# Install Node.js 20+ (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and install
git clone <repo-url> geo-report-dashboard
cd geo-report-dashboard
npm install

# Build for production
npm run build

# Start production server
npm start
# or with PM2:
# npm install -g pm2
# pm2 start npm --name "geo-dashboard" -- start
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/properties` | List all properties |
| GET | `/api/properties/:id` | Get single property |
| GET | `/api/reports/:id` | Get inspection report for property |

## Mock Data

15 properties across Dhaka (Uttara, Gulshan, Banani, Mirpur, Dhanmondi, Motijheel, Bashundhara, Wari, Mohammadpur, Tejgaon, Shyamoli, Rampura, Malibagh, Kakrail) with full inspection reports.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── properties/route.ts        # GET /api/properties
│   │   ├── properties/[id]/route.ts   # GET /api/properties/:id
│   │   └── reports/[id]/route.ts      # GET /api/reports/:id
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Dashboard.tsx                  # Main layout & state
│   ├── Map/MapView.tsx                # Leaflet map (SSR-disabled)
│   ├── Sidebar/
│   │   ├── SearchSidebar.tsx          # Search + filter panel
│   │   └── PropertyCard.tsx           # Individual property card
│   └── Panel/PropertyPanel.tsx        # Details + inspection tabs
├── data/mockData.ts                   # 15 properties + reports
├── types/index.ts
└── utils/
    ├── exportPDF.ts                   # jsPDF export
    └── exportCSV.ts                   # CSV export
```

## Documentation

Full docs site (VitePress): **https://mediuswareltd.github.io/open-geo/**

Local preview:

```bash
cd docs
npm install
npm run docs:dev
```


---

Repository: [mediuswareltd/open-geo](https://github.com/mediuswareltd/open-geo)

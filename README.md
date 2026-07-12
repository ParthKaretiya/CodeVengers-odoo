<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0A1628,100:F5A623&height=220&section=header&text=TransitOps&fontSize=70&fontColor=F5F6F8&fontAlignY=38&desc=Smart%20Transport%20Operations%20Platform&descAlignY=58&descSize=20&animation=fadeIn" width="100%"/>

<img src="https://readme-typing-svg.demolab.com?font=Space+Grotesk&size=22&duration=2500&pause=800&color=F5A623&center=true&vCenter=true&width=650&lines=Fleets+still+run+on+spreadsheets.;We+built+a+live+operations+platform.;Illegal+dispatch+decisions%2C+made+impossible." alt="Typing SVG" />

<br/>

![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

![Status](https://img.shields.io/badge/status-hackathon%20build-F5A623?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-8B93A7?style=flat-square)
![Team](https://img.shields.io/badge/team-2%20developers-3B82F6?style=flat-square)

</div>

---

## What is TransitOps?

Logistics companies still run their fleets on **spreadsheets and paper logbooks** — leading to double-booked vehicles, drivers dispatched with expired licenses, trucks sent out while due for service, and zero visibility into what any single vehicle actually costs to run.

**TransitOps** is a centralized operations platform that digitizes the full lifecycle of a fleet — vehicle registry, driver management, trip dispatch, maintenance, and fuel/expense tracking — while **making illegal or unsafe dispatch decisions physically impossible** at the database level, not just discouraged in the UI.

<div align="center">
<img src="https://img.shields.io/badge/-No%20more%20double--bookings-1C2333?style=flat-square" />
<img src="https://img.shields.io/badge/-No%20more%20expired--license%20dispatch-1C2333?style=flat-square" />
<img src="https://img.shields.io/badge/-No%20more%20invisible%20maintenance%20status-1C2333?style=flat-square" />
</div>

---

## Table of Contents

- [Who it's for](#who-its-for)
- [Core Features](#core-features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Business Rules Engine](#business-rules-engine)
- [Trip Lifecycle](#trip-lifecycle)
- [API Overview](#api-overview)
- [Database Schema](#database-schema)
- [AI / Predictive Layer](#ai--predictive-layer-bonus)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Demo Script](#demo-script)
- [Odoo Alignment](#odoo-alignment)
- [Roadmap](#roadmap)
- [Team](#team)

---

## Who it's for

| Role | What they do |
|---|---|
| 🚚 **Fleet Manager** | Owns vehicles, maintenance, lifecycle, full CRUD access |
| 🧭 **Driver** | Creates and works trips, views assigned vehicle |
| 🛡️ **Safety Officer** | Polices license validity and driver safety scores |
| 📊 **Financial Analyst** | Reviews cost, fuel, and profitability reports |

Access is enforced with real **Role-Based Access Control** — server-side, on every protected route, not just hidden UI elements.

---

## Core Features

- 🔐 **Secure Auth + RBAC** — JWT-based, 4 distinct roles, protected routes on both client and server
- 🚐 **Vehicle Registry** — unique registration numbers, live status tracking (`Available` → `On Trip` → `In Shop` → `Retired`)
- 🧑‍✈️ **Driver Management** — license expiry tracking, safety scores, suspension workflow
- 🗺️ **Trip Dispatch Board** — Kanban-style lifecycle: `Draft → Dispatched → Completed → Cancelled`, with live rule enforcement
- 🔧 **Maintenance Workflow** — opening a record automatically pulls a vehicle out of the dispatch pool
- ⛽ **Fuel & Expense Tracking** — automatic operational cost roll-up per vehicle
- 📈 **Dashboard & Reports** — live KPIs, fleet utilization %, fuel efficiency, and vehicle ROI computed from real data

---

## Screenshots

<div align="center">

**Dashboard**
![Dashboard](https://res.cloudinary.com/dagwbyz4e/image/upload/v1783853941/Screenshot_2026-07-12_161851_cc6xpv.png)

**Trip Dispatch Board**
![Trips](https://res.cloudinary.com/dagwbyz4e/image/upload/v1783853934/Screenshot_2026-07-12_162031_kpqbhi.png)

**Vehicle Registry**
![Vehicles](https://res.cloudinary.com/dagwbyz4e/image/upload/v1783853926/Screenshot_2026-07-12_162103_ukv50v.png)

**Driver Management**
![Drivers](https://res.cloudinary.com/dagwbyz4e/image/upload/v1783853838/Screenshot_2026-07-12_162138_fvfg6l.png)

</div>

---

## Tech Stack

<div align="center">

| Layer | Choice | Why |
|---|---|---|
| Frontend | React (Vite) + Tailwind CSS | Instant HMR, zero CSS context-switching under time pressure |
| Routing | React Router v6 | Minimal setup, protected-route wrapper for RBAC |
| State | React Context + local state | Only one true global value (auth user) — no Redux overhead |
| Backend | Node.js + Express | Fast to scaffold, huge ecosystem |
| Database | PostgreSQL | Strict FK/enum integrity fits this domain's status-driven rules |
| Auth | JWT + bcrypt | Stateless, simple to verify per-request |
| Icons | Lucide React | Consistent, tree-shakeable |
| Charts | Recharts | Simple API, good enough visuals for a 6-hour build |
| Notifications | react-hot-toast | Every state change gets a toast — cheapest "feels alive" win |

</div>

---

## Architecture

```mermaid
flowchart LR
    subgraph Client["Frontend — React + Vite"]
        UI[Pages & Components]
        Hooks[Custom Hooks]
        Services[API Services / Axios]
    end

    subgraph Server["Backend — Node.js / Express"]
        Routes[Routes]
        Controllers[Controllers]
        BizLogic[Service Layer\nTripService · MaintenanceService · ReportService]
        Middleware[Auth + RBAC Middleware]
    end

    DB[(PostgreSQL)]

    UI --> Hooks --> Services -->|REST + JWT| Middleware --> Routes --> Controllers --> BizLogic --> DB
    BizLogic -->|transaction-safe status sync| DB
```

**Key architectural rule:** every business rule (capacity checks, license validity, double-booking prevention, status transitions) lives in the **service layer**, never in controllers — so rules can't be bypassed from a different code path, and every multi-entity status change (e.g. dispatch flips both Vehicle and Driver) happens inside a **single database transaction**.

---

## Business Rules Engine

TransitOps enforces these rules **server-side**, verified live in the demo by deliberately trying to break them:

- ✅ Vehicle registration number must be **globally unique**
- ✅ `Retired` or `In Shop` vehicles **never appear** in the dispatch pool
- ✅ Drivers with **expired licenses** or `Suspended` status **cannot be assigned** to trips
- ✅ A vehicle or driver already `On Trip` **cannot be double-booked**
- ✅ Cargo weight **must not exceed** the vehicle's maximum load capacity
- ✅ Dispatching a trip **automatically flips** both vehicle and driver to `On Trip`
- ✅ Completing a trip **automatically restores** both to `Available`
- ✅ Cancelling a dispatched trip **restores** vehicle and driver to `Available`
- ✅ Opening a maintenance record **automatically hides** the vehicle from dispatch
- ✅ Closing maintenance **restores availability** — unless the vehicle is `Retired`

---

## Trip Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft: Create Trip
    Draft --> Dispatched: Dispatch\n(validates capacity, availability, license)
    Draft --> Cancelled: Cancel
    Dispatched --> Completed: Complete\n(enter odometer + fuel)
    Dispatched --> Cancelled: Cancel
    Completed --> [*]
    Cancelled --> [*]

    note right of Dispatched
        Vehicle → on_trip
        Driver → on_trip
    end note

    note right of Completed
        Vehicle → available
        Driver → available
    end note
```

---

## API Overview

All routes are prefixed `/api`, protected with `Authorization: Bearer <token>`, and return a consistent shape:

```json
// success
{ "success": true, "data": { } }

// error
{ "success": false, "message": "Van-05 is currently On Trip, held by driver Alex", "code": "VEHICLE_UNAVAILABLE" }
```

<details>
<summary><strong>Expand full route table</strong></summary>

| Method | Route | Access | Purpose |
|---|---|---|---|
| POST | `/auth/signup` | Public | Register a user |
| POST | `/auth/login` | Public | Authenticate, receive JWT |
| GET | `/vehicles` | All roles | List vehicles (filterable) |
| POST | `/vehicles` | Fleet Manager | Register a vehicle |
| GET | `/drivers` | All roles | List drivers |
| PATCH | `/drivers/:id/suspend` | Safety Officer | Suspend a driver |
| POST | `/trips` | Fleet Manager, Driver | Create a trip (validates rules) |
| PATCH | `/trips/:id/dispatch` | Fleet Manager, Driver | Dispatch — status sync |
| PATCH | `/trips/:id/complete` | Fleet Manager, Driver | Complete — status sync |
| PATCH | `/trips/:id/cancel` | Fleet Manager, Driver | Cancel — status sync |
| POST | `/maintenance` | Fleet Manager | Open a maintenance record |
| PATCH | `/maintenance/:id/close` | Fleet Manager | Close a record |
| POST | `/fuel-logs` | Fleet Manager, Driver | Log fuel |
| POST | `/expenses` | Fleet Manager | Log an expense |
| GET | `/dashboard/kpis` | All roles | Live fleet KPIs |
| GET | `/reports/roi` | Financial Analyst | ROI per vehicle |
| GET | `/reports/export` | Fleet Manager, Financial Analyst | CSV export |

</details>

---

## Database Schema

```mermaid
erDiagram
    USERS ||--o{ DRIVERS : "may be"
    VEHICLES ||--o{ TRIPS : "assigned to"
    DRIVERS ||--o{ TRIPS : "assigned to"
    VEHICLES ||--o{ MAINTENANCE_LOGS : "has"
    VEHICLES ||--o{ FUEL_LOGS : "has"
    VEHICLES ||--o{ EXPENSES : "has"

    USERS {
        uuid id PK
        string email UK
        string password_hash
        enum role
    }
    VEHICLES {
        uuid id PK
        string reg_number UK
        string type
        int max_capacity
        int odometer
        decimal acquisition_cost
        enum status
    }
    DRIVERS {
        uuid id PK
        string license_number
        date license_expiry
        int safety_score
        enum status
    }
    TRIPS {
        uuid id PK
        uuid vehicle_id FK
        uuid driver_id FK
        int cargo_weight
        enum status
    }
    MAINTENANCE_LOGS {
        uuid id PK
        uuid vehicle_id FK
        decimal cost
        enum status
    }
```

---

## AI / Predictive Layer (Bonus)

> Not required by the original problem statement — added as a differentiator, and built to **never block the core app**.

- **Predictive Maintenance Score** — a transparent, explainable heuristic (no external ML calls):

  ```
  risk% = clamp(
      (km_since_last_service / 5000) * 50
    + (100 - avg_driver_safety_score) * 0.3
    + (vehicle_age_years * 2),
    0, 100
  )
  ```

- **Fuel Anomaly Detection** — flags any completed trip whose fuel efficiency deviates >25% from that vehicle's own rolling average.

Both endpoints degrade gracefully on zero-history vehicles and are computed on **seeded, static data** for the demo — reliability over live inference, on purpose.

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- PostgreSQL ≥ 14
- npm

### 1. Clone & install

```bash
git clone https://github.com/<your-org>/transitops.git
cd transitops

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment

Copy the example env files and fill in your values (see [Environment Variables](#environment-variables)):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Set up the database

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 4. Run it

```bash
# Terminal 1 — backend
cd backend && npm run dev     # http://localhost:5000

# Terminal 2 — frontend
cd frontend && npm run dev    # http://localhost:5173
```

### 5. Log in

Use a seeded demo account, e.g.:

```
Email:    demo@transitops.com
Password: password123
```

---

## Environment Variables

<details>
<summary><strong>backend/.env</strong></summary>

```env
DATABASE_URL=postgresql://user:password@localhost:5432/transitops
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=8h
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

</details>

<details>
<summary><strong>frontend/.env</strong></summary>

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

</details>

---

## Project Structure

```
transitops/
├── backend/
│   └── src/
│       ├── config/        # DB connection, env
│       ├── models/        # Prisma schema-backed models
│       ├── services/      # ALL business rules live here
│       ├── controllers/   # Thin — call services, return responses
│       ├── routes/        # One file per resource
│       ├── middleware/    # auth, rbac, error handling
│       └── utils/
├── frontend/
│   └── src/
│       ├── components/    # common/ + feature-specific subfolders
│       ├── pages/         # One file per route
│       ├── hooks/         # All data-fetching logic
│       ├── services/      # Pure API-call functions
│       ├── context/       # Auth context (the one global state)
│       └── utils/         # statusColors.js, formatters, validators
├── docs/
│   └── screenshots/
└── API_CONTRACT.md        # Locked source of truth for both sides
```

---



## Team

<div align="center">

| Role | Member |
|---|---|
| 🔧 Backend & Business Logic | **Parth Karetiya** |
| 🎨 Frontend & UX | **Devanshi Vadiya** |

Built in a single hackathon sprint.

</div>

---

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:F5A623,100:0A1628&height=100&section=footer" width="100%"/>
</div>

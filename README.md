# Pratra Flight Search – Angular 18+

## Tech stack
- Angular 18 standalone components and Angular Router
- TypeScript
- Reactive Forms and built-in validators
- HttpClient for REST API calls
- RxJS (`BehaviorSubject`, `combineLatest`, `debounceTime`, `switchMap`, `catchError`)
- JSON Server as a local mock REST API
- SCSS

## Prerequisites
- Node.js 18.19+ or 20.11+
- npm 9+

## Setup and run

```bash
npm install
```

Start the mock REST API in terminal 1:

```bash
npm run mock-api
```

Start Angular in terminal 2:

```bash
npm start
```

Open `http://localhost:4200`.

Build for production:

```bash
npm run build
```

## API details
The Angular app calls `GET /api/flights`. The development proxy forwards this to JSON Server at `http://localhost:3000/flights`. Data is in `db.json`.

Example response fields:
`id`, `airline`, `flightNumber`, `from`, `to`, `departureDate`, `returnDate`, `departureTime`, `arrivalTime`, `duration`, `durationMinutes`, `price`, `stops`, `cabinClass`, `aircraft`, `baggage`.

To connect a real backend, update `environment.apiUrl` and the endpoint/DTO mapping in `FlightService`. No component needs to know the API URL.

## Key implementation decisions
- Standalone components keep the app modular without NgModules.
- `FlightService` owns HTTP access and exposes typed observables.
- Search criteria are validated using Reactive Forms before an API request is made.
- The search form supports one-way and round-trip searches; return dates are only required and matched for round trips.
- Search requests use `switchMap` so a newer search supersedes an older request.
- Filters are derived reactively from the latest search result and filter state; `debounceTime` avoids excessive recomputation while moving the price slider.
- Route parameters load a selected flight on the details page.
- Airport dropdowns and mock routes are limited to BOM (Mumbai), DEL (New Delhi) and BLR (Bengaluru), with sample fares in INR.

## Assumptions
- The sample task permits mock JSON data served through a local API.

## Positive Scenarios Data
- One Way - Choose FROM as DEL and TO as BOM with Departure Date 20-11-2026
- Round Trip Choose FROM as DEL and TO as BOM with Departure Date 20-11-2026 and Return Date 24-11-2026

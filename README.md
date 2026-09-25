# Lavender Workshop Invoice

Lavender is a workshop and automotive service invoice management app built with React + TypeScript + Vite. It helps a car service business manage invoices, customers, vehicle history, and Excel imports in one place.

## Features

- Dashboard overview for recent invoices and workshop activity
- Create and manage invoices for services and spare parts
- Customer list and customer detail pages
- Vehicle plate suggestions and customer history tracking
- Invoice import from Excel files
- Discount, service fee, and payment method handling
- Local browser storage persistence for workshop data

## Tech Stack

- React 19
- TypeScript
- Vite
- XLSX for Excel import support

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Production build

```bash
npm run build
```

## Project Structure

```text
src/
  components/
  data/
  pages/
  types/
  utils/
```

## Notes

This project stores invoice data in browser local storage for quick workshop use. For production deployment, you may want to connect it to a backend or database.

## License

This project is for workshop management demo purposes.

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
- Go + Gin + PostgreSQL + GORM backend integration
- JWT authentication for API-backed workshop data

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

## Workshop API

The repository now includes the Go backend in [`backend/`](./backend). It keeps the original authentication and database foundation from `go-todo-api` and adds authenticated workshop endpoints:

- `GET /invoices`
- `POST /invoices`
- `DELETE /invoices/:id`
- `GET /customers`

### Start the backend

1. Copy `backend/.env.example` to `backend/.env`.
2. Set the PostgreSQL and `JWT_SECRET` values.
3. Start PostgreSQL with Docker Compose or use an existing PostgreSQL server.
4. Run the API:

```bash
cd backend
go run ./cmd
```

The API listens on `http://localhost:8080`.

### Connect the frontend

Copy `.env.example` to `.env` in the project root:

```bash
VITE_API_URL=http://localhost:8080
```

When the API URL is configured, the frontend shows a login/register screen, loads invoice and customer data from the backend, and sends invoice create/delete operations through the API. Without `VITE_API_URL`, the app continues using browser local storage for local-only development.

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

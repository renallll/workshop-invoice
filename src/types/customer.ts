import type { Invoice } from "./invoice";

export interface Customer {
  id: string;

  name: string;
  phone: string;

  vehiclePlate: string;
  vehicleBrand: string;
  vehicleType: string;

  totalVisits: number;
  totalSpent: number;

  lastVisit: string;

  invoices: Invoice[];
}
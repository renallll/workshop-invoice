import type { Customer } from "../types/customer";
import { getInvoices } from "./storage";

export const getCustomers = (): Customer[] => {
  const invoices = getInvoices();

  const map = new Map<string, Customer>();

  invoices.forEach((invoice) => {
    const key = invoice.vehiclePlate.toUpperCase();

    if (!map.has(key)) {
      map.set(key, {
        id: key,
        name: invoice.customerName,
        phone: invoice.customerPhone,
        vehiclePlate: invoice.vehiclePlate,
        vehicleBrand: invoice.vehicleBrand,
        vehicleType: invoice.vehicleType,

        totalVisits: 0,
        totalSpent: 0,

        invoices: [],
      });
    }

    const customer = map.get(key)!;

    customer.totalVisits += 1;
    customer.totalSpent += invoice.total;
    customer.invoices.push(invoice);
  });

  return Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};
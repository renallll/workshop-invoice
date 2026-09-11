import type { Customer } from "../types/customer";
import { getInvoices } from "./storage";

export const getCustomers = (): Customer[] => {
  const invoices = getInvoices();

  const customerMap = new Map<string, Customer>();

  invoices.forEach((invoice) => {
    const key = invoice.vehiclePlate.toUpperCase();

    if (!customerMap.has(key)) {
      customerMap.set(key, {
        id: key,

        name: invoice.customerName,
        phone: invoice.customerPhone,

        vehiclePlate: invoice.vehiclePlate,
        vehicleBrand: invoice.vehicleBrand,
        vehicleType: invoice.vehicleType,

        totalVisits: 0,
        totalSpent: 0,

        lastVisit: invoice.date,

        invoices: [],
      });
    }

    const customer = customerMap.get(key)!;

    customer.totalVisits += 1;
    customer.totalSpent += invoice.total;

    customer.invoices.push(invoice);

    if (invoice.date > customer.lastVisit) {
      customer.lastVisit = invoice.date;
    }
  });

  return Array.from(customerMap.values()).sort(
    (a, b) =>
      b.lastVisit.localeCompare(a.lastVisit)
  );
};
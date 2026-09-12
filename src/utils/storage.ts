import type { Invoice } from "../types/invoice";

const INVOICE_STORAGE_KEY = "workshop_invoices";

export const getInvoices = (): Invoice[] => {
  const data = localStorage.getItem(INVOICE_STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse invoices:", error);
    return [];
  }
};

export const saveInvoices = (invoices: Invoice[]): void => {
  localStorage.setItem(
    INVOICE_STORAGE_KEY,
    JSON.stringify(invoices)
  );
};

export const addInvoice = (invoice: Invoice): void => {
  const invoices = getInvoices();

  invoices.push(invoice);

  saveInvoices(invoices);
};

export const deleteInvoice = (id: string): void => {
  const invoices = getInvoices();

  const filteredInvoices = invoices.filter(
    (invoice) => invoice.id !== id
  );

  saveInvoices(filteredInvoices);
};

export const clearInvoices = (): void => {
  localStorage.removeItem(INVOICE_STORAGE_KEY);
};

export const findVehiclesByPlate = (
  keyword: string
): Invoice[] => {
  if (!keyword.trim()) {
    return [];
  }

  const invoices = getInvoices();

  const uniqueVehicles = new Map<string, Invoice>();

  invoices.forEach((invoice) => {
    if (!invoice.vehiclePlate) {
      return;
    }

    const plate = invoice.vehiclePlate.toUpperCase();

    if (!uniqueVehicles.has(plate)) {
      uniqueVehicles.set(plate, invoice);
    }
  });

  return Array.from(uniqueVehicles.values()).filter(
    (invoice) =>
      invoice.vehiclePlate
        ?.toUpperCase()
        .includes(keyword.toUpperCase())
  );
};

export const getVehicleHistory = (
  plate: string
): Invoice[] => {
  if (!plate.trim()) {
    return [];
  }

  return getInvoices()
    .filter(
      (invoice) =>
        invoice.vehiclePlate?.toUpperCase() ===
        plate.toUpperCase()
    )
    .sort((a, b) =>
      b.date.localeCompare(a.date)
    );
};

export const importInvoices = (
  newInvoices: Invoice[]
): number => {
  const existing = getInvoices();

  const existingNumbers = new Set(
    existing.map((i) => i.invoiceNumber)
  );

  const filtered = newInvoices.filter(
    (i) => !existingNumbers.has(i.invoiceNumber)
  );

  saveInvoices([...existing, ...filtered]);

  return filtered.length;
};
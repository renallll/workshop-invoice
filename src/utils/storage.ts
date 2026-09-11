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
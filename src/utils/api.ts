import type { Customer } from "../types/customer";
import type { Invoice } from "../types/invoice";

const API_URL = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "");
const TOKEN_KEY = "workshop_api_token";

export const isApiConfigured = (): boolean => Boolean(API_URL);

export const isApiEnabled = (): boolean =>
  Boolean(API_URL && localStorage.getItem(TOKEN_KEY));

export const getApiToken = (): string | null =>
  localStorage.getItem(TOKEN_KEY);

export const setApiToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

const request = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  if (!API_URL) {
    throw new Error("VITE_API_URL belum dikonfigurasi.");
  }

  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as
      | { error?: string; message?: string }
      | null;
    throw new Error(
      body?.error ?? body?.message ?? `API request gagal (${response.status}).`
    );
  }

  return response.json() as Promise<T>;
};

export const getApiInvoices = (): Promise<Invoice[]> =>
  request<Invoice[]>("/invoices");

export const registerApi = (
  name: string,
  email: string,
  password: string
): Promise<void> =>
  request("/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  }).then(() => undefined);

export const loginApi = (
  email: string,
  password: string
): Promise<{ token: string }> =>
  request<{ token: string }>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const createApiInvoice = (
  invoice: Invoice
): Promise<Invoice> =>
  request<Invoice>("/invoices", {
    method: "POST",
    body: JSON.stringify(invoice),
  });

export const deleteApiInvoice = (id: string): Promise<void> =>
  request(`/invoices/${id}`, { method: "DELETE" }).then(() => undefined);

export const getApiCustomers = (): Promise<Customer[]> =>
  request<Customer[]>("/customers");

export const syncApiInvoices = async (): Promise<Invoice[] | null> => {
  if (!isApiEnabled()) {
    return null;
  }

  return getApiInvoices();
};

import type { Invoice } from "../types/invoice";
import { getInvoices, saveInvoices } from "./storage";

export const seedInvoices = (): void => {
  const existingInvoices = getInvoices();

  if (existingInvoices.length > 0) {
    return;
  }

  const dummyInvoices: Invoice[] = [
    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-202609-001",
      date: "2026-09-11",

      customerName: "Budi Santoso",
      customerPhone: "081234567890",

      vehiclePlate: "B 1234 ABC",
      vehicleBrand: "Toyota",
      vehicleType: "Avanza",

      mechanic: "Andi",

      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Jasa Service",
          quantity: 1,
          price: 150000,
          total: 150000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Oli Mesin",
          quantity: 1,
          price: 75000,
          total: 75000,
        },
      ],

      subtotal: 225000,
      discount: 0,
      total: 225000,

      paymentMethod: "cash",

      notes: "Service rutin",
    },
    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-202609-002",
      date: "2026-09-11",

      customerName: "Andi Wijaya",
      customerPhone: "082345678901",

      vehiclePlate: "B 5678 XYZ",
      vehicleBrand: "Honda",
      vehicleType: "Brio",

      mechanic: "Rudi",

      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Ganti Oli",
          quantity: 1,
          price: 100000,
          total: 100000,
        },
      ],

      subtotal: 100000,
      discount: 0,
      total: 100000,

      paymentMethod: "qris",

      notes: "",
    },
  ];

  saveInvoices(dummyInvoices);
};
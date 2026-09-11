export interface InvoiceItem {
  id: string;
  type: "service" | "part";
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export type PaymentMethod = "cash" | "qris" | "edc";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;

  customerName: string;
  customerPhone: string;

  vehiclePlate: string;
  vehicleBrand: string;
  vehicleType: string;

  mechanic: string;

  items: InvoiceItem[];

  subtotal: number;
  discount: number;
  total: number;

  paymentMethod: PaymentMethod;

  notes?: string;
}
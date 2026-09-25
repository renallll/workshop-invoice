import type { Invoice, InvoiceItem, PaymentMethod } from "../types/invoice";

const parseNumber = (value: unknown): number => {
  if (value === undefined || value === null || value === "") return 0;
  return Number(String(value).replace(/[^\d.-]/g, "")) || 0;
};

export const importLavenderExcel = async (
  file: File
): Promise<Invoice[]> => {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
  });

  const invoices: Invoice[] = [];

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json<any[]>(sheet, {
      header: 1,
      defval: "",
    });

    let invoiceNumber = `INV-${Date.now()}-${sheetName}`;
    let customerName = "";
    let customerPhone = "";
    let vehiclePlate = "";
    let vehicleBrand = "";
    let vehicleType = "";
    let mechanic = "";
    let date = new Date().toISOString().split("T")[0];
    let paymentMethod: PaymentMethod = "cash";

    const items: InvoiceItem[] = [];

    rows.forEach((row) => {
      const values = row.map((cell) =>
        String(cell).trim()
      );

      const text = values.join(" ").toUpperCase();

      if (text.includes("INVOICE")) {
        const value = values.find(
          (v) => v && !v.toUpperCase().includes("INVOICE")
        );
        if (value) invoiceNumber = value;
      }

      if (text.includes("NAMA")) {
        customerName =
          values[values.length - 1] || customerName;
      }

      if (
        text.includes("NO WA") ||
        text.includes("NO. WA")
      ) {
        customerPhone =
          values[values.length - 1] || customerPhone;
      }

      if (text.includes("PLAT")) {
        vehiclePlate =
          values[values.length - 1] || vehiclePlate;
      }

      if (text.includes("TEKNISI")) {
        mechanic =
          values[values.length - 1] || mechanic;
      }

      if (text.includes("TANGGAL")) {
        const value =
          values[values.length - 1] || "";

        if (value && value !== "#REF!") {
          date = value;
        }
      }

      if (values.length >= 4) {
        const qty = parseNumber(values[1]);
        const price = parseNumber(values[2]);
        const total = parseNumber(values[3]);

        if (
          values[0] &&
          qty > 0 &&
          (price > 0 || total > 0)
        ) {
          items.push({
            id: crypto.randomUUID(),
            type: "service",
            name: values[0],
            quantity: qty,
            price,
            total,
          });
        }
      }
    });

    if (items.length === 0) return;

    const subtotal = items.reduce(
      (sum, item) => sum + item.total,
      0
    );

    invoices.push({
      id: crypto.randomUUID(),
      invoiceNumber,
      date,
      customerName,
      customerPhone,
      vehiclePlate,
      vehicleBrand,
      vehicleType,
      mechanic,
      items,
      subtotal,
      discount: 0,
      total: subtotal,
      paymentMethod,
      notes: "",
    });
  });

  return invoices;
};
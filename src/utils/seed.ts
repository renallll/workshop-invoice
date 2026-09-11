import type { Invoice } from "../types/invoice";
import { getInvoices, saveInvoices } from "../utils/storage";

export const seedInvoices = (): void => {
  const existingInvoices = getInvoices();

  if (existingInvoices.length > 0) {
    return;
  }

  const dummyInvoices: Invoice[] = [
    // =====================================================
    // BUDI SANTOSO - 3 INVOICE
    // =====================================================

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260901-001",
      date: "2026-09-01",
      customerName: "Budi Santoso",
      customerPhone: "081234567890",
      vehiclePlate: "B 1234 ABC",
      vehicleBrand: "Toyota",
      vehicleType: "Avanza",
      mechanic: "Andi",
      notes: "Service rutin",
      paymentMethod: "cash",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Ganti Oli Mesin",
          quantity: 1,
          price: 75000,
          total: 75000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Oli Mesin 4 Liter",
          quantity: 1,
          price: 150000,
          total: 150000,
        },
      ],
      subtotal: 225000,
      discount: 0,
      total: 225000,
    },

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260905-002",
      date: "2026-09-05",
      customerName: "Budi Santoso",
      customerPhone: "081234567890",
      vehiclePlate: "B 1234 ABC",
      vehicleBrand: "Toyota",
      vehicleType: "Avanza",
      mechanic: "Bambang",
      notes: "Rem depan terasa kurang pakem",
      paymentMethod: "qris",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Service Rem Depan",
          quantity: 1,
          price: 100000,
          total: 100000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Brake Pad Depan",
          quantity: 1,
          price: 350000,
          total: 350000,
        },
      ],
      subtotal: 450000,
      discount: 0,
      total: 450000,
    },

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260910-003",
      date: "2026-09-10",
      customerName: "Budi Santoso",
      customerPhone: "081234567890",
      vehiclePlate: "B 1234 ABC",
      vehicleBrand: "Toyota",
      vehicleType: "Avanza",
      mechanic: "Andi",
      notes: "AC kurang dingin",
      paymentMethod: "cash",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Service AC",
          quantity: 1,
          price: 150000,
          total: 150000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Freon AC",
          quantity: 1,
          price: 100000,
          total: 100000,
        },
      ],
      subtotal: 250000,
      discount: 0,
      total: 250000,
    },

    // =====================================================
    // ANDI WIJAYA - 3 INVOICE
    // =====================================================

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260901-004",
      date: "2026-09-01",
      customerName: "Andi Wijaya",
      customerPhone: "082345678901",
      vehiclePlate: "B 5678 XYZ",
      vehicleBrand: "Honda",
      vehicleType: "Brio",
      mechanic: "Bambang",
      notes: "Service ringan",
      paymentMethod: "qris",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Tune Up",
          quantity: 1,
          price: 150000,
          total: 150000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Busi",
          quantity: 1,
          price: 85000,
          total: 85000,
        },
      ],
      subtotal: 235000,
      discount: 0,
      total: 235000,
    },

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260906-005",
      date: "2026-09-06",
      customerName: "Andi Wijaya",
      customerPhone: "082345678901",
      vehiclePlate: "B 5678 XYZ",
      vehicleBrand: "Honda",
      vehicleType: "Brio",
      mechanic: "Andi",
      notes: "Ban depan aus",
      paymentMethod: "cash",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Ganti Ban",
          quantity: 2,
          price: 75000,
          total: 150000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Ban Mobil",
          quantity: 2,
          price: 450000,
          total: 900000,
        },
      ],
      subtotal: 1050000,
      discount: 0,
      total: 1050000,
    },

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260911-006",
      date: "2026-09-11",
      customerName: "Andi Wijaya",
      customerPhone: "082345678901",
      vehiclePlate: "B 5678 XYZ",
      vehicleBrand: "Honda",
      vehicleType: "Brio",
      mechanic: "Bambang",
      notes: "Service AC berkala",
      paymentMethod: "qris",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Cuci Evaporator AC",
          quantity: 1,
          price: 175000,
          total: 175000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Filter AC",
          quantity: 1,
          price: 75000,
          total: 75000,
        },
      ],
      subtotal: 250000,
      discount: 0,
      total: 250000,
    },

    // =====================================================
    // RENALD SIMANJUNTAK - 3 INVOICE
    // =====================================================

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260902-007",
      date: "2026-09-02",
      customerName: "Renald Simanjuntak",
      customerPhone: "083456789012",
      vehiclePlate: "BK 1476 FC",
      vehicleBrand: "Nissan",
      vehicleType: "Livina",
      mechanic: "Andi",
      notes: "Ganti oli dan pemeriksaan kendaraan",
      paymentMethod: "cash",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Ganti Oli Mesin",
          quantity: 1,
          price: 75000,
          total: 75000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Oli Mesin",
          quantity: 1,
          price: 150000,
          total: 150000,
        },
      ],
      subtotal: 225000,
      discount: 0,
      total: 225000,
    },

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260907-008",
      date: "2026-09-07",
      customerName: "Renald Simanjuntak",
      customerPhone: "083456789012",
      vehiclePlate: "BK 1476 FC",
      vehicleBrand: "Nissan",
      vehicleType: "Livina",
      mechanic: "Bambang",
      notes: "Aki mulai lemah",
      paymentMethod: "qris",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Pemasangan Aki",
          quantity: 1,
          price: 50000,
          total: 50000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Aki GS Astra",
          quantity: 1,
          price: 850000,
          total: 850000,
        },
      ],
      subtotal: 900000,
      discount: 0,
      total: 900000,
    },

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260911-009",
      date: "2026-09-11",
      customerName: "Renald Simanjuntak",
      customerPhone: "083456789012",
      vehiclePlate: "BK 1476 FC",
      vehicleBrand: "Nissan",
      vehicleType: "Livina",
      mechanic: "Andi",
      notes: "Pengecekan kaki-kaki",
      paymentMethod: "cash",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Pemeriksaan Kaki-Kaki",
          quantity: 1,
          price: 100000,
          total: 100000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Bushing Arm",
          quantity: 2,
          price: 175000,
          total: 350000,
        },
      ],
      subtotal: 450000,
      discount: 0,
      total: 450000,
    },

    // =====================================================
    // ANGGA PRATAMA - 2 INVOICE
    // =====================================================

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260903-010",
      date: "2026-09-03",
      customerName: "Angga Pratama",
      customerPhone: "084567890123",
      vehiclePlate: "B 1234 FH",
      vehicleBrand: "BMW",
      vehicleType: "X1",
      mechanic: "Andi",
      notes: "Service berkala",
      paymentMethod: "qris",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "General Check Up",
          quantity: 1,
          price: 250000,
          total: 250000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Oli Mesin BMW",
          quantity: 1,
          price: 400000,
          total: 400000,
        },
      ],
      subtotal: 650000,
      discount: 0,
      total: 650000,
    },

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260909-011",
      date: "2026-09-09",
      customerName: "Angga Pratama",
      customerPhone: "084567890123",
      vehiclePlate: "B 1234 FH",
      vehicleBrand: "BMW",
      vehicleType: "X1",
      mechanic: "Bambang",
      notes: "Rem belakang berbunyi",
      paymentMethod: "edc",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Service Rem Belakang",
          quantity: 1,
          price: 200000,
          total: 200000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Brake Pad Belakang",
          quantity: 1,
          price: 550000,
          total: 550000,
        },
      ],
      subtotal: 750000,
      discount: 0,
      total: 750000,
    },

    // =====================================================
    // JUAN FERNANDO - 2 INVOICE
    // =====================================================

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260903-012",
      date: "2026-09-03",
      customerName: "Juan Fernando",
      customerPhone: "085678901234",
      vehiclePlate: "B 2344 JH",
      vehicleBrand: "Nissan",
      vehicleType: "Livina",
      mechanic: "Andi",
      notes: "Service rutin",
      paymentMethod: "edc",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Ganti Oli",
          quantity: 1,
          price: 75000,
          total: 75000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Oli Mesin",
          quantity: 1,
          price: 150000,
          total: 150000,
        },
      ],
      subtotal: 225000,
      discount: 0,
      total: 225000,
    },

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260908-013",
      date: "2026-09-08",
      customerName: "Juan Fernando",
      customerPhone: "085678901234",
      vehiclePlate: "B 2344 JH",
      vehicleBrand: "Nissan",
      vehicleType: "Livina",
      mechanic: "Bambang",
      notes: "AC kurang dingin",
      paymentMethod: "qris",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Service AC",
          quantity: 1,
          price: 150000,
          total: 150000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Freon",
          quantity: 1,
          price: 100000,
          total: 100000,
        },
      ],
      subtotal: 250000,
      discount: 0,
      total: 250000,
    },

    // =====================================================
    // DIMAS SAPUTRA - 2 INVOICE
    // =====================================================

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260904-014",
      date: "2026-09-04",
      customerName: "Dimas Saputra",
      customerPhone: "086789012345",
      vehiclePlate: "D 3456 KLM",
      vehicleBrand: "Daihatsu",
      vehicleType: "Xenia",
      mechanic: "Andi",
      notes: "Tune up kendaraan",
      paymentMethod: "cash",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Tune Up",
          quantity: 1,
          price: 175000,
          total: 175000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Busi",
          quantity: 4,
          price: 45000,
          total: 180000,
        },
      ],
      subtotal: 355000,
      discount: 0,
      total: 355000,
    },

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260910-015",
      date: "2026-09-10",
      customerName: "Dimas Saputra",
      customerPhone: "086789012345",
      vehiclePlate: "D 3456 KLM",
      vehicleBrand: "Daihatsu",
      vehicleType: "Xenia",
      mechanic: "Bambang",
      notes: "Ganti filter udara",
      paymentMethod: "qris",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Pembersihan Throttle Body",
          quantity: 1,
          price: 125000,
          total: 125000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Filter Udara",
          quantity: 1,
          price: 85000,
          total: 85000,
        },
      ],
      subtotal: 210000,
      discount: 0,
      total: 210000,
    },

    // =====================================================
    // SITI RAHMA - 2 INVOICE
    // =====================================================

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260904-016",
      date: "2026-09-04",
      customerName: "Siti Rahma",
      customerPhone: "087890123456",
      vehiclePlate: "F 7890 QRS",
      vehicleBrand: "Suzuki",
      vehicleType: "Ertiga",
      mechanic: "Andi",
      notes: "Service rutin",
      paymentMethod: "qris",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Ganti Oli",
          quantity: 1,
          price: 75000,
          total: 75000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Oli Mesin",
          quantity: 1,
          price: 150000,
          total: 150000,
        },
      ],
      subtotal: 225000,
      discount: 0,
      total: 225000,
    },

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260910-017",
      date: "2026-09-10",
      customerName: "Siti Rahma",
      customerPhone: "087890123456",
      vehiclePlate: "F 7890 QRS",
      vehicleBrand: "Suzuki",
      vehicleType: "Ertiga",
      mechanic: "Bambang",
      notes: "Ganti wiper",
      paymentMethod: "cash",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Pemasangan Wiper",
          quantity: 1,
          price: 25000,
          total: 25000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Wiper Depan",
          quantity: 2,
          price: 75000,
          total: 150000,
        },
      ],
      subtotal: 175000,
      discount: 0,
      total: 175000,
    },

    // =====================================================
    // KEVIN PRATAMA - 1 INVOICE
    // =====================================================

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260905-018",
      date: "2026-09-05",
      customerName: "Kevin Pratama",
      customerPhone: "088901234567",
      vehiclePlate: "B 9012 TUV",
      vehicleBrand: "Mitsubishi",
      vehicleType: "Xpander",
      mechanic: "Andi",
      notes: "Service berkala",
      paymentMethod: "edc",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Service Berkala",
          quantity: 1,
          price: 250000,
          total: 250000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Oli Mesin",
          quantity: 1,
          price: 225000,
          total: 225000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Filter Oli",
          quantity: 1,
          price: 75000,
          total: 75000,
        },
      ],
      subtotal: 550000,
      discount: 0,
      total: 550000,
    },

    // =====================================================
    // MARIA ELISABETH - 1 INVOICE
    // =====================================================

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260906-019",
      date: "2026-09-06",
      customerName: "Maria Elisabeth",
      customerPhone: "089012345678",
      vehiclePlate: "B 6789 WXY",
      vehicleBrand: "Hyundai",
      vehicleType: "Creta",
      mechanic: "Bambang",
      notes: "Service AC dan pengecekan kendaraan",
      paymentMethod: "cash",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Service AC",
          quantity: 1,
          price: 175000,
          total: 175000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Filter AC",
          quantity: 1,
          price: 75000,
          total: 75000,
        },
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "General Check Up",
          quantity: 1,
          price: 100000,
          total: 100000,
        },
      ],
      subtotal: 350000,
      discount: 0,
      total: 350000,
    },

    // =====================================================
    // FAJAR HIDAYAT - 1 INVOICE
    // =====================================================

    {
      id: crypto.randomUUID(),
      invoiceNumber: "INV-20260907-020",
      date: "2026-09-07",
      customerName: "Fajar Hidayat",
      customerPhone: "089123456789",
      vehiclePlate: "B 4567 ZAB",
      vehicleBrand: "Wuling",
      vehicleType: "Almaz",
      mechanic: "Andi",
      notes: "Pemeriksaan mesin",
      paymentMethod: "qris",
      items: [
        {
          id: crypto.randomUUID(),
          type: "service",
          name: "Diagnostic Check",
          quantity: 1,
          price: 120000,
          total: 120000,
        },
        {
          id: crypto.randomUUID(),
          type: "part",
          name: "Filter Udara",
          quantity: 1,
          price: 50000,
          total: 50000,
        },
      ],
      subtotal: 170000,
      discount: 0,
      total: 170000,
    },
  ];

  saveInvoices(dummyInvoices);
};

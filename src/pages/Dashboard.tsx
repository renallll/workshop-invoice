import { useMemo } from "react";
import { getInvoices } from "../utils/storage";
import type { Invoice } from "../types/invoice";
import { getCustomers } from "../utils/customer";

interface DashboardProps {
  onSelectInvoice: (invoice: Invoice) => void;
}

function Dashboard({
  onSelectInvoice,
}: DashboardProps) {
  
  const invoices = useMemo(() => getInvoices(), []);
  const customers = useMemo(() => getCustomers(), []);
  const totalRevenue = invoices.reduce(
    (total, invoice) => total + invoice.total,
    0
  );

  const today = new Date().toISOString().split("T")[0];

  const todayInvoices = invoices.filter(
    (invoice) => invoice.date === today
  );

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Invoice</span>
          <strong>{invoices.length}</strong>
        </div>

        <div className="stat-card">
          <span>Invoice Hari Ini</span>
          <strong>{todayInvoices.length}</strong>
        </div>
        <div className="stat-card">
          <span>Total Customer</span>
          <strong>{customers.length}</strong>
        </div>
        <div className="stat-card">
          <span>Total Pendapatan</span>
          <strong>
            Rp {totalRevenue.toLocaleString("id-ID")}
          </strong>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Invoice Terbaru</h2>

      <div className="dashboard-section" style={{ marginTop: 24 }}>
        <h2>Customer Terbaru</h2>

        <div className="invoice-list">
          {customers.slice(0, 5).map((customer) => (
            <div
              className="invoice-row"
              key={customer.id}
            >
              <div>
                <strong>{customer.name}</strong>
                <p>{customer.vehiclePlate}</p>
              </div>

              <strong>{customer.totalVisits}x</strong>
            </div>
          ))}
        </div>
      </div>
        <div className="invoice-list">
          {invoices.slice(-5).reverse().map((invoice) => (
            <button
              className="invoice-row"
              key={invoice.id}
              onClick={() => onSelectInvoice(invoice)}
            >
              <div>
                <strong>{invoice.invoiceNumber}</strong>
                <p>{invoice.customerName}</p>
              </div>

              <strong>
                Rp {invoice.total.toLocaleString("id-ID")}
              </strong>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
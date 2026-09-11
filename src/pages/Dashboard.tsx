import { useMemo } from "react";
import { getInvoices } from "../utils/storage";
import type { Invoice } from "../types/invoice";

interface DashboardProps {
  onSelectInvoice: (invoice: Invoice) => void;
}

function Dashboard({
  onSelectInvoice,
}: DashboardProps) {
  
  const invoices = useMemo(() => getInvoices(), []);

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
          <span>Total Pendapatan</span>
          <strong>
            Rp {totalRevenue.toLocaleString("id-ID")}
          </strong>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Invoice Terbaru</h2>

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
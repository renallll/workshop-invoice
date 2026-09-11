import type { Customer } from "../types/customer";

interface CustomerDetailProps {
  customer: Customer;
  onBack: () => void;
}

function CustomerDetail({
  customer,
  onBack,
}: CustomerDetailProps) {
  return (
    <div>
      <div className="detail-header">
        <div>
          <button
            type="button"
            className="back-button"
            onClick={onBack}
          >
            ← Kembali
          </button>

          <h2>{customer.name}</h2>
          <p>Riwayat Servis Kendaraan</p>
        </div>
      </div>

      <div className="invoice-detail">
        <div className="detail-grid">
          <div className="detail-section">
            <h3>Informasi Customer</h3>

            <div className="detail-item">
              <span>Nama</span>
              <strong>{customer.name}</strong>
            </div>

            <div className="detail-item">
              <span>Telepon</span>
              <strong>{customer.phone || "-"}</strong>
            </div>
          </div>

          <div className="detail-section">
            <h3>Kendaraan</h3>

            <div className="detail-item">
              <span>Plat</span>
              <strong>{customer.vehiclePlate}</strong>
            </div>

            <div className="detail-item">
              <span>Merek</span>
              <strong>{customer.vehicleBrand || "-"}</strong>
            </div>

            <div className="detail-item">
              <span>Tipe</span>
              <strong>{customer.vehicleType || "-"}</strong>
            </div>
          </div>
        </div>

        <div className="summary-section">
          <div className="payment-info">
            <h3>Statistik Customer</h3>

            <div className="payment-method">
              <span>Servis Terakhir</span>
              <strong>{customer.lastVisit}</strong>
            </div>
          </div>

          <div className="invoice-summary">
            <div>
              <span>Total Kunjungan</span>
              <strong>{customer.totalVisits}</strong>
            </div>

            <div className="grand-total">
              <span>Total Pengeluaran</span>
              <strong>
                Rp{" "}
                {customer.totalSpent.toLocaleString("id-ID")}
              </strong>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Riwayat Invoice</h3>

          <div className="detail-table-wrapper">
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Tanggal</th>
                  <th>Mekanik</th>
                  <th>Pembayaran</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {customer.invoices
                  .slice()
                  .sort((a, b) =>
                    b.date.localeCompare(a.date)
                  )
                  .map((invoice) => (
                    <tr key={invoice.id}>
                      <td>{invoice.invoiceNumber}</td>
                      <td>{invoice.date}</td>
                      <td>{invoice.mechanic || "-"}</td>
                      <td>
                        {invoice.paymentMethod
                          ? invoice.paymentMethod.toUpperCase()
                          : "-"}
                      </td>
                      <td>
                        Rp{" "}
                        {invoice.total.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="invoice-footer">
          <p>Customer Summary</p>
          <strong>Lavender Car Solution</strong>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetail;
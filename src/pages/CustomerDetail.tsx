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
      <button
        className="back-button"
        onClick={onBack}
      >
        ← Kembali
      </button>

      <div className="invoice-detail">
        <h2>{customer.name}</h2>

        <div className="detail-grid">
          <div className="detail-section">
            <h3>Informasi Customer</h3>

            <div className="detail-item">
              <span>Telepon</span>
              <strong>{customer.phone}</strong>
            </div>

            <div className="detail-item">
              <span>Plat</span>
              <strong>
                {customer.vehiclePlate}
              </strong>
            </div>

            <div className="detail-item">
              <span>Kendaraan</span>
              <strong>
                {customer.vehicleBrand}{" "}
                {customer.vehicleType}
              </strong>
            </div>
          </div>

          <div className="detail-section">
            <h3>Statistik</h3>

            <div className="detail-item">
              <span>Total Servis</span>
              <strong>
                {customer.totalVisits}
              </strong>
            </div>

            <div className="detail-item">
              <span>Total Pengeluaran</span>
              <strong>
                Rp{" "}
                {customer.totalSpent.toLocaleString(
                  "id-ID"
                )}
              </strong>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Riwayat Servis</h3>

          <div className="invoice-list">
            {customer.invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="invoice-row"
              >
                <div>
                  <strong>
                    {invoice.invoiceNumber}
                  </strong>

                  <p>{invoice.date}</p>
                </div>

                <strong>
                  Rp{" "}
                  {invoice.total.toLocaleString(
                    "id-ID"
                  )}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetail;
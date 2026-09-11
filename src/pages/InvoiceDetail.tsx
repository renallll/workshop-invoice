import type {
  Invoice,
  PaymentMethod,
} from "../types/invoice";

interface InvoiceDetailProps {
  invoice: Invoice;
  onBack: () => void;
}

function InvoiceDetail({
  invoice,
  onBack,
}: InvoiceDetailProps) {
  const paymentLabel: Record<PaymentMethod, string> = {
    cash: "Cash",
    qris: "QRIS",
    edc: "EDC",
    };

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

          <h2>Detail Invoice</h2>
          <p>{invoice.invoiceNumber}</p>
        </div>

        <button
          type="button"
          className="print-button"
          onClick={() => window.print()}
        >
          Cetak Invoice
        </button>
      </div>

      <div className="invoice-detail">
        {/* Header Invoice */}
        <div className="invoice-header">
          <div>
            <h1>Lavender Car Solution</h1>
            <p>Workshop & Automotive Service</p>
          </div>

          <div className="invoice-number">
            <span>Invoice</span>
            <strong>{invoice.invoiceNumber}</strong>
            <small>{invoice.date}</small>
          </div>
        </div>

        {/* Customer & Vehicle */}
        <div className="detail-grid">
          <div className="detail-section">
            <h3>Pelanggan</h3>

            <div className="detail-item">
              <span>Nama</span>
              <strong>{invoice.customerName}</strong>
            </div>

            <div className="detail-item">
              <span>Telepon</span>
              <strong>
                {invoice.customerPhone || "-"}
              </strong>
            </div>
          </div>

          <div className="detail-section">
            <h3>Kendaraan</h3>

            <div className="detail-item">
              <span>Nomor Plat</span>
              <strong>{invoice.vehiclePlate}</strong>
            </div>

            <div className="detail-item">
              <span>Merek</span>
              <strong>
                {invoice.vehicleBrand || "-"}
              </strong>
            </div>

            <div className="detail-item">
              <span>Tipe</span>
              <strong>
                {invoice.vehicleType || "-"}
              </strong>
            </div>

            <div className="detail-item">
              <span>Mekanik</span>
              <strong>
                {invoice.mechanic || "-"}
              </strong>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="detail-section">
          <h3>Detail Pekerjaan & Spare Part</h3>

          <div className="detail-table-wrapper">
            <table className="detail-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tipe</th>
                  <th>Nama</th>
                  <th>Qty</th>
                  <th>Harga</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>

                    <td>
                      {item.type === "service"
                        ? "Jasa"
                        : "Spare Part"}
                    </td>

                    <td>{item.name}</td>

                    <td>{item.quantity}</td>

                    <td>
                      Rp{" "}
                      {item.price.toLocaleString("id-ID")}
                    </td>

                    <td>
                      Rp{" "}
                      {item.total.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment & Total */}
        <div className="summary-section">
          <div className="payment-info">
            <h3>Pembayaran</h3>

            <div className="payment-method">
              <span>Metode Pembayaran</span>

              <strong>
                {paymentLabel[invoice.paymentMethod]}
              </strong>
            </div>
          </div>

          <div className="invoice-summary">
            <div>
              <span>Subtotal</span>
              <strong>
                Rp{" "}
                {invoice.subtotal.toLocaleString("id-ID")}
              </strong>
            </div>

            <div>
              <span>Diskon</span>
              <strong>
                Rp{" "}
                {invoice.discount.toLocaleString("id-ID")}
              </strong>
            </div>

            <div className="grand-total">
              <span>Total</span>
              <strong>
                Rp {invoice.total.toLocaleString("id-ID")}
              </strong>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="notes-section">
            <h3>Catatan</h3>
            <p>{invoice.notes}</p>
          </div>
        )}

        <div className="invoice-footer">
          <p>Terima kasih telah menggunakan layanan</p>
          <strong>Lavender Car Solution</strong>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetail;
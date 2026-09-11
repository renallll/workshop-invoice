import { useState } from "react";
import type { InvoiceItem, PaymentMethod } from "../types/invoice";
import { addInvoice } from "../utils/storage";


function CreateInvoice() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [mechanic, setMechanic] = useState("");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<InvoiceItem[]>([]);

  const [itemType, setItemType] = useState<"service" | "part">("service");
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemPrice, setItemPrice] = useState(0);

  const subtotal = items.reduce(
    (total, item) => total + item.total,
    0
  );

  const addItem = () => {
    if (!itemName.trim()) {
      alert("Nama jasa atau spare part wajib diisi.");
      return;
    }

    if (itemQuantity <= 0) {
      alert("Qty harus lebih dari 0.");
      return;
    }

    if (itemPrice < 0) {
      alert("Harga tidak boleh negatif.");
      return;
    }

    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      type: itemType,
      name: itemName,
      quantity: itemQuantity,
      price: itemPrice,
      total: itemQuantity * itemPrice,
    };

    setItems([...items, newItem]);

    setItemName("");
    setItemQuantity(1);
    setItemPrice(0);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!customerName.trim()) {
      alert("Nama pelanggan wajib diisi.");
      return;
    }

    if (!vehiclePlate.trim()) {
      alert("Nomor plat kendaraan wajib diisi.");
      return;
    }

    if (items.length === 0) {
      alert("Tambahkan minimal satu jasa atau spare part.");
      return;
    }

    const now = new Date();

    const invoice = {
      id: crypto.randomUUID(),
      invoiceNumber: `INV-${now.getFullYear()}${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(
        Math.floor(Math.random() * 999) + 1
      ).padStart(3, "0")}`,

      date: now.toISOString().split("T")[0],

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

      notes,
    };

    addInvoice(invoice);

    alert(
      `Invoice ${invoice.invoiceNumber} berhasil disimpan.`
    );

    setCustomerName("");
    setCustomerPhone("");
    setVehiclePlate("");
    setVehicleBrand("");
    setVehicleType("");
    setMechanic("");
    setNotes("");
    setItems([]);
    setPaymentMethod("cash");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Buat Invoice</h2>
          <p>Buat invoice baru untuk pelanggan.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-card">
          <h3>Data Pelanggan</h3>

          <div className="form-grid">
            <div className="form-group">
              <label>Nama Pelanggan *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(e.target.value)
                }
                placeholder="Contoh: Budi Santoso"
              />
            </div>

            <div className="form-group">
              <label>Nomor Telepon</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) =>
                  setCustomerPhone(e.target.value)
                }
                placeholder="Contoh: 081234567890"
              />
            </div>
          </div>
        </div>

        <div className="form-card">
          <h3>Data Kendaraan</h3>

          <div className="form-grid">
            <div className="form-group">
              <label>Nomor Plat *</label>
              <input
                type="text"
                value={vehiclePlate}
                onChange={(e) =>
                  setVehiclePlate(e.target.value.toUpperCase())
                }
                placeholder="B 1234 ABC"
              />
            </div>

            <div className="form-group">
              <label>Merek</label>
              <input
                type="text"
                value={vehicleBrand}
                onChange={(e) =>
                  setVehicleBrand(e.target.value)
                }
                placeholder="Toyota"
              />
            </div>

            <div className="form-group">
              <label>Tipe Kendaraan</label>
              <input
                type="text"
                value={vehicleType}
                onChange={(e) =>
                  setVehicleType(e.target.value)
                }
                placeholder="Avanza"
              />
            </div>

            <div className="form-group">
              <label>Mekanik</label>
              <input
                type="text"
                value={mechanic}
                onChange={(e) =>
                  setMechanic(e.target.value)
                }
                placeholder="Nama mekanik"
              />
            </div>
          </div>
        </div>

        <div className="form-card">
          <h3>Jasa & Spare Part</h3>

          <div className="item-input-grid">
            <div className="form-group">
              <label>Tipe</label>
              <select
                value={itemType}
                onChange={(e) =>
                  setItemType(
                    e.target.value as "service" | "part"
                  )
                }
              >
                <option value="service">Jasa</option>
                <option value="part">Spare Part</option>
              </select>
            </div>

            <div className="form-group">
              <label>Nama</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) =>
                  setItemName(e.target.value)
                }
                placeholder="Contoh: Ganti Oli"
              />
            </div>

            <div className="form-group">
              <label>Qty</label>
              <input
                type="number"
                min="1"
                value={itemQuantity}
                onChange={(e) =>
                  setItemQuantity(Number(e.target.value))
                }
              />
            </div>

            <div className="form-group">
              <label>Harga</label>
              <input
                type="number"
                min="0"
                value={itemPrice}
                onChange={(e) =>
                  setItemPrice(Number(e.target.value))
                }
              />
            </div>

            <button
              type="button"
              className="add-item-button"
              onClick={addItem}
            >
              + Tambah
            </button>
          </div>

          {items.length > 0 && (
            <div className="items-table">
              <table>
                <thead>
                  <tr>
                    <th>Tipe</th>
                    <th>Nama</th>
                    <th>Qty</th>
                    <th>Harga</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.type === "service"
                          ? "Jasa"
                          : "Spare Part"}
                      </td>

                      <td>{item.name}</td>

                      <td>{item.quantity}</td>

                      <td>
                        Rp {item.price.toLocaleString("id-ID")}
                      </td>

                      <td>
                        Rp {item.total.toLocaleString("id-ID")}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            removeItem(item.id)
                          }
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="form-card">
        <h3>Pembayaran</h3>

        <div className="form-group">
            <label>Jenis Pembayaran *</label>

            <select
            value={paymentMethod}
            onChange={(e) =>
                setPaymentMethod(
                e.target.value as PaymentMethod
                )
            }
            >
            <option value="cash">Cash</option>
            <option value="qris">QRIS</option>
            <option value="edc">EDC</option>
            </select>
        </div>
        </div>
        <div className="form-card">
          <h3>Catatan</h3>

          <div className="form-group">
            <textarea
              rows={4}
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              placeholder="Catatan tambahan untuk invoice..."
            />
          </div>
        </div>

        <div className="total-card">
          <span>Subtotal</span>

          <strong>
            Rp {subtotal.toLocaleString("id-ID")}
          </strong>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-button">
            Simpan Invoice
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateInvoice;
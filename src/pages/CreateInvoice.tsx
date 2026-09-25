import { useState } from "react";
import type { InvoiceItem, PaymentMethod } from "../types/invoice";
import {
  addInvoice,
  findVehiclesByPlate,
  getVehicleHistory,
} from "../utils/storage";
import {
  vehicleData,
  type VehicleBrand,
} from "../data/vehicleData";
import {
  getVehicleStatus,
  getVehicleStatusLabel,
} from "../utils/vehicleStatus";
import { createApiInvoice, isApiEnabled } from "../utils/api";

function CreateInvoice() {
  const [discount, setDiscount] = useState(0);

const [discountType, setDiscountType] =
  useState<"rupiah" | "percent">("rupiah");

const [serviceFee, setServiceFee] =
  useState(0);
  // =========================
  // CUSTOMER
  // =========================
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // =========================
  // VEHICLE
  // =========================
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleBrand, setVehicleBrand] =
    useState<VehicleBrand | "">("");
  const [vehicleType, setVehicleType] = useState("");

  // =========================
  // OTHER
  // =========================
  const [mechanic, setMechanic] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cash");

  // =========================
  // PLATE SUGGESTIONS
  // =========================
  const [plateSuggestions, setPlateSuggestions] =
    useState<ReturnType<typeof findVehiclesByPlate>>([]);

  const [showSuggestions, setShowSuggestions] =
    useState(false);

  // =========================
  // ITEMS
  // =========================
  const [items, setItems] = useState<InvoiceItem[]>([]);

  const [itemType, setItemType] =
    useState<"service" | "part">("service");

  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemPrice, setItemPrice] = useState(0);
 
  // =========================
  // VEHICLE DATA
  // ========================= 
  const brands = Object.keys(vehicleData) as VehicleBrand[];

  const vehicleTypes =
    vehicleBrand && vehicleData[vehicleBrand]
      ? vehicleData[vehicleBrand]
      : [];

  const vehicleHistory = getVehicleHistory(vehiclePlate);

  const latestInvoice = vehicleHistory[0];

  const vehicleStatus = latestInvoice
    ? getVehicleStatus(latestInvoice.date)
    : "inactive";

  const statusLabel =
    getVehicleStatusLabel(vehicleStatus);
  // =========================
  // TOTAL
  // =========================
  const subtotal = items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const discountAmount =
    discountType === "percent"
      ? Math.round((subtotal * discount) / 100)
      : discount;

  const total = Math.max(
    subtotal - discountAmount + serviceFee,
    0
  );

  // =========================
  // PLATE CHANGE
  // =========================
  const handlePlateChange = (
    value: string
  ) => {
    const plate = value.toUpperCase();

    setVehiclePlate(plate);

    // Kosongkan suggestion ketika input kosong
    if (!plate.trim()) {
      setPlateSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const results =
      findVehiclesByPlate(plate);

    setPlateSuggestions(results);

    // Hanya tampilkan dropdown jika ada kendaraan
    setShowSuggestions(results.length > 0);
  };

  // =========================
  // SELECT EXISTING VEHICLE
  // =========================
  const handleSelectVehicle = (
    vehicle: ReturnType<typeof findVehiclesByPlate>[number]
  ) => {
    setVehiclePlate(
      vehicle.vehiclePlate.toUpperCase()
    );

    setCustomerName(
      vehicle.customerName
    );

    setCustomerPhone(
      vehicle.customerPhone || ""
    );

    /*
     * Data lama mungkin menggunakan:
     * "toyota" / "Toyota"
     *
     * Kita cocokkan dengan key vehicleData
     * agar tidak menyebabkan error.
     */
    const matchedBrand =
      brands.find(
        (brand) =>
          brand.toLowerCase() ===
          vehicle.vehicleBrand?.toLowerCase()
      );

    if (matchedBrand) {
      setVehicleBrand(matchedBrand);

      /*
       * Tipe dari invoice lama tetap digunakan
       * jika tersedia.
       */
      const matchedType =
        vehicleData[matchedBrand].find(
          (type) =>
            type.toLowerCase() ===
            vehicle.vehicleType?.toLowerCase()
        );

      setVehicleType(
        matchedType ?? vehicle.vehicleType ?? ""
      );
    } else {
      /*
       * Kalau brand kendaraan lama tidak ada
       * di vehicleData, jangan membuat aplikasi crash.
       */
      setVehicleBrand("");
      setVehicleType(
        vehicle.vehicleType || ""
      );
    }

    setShowSuggestions(false);
    setPlateSuggestions([]);
  };

  // =========================
  // BRAND CHANGE
  // =========================
  const handleBrandChange = (
    brand: VehicleBrand | ""
  ) => {
    setVehicleBrand(brand);

    // Ketika merek berubah, tipe harus dipilih ulang
    setVehicleType("");
  };

  // =========================
  // ADD ITEM
  // =========================
  const addItem = () => {
    if (!itemName.trim()) {
      alert(
        "Nama jasa atau spare part wajib diisi."
      );
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

    setItems([
      ...items,
      newItem,
    ]);

    setItemName("");
    setItemQuantity(1);
    setItemPrice(0);
  };

  // =========================
  // REMOVE ITEM
  // =========================
  const removeItem = (
    id: string
  ) => {
    setItems(
      items.filter(
        (item) => item.id !== id
      )
    );
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!customerName.trim()) {
      alert(
        "Nama pelanggan wajib diisi."
      );
      return;
    }

    if (!vehiclePlate.trim()) {
      alert(
        "Nomor plat kendaraan wajib diisi."
      );
      return;
    }

    if (!vehicleBrand) {
      alert(
        "Merek mobil wajib dipilih."
      );
      return;
    }

    if (!vehicleType) {
      alert(
        "Tipe kendaraan wajib dipilih."
      );
      return;
    }

    if (items.length === 0) {
      alert(
        "Tambahkan minimal satu jasa atau spare part."
      );
      return;
    }

    const now = new Date();
    const randomSequence = crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 3)
      .toUpperCase();

    const invoice = {
      id: crypto.randomUUID(),

      invoiceNumber: `INV-${now.getFullYear()}${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${randomSequence}`,

      date: now
        .toISOString()
        .split("T")[0],

      customerName:
        customerName.trim(),

      customerPhone:
        customerPhone.trim(),

      vehiclePlate:
        vehiclePlate.trim().toUpperCase(),

      vehicleBrand,

      vehicleType,

      mechanic:
        mechanic.trim(),

      items,

      subtotal,
      discount: discountAmount,
      total,
      paymentMethod,

      notes:
        notes.trim(),
    };

    try {
      if (isApiEnabled()) {
        const savedInvoice = await createApiInvoice(invoice);
        addInvoice(savedInvoice);
      } else {
        addInvoice(invoice);
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Invoice gagal disimpan."
      );
      return;
    }

    alert(
      `Invoice ${invoice.invoiceNumber} berhasil disimpan.`
    );

    // =========================
    // RESET FORM
    // =========================
    setCustomerName("");
    setCustomerPhone("");
    setVehiclePlate("");
    setVehicleBrand("");
    setVehicleType("");
    setMechanic("");
    setNotes("");
    setItems([]);
    setPaymentMethod("cash");

    setDiscount(0);
    setDiscountType("rupiah");
    setServiceFee(0);

    setPlateSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div>
      {/* =========================
          HEADER
      ========================= */}
      <div className="page-header">
        <div>
          <h2>Buat Invoice</h2>
          <p>
            Buat invoice baru untuk pelanggan.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        {/* =========================
            DATA PELANGGAN
        ========================= */}
        <div className="form-card">
          <h3>Data Pelanggan</h3>

          <div className="form-grid">

            <div className="form-group">
              <label>
                Nama Pelanggan *
              </label>

              <input
                type="text"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(
                    e.target.value
                  )
                }
                placeholder="Contoh: Budi Santoso"
              />
            </div>

            <div className="form-group">
              <label>
                Nomor Telepon
              </label>

              <input
                type="text"
                value={customerPhone}
                onChange={(e) =>
                  setCustomerPhone(
                    e.target.value
                  )
                }
                placeholder="Contoh: 081234567890"
              />
            </div>

          </div>
        </div>

        {/* =========================
            DATA KENDARAAN
        ========================= */}
        <div className="form-card">
          <h3>Data Kendaraan</h3>

          {vehicleHistory.length > 0 && (
            <div className={`vehicle-status ${vehicleStatus}`}>
              {statusLabel.emoji} {statusLabel.text}
            </div>
          )}
          <div className="form-grid">
            {/* PLAT */}
            <div className="form-group plate-search">
              <label>
                Nomor Plat *
              </label>

              <input
                type="text"
                value={vehiclePlate}
                placeholder="B 1234 ABC"
                onChange={(event) =>
                  handlePlateChange(
                    event.target.value
                  )
                }
                onFocus={() => {
                  if (
                    plateSuggestions.length > 0
                  ) {
                    setShowSuggestions(true);
                  }
                }}
              />

              {/* DROPDOWN PLAT */}
              {showSuggestions &&
                plateSuggestions.length > 0 && (
                  <div className="plate-dropdown">

                    {plateSuggestions.map(
                      (vehicle) => (
                        <button
                          key={vehicle.id}
                          type="button"
                          className="plate-option"
                          onClick={() =>
                            handleSelectVehicle(
                              vehicle
                            )
                          }
                        >
                          <strong>
                            {
                              vehicle.vehiclePlate
                            }
                          </strong>

                          <span>
                            {
                              vehicle.customerName
                            }
                          </span>

                          <small>
                            {
                              vehicle.vehicleBrand
                            }{" "}
                            {
                              vehicle.vehicleType
                            }
                          </small>
                        </button>
                      )
                    )}

                  </div>
                )}
            </div>

            {/* MEREK */}
            <div className="form-group">
              <label>
                Merek Mobil *
              </label>

              <select
                value={vehicleBrand}
                onChange={(event) =>
                  handleBrandChange(
                    event.target
                      .value as
                      | VehicleBrand
                      | ""
                  )
                }
              >
                <option value="">
                  Pilih Merek
                </option>

                {brands.map(
                  (brand) => (
                    <option
                      key={brand}
                      value={brand}
                    >
                      {brand}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* TIPE */}
            <div className="form-group">
              <label>
                Tipe Kendaraan *
              </label>

              <select
                value={vehicleType}
                disabled={!vehicleBrand}
                onChange={(event) =>
                  setVehicleType(
                    event.target.value
                  )
                }
              >
                <option value="">
                  {vehicleBrand
                    ? "Pilih Tipe Kendaraan"
                    : "Pilih merek terlebih dahulu"}
                </option>

                {vehicleTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* MEKANIK */}
            <div className="form-group">
              <label>
                Mekanik
              </label>

              <input
                type="text"
                value={mechanic}
                onChange={(e) =>
                  setMechanic(
                    e.target.value
                  )
                }
                placeholder="Nama mekanik"
              />
            </div>

          </div>
        </div>

        {/* =========================
            JASA & SPARE PART
        ========================= */}
        <div className="form-card">
          <h3>
            Jasa & Spare Part
          </h3>

          <div className="item-input-grid">

            <div className="form-group">
              <label>
                Tipe
              </label>

              <select
                value={itemType}
                onChange={(e) =>
                  setItemType(
                    e.target.value as
                      | "service"
                      | "part"
                  )
                }
              >
                <option value="service">
                  Jasa
                </option>

                <option value="part">
                  Spare Part
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Nama
              </label>

              <input
                type="text"
                value={itemName}
                onChange={(e) =>
                  setItemName(
                    e.target.value
                  )
                }
                placeholder="Contoh: Ganti Oli"
              />
            </div>

            <div className="form-group">
              <label>
                Qty
              </label>

              <input
                type="number"
                min="1"
                value={itemQuantity}
                onChange={(e) =>
                  setItemQuantity(
                    Number(
                      e.target.value
                    )
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>
                Harga
              </label>

              <input
                type="number"
                min="0"
                value={itemPrice}
                onChange={(e) =>
                  setItemPrice(
                    Number(
                      e.target.value
                    )
                  )
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

          {/* TABLE ITEMS */}
          {items.length > 0 && (
            <div className="items-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      Tipe
                    </th>
                    <th>
                      Nama
                    </th>
                    <th>
                      Qty
                    </th>
                    <th>
                      Harga
                    </th>
                    <th>
                      Total
                    </th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {items.map(
                    (item) => (
                      <tr
                        key={item.id}
                      >
                        <td>
                          {item.type ===
                          "service"
                            ? "Jasa"
                            : "Spare Part"}
                        </td>

                        <td>
                          {item.name}
                        </td>

                        <td>
                          {item.quantity}
                        </td>

                        <td>
                          Rp{" "}
                          {item.price.toLocaleString(
                            "id-ID"
                          )}
                        </td>

                        <td>
                          Rp{" "}
                          {item.total.toLocaleString(
                            "id-ID"
                          )}
                        </td>

                        <td>
                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              removeItem(
                                item.id
                              )
                            }
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* =========================
            PEMBAYARAN
        ========================= */}
        <div className="form-card">
          <h3>
            Pembayaran
          </h3>

          <div className="form-group">
            <label>
              Jenis Pembayaran *
            </label>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(
                  e.target
                    .value as PaymentMethod
                )
              }
            >
              <option value="cash">
                Cash
              </option>

              <option value="qris">
                QRIS
              </option>

              <option value="edc">
                EDC
              </option>
            </select>
          </div>
          <div className="form-group">
          <label>Diskon</label>

          <div className="discount-group">
            <input
              type="number"
              min={0}
              value={discount}
              onChange={(e) =>
                setDiscount(Number(e.target.value))
              }
              placeholder="0"
            />

            <select
              value={discountType}
              onChange={(e) =>
                setDiscountType(
                  e.target.value as "rupiah" | "percent"
                )
              }
            >
              <option value="rupiah">Rupiah</option>
              <option value="percent">%</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Biaya Tambahan</label>

          <input
            type="number"
            min={0}
            value={serviceFee}
            onChange={(e) =>
              setServiceFee(Number(e.target.value))
            }
            placeholder="0"
          />
        </div>  
        </div>    
        {/* =========================
            CATATAN
        ========================= */}
        <div className="form-card">
          <h3>
            Catatan
          </h3>

          <div className="form-group">
            <textarea
              rows={4}
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              placeholder="Catatan tambahan untuk invoice..."
            />
          </div>
        </div>

        {/* =========================
            TOTAL
        ========================= */}
        <div className="summary-card">
          <div className="summary-row">
            <span>Subtotal</span>

            <strong>
              Rp {subtotal.toLocaleString("id-ID")}
            </strong>
          </div>

          <div className="summary-row">
            <span>
              Diskon
              {discountType === "percent"
                ? ` (${discount}%)`
                : ""}
            </span>

            <strong>
              - Rp {discountAmount.toLocaleString("id-ID")}
            </strong>
          </div>

          <div className="summary-row">
            <span>Biaya Tambahan</span>

            <strong>
              Rp {serviceFee.toLocaleString("id-ID")}
            </strong>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total Bayar</span>

            <strong>
              Rp {total.toLocaleString("id-ID")}
            </strong>
          </div>

          <div className="payment-badge">
            {paymentMethod === "cash" && "💵 Cash"}
            {paymentMethod === "qris" && "📱 QRIS"}
            {paymentMethod === "edc" && "💳 EDC"}
          </div>
        </div>

        {/* =========================
            ACTION
        ========================= */}
        <div className="form-actions">
          <button
            type="submit"
            className="primary-button"
          >
            Simpan Invoice
          </button>
        </div>

      </form>
    </div>
  );
}

export default CreateInvoice;

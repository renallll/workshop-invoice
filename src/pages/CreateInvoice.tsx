import { useState } from "react";
import type { InvoiceItem, PaymentMethod } from "../types/invoice";
import {
  addInvoice,
  findVehiclesByPlate,
} from "../utils/storage";
import {
  vehicleData,
  type VehicleBrand,
} from "../data/vehicleData";

function CreateInvoice() {
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
  const brands = Object.keys(
    vehicleData
  ) as VehicleBrand[];

  const vehicleTypes =
    vehicleBrand && vehicleData[vehicleBrand]
      ? vehicleData[vehicleBrand]
      : [];

  // =========================
  // TOTAL
  // =========================
  const subtotal = items.reduce(
    (total, item) => total + item.total,
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
  const handleSubmit = (
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

    const invoice = {
      id: crypto.randomUUID(),

      invoiceNumber: `INV-${now.getFullYear()}${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(
        Math.floor(
          Math.random() * 999
        ) + 1
      ).padStart(3, "0")}`,

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

      discount: 0,

      total: subtotal,

      paymentMethod,

      notes:
        notes.trim(),
    };

    addInvoice(invoice);

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
        <div className="total-card">
          <span>
            Subtotal
          </span>

          <strong>
            Rp{" "}
            {subtotal.toLocaleString(
              "id-ID"
            )}
          </strong>
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

import {
  useMemo,
  useState,
} from "react";
import type { MouseEvent } from "react";    
import type { Invoice, PaymentMethod } from "../types/invoice";
import { deleteInvoice, getInvoices } from "../utils/storage";
import { deleteApiInvoice, isApiEnabled } from "../utils/api";

interface InvoiceListProps {
  onSelectInvoice: (invoice: Invoice) => void;
  onCreateInvoice: () => void;
}

type DateFilter = "all" | "today" | "week" | "month";

function InvoiceList({
  onSelectInvoice,
  onCreateInvoice,
}: InvoiceListProps) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] =
    useState<DateFilter>("all");
  const [paymentFilter, setPaymentFilter] =
    useState<"all" | PaymentMethod>("all");

  const invoices = useMemo(() => {
    return getInvoices();
  }, []);

  const filteredInvoices = useMemo(() => {
    const now = new Date();

    return invoices
      .filter((invoice) => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
          return true;
        }

        return (
          invoice.invoiceNumber
            .toLowerCase()
            .includes(keyword) ||
          invoice.customerName
            .toLowerCase()
            .includes(keyword) ||
          invoice.vehiclePlate
            .toLowerCase()
            .includes(keyword)
        );
      })
      .filter((invoice) => {
        if (dateFilter === "all") {
          return true;
        }

        const invoiceDate = new Date(invoice.date);

        if (dateFilter === "today") {
          return (
            invoice.date ===
            now.toISOString().split("T")[0]
          );
        }

        if (dateFilter === "week") {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(
            now.getDate() - now.getDay()
          );
          startOfWeek.setHours(0, 0, 0, 0);

          return invoiceDate >= startOfWeek;
        }

        if (dateFilter === "month") {
          return (
            invoiceDate.getMonth() === now.getMonth() &&
            invoiceDate.getFullYear() ===
              now.getFullYear()
          );
        }

        return true;
      })
      .filter((invoice) => {
        if (paymentFilter === "all") {
          return true;
        }

        return invoice.paymentMethod === paymentFilter;
      })
      .reverse();
  }, [
    invoices,
    search,
    dateFilter,
    paymentFilter,
  ]);

  const handleDelete = async (
    event: MouseEvent,
    id: string
  ) => {
    event.stopPropagation();

    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus invoice ini?"
    );

    if (!confirmed) {
      return;
    }

    try {
      if (isApiEnabled()) {
        await deleteApiInvoice(id);
      }
      deleteInvoice(id);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Invoice gagal dihapus."
      );
      return;
    }

    window.location.reload();
  };

  return (
    <div>
        <div className="page-header">
        <div>
            <h2>Daftar Invoice</h2>
            <p>
            Cari dan kelola seluruh invoice bengkel.
            </p>
        </div>

        <button
            type="button"
            className="primary-button"
            onClick={onCreateInvoice}
        >
            + Buat Invoice
        </button>
        </div>

      <div className="filter-card">
        <div className="search-box">
          <input
            type="text"
            placeholder="Cari invoice, customer, atau nomor plat..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="filter-grid">
          <div className="form-group">
            <label>Periode</label>

            <select
              value={dateFilter}
              onChange={(event) =>
                setDateFilter(
                  event.target.value as DateFilter
                )
              }
            >
              <option value="all">Semua</option>
              <option value="today">Hari Ini</option>
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
            </select>
          </div>

          <div className="form-group">
            <label>Metode Pembayaran</label>

            <select
              value={paymentFilter}
              onChange={(event) =>
                setPaymentFilter(
                  event.target.value as
                    | "all"
                    | PaymentMethod
                )
              }
            >
              <option value="all">Semua</option>
              <option value="cash">Cash</option>
              <option value="qris">QRIS</option>
              <option value="edc">EDC</option>
            </select>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>
            Invoice ({filteredInvoices.length})
          </h2>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="empty-state">
            <p>
              Tidak ada invoice yang sesuai dengan
              pencarian.
            </p>
          </div>
        ) : (
          <div className="invoice-list">
            {filteredInvoices.map((invoice) => (
              <button
                type="button"
                className="invoice-row"
                key={invoice.id}
                onClick={() =>
                  onSelectInvoice(invoice)
                }
              >
                <div>
                  <strong>
                    {invoice.invoiceNumber}
                  </strong>

                  <p>
                    {invoice.customerName} •{" "}
                    {invoice.vehiclePlate}
                  </p>

                <small>
                {invoice.date} •{" "}
                {invoice.paymentMethod
                    ? invoice.paymentMethod.toUpperCase()
                    : "-"}
                </small>
                </div>

                <div className="invoice-row-right">
                  <strong>
                    Rp{" "}
                    {invoice.total.toLocaleString(
                      "id-ID"
                    )}
                  </strong>

                  <span
                    className="delete-button"
                    onClick={(event) =>
                      handleDelete(
                        event,
                        invoice.id
                      )
                    }
                  >
                    Hapus
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InvoiceList;
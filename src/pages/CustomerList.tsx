import { useMemo, useState } from "react";
import type { Customer } from "../types/customer";
import { getCustomers } from "../utils/customer";

interface CustomerListProps {
  onSelectCustomer: (customer: Customer) => void;
}

function CustomerList({
  onSelectCustomer,
}: CustomerListProps) {
  const [search, setSearch] = useState("");

  const customers = useMemo(() => getCustomers(), []);

  const filteredCustomers = customers.filter((customer) => {
    const keyword = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(keyword) ||
      customer.phone.toLowerCase().includes(keyword) ||
      customer.vehiclePlate.toLowerCase().includes(keyword)
    );
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Data Customer</h2>
          <p>Kelola data pelanggan bengkel.</p>
        </div>
      </div>

      <div className="filter-card">
        <div className="search-box">
          <input
            placeholder="Cari nama, telepon, atau plat..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>
            Customer ({filteredCustomers.length})
          </h2>
        </div>

        <div className="invoice-list">
          {filteredCustomers.map((customer) => (
            <button
              key={customer.id}
              className="invoice-row"
              onClick={() =>
                onSelectCustomer(customer)
              }
            >
              <div>
                <strong>{customer.name}</strong>

                <p>
                  {customer.vehiclePlate} •{" "}
                  {customer.phone}
                </p>
              </div>

              <div className="invoice-row-right">
                <strong>
                  {customer.totalVisits} Servis
                </strong>

                <small>
                  Rp{" "}
                  {customer.totalSpent.toLocaleString(
                    "id-ID"
                  )}
                </small>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerList;
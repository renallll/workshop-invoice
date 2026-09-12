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

  const filteredCustomers = customers.filter(
    (customer) => {
      const keyword = search.toLowerCase();

      return (
        customer.name
          .toLowerCase()
          .includes(keyword) ||
        customer.phone
          .toLowerCase()
          .includes(keyword) ||
        customer.vehiclePlate
          .toLowerCase()
          .includes(keyword)
      );
    }
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Data Customer</h2>
          <p>
            Riwayat pelanggan berdasarkan
            kendaraan.
          </p>
        </div>
      </div>

      <div className="filter-card">
        <div className="search-box">
          <input
            placeholder="Cari nama, plat, atau telepon..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>
      </div>

      <div className="customer-grid">
        {filteredCustomers.map((customer) => (
          <button
            key={customer.id}
            className="customer-card"
            onClick={() =>
              onSelectCustomer(customer)
            }
          >
            <div className="customer-avatar">
              {customer.name.charAt(0)}
            </div>

            <div className="customer-info">
              <strong>{customer.name}</strong>

              <p>{customer.vehiclePlate}</p>

              <small>
                {customer.vehicleBrand}{" "}
                {customer.vehicleType}
              </small>
            </div>

            <div className="customer-stats">
              <strong>
                {customer.totalVisits}
              </strong>

              <span>Servis</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CustomerList;
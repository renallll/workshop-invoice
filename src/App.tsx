import { useState } from "react";
import "./App.css";

import { seedInvoices } from "./utils/seed";

import Dashboard from "./pages/Dashboard";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceDetail from "./pages/InvoiceDetail";
import InvoiceList from "./pages/InvoiceList";

import type { Invoice } from "./types/invoice";
import CustomerList from "./pages/CustomerList";
import CustomerDetail from "./pages/CustomerDetail";

import type { Customer } from "./types/customer";

function App() {
  const [page, setPage] = useState("dashboard");

  const [selectedInvoice, setSelectedInvoice] =
    useState<Invoice | null>(null);

  const [invoiceMode, setInvoiceMode] =
    useState<"list" | "create">("list");

  const [selectedCustomer, setSelectedCustomer] =
  useState<Customer | null>(null);

  seedInvoices();

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <h2>Lavender</h2>
          <span>Car Solution</span>
        </div>

        <nav className="navigation">
          <button
            className={`nav-item ${
              page === "dashboard" ? "active" : ""
            }`}
            onClick={() => {
              setPage("dashboard");
              setSelectedInvoice(null);
            }}
          >
            Dashboard
          </button>

          <button
            className={`nav-item ${
              page === "invoice" ? "active" : ""
            }`}
            onClick={() => {
              setPage("invoice");
              setSelectedInvoice(null);
              setInvoiceMode("list");
            }}
          >
            Invoice
          </button>
          
          <button
            className={`nav-item ${
              page==="customer"?"active":""
            }`}
            onClick={()=>{
              setPage("customer");
              setSelectedCustomer(null);
            }}
          >
            Customer
          </button>

          <button className="nav-item">
            Jasa
          </button>

          <button className="nav-item">
            Spare Part
          </button>

          <button className="nav-item">
            Mekanik
          </button>

          <button className="nav-item">
            Pengaturan
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>
              {page === "dashboard"
                ? "Dashboard"
                : page === "invoice"
                ? "Invoice"
                : page === "customer"
                ? "Customer"
                : "Workshop"}
            </h1>

            <p>
              Kelola invoice bengkel dengan mudah.
            </p>
          </div>
        </header>

        <section className="content">
          {page === "dashboard" && (
            <>
              {!selectedInvoice ? (
                <Dashboard
                  onSelectInvoice={(invoice) =>
                    setSelectedInvoice(invoice)
                  }
                />
              ) : (
                <InvoiceDetail
                  invoice={selectedInvoice}
                  onBack={() =>
                    setSelectedInvoice(null)
                  }
                />
              )}
            </>
          )}

          {page === "invoice" && (
            <>
              {invoiceMode === "create" ? (
                <CreateInvoice />
              ) : !selectedInvoice ? (
                <InvoiceList
                  onSelectInvoice={(invoice) =>
                    setSelectedInvoice(invoice)
                  }
                  onCreateInvoice={() => {
                    setSelectedInvoice(null);
                    setInvoiceMode("create");
                  }}
                />
              ) : (
                <InvoiceDetail
                  invoice={selectedInvoice}
                  onBack={() =>
                    setSelectedInvoice(null)
                  }
                />
              )}
            </>
          )}
          {page === "customer" && (
            <>
              {!selectedCustomer ? (
                <CustomerList
                  onSelectCustomer={(customer) =>
                    setSelectedCustomer(customer)
                  }
                />
              ) : (
                <CustomerDetail
                  customer={selectedCustomer}
                  onBack={() =>
                    setSelectedCustomer(null)
                  }
                />
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
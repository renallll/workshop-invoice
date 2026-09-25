import { useEffect, useRef, useState } from "react";
import "./App.css";

import { seedInvoices } from "./utils/seed";

import Dashboard from "./pages/Dashboard";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceDetail from "./pages/InvoiceDetail";
import InvoiceList from "./pages/InvoiceList";

import type { Invoice } from "./types/invoice";
import CustomerList from "./pages/CustomerList";
import CustomerDetail from "./pages/CustomerDetail";
import ImportInvoice from "./pages/ImportInvoice";
import type { Customer } from "./types/customer";
import { clearLogo, getLogo, saveLogo } from "./utils/logo";
import {
  getApiToken,
  isApiConfigured,
  isApiEnabled,
  loginApi,
  registerApi,
  setApiToken,
  syncApiInvoices,
} from "./utils/api";
import { saveInvoices } from "./utils/storage";

function ApiLogin({
  onAuthenticated,
}: {
  onAuthenticated: (token: string) => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      if (mode === "register") {
        if (!name.trim()) {
          throw new Error("Nama wajib diisi.");
        }
        await registerApi(name.trim(), email.trim(), password);
      }

      const result = await loginApi(email.trim(), password);
      setApiToken(result.token);
      onAuthenticated(result.token);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Autentikasi gagal."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="main-content">
      <section className="content">
        <div className="form-card" style={{ maxWidth: 460, margin: "80px auto" }}>
          <h2>{mode === "login" ? "Masuk ke Workshop" : "Buat Akun Workshop"}</h2>
          <p>Hubungkan Lavender dengan backend workshop.</p>
          <form onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="form-group">
                <label htmlFor="api-name">Nama</label>
                <input
                  id="api-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="api-email">Email</label>
              <input
                id="api-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="api-password">Password</label>
              <input
                id="api-password"
                type="password"
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {error && <p role="alert">{error}</p>}
            <button className="primary-button" type="submit" disabled={busy}>
              {busy ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar"}
            </button>
          </form>
          <button
            className="logo-action"
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login"
              ? "Belum punya akun? Daftar"
              : "Sudah punya akun? Masuk"}
          </button>
        </div>
      </section>
    </main>
  );
}

function App() {
  const [page, setPage] = useState("dashboard");

  const [selectedInvoice, setSelectedInvoice] =
    useState<Invoice | null>(null);

  const [invoiceMode, setInvoiceMode] =
    useState<"list" | "create">("list");

  const [selectedCustomer, setSelectedCustomer] =
  useState<Customer | null>(null);
  const [logo, setLogo] = useState<string | null>(() => getLogo());
  const [apiToken, setApiTokenState] = useState<string | null>(() => getApiToken());
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadInvoices = async () => {
      if (!isApiConfigured()) {
        seedInvoices();
        return;
      }

      if (!isApiEnabled()) return;

      try {
        const invoices = await syncApiInvoices();
        if (invoices) {
          saveInvoices(invoices);
        }
      } catch (error) {
        console.error("Gagal memuat invoice dari API:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Gagal memuat data dari API."
        );
      }
    };

    void loadInvoices();
  }, [apiToken]);

  if (isApiConfigured() && !apiToken) {
    return (
      <div className="app">
        <ApiLogin onAuthenticated={setApiTokenState} />
      </div>
    );
  }

  const handleLogoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Logo harus berupa file gambar.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran logo maksimal 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        alert("Logo gagal dibaca.");
        return;
      }

      saveLogo(reader.result);
      setLogo(reader.result);
    };
    reader.onerror = () => alert("Logo gagal dibaca.");
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleLogoRemove = () => {
    clearLogo();
    setLogo(null);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className={`brand ${logo ? "has-custom-logo" : ""}`}>
          <button
            type="button"
            className="brand-logo-button"
            onClick={() => logoInputRef.current?.click()}
            title="Unggah logo"
          >
            {logo ? (
              <img src={logo} alt="Logo workshop" className="custom-logo" />
            ) : (
              <span className="brand-logo-fallback">LCS</span>
            )}
          </button>
          <input
            ref={logoInputRef}
            className="visually-hidden"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleLogoUpload}
          />

          <div className="brand-text">
            <h2>Lavender</h2>
            <span>CAR SOLUTION</span>
            <small>Workshop & Automotive Service</small>
            <button
              type="button"
              className="logo-action"
              onClick={logo ? handleLogoRemove : () => logoInputRef.current?.click()}
            >
              {logo ? "Hapus logo" : "Unggah logo"}
            </button>
          </div>
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
          <button
            className={`nav-item ${
              page === "import" ? "active" : ""
            }`}
            onClick={() => setPage("import")}
          >
            Import Excel
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
          {page === "import" && <ImportInvoice />}

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
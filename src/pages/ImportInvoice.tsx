import { useState } from "react";
import { importLavenderExcel } from "../utils/excelImport";
import { importInvoices } from "../utils/storage";
import { createApiInvoice, isApiEnabled } from "../utils/api";

function ImportInvoice() {
  const [loading, setLoading] = useState(false);

  const handleImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setLoading(true);

    try {
      const invoices =
        await importLavenderExcel(file);

      const invoicesToStore = isApiEnabled()
        ? await Promise.all(invoices.map(createApiInvoice))
        : invoices;

      const imported = importInvoices(invoicesToStore);

      alert(
        `${imported} invoice berhasil diimport.`
      );
    } catch (error) {
      console.error(error);
      alert("Import gagal.");
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Import Excel</h2>
        <p>Upload invoice Lavender (.xls atau .xlsx)</p>
      </div>

      <div className="form-card">
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleImport}
        />

        {loading && (
          <p>Mengimpor data...</p>
        )}
      </div>
    </div>
  );
}

export default ImportInvoice;
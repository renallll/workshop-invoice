import { useState } from "react";
import { importLavenderExcel } from "../utils/excelImport";
import { importInvoices } from "../utils/storage";

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

      const imported =
        importInvoices(invoices);

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
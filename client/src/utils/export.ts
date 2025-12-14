/**
 * Export utilities for downloading data as CSV
 */

/**
 * Convert array of objects to CSV string
 */
export function convertToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers: { key: keyof T; label: string }[]
): string {
  if (data.length === 0) return "";

  // Create header row
  const headerRow = headers.map((h) => h.label).join(",");

  // Create data rows
  const dataRows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header.key];
        // Handle null/undefined
        if (value === null || value === undefined) return "";
        // Handle objects/arrays - stringify them
        if (typeof value === "object") {
          return JSON.stringify(value);
        }
        // Escape commas and quotes in string values
        const stringValue = String(value);
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(",")
  );

  return [headerRow, ...dataRows].join("\n");
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export transactions to CSV
 */
export function exportTransactionsToCSV(
  transactions: Array<{
    id: string;
    customer?: string;
    phone?: string;
    total: number;
    discount: number;
    finalAmount: number;
    paymentMethod: string;
    createdAt: string;
  }>
) {
  const headers = [
    { key: "customer" as const, label: "Customer" },
    { key: "phone" as const, label: "Phone" },
    { key: "total" as const, label: "Total (VND)" },
    { key: "discount" as const, label: "Discount (VND)" },
    { key: "finalAmount" as const, label: "Final Amount (VND)" },
    { key: "paymentMethod" as const, label: "Payment Method" },
    { key: "createdAt" as const, label: "Date" },
  ];

  const csvContent = convertToCSV(transactions, headers);
  const filename = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
  downloadCSV(csvContent, filename);
}



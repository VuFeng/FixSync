/**
 * Print utilities
 */

/**
 * Print HTML content
 */
export function printHTML(htmlContent: string, title: string = "Document") {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    console.error("Failed to open print window");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @media print {
            @page {
              margin: 1cm;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              color: #000;
            }
            .no-print {
              display: none;
            }
          }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #000;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .info-section {
            margin-bottom: 20px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 4px 0;
            border-bottom: 1px dotted #ccc;
          }
          .info-label {
            font-weight: bold;
            width: 40%;
          }
          .info-value {
            width: 60%;
            text-align: right;
          }
          .total-section {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #000;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            margin-bottom: 8px;
          }
          .total-final {
            font-size: 20px;
            font-weight: bold;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10px;
            color: #666;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  
  // Wait for content to load before printing
  setTimeout(() => {
    printWindow.print();
    // Close window after printing (optional)
    // printWindow.close();
  }, 250);
}

/**
 * Generate transaction receipt HTML
 */
export function generateTransactionReceiptHTML(
  transaction: {
    id: string;
    total: number;
    discount: number;
    finalAmount: number;
    paymentMethod: string;
    createdAt: string;
  },
  device?: {
    customer?: { name?: string; phone?: string };
    customerName?: string;
    customerPhone?: string;
    brand?: { name: string };
    model?: { name: string };
  }
): string {
  const methodMap: Record<string, string> = {
    CASH: "Cash",
    MOMO: "MoMo",
    BANKING: "Banking",
  };

  return `
    <div class="header">
      <h1>FIXSYNC</h1>
      <p>Phone Repair Management System</p>
      <p>Transaction Receipt</p>
    </div>

    <div class="info-section">
      <div class="info-row">
        <span class="info-label">Receipt ID:</span>
        <span class="info-value">${transaction.id}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date:</span>
        <span class="info-value">${new Date(transaction.createdAt).toLocaleString("vi-VN")}</span>
      </div>
      ${device ? `
        ${(device.customer?.name || device.customerName) ? `
          <div class="info-row">
            <span class="info-label">Customer:</span>
            <span class="info-value">${device.customer?.name || device.customerName || "N/A"}</span>
          </div>
        ` : ""}
        ${(device.customer?.phone || device.customerPhone) ? `
          <div class="info-row">
            <span class="info-label">Phone:</span>
            <span class="info-value">${device.customer?.phone || device.customerPhone || "N/A"}</span>
          </div>
        ` : ""}
        ${device.brand && device.model ? `
          <div class="info-row">
            <span class="info-label">Device:</span>
            <span class="info-value">${device.brand.name} ${device.model.name}</span>
          </div>
        ` : ""}
      ` : ""}
      <div class="info-row">
        <span class="info-label">Payment Method:</span>
        <span class="info-value">${methodMap[transaction.paymentMethod] || transaction.paymentMethod}</span>
      </div>
    </div>

    <div class="total-section">
      <div class="total-row">
        <span>Subtotal:</span>
        <span>${transaction.total.toLocaleString("vi-VN")} VND</span>
      </div>
      <div class="total-row">
        <span>Discount:</span>
        <span>-${transaction.discount.toLocaleString("vi-VN")} VND</span>
      </div>
      <div class="total-row total-final">
        <span>Total Amount:</span>
        <span>${transaction.finalAmount.toLocaleString("vi-VN")} VND</span>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for your business!</p>
      <p>Generated on ${new Date().toLocaleString("vi-VN")}</p>
    </div>
  `;
}

/**
 * Print transaction receipt
 */
export function printTransactionReceipt(
  transaction: {
    id: string;
    total: number;
    discount: number;
    finalAmount: number;
    paymentMethod: string;
    createdAt: string;
  },
  device?: {
    customer?: { name?: string; phone?: string };
    customerName?: string;
    customerPhone?: string;
    brand?: { name: string };
    model?: { name: string };
  }
) {
  const html = generateTransactionReceiptHTML(transaction, device);
  printHTML(html, `Receipt_${transaction.id}`);
}



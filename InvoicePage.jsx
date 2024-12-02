import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './InvoicePage.css';

const InvoicePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, total, billingInfo, date } = location.state || {};

  const generateInvoiceHTML = () => {
    const invoiceContent = document.querySelector('.invoice-container').innerHTML;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - WheelCar</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .invoice-container { padding: 20px; }
            .invoice-table { width: 100%; border-collapse: collapse; }
            .invoice-table th, .invoice-table td { padding: 10px; border: 1px solid #ddd; }
            .invoice-table th { background-color: #043b4f; color: white; }
          </style>
        </head>
        <body>
          ${invoiceContent}
        </body>
      </html>
    `;
  };

  const downloadInvoice = () => {
    const blob = new Blob([generateInvoiceHTML()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <h1>Invoice</h1>
        <p>Date: {date}</p>
      </div>

      <div className="billing-info">
        <h2>Billing Information</h2>
        <p>{billingInfo.address}</p>
        <p>{billingInfo.city}, {billingInfo.state} {billingInfo.zip}</p>
      </div>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
              <td>${(parseFloat(item.price.replace('$', '').replace(',', '')) * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">Subtotal:</td>
            <td>${total.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan="3">Tax (10%):</td>
            <td>${total.tax.toFixed(2)}</td>
          </tr>
          <tr className="total-row">
            <td colSpan="3"><strong>Total:</strong></td>
            <td><strong>${total.total.toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>

      <div className="invoice-actions">
        <button onClick={() => window.print()} className="print-btn">
          Print Invoice
        </button>
        <button onClick={downloadInvoice} className="download-btn">
          Download Invoice
        </button>
        <button onClick={() => navigate('/main')} className="return-btn">
          Return to Store
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
import React, { useEffect, useState } from "react";
import "./InvoicePage.css";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";

const InvoicePage = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("currentOrders"));
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!orders || !user) {
      alert("No orders found. Redirecting to the store...");
      navigate("/main");
    } else {
      setCurrentOrders(orders);

      // Fetch email and address from endpoints
      const fetchUserDetails = async () => {
        try {
          const emailResponse = await axios.get(
            `http://127.0.0.1:8000/users/${user.username}/email`
          );
          const addressResponse = await axios.get(
            `http://127.0.0.1:8000/users/${user.username}/address`
          );

          setUserEmail(emailResponse.data.email);
          setUserAddress(addressResponse.data.address);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserDetails();
    }
  }, [navigate]);

  const handleDownloadPDF = () => {
    if (!currentOrders.length) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Invoice", 14, 20);

    doc.setFontSize(12);
    doc.text(`Customer: ${currentOrders[0]?.Customer}`, 14, 30);
    doc.text(`Email: ${userEmail}`, 14, 40);
    doc.text(`Address: ${userAddress}`, 14, 50);

    let startY = 60;
    currentOrders.forEach((order, index) => {
      doc.text(`Order ID: ${order.OrderID}`, 14, startY);
      doc.text(`Date: ${order.Date}`, 14, startY + 10);

      const tableBody = [
        [
          order.Content,
          `$${parseFloat(order.Total).toFixed(2)}`,
          order.quantity || 1,
          `$${(parseFloat(order.Total) * (order.quantity || 1)).toFixed(2)}`,
        ],
      ];

      doc.autoTable({
        startY: startY + 20,
        head: [["Product", "Unit Price", "Quantity", "Total Price"]],
        body: tableBody,
      });

      startY = doc.lastAutoTable.finalY + 20;
    });

    const grandTotal = currentOrders.reduce(
      (acc, order) => acc + parseFloat(order.Total),
      0
    );

    doc.text(`Grand Total: $${grandTotal.toFixed(2)}`, 14, startY);
    doc.save(`invoice_${currentOrders[0]?.Customer}.pdf`);
  };

  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <h1>Invoice</h1>
      </div>
      <div className="billing-info">
        <h2>Billing Information</h2>
        <p>
          <strong>Email:</strong> {userEmail}
        </p>
        <p>
          <strong>Address:</strong> {userAddress}
        </p>
      </div>
      <div className="orders-info">
        {currentOrders.map((order, index) => (
          <div key={index} className="order-details">
            <p>
              <strong>Order ID:</strong> {order.OrderID}
            </p>
            <p>
              <strong>Date:</strong> {order.Date}
            </p>
            <p>
              <strong>Product:</strong> {order.Content}
            </p>
            <p>
              <strong>Total Price:</strong> ${order.Total.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <div className="invoice-actions">
        <button onClick={handleDownloadPDF} className="download-btn">
          Download PDF
        </button>
        <button onClick={() => window.print()} className="print-btn">
          Print
        </button>
        <button onClick={() => navigate("/main")} className="return-btn">
          Back to Store
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;

import React, { useEffect, useState } from "react";
import { Table, Image } from "react-bootstrap";
import "./Order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("User:Token");
      const response = await fetch(
        "http://localhost:8089/api/orders/getOrders",
        {
          method: "GET",
          headers: {
            "Authentication-Token": `${token}`,
          },
        }
      );
      const resultData = await response.json();
      console.log(resultData);
      setOrders(resultData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  


  return (
    <div className="order-container">
      <h3 className="order-title">All Orders</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Products</th>
            <th>Payment Status</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <div className="product-list">
                  {item.products.map((product) => (
                    <div
                      className="product-item"
                      key={product._id}
                    >
                      <img
                        src={product.photo}
                        width="50"
                        height="50"
                        alt={product.name}
                      />
                      <span className="product-name">{product.name}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td className={`payment-status ${item.payment.success ? "" : "not-paid"}`}>
                {item.payment.success ? "Paid" : "Not Paid"}
              </td>
              <td className={`order-status ${item.status.toLowerCase()}`}>
                {item.status}
              </td>
              <td className="order-date">
                {new Date(item.createdAt).toLocaleString()}
              </td>
              <td className="order-date">
                {new Date(item.updatedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );


};

export default Order;

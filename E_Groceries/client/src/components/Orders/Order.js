import React, { useEffect, useState } from "react";
import "./Order.css";
import Alert from "../Alert";

const host = process.env.REACT_APP_LOCALHOST;

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [alert, setAlert] = useState(null);
  // console.log(orders)

  function showAlert(message, type) {
    setAlert({
      msg: message,
      ty: type,
    });

    setTimeout(() => {
      setAlert(null);
    }, 4000);
  }

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("User:Token");
      const response = await fetch(
        `${host}api/orders/getOrders`,
        {
          method: "GET",
          headers: {
            "Authentication-Token": `${token}`,
          },
        }
      );
      const resultData = await response.json();
      // console.log(resultData);
      setOrders(resultData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderCancel = async (orderId) => {
    const token = localStorage.getItem("User:Token");
    const response = await fetch(
      `${host}api/orders/cancelOrders/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Authentication-Token": `${token}`,
        },
      }
    );
    const resData = await response.json();
    if (resData.success) {
      showAlert("Order Cancelled successfully!", "warning");
      fetchOrders();
    } else {
      console.log("Error");
    }
  };

  return (
    <div className="order-container">
      <div className="alertPositionProduct">
        <Alert alert={alert} />
      </div>
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
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order._id}>
              <td>{index + 1}</td>
              <td>
                {order.products.map((product) => (
                  <div className="product-item" key={product._id}>
                    <img
                      src={product.photo}
                      width="50"
                      height="50"
                      alt={product.name}
                    />
                    <span className="product-name">{product.name}</span>
                    {/* <span className="product-quantity">
                      x{product.numberOfQuantity}
                    </span> */}
                  </div>
                ))}
              </td>
              <td
                className={`payment-status ${
                  order.payment.success
                    ? ""
                    : order.status === "Cancelled"
                    ? "refunded"
                    : "not-paid"
                }`}
              >
                {order.payment.success
                  ? "Paid"
                  : order.status === "Cancelled"
                  ? "Refunded"
                  : "Not Paid"}
              </td>
              <td className={`order-status ${order.status.toLowerCase()}`}>
                {order.status}
              </td>

              <td className="order-date">
                {new Date(order.createdAt).toLocaleString()}
              </td>
              <td className="order-date">
                {new Date(order.updatedAt).toLocaleString()}
              </td>
              <td className="order-date">
                <img
                  src={require("../../assets/cancel.png")}
                  alt="Cart"
                  style={{
                    height: "30px",
                    width: "30px",
                    cursor:
                      order.status === "Delivered" ? "not-allowed" : "pointer",
                    opacity: order.status === "Delivered" ? 0.5 : 1,
                  }}
                  onClick={() =>
                    order.status !== "Delivered" && handleOrderCancel(order._id)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Order;

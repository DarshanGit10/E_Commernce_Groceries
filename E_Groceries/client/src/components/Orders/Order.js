import React, { useEffect, useState } from "react";
import "./Order.css";
import Alert from "../Alert";
import easyinvoice from 'easyinvoice';
import download from 'downloadjs';
import { Buffer } from 'buffer';





const host = process.env.REACT_APP_LOCALHOST;

const Order = () => {
  const [orders, setOrders] = useState([]);
  // console.log(orders)
  const [alert, setAlert] = useState(null);
  // console.log(orders)

  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);


  const selectedOrder = orders.find((order) => order._id === selectedOrderId);
  console.log(selectedOrder)

  const handleViewMore = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

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
      const response = await fetch(`${host}api/orders/getOrders`, {
        method: "GET",
        headers: {
          "Authentication-Token": `${token}`,
        },
      });
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
    const response = await fetch(`${host}api/orders/cancelOrders/${orderId}`, {
      method: "PUT",
      headers: {
        "Authentication-Token": `${token}`,
      },
    });
    const resData = await response.json();
    if (resData.success) {
      showAlert("Order Cancelled successfully!", "warning");
      fetchOrders();
    } else {
      console.log("Error");
    }
  };

  



const handleInvoiceDownload = async () => {
  try {
    // Ensure that selectedOrder object is defined before using it
    if (!selectedOrder) {
      console.error('Error generating invoice: selectedOrder is undefined');
      return;
    }

    const invoice = {
      documentTitle: 'Invoice',
      currency: 'INR',
      taxNotation: 'GST',
      marginTop: 25,
      marginRight: 25,
      marginLeft: 25,
      marginBottom: 25,
      images: {
        logo: 'https://github.com/DarshanGit10/E_Commernce_Groceries/blob/master/E_Groceries/client/src/assets/logo1.png?raw=true',
        
    },

      sender: {
        company: 'FreshCo Pantry',
        address: 'Vijay towers, Vidyanagar Main Road',
        zip: '583104',
        city: 'Ballari',
        country: 'India',
      },
      client: {
        company: selectedOrder.buyer.firstName,
        address: selectedOrder.shippingAddress.street,
        zip: selectedOrder.shippingAddress.zipCode,
        city: selectedOrder.shippingAddress.city,
        country: selectedOrder.shippingAddress.country,
      },

      information: {
        number: `${selectedOrder._id}`,
        date: new Date().toLocaleDateString(),
        'due-date': new Date().toLocaleDateString()
        
    },
      invoiceNumber: selectedOrder._id,
      invoiceDate: new Date().toLocaleDateString('en-IN'),
      products: selectedOrder.products.map((item) => {
        const productQty = selectedOrder.product.find(
          (p) => p.productId === item._id
        );
        return {
          quantity: productQty ? productQty.qty : 0, // use the quantity if found, or 0 otherwise
          description: item.name,
          "tax-rate": 0,
          price: item.price,
        };
      }),
      

      bottomNotice: 'Thank you for your business',
    };

    const result = await easyinvoice.createInvoice(invoice);

    if (result && result.pdf) {
      const pdfData = Buffer.from(result.pdf, 'base64');
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      download(blob, 'invoice.pdf', 'application/pdf');
    } else {
      console.error('Error generating invoice: invalid PDF data');
    }
  } catch (error) {
    console.error('Error generating invoice:', error);
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
            <th>View More</th>
            {/* <th>Updated At</th>
            <th>Shipping Address</th>
            <th>Cancel</th> */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order._id}>
              <td>{index + 1}</td>

              <td>
                {order.products.slice(0, 2).map((product, index) => (
                  <div className="product-item" key={index}>
                    <img
                      src={product.photo}
                      width="50"
                      height="50"
                      alt={product.name}
                    />
                    <span className="product-name">{product.name}</span>
                  </div>
                ))}
                {order.products.length > 2 && <span>...</span>}
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
                {
                  <button
                    className="btn btn-color-2"
                    onClick={() => {
                      handleViewMore();
                      setSelectedOrderId(order._id);
                    }}
                  >
                    View More
                  </button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Order Details</h2>
            <div></div>
            <img
              src={require("../../assets/cancel.png")}
              alt="Cart"
              className="cancelOrder"
              style={{
                cursor:
                  selectedOrder.status === "Delivered" ||
                  selectedOrder.status === "Cancelled"
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  selectedOrder.status === "Delivered" ||
                  selectedOrder.status === "Cancelled"
                    ? 0.5
                    : 1,
              }}
              onClick={() =>
                selectedOrder.status !== "Delivered" &&
                handleOrderCancel(selectedOrder._id)
              }
            />
               <img
              src={require("../../assets/download.png")}
              alt="Cart"
              className="invoiceDownload"
              style={{
                cursor:
                  
                  selectedOrder.status === "Cancelled"
                    ? "not-allowed"
                    : "pointer",
                opacity:
                 
                  selectedOrder.status === "Cancelled"
                    ? 0.5
                    : 1,
              }}
              onClick={() =>
                selectedOrder.status !== "Cancelled" &&
                handleInvoiceDownload(selectedOrder._id)
              }
            />

            <div className="order-info">
              <p className="order-info-buyer">
                Buyer: {selectedOrder.buyer.firstName}
              </p>
              <p className="order-info-products">Products:</p>
              <ul className="order-info-product-list">
  {selectedOrder.products.map((product) => (
    <li key={product._id}>
      <p>Name: {product.name}</p>
      <p>Description: {product.description}</p>
      <p>Price: {product.price}/-</p>
      <ul style={{listStyle:'none'}}>
        {selectedOrder.product.map((productQty) => (
          productQty.productId === product._id && (
            <li key={productQty.productId} >
              <p>Quantity: {productQty.qty}</p>
            </li>
          )
        ))}
      </ul>
    </li>
  ))}
</ul>

              <p className="order-info-shipping-address">Shipping Address:</p>
              <ul className="order-info-address">
                <li>
                  {selectedOrder.shippingAddress ? (
                    <>
                      <p>Street: {selectedOrder.shippingAddress.street}</p>
                      <p>City: {selectedOrder.shippingAddress.city}</p>
                      <p>State: {selectedOrder.shippingAddress.state}</p>
                      <p>Country: {selectedOrder.shippingAddress.country}</p>
                      <p>ZipCode: {selectedOrder.shippingAddress.zipCode}</p>
                    </>
                  ) : (
                    <>
                      <p>Street: null</p>
                      <p>City: null</p>
                      <p>State: null</p>
                      <p>Country: null</p>
                      <p>ZipCode: null</p>
                    </>
                  )}
                </li>
              </ul>
              <p className="order-info-status">
                Status: {selectedOrder.status}
              </p>
              <p className="order-info-created-at">
                Created At: {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
              <p className="order-info-updated-at">
                Updated At: {new Date(selectedOrder.updatedAt).toLocaleString()}
              </p>
            </div>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;

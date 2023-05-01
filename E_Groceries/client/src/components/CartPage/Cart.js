import React, { useEffect, useState } from "react";
import "./Cart.css";
import { useCart } from "../../context/cart";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";

const Cart = ({}) => {
  const [cart, setCart] = useCart();
  const [userAddress, setUserAddress] = useState([]);
  const [clientToken, setClientToken] = useState(null);
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickProfile = () => {
    navigate("/profile");
  };

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      setCart(JSON.parse(cartData));
    }
  }, []);

  const totalPrice = () => {
    try {
      const total = cart.reduce((acc, item) => acc + item.price, 0);
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Get payment gateway token
  const getToken = async () => {
    try {
      const response = await fetch(
        "http://localhost:8089/api/payment/brainTree/token",
        {
          method: "GET",
        }
      );
      const {resData} = await response.json();
      console.log(resData.clientToken);
      setClientToken(resData?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  const handlePayment = async() => {
    try {
      // const {nonce} = await instance.requestPaymentMethod();
      // const {}
    } catch (error) {
      console.log(error);
    }
  };

  const removeItemFromCart = (index) => {
    try {
      const updatedCart = [...cart];
      updatedCart.splice(index, 1);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserAddressCart = async () => {
    const token = localStorage.getItem("User:Token");
    const response = await fetch(
      "http://localhost:8089/api/address/getAddress",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": `${token}`,
        },
      }
    );
    const resData = await response.json();
    setUserAddress(resData);
  };

  useEffect(() => {
    fetchUserAddressCart();
  }, []);

  return (
    <div>
      <div className="container cartContainer">
        <div className="row">
          <div className="md-col-12">
            <h1 className="text-center bg-light p-2 mb-1">Your Cart</h1>
            <h4 className="text-center">
              {cart?.length > 1
                ? `You Have ${cart.length} items in your cart`
                : "Your cart is empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-7">
            {cart.map((item, index) => {
              return (
                <div key={index} className="row m-2 card p-1 flex-row">
                  <div className="col-md-4">
                    <img
                      src={item.photo}
                      alt="photo"
                      width={"180px"}
                      height={"180px"}
                    />
                  </div>
                  <div className="col-md-8 mt-3">
                    <h6>{item.name}</h6>
                    <p>{item.description}</p>
                    <span>Price: {item.price}/-</span>{" "}
                    <span style={{ marginLeft: "15px" }}>
                      {" "}
                      Quantity: {item.quantity}
                    </span>
                    <div className="cartRemoveBtn">
                      <button onClick={() => removeItemFromCart(index)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-md-4 text-center">
            <h4>Cart Summary</h4>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h5>Total: {totalPrice()}/-</h5>
            <div className="mb-3 addressCartContainer">
              <h5>Select an address:</h5>
              {userAddress && userAddress.length > 0 ? (
                <select name="address">
                  {userAddress.map((address) => (
                    <option key={address._id} value={address._id}>
                      {address.street}, {address.city}, {address.state}{" "}
                      {address.zip}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <p>
                    No addresses found, Please try after adding address:{" "}
                    <button onClick={handleClickProfile}>Profile</button>{" "}
                  </p>
                </>
              )}
            </div>

            <div className="mt-2">
              <DropIn
                options={{
                  authorization: clientToken,
                  paypal: {
                    flow: "vault",
                  },
                }}
                onInstance={(instance) => setInstance(instance)}
              />

              <button
                className="btn btn-primary"
                onClick={handlePayment}
                disabled={!loading || !instance}
              >
                Make Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

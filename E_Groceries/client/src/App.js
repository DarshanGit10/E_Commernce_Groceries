import "./App.css";
import {Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp/SignUp";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import Shop from "./components/Shop/Shop";
import Home from "./components/Home/Home";
import Contact from "./components/Contact/Contact";
import Navbar from "./components/Navbar/Navbar";
import React from "react";
import AddressForm from "./components/Address/AddressForm";
import Cart from "./components/CartPage/Cart";
import Order from "./components/Orders/Order";
import SearchPage from "./components/SearchInput/SearchPage";


function App() {
  return (
    <>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/shop" element={<Shop />} />
          <Route exact path="/addAddress" element={<AddressForm />} />
          <Route exact path="/cartPage" element={<Cart />} />
          <Route exact path="/order" element={<Order />} />
          <Route exact path="/search" element={<SearchPage/>} />
        </Routes>
    </>
  );
}

export default App;

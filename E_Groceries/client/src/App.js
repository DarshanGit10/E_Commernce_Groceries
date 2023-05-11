import "./App.css";
import {Routes, Route , useNavigate} from "react-router-dom";
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
import EmailVerify from "./components/Email/EmailVerify";
import jwt_decode from 'jwt-decode';

function App() {
  const navigate = useNavigate();
  const [token, setToken] = React.useState(localStorage.getItem('User:Token'));

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      const token = localStorage.getItem('User:Token');
      if (!token) {
        clearInterval(intervalId);
        return;
      }

      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      if (currentTime > decodedToken.exp) {
        alert('Your session has expired. Please log in again.');
        clearInterval(intervalId);
        localStorage.removeItem('User:Token')
        localStorage.removeItem("User:Id");
        navigate('/login');
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [navigate]);

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
          {/* <Route exact path="/editAddress" element={< />} /> */}
          <Route exact path="/cartPage" element={<Cart />} />
          <Route exact path="/order" element={<Order />} />
          <Route exact path="/search" element={<SearchPage/>} />
          <Route path="/users/:id/verify/:token" element={<EmailVerify/>} />
        </Routes>
    </>
  );
}

export default App;

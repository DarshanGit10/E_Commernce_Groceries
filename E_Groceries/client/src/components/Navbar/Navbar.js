import React from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import "./navbar.css";
import { useCart } from "../../context/cart";
import {Badge} from 'antd'

const Navbar = () => {
  const [cart] = useCart();

  let navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("User:Token");
    localStorage.removeItem("User:TokenExpiration");
    localStorage.removeItem("User:TokenCreation");
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };
  return (
    <>
      <div>
        <nav className="desktop-nav">
          <div className="navbar-left">
            <Link to="/">
              <img
                src={require("../../assets/logo2.png")}
                alt="Logo"
                className="logoImg"
              />
            </Link>
          </div>
          <div className="navbar-middle">
            <ul className="nav-links">
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/shop" className="nav-link">
                  Shop
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="nav-link">
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="navbar-right">
            <div className="btn-container">
              {!localStorage.getItem("User:Token") ? (
                <>
                  <Link className="btn btn-color-2" role="button" to="/login">
                    Log In
                  </Link>
                  <Link className="btn btn-color-1" role="button" to="/signup">
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <button className="btn btn-color-2" onClick={handleLogout}>
                    Logout
                  </button>
                  <img
                    src={require("../../assets/user.png")}
                    alt="Logo"
                    className="imgAvatar"
                    onClick={handleProfile}
                  />
                  <li className="nav-item" style={{listStyle:"none"}}>
                    <div className="add-cart-image">
                      <Badge count={cart?.length} showZero>
                      <NavLink to="/cartPage" className="nav-link">
                        <img src={require("../../assets/add-cart.png")} alt="Cart" />
                      </NavLink>
                      </Badge>
                    </div>
                  </li>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;

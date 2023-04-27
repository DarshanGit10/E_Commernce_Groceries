import './login.css'
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  let navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:8089/api/login_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });
    const resData = await response.json();
    if (resData.success) {
      localStorage.setItem("User:Token", resData.authToken);
      setMessage("Account logged in successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      setMessage("Invalid credentials!");
    }
  };

  const handleInputChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  return (
    <div className="formContainer">
      <div className="formCenter">
        <form className="formFields" onSubmit={handleSubmit}>
          <div className="loginFormField">
            <>
            <Link to="/">
              <img src={require('../../assets/logo2.png')} alt="Logo" className="logoImgLogin" />
            </Link>
            </>
            <h2 className="formHeader">LOGIN</h2>
            <label className="formFieldLabel">E-MAIL ADDRESS:</label>
            <input
              type="email"
              name="email"
              onChange={handleInputChange}
              className="formFieldInput"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="loginFormField">
            <label className="formFieldLabel">PASSWORD:</label>
            <input
              type="password"
              name="password"
              onChange={handleInputChange}
              className="formFieldInput"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="loginFormField">
            <button type="submit" className="formFieldButton">
              Login
            </button>
            <Link to="/signup" className="formFieldLink">
              Create an account
            </Link> 
            <div className="formMessage">
            <p>{message}</p>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

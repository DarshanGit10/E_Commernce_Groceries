import React, { useState } from "react";
import "./signup.css";
import { useNavigate, Link } from "react-router-dom";
import Alert from "../Alert";

const SignUp = () => {
  const [alert, setAlert] = useState(null);
  function showAlert(message, type) {
    setAlert({
      msg: message,
      ty: type,
    });

    setTimeout(() => {
      setAlert(null);
    }, 4000);
  }
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    confirmPassword: "",
  });
  // console.log(data)
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (data.password !== data.confirmPassword) {
      setErrors((prevState) => ({
        ...prevState,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    const response = await fetch("http://localhost:8089/api/create_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
      }),
    });
    const resData = await response.json();
    if (resData.error === "User already exists.") {
      showAlert("User already exists, please try login ", "warning");
      setTimeout(() => {
        navigate("/login");
      }, 3500);
    } else if (resData.errors) {
      setSuccessMessage("");
      setErrors({});
      const fieldErrors = {};
      resData.errors.forEach((error) => {
        fieldErrors[error.path] = error.msg;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
      setSuccessMessage(resData.message);
      // setTimeout(() => {
      //   navigate("/login");
      // }, 1500);
      showAlert(resData.message, "success");
        setTimeout(() => {
          setSuccessMessage("");
      }, 2500);
    }
  };

  const handleInputChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handlePasswordChange = (event) => {
    const password = event.target.value;
    setData((prevState) => ({ ...prevState, password }));
    if (data.confirmPassword !== password) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };

  const handleConfirmPasswordChange = (event) => {
    const confirmPassword = event.target.value;
    setData((prevState) => ({ ...prevState, confirmPassword }));
    if (data.password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };

  return (
    <div className="formContainer">
      <div className="alertPosition">
        <Alert alert={alert} />
        {/* Alert Text !!!! */}
      </div>
      <div className="formCenterSign scroll">
        <form onSubmit={handleSubmit} className="formFields">
          <>
            <Link to="/">
              <img
                src={require("../../assets/logo2.png")}
                alt="Logo"
                className="logoImgLogin"
              />
            </Link>
          </>
          <h1 className="formHeader">SIGN UP</h1>
          <div className="formField">
            <label className="formFieldLabel">First Name:</label>
            <input
              type="text"
              name="firstName"
              onChange={handleInputChange}
              className="formFieldInput"
              placeholder="Enter your first name"
              required
            />
          </div>
          {errors.firstName && (
            <div className="formMessageSign">{errors.firstName}</div>
          )}
          <div className="formField">
            <label className="formFieldLabel">Last Name:</label>
            <input
              type="text"
              name="lastName"
              onChange={handleInputChange}
              className="formFieldInput"
              placeholder="Enter your last name"
              required
            />
          </div>
          {errors.lastName && (
            <div className="formMessageSign">{errors.lastName}</div>
          )}

          <div className="formField">
            <label className="formFieldLabel">E-mail Address:</label>
            <input
              type="email"
              name="email"
              onChange={handleInputChange}
              className="formFieldInput"
              placeholder="Enter your email"
              required
            />
          </div>
          {errors.email && (
            <div className="formMessageSign">{errors.email}</div>
          )}
          <div className="formField">
            <label className="formFieldLabel">Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              onChange={handleInputChange}
              className="formFieldInput"
              placeholder="Enter your phone number"
              required
            />
          </div>
          {errors.phoneNumber && (
            <div className="formMessageSign">{errors.phoneNumber}</div>
          )}
          <div className="formField">
            <label className="formFieldLabel">Password:</label>
            <input
              type="password"
              onChange={handlePasswordChange}
              className="formFieldInput"
              placeholder="Enter your password"
              required
            />
          </div>
          {errors.password && (
            <div className="formMessageSign">{errors.password}</div>
          )}

          <div className="formField">
            <label className="formFieldLabel">Confirm Password:</label>
            <input
              type="password"
              onChange={handleConfirmPasswordChange}
              className="formFieldInput"
              placeholder="Enter your confirm password"
              required
            />
          </div>
          {error && <div className="signup-error-message">{error}</div>}

          <div className="formField">
            <button type="submit" className="formFieldButton">
              Sign Up
            </button>
            <Link to="/login" className="formFieldLink">
              I'm already member
            </Link>
          </div>
          <div className="formMessage">
            <p>{successMessage}</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

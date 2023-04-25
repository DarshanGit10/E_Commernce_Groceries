import React, { useState } from "react";
import "./signup.css";
import {useNavigate} from 'react-router-dom'

const SignUp = () => {
const [data, setData] = useState({
  firstName:"",
  lastName:"",
  email:"",
  password:"",
  phoneNumber:"",
  confirmPassword:""
})
// console.log(data)
const [error, setError] = useState("")

const navigate = useNavigate()

  const handleSubmit = async(event) => {
    event.preventDefault();
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    // form submission logic here
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
        phoneNumber: data.phoneNumber
    })
  });
  const resData = await response.json()
  console.log(resData)

  if(resData.success){
      alert("User created successfully.");
      setTimeout(() => {
          navigate("/login");
        }, 1500);
  }
}

const handleInputChange = (event) =>{
  setData({...data, [event.target.name]:event.target.value})

}

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
    <form onSubmit={handleSubmit} className="signup-form">
      <label className="signup-label">
        First Name:
        <input
          type="text"
          name="firstName"
          onChange={handleInputChange}
          className="signup-input"
        />
      </label>
      <label className="signup-label">
        Last Name:
        <input
          type="text"
          name="lastName"
          onChange={handleInputChange}
          className="signup-input"
        />
      </label>
      <label className="signup-label">
        Email:
        <input
          type="email"
          name="email"
          onChange={handleInputChange}
          className="signup-input"
        />
      </label>
      <label className="signup-label">
        Phone Number:
        <input
          type="tel"
          name="phoneNumber"
          onChange={handleInputChange}
          className="signup-input"
        />
      </label>
      <label className="signup-label">
        Password:
        <input
          type="password"
          onChange={handlePasswordChange}
          className="signup-input"
        />
      </label>
      <label className="signup-label">
        Confirm Password:
        <input
          type="password"
          onChange={handleConfirmPasswordChange}
          className="signup-input"
        />
           {error && <div className="signup-error-message">{error}</div>}
      </label>

      <button type="submit" className="signup-button">
        Sign Up
      </button>
    </form>
  );
};

export default SignUp;

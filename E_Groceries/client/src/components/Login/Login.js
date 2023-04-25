import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  let navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });
  //   console.log(data)

  const handleSubmit = async (event) => {
    event.preventDefault();
    // form submission logic here
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
    console.log(resData);
    if (resData.success) {
      localStorage.setItem("User:Token", resData.authToken);
      console.log("Account Logged in Successfully ");
      setTimeout(() => {
        navigate("/");
      }, 500);
    } else {
      console.log("Invalid !!!");
    }

    // if(resData === 'User registered successfully'){
    //     alert("User created successfully.");
    //     // setTimeout(() => {
    //     //     navigate("/users/login");
    //     //   }, 1500);
    // }
  };

  const handleInputChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  return (
    <form className="signup-form" onSubmit={handleSubmit}>
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
        Password:
        <input
          type="password"
          name="password"
          onChange={handleInputChange}
          className="signup-input"
        />
      </label>
      <button type="submit" className="signup-button">
        Login
      </button>
    </form>
  );
};

export default Login;

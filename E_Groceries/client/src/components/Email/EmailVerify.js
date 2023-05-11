import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import successImg from "../../assets/success.png";
import './EmailVerify.css'

const host = process.env.REACT_APP_LOCALHOST;

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(false);
  const param = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `${host}api/${param.id}/verify/${param.token}`;
        const { data } = await axios.get(url);
        console.log(data);
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param]);

  return (
    <div className="email-container">
      {validUrl ? (
        <div className="success-email-container">
          <img src={successImg} alt="success_img" className="imgEmail" />
          <h1>Email verified successfully</h1>
          <Link to="/login">
            <button className="btn">Login</button>
          </Link>
        </div>
      ) : (
        <h1>404 Not Found</h1>
      )}
    </div>
  );
};

export default EmailVerify;

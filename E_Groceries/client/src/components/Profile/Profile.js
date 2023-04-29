import React, { useState, useEffect } from "react";
import "./Profile.css";
import AddressForm from "../Address/AddressForm";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [userAddress, setUserAddress] = useState([]);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("User:Token");
      const response = await fetch("http://localhost:8089/api/user/get_user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${token}`,
        },
      });
      const resData = await response.json();
      setUserData(resData);
    };
    fetchUserData();
 
  }, []);  
  
  const fetchUserAddress = async () => {
    const token = localStorage.getItem("User:Token");
    const response = await fetch("http://localhost:8089/api/address/getAddress", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": `${token}`,
      },
    });
    const resData = await response.json();
    setUserAddress(resData);
  };

  useEffect(() => {
    fetchUserAddress();
  }, []);

  const handleAddAddressClick = () => {
    setShowAddAddressForm(true);
  };
  
  return (
    <>
      <div className="profileContainer">

        <h4>Profile Details</h4>
      
      {userData ? (
        <div className="profile-card">
          <h3 className="profile-name">
            {userData.firstName} {userData.lastName}
          </h3>
          <div className="profile-info">
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {userData.phoneNumber}
            </p>
          </div>
          <button onClick={handleAddAddressClick} className="btn btn-color-2">Add Address</button>
          {showAddAddressForm && <AddressForm fetchUserAddress={fetchUserAddress}/>}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    <div className="addressContainer">
    <h4>Addresses</h4>
      <div className="address-card"> 
        {userAddress ? (
          <table>
            <thead>
              <tr>
                <th>Address</th>
                <th>Street</th>
                <th>City</th>
                <th>State</th>
                <th>Zip Code</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
  {userAddress && userAddress.length > 0 ? userAddress.map((address, index) => (
    <tr key={address._id}>
      <td>{index + 1}</td>
      <td>{address.street}</td>
      <td>{address.city}</td>
      <td>{address.state}</td>
      <td>{address.zipCode}</td>
      <td>{address.country}</td>
    </tr>
  )) : (
    <tr>
      <td colSpan="6">No addresses found</td>
    </tr>
  )}
</tbody>
          </table>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
      
    </>
  );
};

export default Profile;

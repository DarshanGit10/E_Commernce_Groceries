import React, { useState, useEffect } from "react";
import "./Profile.css";
import AddressForm from "../Address/AddressForm";
import Alert from "../Alert";
import EditAddress from "../Address/EditAddress";
import EditProfile from "./EditProfile";
const host = process.env.REACT_APP_LOCALHOST;


const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [userAddressId, setUserAddressId] = useState("");
  const [userAddress, setUserAddress] = useState([]);
  const [existingAddress, setExistingAddress] = useState("")
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [showEditAddressForm, setShowEditAddressForm] = useState(false);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
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

  const fetchUserData = async () => {
    const token = localStorage.getItem("User:Token");
    const response = await fetch(`${host}api/user/get_user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authentication-Token": `${token}`,
      },
    });
    const resData = await response.json();
    setUserData(resData);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserAddress = async () => {
    const token = localStorage.getItem("User:Token");
    const response = await fetch(
      `${host}api/address/getAddress`,
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
    fetchUserAddress();
  }, []);

  const handleAddAddressClick = () => {
    setShowAddAddressForm(true);
  };

  const handleAddressEdit = () =>{
    setShowEditAddressForm(true)
  }

  const handlePassAddressId = (addressId) =>{
    setUserAddressId(addressId)
  }

  const handleUserEdit = () =>{
    setShowEditUserForm(true)
  }



 
  const handleAddressDelete = async (addressId) => {
    const token = localStorage.getItem("User:Token");
    const response = await fetch(
      `${host}address/deleteAddress/${addressId}`,
      {
        method: "DELETE",
        headers: {
          "Authentication-Token": `${token}`,
        },
      }
    );
    const resData = await response.json();
    if (resData.Success === "Deleted Address") {
      showAlert("Address deleted successfully!", "warning");
      fetchUserAddress();
    } else {
      console.log("Error");
    }
  };

  return (
    <>
      <div className="profileContainer">
        <h4>Profile Details</h4>

        {userData ? (
          <div className="profile-card">
            <h3 className="profile-name">
              {userData.firstName} {userData.lastName}
              <img
                          src={require("../../assets/draw.png")}
                          alt="Cart"
                          
                          onClick={() => {
                          handleUserEdit()}}
                        />
                
            </h3>
            <div className="profile-info">
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {userData.phoneNumber}
              </p>
            </div>
            <button onClick={handleAddAddressClick} className="btn btn-color-2">
              Add Address
            </button>
            {showAddAddressForm && (
              <AddressForm fetchUserAddress={fetchUserAddress} />
            )}  
            {showEditAddressForm && (
              <EditAddress fetchUserAddress={fetchUserAddress} addressId={userAddressId} existingAddress={existingAddress} />
            )} 
            {showEditUserForm && (
              <EditProfile fetchUserData={fetchUserData} userData={userData}/>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="addressContainer">
        <div className="alertPositionProduct">
          <Alert alert={alert} />
        </div>
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
                  <th>Delete/Edit</th>
                </tr>
              </thead>
              <tbody>
                {userAddress && userAddress.length > 0 ? (
                  userAddress.map((address, index) => (
                    <tr key={address._id}>
                      <td>{index + 1}</td>
                      <td>{address.street}</td>
                      <td>{address.city}</td>
                      <td>{address.state}</td>
                      <td>{address.zipCode}</td>
                      <td>{address.country}</td>
                      <td>
                      <img
                          src={require("../../assets/draw.png")}
                          alt="Cart"
                          style={{
                            height: "20px",
                            width: "20px",
                            cursor: "pointer",
                            marginRight:"10px"
                          }}
                          onClick={() => {handleAddressEdit();
                          handlePassAddressId(address._id)
                          setExistingAddress(address)
                        }}
                        />
                        <img
                          src={require("../../assets/garbage.png")}
                          alt="Cart"
                          style={{
                            height: "20px",
                            width: "20px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleAddressDelete(address._id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No addresses found</td>
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

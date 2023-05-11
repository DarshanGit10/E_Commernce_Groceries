import React, { useState } from 'react';
import './AddressForm.css';

const EditAddress = ({fetchUserAddress, addressId}) => {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [validationMsg, setValidationMsg] = useState('');
  const [addressEdited, setAddressEdited] = useState(false); // Add state variable to track whether address was added or not
  const [showForm, setShowForm] = useState(true);


  const handleInputChange = (event) => {
    setAddress({ ...address, [event.target.name]: event.target.value });
  };

  const handleAddressSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('User:Token');
    const response = await fetch(`http://localhost:8089/api/address/editAddress/${addressId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authentication-Token': `${token}`,
      },
      body: JSON.stringify({
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      }),
    });
    const resultData = await response.json();
    if (resultData.success) {
      setValidationMsg('Address added successfully.');
      setAddress({ street: '', city: '', state: '', zipCode: '' });
      setAddressEdited(true); // Set addressAdded state variable to true after successfully adding an address
      fetchUserAddress()
    } else {
      setValidationMsg(resultData.message);
    }
  };
  const handleCancel = () => {
    setShowForm(false);
  };


  
  const handleReset = () => {
    // Reset the form data to its initial state when Reset button is clicked
    setAddress({
      street: "",
      city: "",
      state: "",
      zipCode: "",
    });
    setValidationMsg("");
    console.log("Reset button clicked");
  };
  return (
    <>
    {showForm && (
    <div className="addAddressContainer">
    <h4>Update Address</h4>
      <div className="addAddress-card"> 
      {addressEdited ? ( // Conditionally render the form based on the addressAdded state variable
        <p>Address Updated successfully.</p>
      ) : (
        <div className="address-form">
          <form onSubmit={handleAddressSubmit}>
            <div className="address-form-group">
              <div className="address-form-group-left">
                <div className="form-group">
                  <label htmlFor="street">Street:</label>
                  <input
                    type="text"
                    id="street"
                    className='textCSS'
                    name="street"
                    value={address.street}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City:</label>
                  <input
                    type="text"
                    className='textCSS'
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="address-form-group-right">
                <div className="form-group">
                  <label htmlFor="state">State:</label>
                  <input
                    type="text"
                    className='textCSS'
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">Zip Code:</label>
                  <input
                    type="text"
                    className='textCSS'
                    id="zipCode"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          <div className="button-group">
          <button type="submit" className="btn btn-color-2" >Save</button>
            <button type="button" className="btn btn-color-2" onClick={handleCancel}>Cancel</button>
                  <button type="button" className="btn btn-color-2" onClick={handleReset}>Reset</button>
                  </div>
            {validationMsg && <p className="validation-msg">{validationMsg}</p>}
          </form>
        </div>)}
      </div></div>    )}
    </>
  );
};

export default EditAddress;

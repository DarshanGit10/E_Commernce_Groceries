import React, { useState } from 'react';
import './AddressForm.css';

const host = process.env.REACT_APP_LOCALHOST;

const EditAddress = ({fetchUserAddress, addressId,existingAddress}) => {
  const [address, setAddress] = useState({
    street: existingAddress.street,
    city: existingAddress.city,
    state: existingAddress.state,
    zipCode: existingAddress.zipCode,
  });
  const [validationMsg, setValidationMsg] = useState('');
  const [addressEdited, setAddressEdited] = useState(false); // Add state variable to track whether address was added or not
  const [showModal, setShowModal] = useState(true);


  const handleInputChange = (event) => {
    setAddress({ ...address, [event.target.name]: event.target.value });
  };

  const handleAddressSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('User:Token');
    const response = await fetch(`${host}api/address/editAddress/${addressId}`, {
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
      setTimeout(() => {
        setShowModal(false);
      }, 1500);
    } else {
      setValidationMsg(resultData.message);
    }
  };
  const handleCancel = () => {
    setShowModal(false);
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
       {showModal && (
  <div className="modal-container">
    <div className="modal-overlay"></div>
    <div className="modal-form">
      <div className="modal-content-form">
        <h4 className="modal-title">Update Address</h4>
        <div className="modal-body">
          {addressEdited ? (
            <p>Address Updated successfully.</p>
          ) : (
            <div className="address-form">
              <form onSubmit={handleAddressSubmit}>
                <div className="form-group">
                  <label htmlFor="street">Street:</label>
                  <input
                    type="text"
                    id="street"
                    className="form-control"
                    name="street"
                    value={address.street}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">Zip Code:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="zipCode"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="modal-button-group">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
                {validationMsg && (
                  <p className="validation-msg">{validationMsg}</p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default EditAddress;

import React, { useState } from 'react';
import '../Address/AddressForm.css';
const host = process.env.REACT_APP_LOCALHOST;

const EditProfile = ({fetchUserData,userData}) => {
  const [user, setUser] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    phoneNumber: userData.phoneNumber,
  });
  const [validationMsg, setValidationMsg] = useState('');
  const [userAdded, setUserAdded] = useState(false); // Add state variable to track whether address was added or not
  const [showModal, setShowModal] = useState(true);


  const handleInputChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleUserSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('User:Token');
    const response = await fetch(`${host}api/user/edit_user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authentication-Token': `${token}`,
      },
      body: JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
      }),
    });
    const resultData = await response.json();
    if (resultData.success) {
      setValidationMsg('Profile updated successfully.');
      setUser({ firstName: '', lastName: '', phoneNumber: '' });
      setUserAdded(true); 
      fetchUserData()
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
    setUser({
        firstName: '', lastName: '', phoneNumber: ''
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
        <h4 className="modal-title">Update Profile</h4>
        <div className="modal-body">
          {userAdded ? (
            <p>Profile Updated successfully.</p>
          ) : (
            <div className="address-form">
              <form onSubmit={handleUserSubmit}>
              <div className="form-group">
                  <label htmlFor="street">First Name:</label>
                  <input
                    type="text"
                    id="firstName"
                    className="form-control"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">Last Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">Phone Number:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={user.phoneNumber}
                    onChange={handleInputChange}
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

export default EditProfile;

import React, { useState } from 'react';
import '../Address/AddressForm.css';

const EditProfile = ({fetchUserData}) => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [validationMsg, setValidationMsg] = useState('');
  const [userAdded, setUserAdded] = useState(false); // Add state variable to track whether address was added or not
  const [showForm, setShowForm] = useState(true);


  const handleInputChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleUserSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('User:Token');
    const response = await fetch('http://localhost:8089/api/user/edit_user', {
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
    } else {
      setValidationMsg(resultData.message);
    }
  };
  const handleCancel = () => {
    setShowForm(false);
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
    {showForm && (
    <div className="addAddressContainer">
    <h4>Update Profile</h4>
      <div className="addAddress-card"> 
      {userAdded ? ( 
        <p>Profile updated successfully.</p>
      ) : (
        <div className="address-form">
          <form onSubmit={handleUserSubmit}>
            <div className="address-form-group">
              <div className="address-form-group-left">
                <div className="form-group">
                  <label htmlFor="street">First Name:</label>
                  <input
                    type="text"
                    id="firstName"
                    className='textCSS'
                    name="firstName"
                    value={user.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">Last Name:</label>
                  <input
                    type="text"
                    className='textCSS'
                    id="lastName"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="address-form-group-right">
                <div className="form-group">
                  <label htmlFor="state">Phone Number:</label>
                  <input
                    type="text"
                    className='textCSS'
                    id="phoneNumber"
                    name="phoneNumber"
                    value={user.phoneNumber}
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

export default EditProfile;

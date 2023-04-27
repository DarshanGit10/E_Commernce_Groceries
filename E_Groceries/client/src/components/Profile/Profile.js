import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('User:Token');
      const response = await fetch('http://localhost:8089/api/get_user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `${token}`,
        },
      });
      const resData = await response.json();
      setUserData(resData);
    };
    fetchUserData();
  }, []);

  return (
    <>
      {userData && (
        <div className="profile-card">
          <h1 className="profile-name">{userData.firstName} {userData.lastName}</h1>
          <div className="profile-info">
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Phone Number:</strong> {userData.phoneNumber}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;

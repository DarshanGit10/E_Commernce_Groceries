import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './navbar.css'


const Navbar = () => {
  let navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('User:Token')
    navigate('/')
  }
  return (
    <>
      <div>
        <nav className="navbar">
          <div className="navbar-left">
            <Link to="/">
              <img src="" alt="Logo" className="logo" />
              <span className="logo-name">Logo Name</span>
            </Link>
          </div>
          <div className="navbar-middle">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">About</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="navbar-right">
            <ul className="navbar-nav">
              {
                !localStorage.getItem('User:Token') ? <><li className="nav-item">
                  <Link className="btn btn-outline-primary mr-2" role='button' to="/login">Log In</Link>
                </li>
                  <li className="nav-item">
                    <Link className="btn btn-primary" role='button' to="/signup">Sign Up</Link>
                  </li> </> : <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
              }
            </ul>
          </div>
        </nav></div>
    </>

  )
}

export default Navbar
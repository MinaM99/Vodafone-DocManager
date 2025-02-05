import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import config from './../../data/config.json';
import VodafoneIcon from './../../assets/vodafone-icon.png';
import UserIcon from './../../assets/user-icon.png'; // Import the user icon

const Navbar = ({ username, userGroup, onLogout }) => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [currentView, setCurrentView] = useState(userGroup === 'both' ? 'statistics' : userGroup);
  const navigate = useNavigate();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  // Toggle the logout confirmation popup
  const toggleLogoutPopup = () => setShowLogoutPopup(!showLogoutPopup);

  // Function to validate the token and redirect based on its status
  const checkAuthenticationAndRedirect = async () => {
    const clientToken = getCookie("dctmclientToken");
    if (!clientToken) {
      console.log("No token found, redirecting to login page");
      window.location.href = "/Vodafone-DocManager";
      return;
    }

    // Validate token as usual
    try {
      const response = await fetch(
        `${config.documentumUrl}/dctm-rest/repositories/${config.repositoryName}`,
        {
          method: "GET",
          headers: { DCTMClientToken: clientToken },
          //credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Token is valid, refreshing page");
        window.location.reload();
      } else {
        document.cookie = "dctmclientToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/Vodafone-DocManager";
      }
    } catch (error) {
      console.error("Error validating token:", error);
      document.cookie = "dctmclientToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/Vodafone-DocManager";
    }
  }; 

  const handleNavigation = (view) => {
    setCurrentView(view);
    navigate(`/Vodafone-DocManager/${view}`);
  };

  return (
    <nav className="navbar">
      {/* Left section: Logo */}
      <div className="navbar-left">
        <Link to="#" onClick={(e) => { e.preventDefault();
          checkAuthenticationAndRedirect();
        }}>
          <img
            src={VodafoneIcon}
            alt="Vodafone Logo"
            className="vodafone-logo"
          />
        </Link>
      </div>

      {/* Center section: Navigation items */}
      <div className="navbar-center">
        {userGroup === 'both' && (
          <>
            <button
              className={`nav-item ${currentView === 'statistics' ? 'active' : ''}`}
              onClick={() => handleNavigation('statistics')}
            >
              Statistics
            </button>
            <button
              className={`nav-item ${currentView === 'records' ? 'active' : ''}`}
              onClick={() => handleNavigation('records')}
            >
              Records
            </button>
          </>
        )}
        {userGroup === 'vf_stats_users' && (
          <button
            className="nav-item active"
            onClick={() => handleNavigation('statistics')}
          >
            Statistics
          </button>
        )}
        {userGroup === 'vf_records_users' && (
          <button
            className="nav-item active"
            onClick={() => handleNavigation('records')}
          >
            Records
          </button>
        )}
      </div>

      {/* Right section: User icon and username */}
      <div className="navbar-right">
        <span className="username">{username}</span>
        <img
          src={UserIcon}
          alt="User Icon"
          className="user-icon"
          onClick={toggleLogoutPopup}
        />
      </div>

      {/* Logout confirmation popup */}
      {showLogoutPopup && (
        <div className="logout-popup">
          <div className="logout-popup-content">
            <p>Are you sure you want to logout?</p>
            <button className="confirm-logout-button" onClick={onLogout}>
              Yes
            </button>
            <button className="cancel-logout-button" onClick={toggleLogoutPopup}>
              No
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
import React, { useState } from "react";
import "./Navbar.css"; // Import CSS for styling
import UserIcon from "./../../assets/user-icon.png";
import VodafoneIcon from "./../../assets/vodafone-icon.png";
import config from "./../../data/config.json"; // Import config file

const Navbar = ({ username, userGroup, onLogout }) => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [currentView, setCurrentView] = useState(userGroup === 'both' ? 'statistics' : userGroup);

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



  return (
    <nav className="navbar">
      {/* Left section (could contain other content like user icon) */}
      <div></div>

      {/* Center section: Logo and Text */}
      <div className="navbar-center">
        <div className="vodafone-logo-container">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              checkAuthenticationAndRedirect();
            }}
          >
            <img
              src={VodafoneIcon}
              alt="Vodafone Logo"
              className="vodafone-icon"
            />
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              checkAuthenticationAndRedirect();
            }}
            className="vodafone-link-text"
          >
            Vodafone
          </a>
        </div>
      </div>

      {/* Right section: User and Logout */}
      <div className="logout-container">
        <span className="username">{username}</span>
        <img
          src={UserIcon}
          alt="Logout"
          className="logout-icon"
          onClick={toggleLogoutPopup}
        />
        {showLogoutPopup && (
          <div className="logout-popup">
            <p>Are you sure you want to logout?</p>
            <button className="logout-yes-button" onClick={onLogout}>
              Yes
            </button>
            <button className="logout-no-button" onClick={toggleLogoutPopup}>
              No
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

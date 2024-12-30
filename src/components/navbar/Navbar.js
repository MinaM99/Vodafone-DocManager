import React, { useState } from "react";
import "./Navbar.css"; // Import CSS for styling
import UserIcon from "./../../assets/user-icon.png";
import VodafoneIcon from "./../../assets/vodafone-icon.png";
import config from "./../../data/config.json"; // Import config file

const Navbar = ({ username }) => {
  // State for showing the logout confirmation popup
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Retrieve the client token from sessionStorage
  const clientToken = sessionStorage.getItem("dctmclientToken");

  // URL for logout endpoint
  const logoutUrl = `${config.documentumUrl}/dctm-rest/logout`;

  // Common headers for API requests
  const headers = { DCTMClientToken: clientToken };

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      const response = await fetch(logoutUrl, {
        method: "GET",
        headers: headers,
       // credentials: "include", // Include cookies with the request
      });

      if (response.ok) {
        console.log("User logged out successfully");
        sessionStorage.clear(); // Clear session data
        window.location.href = "/Vodafone-DocManager"; // Redirect to login page
      } else {
        console.error("Failed to log out", response.status);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Function to validate the token and redirect based on its status
  const checkAuthenticationAndRedirect = async () => {
    const clientToken = sessionStorage.getItem("dctmclientToken");
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
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Token is valid, refreshing page");
        window.location.reload();
      } else {
        sessionStorage.removeItem("dctmclientToken");
        window.location.href = "/Vodafone-DocManager";
      }
    } catch (error) {
      console.error("Error validating token:", error);
      sessionStorage.removeItem("dctmclientToken");
      window.location.href = "/Vodafone-DocManager";
    }
  };

  // Toggle the logout confirmation popup
  const toggleLogoutPopup = () => setShowLogoutPopup(!showLogoutPopup);

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
            <button className="logout-yes-button" onClick={handleLogout}>
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

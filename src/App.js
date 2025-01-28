import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/login/LoginPage";
import Statistics from "./components/statistics/Statistics";
import Records from "./components/records/Records";
import Navbar from "./components/navbar/Navbar";
import "./App.css";
import config from "./data/config.json";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track login state
  const [isTokenChecked, setIsTokenChecked] = useState(false);  // Check if token validation is done
  const [username, setUsername] = useState("");  // Store logged-in user's username
  const [userGroup, setUserGroup] = useState("");  // Store the user group

  const currentUserURL = `${config.documentumUrl}/dctm-rest/repositories/${config.repositoryName}/currentuser`;  // URL for current user data

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  useEffect(() => {
    const checkToken = async () => {
      const clientToken = getCookie("dctmclientToken");
      const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";  // Check if user is logged in
      const storedUsername = localStorage.getItem("username");
      const storedUserGroup = localStorage.getItem("userGroup");

      if (!clientToken || !storedIsLoggedIn) {
        setIsLoggedIn(false);
        setIsTokenChecked(true);
        return;
      }

      try {
        const response = await fetch(currentUserURL, {
          method: "GET",
          headers: { DCTMClientToken: clientToken },  // Pass token for authentication
        });

        if (response.ok) {
          const userData = await response.json();
          const currentUsername = userData.properties.user_name;

          if (storedUsername && storedUsername !== currentUsername) {
            console.error("Different user detected, logging out...");
            document.cookie = "dctmclientToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            localStorage.removeItem("userGroup");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("username");
            setIsLoggedIn(false);
          } else {
            setUsername(currentUsername || "Success");  // Set username
            setUserGroup(storedUserGroup || userData.properties.user_group);  // Set user group
            localStorage.setItem("username", currentUsername);  // Store username in localStorage
            setIsLoggedIn(true);
            localStorage.setItem("loginEvent", JSON.stringify({ isLoggedIn: true, username: currentUsername })); // Set login event in localStorage
          }
        } else {
          console.error("Invalid token, redirecting...");
          document.cookie = "dctmclientToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          localStorage.removeItem("userGroup");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("username");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        document.cookie = "dctmclientToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("userGroup");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
      }
      setIsTokenChecked(true);
    };

    checkToken();

    // Listen for changes in localStorage
    const handleStorageChange = (event) => {
      if (event.key === "loginEvent") {
        const { isLoggedIn, username } = JSON.parse(event.newValue);
        if (isLoggedIn) {
          const clientToken = getCookie("dctmclientToken");
          if (clientToken) {
            setUsername(username);
            setIsLoggedIn(true);
          }
        } else {
          setIsLoggedIn(false);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogin = (token, userGroup, username) => {
    setUserGroup(userGroup);
    setIsLoggedIn(true);
    setUsername(username);
   localStorage.setItem("userGroup", userGroup);  // Store user group
    localStorage.setItem("isLoggedIn", "true");  // Mark as logged in
    localStorage.setItem("username", username);  // Store username
    localStorage.setItem("loginEvent", JSON.stringify({ isLoggedIn: true, username })); // Set login event in localStorage
  };

  const handleLogout = async () => {
    const clientToken = getCookie("dctmclientToken");
    const logoutUrl = `${config.documentumUrl}/dctm-rest/logout`;

    try {
      const response = await fetch(logoutUrl, {
        method: "GET",
        headers: { DCTMClientToken: clientToken },
        // credentials: "include", // Include cookies with the request
      });

      if (response.ok) {
        console.log("User logged out successfully");
        document.cookie = "dctmclientToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("userGroup");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
         window.location.href = "/Vodafone-DocManager/login"; // Redirect to the login page
      } else {
        console.error("Failed to log out", response.status);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!isTokenChecked) {
    return <div>Loading...</div>;  // Show loading until token validation is done
  }

  return (
    <Router>
      <div className={`app ${isLoggedIn ? "logged-in" : "login-page"}`}> 
        {isLoggedIn && <Navbar username={username} userGroup={userGroup} onLogout={handleLogout} />}   
        <Routes>
          <Route
            path="/Vodafone-DocManager/login"
            element={
              isLoggedIn ? (
                <Navigate
                  to={
                    userGroup === "vf_stats_users"
                      ? "/Vodafone-DocManager/statistics"
                      : userGroup === "vf_records_users"
                      ? "/Vodafone-DocManager/records"
                      : "/Vodafone-DocManager/login"  // Fallback route
                  }
                />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />

          {/* Statistics Route */}
          <Route
            path="/Vodafone-DocManager/statistics"
            element={
              isLoggedIn && (userGroup === "vf_stats_users" || userGroup === "both") ? (
                <Statistics username={username} userGroup={userGroup} />  // Pass username and userGroup to Statistics
              ) : (
                <Navigate to="/Vodafone-DocManager/login" />
              )
            }
          />

          {/* Records Route */}
          <Route
            path="/Vodafone-DocManager/records/*"
            element={
              isLoggedIn && (userGroup === "vf_records_users" || userGroup === "both") ? (
                <Records username={username} />  // Pass username to Records
              ) : (
                <Navigate to="/Vodafone-DocManager/login" />
              )
            }
          />

          {/* Default Redirect for Logged-In Users */}
          <Route
            path="/Vodafone-DocManager"
            element={
              isLoggedIn ? (
                <Navigate
                  to={
                    userGroup === "vf_stats_users"
                      ? "/Vodafone-DocManager/statistics"
                      : userGroup === "vf_records_users"
                      ? "/Vodafone-DocManager/records"
                      : userGroup === "both"
                      ? "/Vodafone-DocManager/statistics"  // Default to statistics if both groups
                      : "/Vodafone-DocManager/login"  // Fallback if userGroup is neither
                  }
                />
              ) : (
                <Navigate to="/Vodafone-DocManager/login" />
              )
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/Vodafone-DocManager" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
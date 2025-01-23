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
  const clientToken = sessionStorage.getItem("dctmclientToken");  // Retrieve token from session storage

  const currentUserURL = `${config.documentumUrl}/dctm-rest/repositories/${config.repositoryName}/currentuser`;  // URL for current user data

  useEffect(() => {
    const checkToken = async () => {
      const storedUserGroup = sessionStorage.getItem("userGroup");
      const storedIsLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";  // Check if user is logged in

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
          setUsername(userData.properties.user_name || "Success");  // Set username
          setUserGroup(storedUserGroup || userData.properties.user_group);  // Set user group
          setIsLoggedIn(true);
        } else {
          console.error("Invalid token, redirecting...");
          sessionStorage.removeItem("dctmclientToken");
          sessionStorage.removeItem("userGroup");
          sessionStorage.removeItem("isLoggedIn");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        sessionStorage.removeItem("dctmclientToken");
        sessionStorage.removeItem("userGroup");
        sessionStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
      }
      setIsTokenChecked(true);
    };

    checkToken();

    // Add event listener for storage changes
    const handleStorageChange = (event) => {
      if (event.key === 'logoutEvent') {
        const { userName } = JSON.parse(event.newValue);
        if (userName === username) {
          console.log('Logout event detected for the same user, logging out...');
          sessionStorage.removeItem("dctmclientToken");
          sessionStorage.removeItem("userGroup");
          sessionStorage.removeItem("isLoggedIn");
          setIsLoggedIn(false);
          localStorage.clear(); // Clear localStorage
          window.location.href = "/Vodafone-DocManager/login";
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [clientToken, currentUserURL, username]);

  const handleLogin = (token, userGroup) => {
    setUserGroup(userGroup);
    setIsLoggedIn(true);
    sessionStorage.setItem("dctmclientToken", token);  // Store token
    sessionStorage.setItem("userGroup", userGroup);  // Store user group
    sessionStorage.setItem("isLoggedIn", "true");  // Mark as logged in
  };

  if (!isTokenChecked) {
    return <div>Loading...</div>;  // Show loading until token validation is done
  }

  return (
    <Router>
      <div className={`app ${isLoggedIn ? "logged-in" : "login-page"}`}> 
        {isLoggedIn && <Navbar username={username} />}   
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
              isLoggedIn && userGroup === "vf_stats_users" ? (
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
              isLoggedIn && userGroup === "vf_records_users" ? (
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
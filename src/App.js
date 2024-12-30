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
import jsonData from "./data/data.json";
import "./App.css";
import config from "./data/config.json";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [userGroup, setUserGroup] = useState("");
  const [data, setData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [noDataFound, setNoDataFound] = useState(false);
  const clientToken = sessionStorage.getItem("dctmclientToken");

  const currentUserURL = `${config.documentumUrl}/dctm-rest/repositories/${config.repositoryName}/currentuser`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(jsonData);
        setFilteredData(jsonData);
      } catch (error) {
        console.error("Error loading JSON data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      const storedUserGroup = sessionStorage.getItem("userGroup");
      const storedIsLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  
      if (!clientToken || !storedIsLoggedIn) {
        setIsLoggedIn(false);
        setIsTokenChecked(true);
        return;
      }
  
      try {
        const response = await fetch(currentUserURL, {
          method: "GET",
          headers: { DCTMClientToken: clientToken },
          //credentials: "include",
        });
  
        if (response.ok) {
          const userData = await response.json();
          setUsername(userData.properties.user_name || "Success");
          setUserGroup(storedUserGroup || userData.properties.user_group);
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
  }, [clientToken, currentUserURL]);
  
  const handleLogin = (token, userGroup) => {
    setUserGroup(userGroup);
    setIsLoggedIn(true);
    sessionStorage.setItem("dctmclientToken", token);
    sessionStorage.setItem("userGroup", userGroup);
    sessionStorage.setItem("isLoggedIn", "true");
  };
  

  const handleFilterData = (filtered) => {
    setFilteredData(filtered);
    setNoDataFound(Object.keys(filtered).length === 0);
  };

  if (!isTokenChecked) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className={`app ${isLoggedIn ? "logged-in" : "login-page"}`}>
        {isLoggedIn && <Navbar username={username} />}
        <Routes>
          {/* Login Route */}
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
                      : "/Vodafone-DocManager/login" // Fallback if userGroup is neither
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
                <Statistics
                  username={username}
                  data={data}
                  filteredData={filteredData}
                  noDataFound={noDataFound}
                  onFilterData={handleFilterData}
                />
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
                <Records username={username} />
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
                      : "/Vodafone-DocManager/login" // Fallback if userGroup is neither
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

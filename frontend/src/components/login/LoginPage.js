import React, { useState, useEffect } from 'react';
import classes from './LoginPage.module.css';
import config from '../../data/config';

const LoginPage = ({ onLogin }) => {
  const [windowsusername, setWindowsUsername] = useState('INVALID');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Fetch data from the backend using useEffect to get Windows UserName
  useEffect(() => {
    let intervalId;
    // Run machine details logic first
    window.location.href = "MacDetails://";
  
    const fetchWindowsUsername = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Set timeout to 5 seconds
  
      try {
        const response = await fetch(`${config.backendURL}/get-windowsusername`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });
  
        clearTimeout(timeoutId); // Clear the timeout if the request completes in time
  
        if (!response.ok) {
          throw new Error('Failed to fetch username');
        }
  
        const data = await response.json();
        setWindowsUsername(data.windowsUsername);
        console.log('WindowsUsername:', data.windowsUsername);

        if (data.windowsUsername !== 'INVALID') {
          clearInterval(intervalId); // Stop the loop if a valid username is retrieved
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.error('Fetch request timed out');
        } else {
          console.error('Error:', error);
        }
        setWindowsUsername('INVALID');
      }
    };
  
    intervalId = setInterval(fetchWindowsUsername, 5000); // Run fetchWindowsUsername every 5 seconds
  
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []); // Empty dependency array means this runs only once when the component mounts

  const setCookie = (name, value) => {
    document.cookie = `${name}=${value}; path=/`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Set loading to true before making the request
    setError(''); // Clear any previous error message when login starts

    const loginUrl = `${config.documentumUrl}/dctm-rest/repositories/${config.repositoryName}`;
    try {
      const response = await fetch(loginUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${windowsusername}:${password}`)}`, // Base64 encode credentials
          'DOCUMENTUM-CUSTOM-UNAUTH-SCHEME': true, // Ensure string value
        },
        //credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorText = await response.text();
        throw new Error(`Login failed: ${errorText}`);
      }

      console.log('Response Headers:');
      response.headers.forEach((value, name) => {
        console.log(`${name}: ${value}`);
      });

      // Assuming token is in response headers (replace with actual header key)
      const token = response.headers.get('dctmclientToken'); // Example: Replace with your actual token header key

      if (!token) {
        throw new Error('Token not found in response headers.');
      }

      // Set the token as a session cookie
      setCookie('dctmclientToken', token);

      // Now, fetch the current user using the token
      const currentUserURL = `${config.documentumUrl}/dctm-rest/repositories/${config.repositoryName}/currentuser`;
      const currentUserResponse = await fetch(currentUserURL, {
        method: 'GET',
        headers: {
          'DCTMClientToken': token, // Use the token here
        },
        //credentials: 'include',
      });

      if (!currentUserResponse.ok) {
        const errorText = await currentUserResponse.text();
        throw new Error(`Failed to fetch current user: ${errorText}`);
      }

      const currentUserData = await currentUserResponse.json();
      const userName = currentUserData.properties.user_name;

      console.log('Current User:', currentUserData);

      // Fetch user groups using the token
      const currentUserGroupURL = `${config.documentumUrl}/dctm-rest/repositories/${config.repositoryName}/groups?user-name=${userName}`;
      const currentUserGroupResponse = await fetch(currentUserGroupURL, {
        method: 'GET',
        headers: {
          'DCTMClientToken': token, // Use the token here
        },
        //credentials: 'include',
      });

      if (!currentUserGroupResponse.ok) {
        const errorText = await currentUserGroupResponse.text();
        throw new Error(`Failed to fetch user groups: ${errorText}`);
      }

      const currentUserGroupData = await currentUserGroupResponse.json();
      console.log('User Groups:', currentUserGroupData);
      
      if (currentUserGroupData.entries && currentUserGroupData.entries.length > 0) {
        // Check if the user is part of vf_stats_users or vf_records_users or both
        const isStatsUser = currentUserGroupData.entries.some(entry => entry.title === 'vf_stats_users');
        const isRecordsUser = currentUserGroupData.entries.some(entry => entry.title === 'vf_records_users');
        
        if (isStatsUser && isRecordsUser) {
          // User is part of both groups
          onLogin('both', userName, windowsusername);
        } else if (isStatsUser) {
          // User is part of vf_stats_users group
          onLogin('vf_stats_users', userName ,windowsusername);
        } else if (isRecordsUser) {
          // User is part of vf_records_users group
          onLogin('vf_records_users', userName ,windowsusername);
        } else {
          // User is not part of any valid group
          setError('User group does not have access to this application.');
        }
      } else {
        // If there are no groups (entries is empty or undefined), show an error message
        setError('User not authorized. Please contact the system administrator.');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false); // Set loading to false after the request is finished (either success or error)
    }
  };

  return (
    <div className={classes.loginPage}>
      <h1 className={classes.loginTitle}>Vodafone Documentum DocManager</h1>
      <form onSubmit={handleLogin} className={classes.loginForm}>
        <div className={classes.inputGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={windowsusername}
            onChange={(e) => setWindowsUsername(e.target.value)}
            required
            disabled // Disable input for user input
          />
        </div>
        <div className={classes.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading} // Disable input while loading
          />
        </div>
        {error && <p className={classes.errorMessage}>{error}</p>}  {/* Display error message */}

        {isLoading ? (
          <div className={classes.loadingSpinner}>
            <div className={classes.spinner}></div> {/* Add a loading spinner */}
            <p>Logging in...</p>
          </div>
        ) : (
          <button type="submit" className={classes.loginButton}>Login</button>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
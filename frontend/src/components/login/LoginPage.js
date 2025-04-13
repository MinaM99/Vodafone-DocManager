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

  const fetchAllUserGroups = async (token, userName) => {
    const groups = [];
    let nextPage = `${config.documentumUrl}/dctm-rest/repositories/${config.repositoryName}/groups?user-name=${userName}&items-per-page=100&page=1`;
    let hasMorePages = true;

    while (hasMorePages) {
      const currentUserGroupResponse = await fetch(nextPage, {
        method: 'GET',
        headers: {
          'DCTMClientToken': token, // Use the token here
          'DOCUMENTUM-CUSTOM-UNAUTH-SCHEME': true, // Prevent login dialog boxes
        },
      });

      if (!currentUserGroupResponse.ok) {
        const errorText = await currentUserGroupResponse.text();
        throw new Error(`Failed to fetch user groups: ${errorText}`);
      }

      const currentUserGroupData = await currentUserGroupResponse.json();
      console.log('Fetched User Groups Page:', currentUserGroupData);

      // Add the current page's entries to the groups array
      groups.push(...currentUserGroupData.entries);

      // Check if there is a next page in the links array
      const nextLink = currentUserGroupData.links.find((link) => link.rel === 'next');
      if (nextLink) {
        nextPage = nextLink.href; // Use the href for the next page
      } else {
        hasMorePages = false; // No more pages
      }
    }

    return groups;
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
          'DOCUMENTUM-CUSTOM-UNAUTH-SCHEME': true, // Prevent login dialog boxes
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Login failed: ${errorText}`);
      }

      const token = response.headers.get('dctmclientToken');
      if (!token) {
        throw new Error('Token not found in response headers.');
      }

      setCookie('dctmclientToken', token);

      // Fetch the current user
      const currentUserURL = `${config.documentumUrl}/dctm-rest/repositories/${config.repositoryName}/currentuser`;
      const currentUserResponse = await fetch(currentUserURL, {
        method: 'GET',
        headers: {
          'DCTMClientToken': token,
          'DOCUMENTUM-CUSTOM-UNAUTH-SCHEME': true,
        },
      });

      if (!currentUserResponse.ok) {
        const errorText = await currentUserResponse.text();
        throw new Error(`Failed to fetch current user: ${errorText}`);
      }

      const currentUserData = await currentUserResponse.json();
      const userName = currentUserData.properties.user_name;

      console.log('Current User:', currentUserData);

      // Fetch all user groups (handle pagination)
      const allGroups = await fetchAllUserGroups(token, userName);

      console.log('All User Groups:', allGroups);

      // Check if the user is part of vf_stats_users or vf_records_users or both
      const isStatsUser = allGroups.some((entry) => entry.title === 'vf_stats_users');
      const isRecordsUser = allGroups.some((entry) => entry.title === 'vf_records_users');

      if (isStatsUser && isRecordsUser) {
        // User is part of both groups
        onLogin('both', userName, windowsusername);
      } else if (isStatsUser) {
        // User is part of vf_stats_users group
        onLogin('vf_stats_users', userName, windowsusername);
      } else if (isRecordsUser) {
        // User is part of vf_records_users group
        onLogin('vf_records_users', userName, windowsusername);
      } else {
        // User is not part of any valid group
        setError('User group does not have access to this application.');
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
        {error && <p className={classes.errorMessage}>{error}</p>} {/* Display error message */}

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
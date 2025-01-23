import React, { useState } from 'react';
import './LoginPage.css';
import config from './../../data/config.json';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Set loading to true before making the request
    setError(''); // Clear any previous error message when login starts

    const loginUrl = `${config.documentumUrl}/dctm-rest/repositories/${config.repositoryName}`;
    try {
      const response = await fetch(loginUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`, // Base64 encode credentials
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

      // Store the token in sessionStorage
      sessionStorage.setItem('dctmclientToken', token);

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
      
      // Check if 'entries' exist and is not empty
      if (currentUserGroupData.entries && currentUserGroupData.entries.length > 0) {
        // Find the valid group the user is part of (either vf_stats_users or vf_records_users)
        const validGroup = currentUserGroupData.entries.find(entry =>
          entry.title === 'vf_stats_users' || entry.title === 'vf_records_users'
        );
      
        if (validGroup) {
          // If the user is part of a valid group, pass only the group's title and the token to the parent component
          onLogin(token, validGroup.title);
        } else {
          // If the user is not part of a valid group, show the error message
          setError('User group does not have access to this application.');
        }
      } else {
        // If there are no groups (entries is empty or undefined), show an error message
        setError('User does not belong to any valid group.');
      }
      

    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false); // Set loading to false after the request is finished (either success or error)
    }
  };

  return (
    <div className="login-page">
      <h1 className="login-title">Vodafone Documentum DocManager</h1>
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading} // Disable input while loading
          />
        </div>
        <div className="input-group">
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
        {error && <p className="error-message">{error}</p>}  {/* Display error message */}

        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div> {/* Add a loading spinner */}
            <p>Logging in...</p>
          </div>
        ) : (
          <button type="submit" className="login-button">Login</button>
        )}
      </form>
    </div>
  );
};

export default LoginPage;

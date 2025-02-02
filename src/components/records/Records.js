import React, { useState, useEffect } from "react";
import "./Records.css"; // Ensure this file includes the styles above
import config from "./../../data/config.json";




const Records = ({ username }) => {
  // State for input fields
  const [boxNumber, setBoxNumber] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [msisdn, setMsisdn] = useState("");
  const [statusData, setStatusData] = useState([]); // To store status results
  const [documentTypes, setDocumentTypes] = useState([]); // To store document types from API
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [errors, setErrors] = useState({}); // State for input errors
  const [ipAddress, setIpAddress] = useState(''); // State for IP address

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };
  const clientToken = getCookie("dctmclientToken");

  const dqlQuery = '?dql=select%20name%20from%20dm_type%20where%20name%20like%20%27voda_%25%27';
  const dqlUrl = `${config.documentumUrl}/dctm-rest/repositories/${config.repositoryName}${dqlQuery}`;

  // Fetch document types when the component mounts
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const response = await fetch(dqlUrl, {
          method: "POST", // Use POST method
          headers: {
            DCTMClientToken: clientToken, // Indicate that we're sending JSON
          },
          //credentials: "include", // Include cookies with the request
          body: JSON.stringify(dqlQuery), // Pass the dql query in the body
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        const allTypes = data.entries.map((entry) => entry.title); // Extract titles (document types)
  
        // Filter for specific document types
        const desiredTypes = [
          "voda_cash_contract",
          "voda_post_paid_contract",
          "voda_pre_paid_contract",
          "voda_corporate_contracts",
          "voda_adsl_contract",
        ];
        const filteredTypes = allTypes.filter((type) => desiredTypes.includes(type));
  
        setDocumentTypes(filteredTypes); // Set document types state
      } catch (error) {
        console.error("Error fetching document types:", error);
      }
    };
  
    fetchDocumentTypes();
  }, [config.documentumUrl, config.repositoryName]); // Re-run if config changes
  

  // Fetch the client's IP address when the component mounts
  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
        console.log(data.ip); // Log the IP address
      } catch (error) {
        console.error('Error fetching IP address:', error);
      }
    };

    fetchIpAddress();
  }, []);
  
  
  const handleSubmit = async () => {
    
    const newErrors = {};
    // Check if any of the input fields are empty
    if (!boxNumber) {
      newErrors.boxNumber = "Please enter Box Number.";
    }
    if (!documentType) {
      newErrors.documentType = "Please select a Document Type.";
    }
    if (!msisdn) {
      newErrors.msisdn = "Please enter MSISDN.";
    }

    const errorKeys = Object.keys(newErrors);
    if (errorKeys.length > 0) {
      setErrors(newErrors);
      if (errorKeys.length === 1) {
        setErrorMessage(newErrors[errorKeys[0]]);
      } else {
        setErrorMessage("Please fill in all required fields.");
      }
      return; // Prevent submitting if any field is empty
    }

    setErrors({});
    setErrorMessage("");

    // Construct the request body
    const requestBody = {
      customerId: msisdn,
      documentType: documentType,
      boxNumber: boxNumber,
      appUserName: username,
      ipAddress: ipAddress, // Include the IP address in the request body
    };

    try {
      // Send the POST request
      const response = await fetch(`${config.documentumUrl}/vodafone/archive`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          DCTMClientToken: clientToken,
        },
        body: JSON.stringify(requestBody),
      });

      // Parse the response
      const data = await response.json();

      // Reset error states
      setErrors({});

      // Check for specific error messages
      if (data.Error === "Box Number & MSISDN don't exist") {
        setErrors({
          boxNumber: true,
          msisdn: true,
          documentType: true,
        });
      } else if (data.Error === "Box doesn't exist") {
        setErrors({
          boxNumber: true,
        });
      } else if (data.Error === "Document not found. check MSISDN/Document Type") {
        setErrors({
          msisdn: true,
          documentType: true,
        });
      }

      let status;
      let description;
      let statusClass;

      if (response.ok) {
        // Success case (HTTP 200)
        statusClass = "success-row";
        status = "Succeeded";
        description = data.Succeeded || "Archived successfully.";
      } else {
        // Error case (e.g., HTTP 404)
        statusClass = "error-row";
        status = "Failed";
        description = data.Error || data.message || "An error occurred.";
      }

      // Add the response data to the status table
      const newStatus = {
        boxNumber: boxNumber,
        msisdn: msisdn,
        documentType: documentType,
        status: status,
        description: description,
        statusClass,
      };
  
      // Add the new status to the existing list
      setStatusData((prevStatusData) => [...prevStatusData, newStatus]);
      setErrorMessage(""); // Clear error message on successful submission
    } catch (error) {
      console.error("Error sending POST request:", error);
      // Handle network or unexpected errors
      const newStatus = {
        boxNumber: boxNumber,
        msisdn: msisdn,
        documentType: documentType,
        status: "Error",
        description: "Network error or unexpected issue occurred.",
        statusClass: "error-row",
      };
      setStatusData((prevStatusData) => [...prevStatusData, newStatus]);
      setErrorMessage(""); // Clear error message on successful submission
    }
  };
  
  // Reset function to clear input fields and status data
  const handleReset = () => {
    setBoxNumber("");
    setDocumentType("");
    setMsisdn("");
    setStatusData([]);
    setErrorMessage(""); // Clear error message on reset
    setErrors({});
  };

  return (
    <div className="records-container">
      <div className="records-content">
        {/* Form for Box Number, Document Type, and MSISDN */}
        <div className="input-panel">
          <div>
            <label htmlFor="boxNumber">
              Box Number: <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              id="boxNumber"
              value={boxNumber}
              onChange={(e) => {
                setBoxNumber(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, boxNumber: "" }));
              }}
              className={errors.boxNumber ? "input-error" : ""}
            />
          </div>
          <div>
            <label htmlFor="documentType">
              Document Type: <span style={{ color: "red" }}>*</span>
            </label>
            <select
              id="documentType"
              value={documentType}
              onChange={(e) => {
                setDocumentType(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, documentType: "" }));
              }}
              className={errors.documentType ? "input-error" : ""}
            >
              <option value="">Select a document type</option>
              {documentTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="msisdn">
              MSISDN: <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="number"
              id="msisdn"
              value={msisdn}
              onChange={(e) => {
                setMsisdn(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, msisdn: "" }));
              }}
              className={errors.msisdn ? "input-error" : ""}
            />
          </div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <div className="button-group">
            <button onClick={handleSubmit}>Submit</button>
            <button className="reset-button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        {/* Status Panel */}
        <div className="status-panel">
          <h3>Status Information</h3>
          {statusData.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Box Number</th>
                  <th>MSISDN</th>
                  <th>Document Type</th>
                  <th>Status</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {statusData.map((status, index) => (
                  <tr key={index} className={status.statusClass}>
                    <td>{status.boxNumber}</td>
                    <td>{status.msisdn}</td>
                    <td>{status.documentType}</td>
                    <td>{status.status}</td>
                    <td>{status.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No status data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Records;
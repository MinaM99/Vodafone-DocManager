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
  const clientToken = sessionStorage.getItem("dctmclientToken");

  const dqlQuery = '?dql=select%20name%20from%20dm_type%20where%20name%20like%20%27voda_%25%27';
  const dqlUrl = `${config.documentumUrl}/dctm-rest/repositories/${config.repositoryName}${dqlQuery}`;

  // Fetch document types when the component mounts
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const response = await fetch(dqlUrl, {
          method: "POST", // Use POST method
          headers: {
            DCTMClientToken : clientToken, // Indicate that we're sending JSON
          },
          credentials: "include", // Include cookies with the request
          body: JSON.stringify(dqlQuery), // Pass the dql query in the body
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const types = data.entries.map(entry => entry.title); // Extract titles (document types)
        setDocumentTypes(types); // Set document types state
      } catch (error) {
        console.error("Error fetching document types:", error);
      }
    };

    fetchDocumentTypes();
  }, [config.documentumUrl, config.repositoryName]); // Re-run if config changes

  
  const handleSubmit = async () => {
    // Check if any of the input fields are empty
    if (!boxNumber || !documentType || !msisdn) {
      alert("Please fill in all fields.");
      return; // Prevent submitting if any field is empty
    }

    // Simulate the response with a 200 HTTP status for success or a different code for error
    const simulatedSuccessResponse = {
      status: 200, // HTTP status code 200 for success
      response: {
        properties: {
          cch_status: "ARCHIVED", // Status to display in the table
          cch_comments: "Document is archived", // Additional comment
        },
      },
      message: "Document processed successfully.",
    };

    const simulatedErrorResponse = {
      status: 400, // HTTP status code 400 for error (example)
      message: "No Box Number exists.",
    };

    // Simulate API behavior
    let simulatedResponse;
    if (boxNumber === "123456") {
      simulatedResponse = simulatedSuccessResponse;
    } else {
      simulatedResponse = simulatedErrorResponse;
    }

    // Determine the status based on the HTTP response status code
    const statusClass = simulatedResponse.status === 200 ? "success-row" : "error-row";

    // Process the response and append to the existing statusData
    const newStatus = {
      msisdn: msisdn,
      documentType: documentType,
      status: simulatedResponse.status === 200 ? simulatedResponse.response.properties.cch_status : "Error",
      description: simulatedResponse.status === 200 ? simulatedResponse.response.properties.cch_comments : simulatedResponse.message,
      statusClass, // Add class for status row color
    };

    // Add the new status to the existing list (without erasing the old ones)
    setStatusData((prevStatusData) => [...prevStatusData, newStatus]);
  };

  // Reset function to clear input fields and status data
  const handleReset = () => {
    setBoxNumber("");
    setDocumentType("");
    setMsisdn("");
    setStatusData([]);
  };

  return (
    <div className="records-container">
      <div className="records-content">
        {/* Form for Box Number, Document Type, and MSISDN */}
        <div className="input-panel">
          <div>
            <label htmlFor="boxNumber">Box Number:</label>
            <input
              type="text"
              id="boxNumber"
              value={boxNumber}
              onChange={(e) => setBoxNumber(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="documentType">Document Type:</label>
            <select
              id="documentType"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
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
            <label htmlFor="msisdn">MSISDN:</label>
            <input
              type="text"
              id="msisdn"
              value={msisdn}
              onChange={(e) => setMsisdn(e.target.value)}
            />
          </div>
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
                  <th>MSISDN</th>
                  <th>Document Type</th>
                  <th>Status</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {statusData.map((status, index) => (
                  <tr key={index} className={status.statusClass}>
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

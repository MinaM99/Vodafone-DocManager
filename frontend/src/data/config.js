// src/data/config.js
const config = {
  documentumUrl: process.env.REACT_APP_DOCUMENTUM_URL,
  repositoryName: process.env.REACT_APP_REPOSITORY_NAME,
  backendURL: process.env.REACT_APP_BACKEND_URL,
  statusURL: `${process.env.REACT_APP_BACKEND_STATUS_ARCHIVE_BASE_URL}/status`,
  archiveURL: `${process.env.REACT_APP_BACKEND_STATUS_ARCHIVE_BASE_URL}/archive`,
};

export default config;
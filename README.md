# Vodafone-DocManager

This README provides instructions for setting up, running, and deploying the **Vodafone-DocManager** React application.

## Prerequisites

- Node.js installed on your system
- Tomcat server installed and running

## Steps to Run and Deploy the Application

### 1. Install Dependencies

First, ensure you have the required dependencies for the React app installed. Run the following command in the root directory of the project:

```bash
npm install
```

### 2. Start the Development Server

To start the app in development mode, use the command:

```bash
npm start
```

This will run the app locally. You can access it in your browser at:

```
http://localhost:3000
```

### 3. Build the App for Production

To deploy the app, create a production build by running:

```bash
npm run build
```

This will generate the production-ready files in a `build` directory in the project root.

### 4. Deploy to Tomcat

To deploy the app on a Tomcat server:

1. Navigate to your Tomcat's `webapps` directory.
2. Create a new folder named `Vodafone-DocManager`:
   ```
   <TOMCAT_HOME>/webapps/Vodafone-DocManager
   ```
3. Copy the contents of the `build` folder from your React app into this new folder:
   ```
   cp -r build/* <TOMCAT_HOME>/webapps/Vodafone-DocManager
   ```

### 5. Access the App on Tomcat

Once the files are copied and the Tomcat server is running, access the app in your browser at:

```
http://localhost:<TOMCAT_PORT>/Vodafone-DocManager
```

Replace `<TOMCAT_PORT>` with the port number where your Tomcat server is running (default is usually `8080`).

---

## Notes

- Configuration of Documentum port and repository name is located in the src/data/config.json file.
- Ensure that the Tomcat server is properly configured to serve static files.
- If you encounter any issues, check the Tomcat logs for errors.
- For customization or additional configurations, modify the `build` process or adjust the Tomcat settings accordingly.

## Troubleshooting

If the app doesn't load as expected:

- Ensure that the `npm run build` command was successful and all files were generated in the `build` folder.
- Check the permissions of the `Vodafone-DocManager` folder in the Tomcat `webapps` directory.
- Verify that the Tomcat server is running and accessible.




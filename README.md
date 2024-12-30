# Vodafone Documentum Documents Manager

## About the Project

The **Vodafone-DocManager** is an integration between Vodafone and Documentum, designed with two primary functionalities:

1. **Document Statistics**:

   - Displays comprehensive statistics on documents processed by Documentum.
   - Tracks successful and failed document processing, providing insights into operational performance.

2. **Records Archiving**:

   - Facilitates the archiving of physical documents.
   - Uses QR code scanning to input details such as box number, MSISDN, and document type.
   - Checks for the existence of a corresponding digital document in the system.
   - Creates and links a physical document to the identified digital document for efficient record management.

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
4. **Add `WEB-INF` and `web.xml` Configuration**:
   
   - Inside the `Vodafone-DocManager` folder, create a new directory called `WEB-INF`.
   - In the `WEB-INF` directory, create a file named `web.xml` and add the following content:
     
     ```xml
     <web-app xmlns="http://java.sun.com/xml/ns/javaee" version="3.0">
         <welcome-file-list>
             <welcome-file>index.html</welcome-file>
         </welcome-file-list>

         <error-page>
             <error-code>404</error-code>
             <location>/index.html</location>
         </error-page>
     </web-app>
     ```

   This step is necessary to handle client-side routing correctly in a React application. When using React Router, refreshing or directly accessing a route (e.g., `/login`) can result in a `404 Not Found` error because the Tomcat server tries to resolve the route itself instead of serving `index.html`. The `web.xml` configuration ensures that any unrecognized route will fallback to `index.html`, allowing React Router to handle the routing.

5. Restart the Tomcat server to apply the changes.

### 5. Access the App on Tomcat

Once the files are copied and the Tomcat server is running, access the app in your browser at:

```
http://localhost:<TOMCAT_PORT>/Vodafone-DocManager
```

Replace `<TOMCAT_PORT>` with the port number where your Tomcat server is running (default is usually `8080`).

---

## Notes

- Configuration of Documentum port and repository name is located in the `src/data/config.json` file.
- Ensure that the Tomcat server is properly configured to serve static files.
- If you encounter any issues, check the Tomcat logs for errors.
- For customization or additional configurations, modify the `build` process or adjust the Tomcat settings accordingly.

## Troubleshooting

If the app doesn't load as expected:

- Ensure that the `npm run build` command was successful and all files were generated in the `build` folder.
- Check the permissions of the `Vodafone-DocManager` folder in the Tomcat `webapps` directory.
- Verify that the Tomcat server is running and accessible.


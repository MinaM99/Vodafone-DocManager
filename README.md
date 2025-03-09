### Main README (Root Repo)

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

Additionally, the **v2 branch** in GitHub introduces enhanced **user session management** by replacing session storage with **cookies-based logic**. This approach ensures:

- **One user per browser** for tighter session control.
- **Cross-tab login consistency**, allowing the user to stay logged in across all tabs of the same browser.
- Improved security and session management.

---

## Prerequisites

- Node.js installed on your system
- PM2 process manager installed
- Tomcat server installed and running

---

## Frontend Setup & Deployment

### 1. Install Dependencies

Navigate to the `frontend` folder and install dependencies:

```bash
cd frontend
npm install
```

### 2. Start the Development Server

```bash
npm start
```

Access the app in your browser at:
```
http://localhost:3000
```

### 3. Build for Production

```bash
npm run build
```

### 4. Deploy to Tomcat (OPTION 1)
1. Configure `WEB-INF/web.xml`:

- Inside the `Vodafone-DocManager/frontend/build` folder, create a new directory called `WEB-INF`.
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

2. Navigate to Tomcat’s `webapps` directory.
3. Create a new folder named `Vodafone-DocManager`:
   ```bash
   <TOMCAT_HOME>/webapps/Vodafone-DocManager
   ```
4. Copy the `build` folder contents:
   ```bash
   cp -r build/* <TOMCAT_HOME>/webapps/Vodafone-DocManager
   ```

5. Restart Tomcat and access at:
```
http://localhost:<TOMCAT_PORT>/Vodafone-DocManager
```

---

### 4. Deploy to WebLogic (OPTION 2)

1. **Configure `WEB-INF/web.xml`:**

   After building the frontend files, navigate to the `frontend/build` folder, and create a new directory called `WEB-INF`.

   - Inside the `WEB-INF` directory, create a file named `web.xml` and add the following content:

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

   This step is necessary to handle client-side routing correctly in a React application. When using React Router, refreshing or directly accessing a route (e.g., `/login`) can result in a `404 Not Found` error because the WebLogic server tries to resolve the route itself instead of serving `index.html`. The `web.xml` configuration ensures that any unrecognized route will fallback to `index.html`, allowing React Router to handle the routing.

2. **Create a WAR file:**

   After configuring `web.xml`, you need to create a **WAR file** for deployment. In the `frontend/build` folder, run the following command to create the `frontend.war`:

   ```bash
   jar -cvf frontend.war -C build .
   ```

   This command creates a WAR file from the contents of the `build` directory.

3. **Deploy the WAR to WebLogic:**

   - Navigate to your **WebLogic domain's** `servers` directory.
   - Copy the `frontend.war` file into the `autodeploy` folder (you may need to create it if it doesn't exist):
     ```bash
     cp frontend.war <WEBLOGIC_HOME>/user_projects/domains/<DOMAIN_NAME>/servers/AdminServer/autodeploy/
     ```

4. **Restart WebLogic Server:**

   After copying the WAR file, restart the WebLogic server or perform an **automatic redeployment** via the WebLogic console to deploy the application.

   Access the deployed application at:
   ```
   http://<WEBLOGIC_HOST>:<WEBLOGIC_PORT>/Vodafone-DocManager
   ```

--- 

## Backend Setup & Deployment


## Setup & Deployment

### 1. Install Node.js

Before proceeding, ensure that **Node.js** is installed on your system. If it's not installed, you can download and install it from the official website:

- [Download Node.js](https://nodejs.org/)

You can verify if Node.js is installed by running the following command:

```bash
node -v
```

This will display the version of Node.js installed. Make sure it is at least version **12.x** or higher to ensure compatibility with the backend.

### 2. Install Dependencies

Once Node.js is installed, navigate to your backend directory and run the following command to install all required dependencies:

```bash
npm install
```

This will install all dependencies listed in package.json.

### 3. Install PM2

PM2 is a production process manager for Node.js applications. It will help in keeping the backend running smoothly and in managing it effectively.

To install PM2 globally, use the following command:

```bash
npm install pm2 -g
```

Make sure PM2 is installed correctly by checking the version:

```bash
pm2 -v
```

If PM2 is installed correctly, this will display the version number.

### 4. Start the Backend with PM2

Once PM2 is installed, you can start the backend application by running:

```bash
pm2 start server.js --name vodafoneDocBackend
```

This will start your backend server. PM2 will now keep the server running and manage the process.

### 5. Monitor PM2 Process

To check which applications are currently running under PM2, use:

```bash
pm2 list
```

This will display a list of all running applications along with their status.

If you need to view the logs of the application, use:

```bash
pm2 logs
```

This will show the real-time logs of your backend application.

### 6. Auto-Restart Backend on System Reboot

To ensure that your backend automatically restarts and starts when the OS boots up, follow these steps:

#### On Windows:
1. Install the PM2 Windows service:
   ```bash
   npm install -g pm2-windows-service
   ```
2. Set up PM2 as a Windows service:
   ```bash
   pm2-service-install
   ```
   Follow the prompts to complete the setup. This will run PM2 as a Windows service and ensure your backend starts on reboot.
3. Start your backend application with PM2:
   ```bash
   pm2 start server.js --name vodafoneDocBackend
   ```
4. Save the PM2 process list:
   ```bash
   pm2 save
   ```
5. Verify the setup by restarting your system and running:
   ```bash
   pm2 list
   ```

#### On Linux:
1. Start your backend with PM2:
   ```bash
   pm2 start server.js --name vodafoneDocBackend
   ```
2. Generate the startup script:
   ```bash
   pm2 startup systemd
   ```
   **Note:** This command will output another command specific to your system. **Copy and run the generated command with `sudo`**, for example:
   ```bash
   sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u <your-username> --hp /home/<your-username>
   ```
3. Save the PM2 process list:
   ```bash
   pm2 save
   ```
4. Verify the setup by restarting your system and checking if PM2 automatically starts the backend:
   ```bash
   pm2 list
   ```

## Alternative PM2 Installation (If Online Installation Fails)

If you cannot install PM2 online, follow these steps:

1. Download the `.tgz` package and place it in your working directory.
2. Extract the package using PowerShell:

   ```bash
   tar -xvzf pm2-x.x.x.tgz
   ```

3. Install PM2 from the extracted folder:

   ```bash
   npm install -g ./package
   ```

---

## Alternative Local PM2 Execution

If PM2 is not installed globally, you can run it locally from `node_modules`:

```bash
node_modules\.bin\pm2 start server.js
```

---

## Troubleshooting

### PM2 Command Not Found

If `pm2` is not recognized, try:

```bash
npx pm2 start server.js --name vodafoneDocBackend
```

or reinstall it:

```bash
npm install -g pm2
```

---

---



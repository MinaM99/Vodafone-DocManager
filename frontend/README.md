### Frontend README (`frontend/README.md`)

# Vodafone-DocManager Frontend

## Setup & Deployment


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

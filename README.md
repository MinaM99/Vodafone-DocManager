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

### 4. Deploy to Tomcat

1. Navigate to Tomcat’s `webapps` directory.
2. Create a new folder named `Vodafone-DocManager`:
   ```bash
   <TOMCAT_HOME>/webapps/Vodafone-DocManager
   ```
3. Copy the `build` folder contents:
   ```bash
   cp -r build/* <TOMCAT_HOME>/webapps/Vodafone-DocManager
   ```
4. Configure `WEB-INF/web.xml`:

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

5. Restart Tomcat and access at:
```
http://localhost:<TOMCAT_PORT>/Vodafone-DocManager
```

---

## Backend Setup & Deployment

### 1. Install Dependencies

Navigate to the `backend` folder and install dependencies:

```bash
cd backend
npm install
```

### 2. Start the Backend with PM2

```bash
pm2 start server.js
```

Check running applications:
```sh
pm2 list
```

View logs:
```sh
pm2 logs
```

### 3. Auto-Restart Backend on System Reboot

```sh
pm2 startup
pm2 save
```

---




# Vodafone-DocManager Backend

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

This will install all dependencies listed in `package.json`.

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
pm2 start server.js
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

To ensure that your backend server automatically restarts if the system reboots, follow these steps:

```bash
pm2 startup
```

This will generate a command to set PM2 to start automatically when your server reboots. 

After this, save the current process list:

```bash
pm2 save
```

This command will ensure that your running applications (in this case, the backend) are restored after a reboot.

# Vodafone-DocManager Backend

## Setup & Deployment

### 1. Install Node.js

Before proceeding, ensure that **Node.js** is installed on your system. If it's not installed, you can download and install it from the official website:

- [Download Node.js](https://nodejs.org/)

You can verify if Node.js is installed by running the following command:

```sh
node -v
```

This will display the version of Node.js installed. Make sure it is at least version **12.x** or higher to ensure compatibility with the backend.

### 2. Install Dependencies

Once Node.js is installed, navigate to your backend directory and run the following command to install all required dependencies:

```sh
npm install
```

This will install all dependencies listed in `package.json`.

### 3. Install PM2

PM2 is a production process manager for Node.js applications. It will help in keeping the backend running smoothly and in managing it effectively.

To install PM2 globally, use the following command:

```sh
npm install pm2 -g
```

Make sure PM2 is installed correctly by checking the version:

```sh
pm2 -v
```

If PM2 is installed correctly, this will display the version number.

### 4. Start the Backend with PM2

Once PM2 is installed, you can start the backend application by running:

```sh
pm2 start server.js --name vodafoneDocBackend
```

This will start your backend server. PM2 will now keep the server running and manage the process.

### 5. Monitor PM2 Process

To check which applications are currently running under PM2, use:

```sh
pm2 list
```

This will display a list of all running applications along with their status.

If you need to view the logs of the application, use:

```sh
pm2 logs
```

This will show the real-time logs of your backend application.

### 6. Auto-Restart Backend on System Reboot

#### **For Linux**

To ensure that your backend server automatically restarts if the system reboots, follow these steps:

```sh
pm2 startup
```

This will generate a command to set PM2 to start automatically when your server reboots. Copy and run the generated command.

After this, save the current process list:

```sh
pm2 save
```

This command will ensure that your running applications (in this case, the backend) are restored after a reboot.

#### **For Windows**

Windows does not support `pm2 startup` natively. Instead, follow these steps:

1. Install PM2 Windows service:

   ```sh
   npm install -g pm2-windows-service
   ```

2. Register PM2 as a Windows service:

   ```sh
   pm2-service-install
   ```

   Follow the on-screen instructions to configure the service.

3. Start your applications with PM2:

   ```sh
   pm2 start server.js --name vodafoneDocBackend
   pm2 save
   ```

4. Ensure PM2 restarts after reboot:

   ```sh
   pm2 resurrect
   ```

Alternatively, you can use **Windows Task Scheduler**:

1. Open **Task Scheduler**.
2. Create a new task that runs `pm2 resurrect` at system startup.

---

## Alternative PM2 Installation (If Online Installation Fails)

If you cannot install PM2 online, follow these steps:

1. Download the `.tgz` package and place it in your working directory.

2. Extract the package using PowerShell:

   ```sh
   tar -xvzf pm2-x.x.x.tgz
   ```

3. Install PM2 from the extracted folder:

   ```sh
   npm install -g ./package
   ```

---

## Alternative Local PM2 Execution

If PM2 is not installed globally, you can run it locally from `node_modules`:

```sh
node_modules\.bin\pm2 start server.js
```

---

## Troubleshooting

### PM2 Command Not Found

If `pm2` is not recognized, try:

```sh
npx pm2 start server.js --name vodafoneDocBackend
```

or reinstall it:

```sh
npm install -g pm2
```

---


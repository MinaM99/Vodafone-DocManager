### Backend README (`backend/README.md`)

# Vodafone-DocManager Backend

## Setup & Deployment

### 1. Install Dependencies

```bash
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


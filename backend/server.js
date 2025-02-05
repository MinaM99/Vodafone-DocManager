import express from 'express';
import os from 'os';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());

app.get('/get-username', (req, res) => {
    res.json({ username: os.userInfo().username });
});

// Use the port specified in the .env file or default to 5000
const PORT = process.env.PORT || 5000;

// Listen on all network interfaces by using '0.0.0.0'
app.listen(PORT, '0.0.0.0', () => console.log(`Backend Server running on port ${PORT}`));

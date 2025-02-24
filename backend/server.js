import express from 'express';
import dns from 'dns';
import oracledb from 'oracledb';
import crypto from 'crypto';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Decryption function
async function decryptPassword(encryptedPassword) {
  const combined = Buffer.from(encryptedPassword, 'base64');
  const iv = combined.subarray(0, 16);
  const encrypted = combined.subarray(16);
  const key = crypto.pbkdf2Sync('YourSecretKey', 'YourSecretKey', 65536, 32, 'sha256');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Endpoint to get Windows username
app.get('/get-windowsusername', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  dns.reverse(ip, async (err, hostnames) => {
    let hostname = 'Hostname not available';

    // If DNS resolution fails, log the error but proceed with IP for query
    if (err) {
      console.error('Error resolving IP to hostname:', err);
    } else if (hostnames.length) {
      hostname = hostnames[0];  // If hostnames are available, use the first one
    }

    try {
      const encryptedPassword = process.env.DB_PASSWORD;
      if (!encryptedPassword) {
        throw new Error('DB_PASSWORD environment variable is not set');
      }

      const decryptedPassword = await decryptPassword(encryptedPassword);

      const connection = await oracledb.getConnection({
        user: process.env.DB_USER,
        password: decryptedPassword,
        connectString: `//${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
      });

      // Query the database with both hostname and IP, fallback to IP if hostname is unavailable
      const result = await connection.execute(
        `SELECT DISTINCT WINDOWSUSERNAME, timestamp 
         FROM AUDITMACHINEDETAILS 
         WHERE ((HOSTNAME = :hostname) OR (IPV4 = :ip)) 
         ORDER BY timestamp DESC`,
        { hostname, ip }
      );

      const windowsUsername = result.rows.length ? result.rows[0][0] : 'INVALID';

      res.json({
        ip: ip,
        hostname: hostname,
        windowsUsername: windowsUsername,
      });

      await connection.close();
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });
});

// Endpoint to delete Windows username
app.post('/delete-windowsusername', async (req, res) => {
  const { windowsUsername } = req.body;

  if (!windowsUsername) {
    return res.status(400).json({ error: 'windowsUsername is required' });
  }

  try {
    const encryptedPassword = process.env.DB_PASSWORD;
    if (!encryptedPassword) {
      throw new Error('DB_PASSWORD environment variable is not set');
    }

    const decryptedPassword = await decryptPassword(encryptedPassword);

    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: decryptedPassword,
      connectString: `//${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
    });

    // Delete the record for the given Windows username
    await connection.execute(
      `DELETE FROM AUDITMACHINEDETAILS WHERE WINDOWSUSERNAME = :windowsUsername`,
      { windowsUsername }
    );

    await connection.commit(); // Commit the delete transaction
    await connection.close();

    console.log(`Deleted record for WINDOWSUSERNAME: ${windowsUsername}`);
    res.json({ message: `Deleted record for WINDOWSUSERNAME: ${windowsUsername}` });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

const BACKEND_PORT = process.env.BACKEND_PORT || 5000;
app.listen(BACKEND_PORT, '0.0.0.0', () => console.log(`Backend Server running on port ${BACKEND_PORT}`));

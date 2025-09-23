import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from "path";


dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
    ssl: {
    ca: fs.readFileSync(path.resolve("ca.pem")),  
  },
});

(async () => {
  try {
    const connection = await db.getConnection();
    connection.release();
  } catch (err) {
    console.error('DB connection failed:', err.message);
  }
})();

export default db;
export default db;

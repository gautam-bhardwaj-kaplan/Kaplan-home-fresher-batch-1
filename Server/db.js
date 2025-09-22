import mysql from "mysql2/promise";
const db = mysql.createPool({
  host: "studentdata-kaplan-daf0.d.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_OrUpl4vULHbGZTRloMs",
  database: "student_dashboard",
  port: "14049",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Connected to DB!");
    connection.release();
  } catch (err) {
    console.error("DB connection failed:", err);
  }
})();

export default db;

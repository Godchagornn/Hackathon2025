// config/db.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',        // ชื่อ user ของ database
  host: 'database',       // host ของ database
  database: 'sharecycle',  // ชื่อ database
  password: 'yourpassword',// รหัสผ่าน
  port: 5432,              // พอร์ต PostgreSQL ปกติคือ 5432
});

// ฟังก์ชัน query สำหรับใช้งานใน service ต่าง ๆ
const query = (text, params) => pool.query(text, params);

export default { query };

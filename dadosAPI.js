const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://origem_iprq_user:NG5yCul6MVyipMEGwSTOf7kUdWPihWgB@dpg-d5sr59vpm1nc73cj6cf0-a.oregon-postgres.render.com/origem_iprq",
  ssl: {
    rejectUnauthorized: false
  }
});

async function testar() {
  try {
    const client = await pool.connect();
    console.log("✅ Conectado com Pool!");
    client.release();
  } catch (err) {
    console.error("❌ Erro Pool:", err.message);
  } finally {
    await pool.end();
  }
}

testar();

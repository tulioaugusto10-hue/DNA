const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 
    "postgresql://origem_iprq_user:NG5yCul6MVyipMEGwSTOf7kUdWPihWgB@dpg-d5sr59vpm1nc73cj6cf0-a.oregon-postgres.render.com/origem_iprq",
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    console.log("🔹 Tentando conectar...");
    await client.connect();
    console.log("✅ Conexão bem-sucedida!");
  } catch (err) {
    console.error("❌ Erro de conexão:", err.message);
  } finally {
    await client.end();
  }
}

test();


// arquivo: db.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000 // 🔥 AQUI ESTÁ A CHAVE
});

// Teste seguro de conexão
(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexão ao PostgreSQL estabelecida com sucesso!');
    client.release();
  } catch (err) {
    console.error('❌ Erro ao conectar no banco:', err.message);
  }
})();

export default pool;

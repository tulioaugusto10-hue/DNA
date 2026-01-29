// arquivo: db.js
import pkg from 'pg';
const { Pool } = pkg;

// Cria pool de conexões com SSL (necessário no Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // use seu DATABASE_URL do Render
  ssl: {
    rejectUnauthorized: false // necessário para Render
  },
  max: 10,            // número máximo de conexões simultâneas
  idleTimeoutMillis: 30000, // desconecta conexões ociosas após 30s
  connectionTimeoutMillis: 2000 // timeout para novas conexões
});

// Testa a conexão
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err.stack);
  } else {
    console.log('Conexão ao PostgreSQL estabelecida com sucesso!');
  }
  release(); // libera o cliente de volta para o pool
});

export default pool;



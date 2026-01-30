const express = require('express');
const fs = require('fs');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// TESTE
app.get('/', async (req, res) => {
  const r = await pool.query('SELECT NOW()');
  res.json({ banco: 'conectado', hora: r.rows[0] });
});

// IMPORTAÇÃO SIMPLES
app.get('/importar', async (req, res) => {
  const dados = JSON.parse(fs.readFileSync('./dados.json', 'utf8'));

  await pool.query(`
    CREATE TABLE IF NOT EXISTS dados (
      id SERIAL PRIMARY KEY,
      conteudo JSONB
    )
  `);

  await pool.query('INSERT INTO dados (conteudo) VALUES ($1)', [dados]);

  res.json({ status: 'ok', registros: 1 });
});

app.listen(port, () => {
  console.log('API rodando na porta', port);
});

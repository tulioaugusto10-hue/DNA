const express = require('express');
const fs = require('fs');
const { Pool } = require('pg');
const cors = require('cors'); // << adicione esta linha

const app = express();
const port = process.env.PORT || 10000; // Render geralmente usa porta >= 10000

// 🔓 LIBERA CORS PARA QUALQUER ORIGEM
app.use(cors({
  origin: "*", // permite qualquer site acessar
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json()); // para lidar com JSON no corpo da requisição

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* =========================
   TESTE DE BANCO
========================= */
app.get('/', async (req, res) => {
  try {
    const r = await pool.query('SELECT NOW()');
    res.json({ banco: 'conectado', hora: r.rows[0] });
  } catch (err) {
    res.status(500).json({ erro: 'falha no banco' });
  }
});

/* =========================
   CRIAR TABELA
========================= */
app.get('/criar-tabela', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fatos (
        id SERIAL PRIMARY KEY,
        titulo TEXT,
        descricao TEXT
      )
    `);

    res.json({ status: 'tabela criada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'erro ao criar tabela' });
  }
});

/* =========================
   IMPORTAR JSON
========================= */
app.get('/importar', async (req, res) => {
  try {
    const dados = JSON.parse(fs.readFileSync('./dados.json', 'utf8'));

    for (const item of dados) {
      await pool.query(
        'INSERT INTO fatos (titulo, descricao) VALUES ($1, $2)',
        [item.titulo, item.descricao]
      );
    }

    res.json({
      status: 'importação concluída',
      total: dados.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'erro ao importar dados' });
  }
});

/* =========================
   BUSCA
========================= */
app.get('/historia', async (req, res) => {
  const termo = req.query.termo || '';

  try {
    const r = await pool.query(
      'SELECT * FROM fatos WHERE titulo ILIKE $1 OR descricao ILIKE $1',
      [`%${termo}%`]
    );

    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ erro: 'erro na busca' });
  }
});

app.listen(port, () => {
  console.log('API rodando na porta', port);
});


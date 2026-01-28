const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// conexão com o banco (Render usa variável de ambiente)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/', (req, res) => {
  res.json({ status: 'API de História online 📚' });
});

// rota de busca histórica
app.get('/historia', async (req, res) => {
  const { termo } = req.query;

  try {
    const result = await pool.query(
      'SELECT * FROM fatos WHERE titulo ILIKE $1 OR descricao ILIKE $1',
      [`%${termo}%`]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro na busca' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('API rodando');
});

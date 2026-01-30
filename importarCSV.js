const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const arquivo = path.join(__dirname, 'data', 'sobrenomes-por-pais.csv');

async function importar() {
  const dados = [];

  fs.createReadStream(arquivo)
    .pipe(csv())
    .on('data', (row) => dados.push(row))
    .on('end', async () => {
      for (const linha of dados) {
        await pool.query(
          'INSERT INTO sobrenomes (pais, sobrenome, origem) VALUES ($1, $2, $3)',
          [linha.pais, linha.sobrenome, linha.origem]
        );
      }
      console.log('✅ Importação concluída');
      process.exit();
    });
}

importar();

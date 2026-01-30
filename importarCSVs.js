const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const csvFiles = [
  'historia-continentes.csv',
  'historia-por-tras-de-cada-sobrenome.csv',
  'historia-povos-de-cada-pais.csv',
  'paises_datas_surgimento.csv',
  'por-pais-brasil.csv',
  'povos_origem_paises.csv',
  'sobrenomes-por-pais.csv'
];

async function importarCSV(fileName) {
  return new Promise((resolve, reject) => {
    const resultados = [];
    fs.createReadStream(path.join(__dirname, fileName))
      .pipe(csv())
      .on('data', (data) => resultados.push(data))
      .on('end', async () => {
        try {
          for (const row of resultados) {
            // Ajuste os campos conforme cada CSV
            const titulo = row.Continente || row.Pais || row.Sobrenome || row.Titulo || '';
            const descricao = row.Resumo || row.Descricao || row.Destaques || '';
            await pool.query(
              'INSERT INTO fatos (titulo, descricao) VALUES ($1, $2)',
              [titulo, descricao]
            );
          }
          console.log(`${fileName} importado com sucesso`);
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', reject);
  });
}

(async () => {
  try {
    for (const file of csvFiles) {
      await importarCSV(file);
    }
    console.log('Todos os CSVs foram importados!');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao importar CSVs:', err);
    process.exit(1);
  }
})();

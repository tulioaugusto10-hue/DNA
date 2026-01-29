// dadosAPI.js
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Configuração do Postgres
const client = new Client({
  connectionString: process.env.DATABASE_URL, // Render já fornece
  ssl: { rejectUnauthorized: false }          // necessário no Render
});

async function importarCSV() {
  await client.connect();

  const pastaDados = path.join(__dirname, 'dados');
  const arquivosCSV = fs.readdirSync(pastaDados).filter(file => file.endsWith('.csv'));

  for (const arquivo of arquivosCSV) {
    const conteudo = fs.readFileSync(path.join(pastaDados, arquivo), 'utf-8');
    // Usando nome do arquivo como título
    const titulo = arquivo.replace('.csv', '');
    const categoria = 'sobrenomes'; // você pode mudar por arquivo

    await client.query(
      'INSERT INTO conteudos(categoria, titulo, conteudo) VALUES($1, $2, $3)',
      [categoria, titulo, conteudo]
    );
    console.log(`Importado: ${arquivo}`);
  }

  await client.end();
  console.log('Importação concluída!');
}

importarCSV().catch(err => console.error(err));


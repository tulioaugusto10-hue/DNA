// dadosAPI.js
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Conexão segura com SSL obrigatório
const client = new Client({
  connectionString: process.env.DATABASE_URL || 
    "postgresql://origem_iprq_user:NG5yCul6MVyipMEGwSTOf7kUdWPihWgB@dpg-d5sr59vpm1nc73cj6cf0-a.oregon-postgres.render.com/origem_iprq",
  ssl: {
    rejectUnauthorized: false, // necessário para Render
  },
});

async function importarCSV() {
  try {
    console.log("🔹 Tentando conectar ao banco...");
    await client.connect();
    console.log("✅ Conectado com sucesso!");

    const pastaDados = path.join(__dirname, 'dados');
    const arquivosCSV = fs.readdirSync(pastaDados).filter(f => f.endsWith('.csv'));

    for (const arquivo of arquivosCSV) {
      console.log(`🔹 Lendo arquivo: ${arquivo}`);
      const conteudo = fs.readFileSync(path.join(pastaDados, arquivo), 'utf-8');
      const titulo = arquivo.replace('.csv', '');
      let categoria = 'sobrenomes';

      await client.query(
        'INSERT INTO conteudos(categoria, titulo, conteudo) VALUES($1, $2, $3)',
        [categoria, titulo, conteudo]
      );

      console.log(`✅ Importado: ${arquivo}`);
    }

    console.log("🎉 Todos os CSVs foram importados!");
  } catch (err) {
    console.error("❌ Erro ao conectar ou importar:", err.message);
  } finally {
    await client.end();
    console.log("🔹 Conexão com banco encerrada.");
  }
}

importarCSV();


// dadosAPI.js
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Cria um pool de conexões seguro para o Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    "postgresql://origem_iprq_user:NG5yCul6MVyipMEGwSTOf7kUdWPihWgB@dpg-d5sr59vpm1nc73cj6cf0-a.oregon-postgres.render.com/origem_iprq",
  ssl: {
    rejectUnauthorized: false
  }
});

async function importarCSV() {
  try {
    console.log("🔹 Tentando conectar ao banco...");
    const client = await pool.connect();
    console.log("✅ Conectado com sucesso!");

    const pastaDados = path.join(__dirname, 'dados');
    if (!fs.existsSync(pastaDados)) throw new Error("Pasta 'dados' não encontrada!");

    const arquivosCSV = fs.readdirSync(pastaDados).filter(f => f.endsWith('.csv'));
    if (arquivosCSV.length === 0) throw new Error("Nenhum CSV encontrado na pasta 'dados'");

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

    client.release();
    console.log("🎉 Todos os CSVs foram importados!");
  } catch (err) {
    console.error("❌ Erro ao conectar ou importar:", err.message);
  } finally {
    await pool.end();
    console.log("🔹 Conexão com banco encerrada.");
  }
}

importarCSV();



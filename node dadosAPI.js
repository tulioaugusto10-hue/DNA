const { Pool } = require('pg');
const fs = require('fs');
const path = require('path'); 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    "postgresql://dna_historia_db_user:YIfhWm9UcUc12WJzh1Jp225CeX9CO152@dpg-d5t7n8sr85hc73f1lmb0-a/dna_historia_db",
  ssl: { rejectUnauthorized: false }
});

async function importarCSV() {
  try {
    console.log("🔹 Tentando conectar...");
    const client = await pool.connect();
    console.log("✅ Conectado com sucesso!");

    const pastaDados = path.join(__dirname, 'dados');
    const arquivosCSV = fs.readdirSync(pastaDados).filter(f => f.endsWith('.csv'));

    for (const arquivo of arquivosCSV) {
      console.log(`🔹 Lendo arquivo: ${arquivo}`);
      const conteudo = fs.readFileSync(path.join(pastaDados, arquivo), 'utf-8');
      const titulo = arquivo.replace('.csv', '');
      const categoria = 'sobrenomes';

      await client.query(
        'INSERT INTO conteudos(categoria, titulo, conteudo) VALUES($1, $2, $3)',
        [categoria, titulo, conteudo]
      );
      console.log(`✅ Importado: ${arquivo}`);
    }

    client.release();
    console.log("🎉 Todos os CSVs foram importados!");
  } catch (err) {
    console.error("❌ Erro Pool:", err.message);
  } finally {
    await pool.end();
    console.log("🔹 Conexão com banco encerrada.");
  }
}

importarCSV();


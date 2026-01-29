// dadosAPI.js
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// --- CONFIGURAÇÃO DO POSTGRES ---
// Substitua pelo DATABASE_URL do seu Render ou use variável de ambiente
const client = new Client({
  connectionString: process.env.DATABASE_URL || 
    "postgresql://origem_iprq_user:NG5yCul6MVyipMEGwSTOf7kUdWPihWgB@dpg-d5sr59vpm1nc73cj6cf0-a.oregon-postgres.render.com/origem_iprq",
  ssl: { rejectUnauthorized: false }
});

// Função principal para importar os CSVs
async function importarCSV() {
  try {
    await client.connect();
    console.log("Conectado ao banco com sucesso!");

    const pastaDados = path.join(__dirname, 'dados');
    if (!fs.existsSync(pastaDados)) {
      console.error("Pasta 'dados' não encontrada!");
      return;
    }

    const arquivosCSV = fs.readdirSync(pastaDados).filter(file => file.endsWith('.csv'));
    if (arquivosCSV.length === 0) {
      console.error("Nenhum CSV encontrado na pasta 'dados'");
      return;
    }

    for (const arquivo of arquivosCSV) {
      const conteudo = fs.readFileSync(path.join(pastaDados, arquivo), 'utf-8');

      // Usando nome do arquivo como título
      const titulo = arquivo.replace('.csv', '');

      // Aqui você pode personalizar a categoria por arquivo
      let categoria = 'sobrenomes';
      if (arquivo.toLowerCase().includes('paises')) categoria = 'paises_datas';
      else if (arquivo.toLowerCase().includes('migracao')) categoria = 'migracao_brasil';
      else if (arquivo.toLowerCase().includes('povos')) categoria = 'povos_origem';
      else if (arquivo.toLowerCase().includes('continente')) categoria = 'continentes';

      await client.query(
        'INSERT INTO conteudos(categoria, titulo, conteudo) VALUES($1, $2, $3)',
        [categoria, titulo, conteudo]
      );

      console.log(`✅ Importado: ${arquivo} (categoria: ${categoria})`);
    }

    console.log("🎉 Importação concluída para todos os CSVs!");
  } catch (err) {
    console.error("❌ Erro ao importar CSVs:", err.message);
  } finally {
    await client.end();
    console.log("Conexão com banco encerrada.");
  }
}

// Executa a importação
importarCSV();


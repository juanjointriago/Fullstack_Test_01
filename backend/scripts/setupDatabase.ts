import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupDatabase = async () => {
  let connection;
  
  try {
    console.log('\n🚀 Iniciando setup de base de datos...\n');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'project_manager',
      multipleStatements: true
    });

    console.log('✅ Conectado a la base de datos');

    // Ejecutar schema.sql
    console.log('📄 Ejecutando schema.sql...');
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSQL);
    console.log('✅ Tablas creadas exitosamente\n');

    // Ejecutar seeds.sql
    console.log('📄 Ejecutando seeds.sql...');
    const seedsPath = path.join(__dirname, '../database/seeds.sql');
    const seedsSQL = fs.readFileSync(seedsPath, 'utf8');
    await connection.query(seedsSQL);
    console.log('✅ Datos insertados exitosamente\n');

    console.log('═══════════════════════════════════════════');
    console.log('🎉 Base de datos configurada exitosamente!');
    console.log('═══════════════════════════════════════════\n');
    console.log('📊 Datos de prueba insertados:');
    console.log('═══════════════════════════════════════════');
    console.log('👥 8 usuarios');
    console.log('📁 8 proyectos');
    console.log('🤝 24 colaboradores');
    console.log('✅ 50+ tareas');
    console.log('═══════════════════════════════════════════\n');
    console.log('🔑 Credenciales de prueba:');
    console.log('═══════════════════════════════════════════');
    console.log('Email: juan.perez@example.com');
    console.log('Email: maria.garcia@example.com');
    console.log('Email: carlos.rodriguez@example.com');
    console.log('Password: password123 (para todos)');
    console.log('═══════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ Error configurando base de datos:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada\n');
    }
  }
};

setupDatabase();

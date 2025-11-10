import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const verifyDatabase = async () => {
  let connection;
  
  try {
    console.log('\n🔍 Verificando base de datos...\n');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'project_manager'
    });

    console.log('✅ Conectado a la base de datos\n');

    // Contar registros
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    const [projects] = await connection.query('SELECT COUNT(*) as count FROM projects');
    const [collaborators] = await connection.query('SELECT COUNT(*) as count FROM project_collaborators');
    const [tasks] = await connection.query('SELECT COUNT(*) as count FROM tasks');

    console.log('═══════════════════════════════════════════');
    console.log('📊 Resumen de Datos');
    console.log('═══════════════════════════════════════════');
    console.log(`👥 Usuarios: ${(users as any)[0].count}`);
    console.log(`📁 Proyectos: ${(projects as any)[0].count}`);
    console.log(`🤝 Colaboradores: ${(collaborators as any)[0].count}`);
    console.log(`✅ Tareas: ${(tasks as any)[0].count}`);
    console.log('═══════════════════════════════════════════\n');

    // Mostrar algunos usuarios
    const [usersList] = await connection.query('SELECT id, name, email FROM users LIMIT 5');
    console.log('👥 Usuarios de prueba:');
    console.log('═══════════════════════════════════════════');
    (usersList as any[]).forEach((user: any) => {
      console.log(`${user.id}. ${user.name} (${user.email})`);
    });
    console.log('═══════════════════════════════════════════\n');

    // Mostrar algunos proyectos
    const [projectsList] = await connection.query(`
      SELECT p.id, p.name, u.name as owner, 
             (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      LIMIT 5
    `);
    console.log('📁 Proyectos de prueba:');
    console.log('═══════════════════════════════════════════');
    (projectsList as any[]).forEach((project: any) => {
      console.log(`${project.id}. ${project.name}`);
      console.log(`   Owner: ${project.owner} | Tareas: ${project.task_count}`);
    });
    console.log('═══════════════════════════════════════════\n');

    // Estadísticas de tareas
    const [taskStats] = await connection.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM tasks
      GROUP BY status
    `);
    console.log('📊 Estadísticas de Tareas:');
    console.log('═══════════════════════════════════════════');
    (taskStats as any[]).forEach((stat: any) => {
      console.log(`${stat.status}: ${stat.count} tareas`);
    });
    console.log('═══════════════════════════════════════════\n');

    console.log('✅ Verificación completada exitosamente!\n');

  } catch (error) {
    console.error('\n❌ Error verificando base de datos:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

verifyDatabase();

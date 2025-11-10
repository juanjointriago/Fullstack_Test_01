import bcrypt from 'bcryptjs';

const password = 'password123';
const saltRounds = 10;

async function generateHash() {
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('\n===========================================');
  console.log('Password Hash Generator');
  console.log('===========================================');
  console.log(`Password: ${password}`);
  console.log(`Salt Rounds: ${saltRounds}`);
  console.log(`Hash: ${hash}`);
  console.log('===========================================\n');
  console.log('Use este hash en seeds.sql para todos los usuarios');
  console.log('===========================================\n');
}

generateHash();

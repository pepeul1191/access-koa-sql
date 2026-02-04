// scripts/hasheo.js
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import bcrypt from 'bcrypt';

const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 10);
const PEPPER = process.env.CRYPTO;

export const hashPassword = async (password) =>
  bcrypt.hash(password + PEPPER, SALT_ROUNDS);

export const verifyPassword = async (password, hashedPassword) =>
  bcrypt.compare(password + PEPPER, hashedPassword);

// prueba rápida
(async () => {
  const hash = await hashPassword('123');
  console.log('Hash:', hash);

  const ok = await verifyPassword('123', hash);
  console.log('Valido?', ok);
})();

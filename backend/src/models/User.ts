
import { type RowDataPacket, type ResultSetHeader } from 'mysql2';
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IUserResponse {
  id: number;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export class User {
  // Crear un nuevo usuario
  static async create(userData: IUser): Promise<number> {
    const { name, email, password } = userData;

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    return result.insertId;
  }

  // Buscar usuario por email
  static async findByEmail(email: string): Promise<IUser | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    return rows.length > 0 ? (rows[0] as IUser) : null;
  }

  // Buscar usuario por ID
  static async findById(id: number): Promise<IUserResponse | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    return rows.length > 0 ? (rows[0] as IUserResponse) : null;
  }

  // Verificar contraseña
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Buscar múltiples usuarios por IDs
  static async findByIds(ids: number[]): Promise<IUserResponse[]> {
    if (ids.length === 0) return [];

    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, name, email FROM users WHERE id IN (${placeholders})`,
      ids
    );

    return rows as IUserResponse[];
  }

  static async searchByEmailOrName(query: string): Promise<IUserResponse[]> {
    const searchPattern = `%${query}%`;
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, name, email FROM users WHERE email LIKE ? OR name LIKE ? LIMIT 10',
      [searchPattern, searchPattern]
    );

    return rows as IUserResponse[];
  }
}
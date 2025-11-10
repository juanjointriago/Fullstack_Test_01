
import { type RowDataPacket, type ResultSetHeader } from 'mysql2';
import pool from '../config/db.js';

export interface IProject {
  id?: number;
  name: string;
  description?: string;
  owner_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface IProjectWithOwner extends IProject {
  owner_name: string;
  owner_email: string;
  is_owner?: boolean;
  is_collaborator?: boolean;
}

export interface IPaginatedProjects {
  projects: IProjectWithOwner[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class Project {
  // Crear un nuevo proyecto
  static async create(projectData: IProject): Promise<number> {
    const { name, description, owner_id } = projectData;
    
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO projects (name, description, owner_id) VALUES (?, ?, ?)',
      [name, description || null, owner_id]
    );
    
    return result.insertId;
  }

  // Obtener proyectos del usuario con paginación
  static async findByUser(userId: number, page: number = 1, limit: number = 10): Promise<IPaginatedProjects> {
    const offset = (page - 1) * limit;
    
    // Obtener proyectos donde el usuario es owner o colaborador
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT DISTINCT p.*, u.name as owner_name, u.email as owner_email,
              (p.owner_id = ?) as is_owner,
              EXISTS(SELECT 1 FROM project_collaborators pc WHERE pc.project_id = p.id AND pc.user_id = ?) as is_collaborator
       FROM projects p
       INNER JOIN users u ON p.owner_id = u.id
       LEFT JOIN project_collaborators pc ON p.id = pc.project_id
       WHERE p.owner_id = ? OR pc.user_id = ?
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, userId, userId, userId, limit, offset]
    );
    
    // Contar total de proyectos
    const [countRows] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(DISTINCT p.id) as total
       FROM projects p
       LEFT JOIN project_collaborators pc ON p.id = pc.project_id
       WHERE p.owner_id = ? OR pc.user_id = ?`,
      [userId, userId]
    );
    
    const total = countRows[0]!.total;
    const totalPages = Math.ceil(total / limit);
    
    return {
      projects: rows as IProjectWithOwner[],
      total,
      page,
      limit,
      totalPages
    };
  }

  // Obtener proyecto por ID
  static async findById(projectId: number, userId: number): Promise<IProjectWithOwner | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.*, u.name as owner_name, u.email as owner_email,
              (p.owner_id = ?) as is_owner,
              EXISTS(SELECT 1 FROM project_collaborators pc WHERE pc.project_id = p.id AND pc.user_id = ?) as is_collaborator
       FROM projects p
       INNER JOIN users u ON p.owner_id = u.id
       WHERE p.id = ?`,
      [userId, userId, projectId]
    );
    
    return rows.length > 0 ? (rows[0] as IProjectWithOwner) : null;
  }

  // Actualizar proyecto
  static async update(projectId: number, projectData: Partial<IProject>): Promise<boolean> {
    const { name, description } = projectData;
    
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE projects SET name = ?, description = ? WHERE id = ?',
      [name, description || null, projectId]
    );
    
    return result.affectedRows > 0;
  }

  // Eliminar proyecto
  static async delete(projectId: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM projects WHERE id = ?',
      [projectId]
    );
    
    return result.affectedRows > 0;
  }

  // Verificar si el usuario es owner del proyecto
  static async isOwner(projectId: number, userId: number): Promise<boolean> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM projects WHERE id = ? AND owner_id = ?',
      [projectId, userId]
    );
    
    return rows.length > 0;
  }

  // Verificar si el usuario tiene acceso al proyecto (owner o colaborador)
  static async hasAccess(projectId: number, userId: number): Promise<boolean> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.id FROM projects p
       LEFT JOIN project_collaborators pc ON p.id = pc.project_id
       WHERE p.id = ? AND (p.owner_id = ? OR pc.user_id = ?)`,
      [projectId, userId, userId]
    );
    
    return rows.length > 0;
  }

  // Añadir colaborador
  static async addCollaborator(projectId: number, userId: number): Promise<boolean> {
    try {
      await pool.execute<ResultSetHeader>(
        'INSERT INTO project_collaborators (project_id, user_id) VALUES (?, ?)',
        [projectId, userId]
      );
      return true;
    } catch (error: any) {
      // Si es error de duplicado, retornar false
      if (error.code === 'ER_DUP_ENTRY') {
        return false;
      }
      throw error;
    }
  }

  // Obtener colaboradores del proyecto
  static async getCollaborators(projectId: number): Promise<any[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT u.id, u.name, u.email, pc.added_at
       FROM project_collaborators pc
       INNER JOIN users u ON pc.user_id = u.id
       WHERE pc.project_id = ?
       ORDER BY pc.added_at DESC`,
      [projectId]
    );
    
    return rows;
  }

  // Eliminar colaborador
  static async removeCollaborator(projectId: number, userId: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM project_collaborators WHERE project_id = ? AND user_id = ?',
      [projectId, userId]
    );
    
    return result.affectedRows > 0;
  }
}
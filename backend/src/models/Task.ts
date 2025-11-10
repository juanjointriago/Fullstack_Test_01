import { type RowDataPacket, type ResultSetHeader } from 'mysql2';
import pool from '../config/db.js';

export type TaskStatus = 'pendiente' | 'en progreso' | 'completada';
export type TaskPriority = 'baja' | 'media' | 'alta';

export interface ITask {
  id?: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: number;
  assigned_to?: number;
  created_by: number;
  due_date?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ITaskWithDetails extends ITask {
  project_name: string;
  assigned_to_name?: string;
  assigned_to_email?: string;
  created_by_name: string;
  created_by_email: string;
}

export interface ITaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: number;
  assigned_to?: number;
  created_by?: number;
}

export class Task {
  // Crear una nueva tarea
  static async create(taskData: ITask): Promise<number> {
    const { title, description, status, priority, project_id, assigned_to, created_by, due_date } = taskData;

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO tasks (title, description, status, priority, project_id, assigned_to, created_by, due_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description || null, status, priority, project_id, assigned_to || null, created_by, due_date || null]
    );

    return result.insertId;
  }

  // Obtener tareas con filtros
  static async findWithFilters(filters: ITaskFilters, userId: number, page: number = 1, limit: number = 20): Promise<any> {
    const offset = (page - 1) * limit;
    let query = `
      SELECT DISTINCT t.*,
             p.name as project_name,
             u1.name as assigned_to_name, u1.email as assigned_to_email,
             u2.name as created_by_name, u2.email as created_by_email
      FROM tasks t
      INNER JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u1 ON t.assigned_to = u1.id
      INNER JOIN users u2 ON t.created_by = u2.id
      LEFT JOIN project_collaborators pc ON p.id = pc.project_id
      WHERE (p.owner_id = ? OR pc.user_id = ?)
    `;

    const params: any[] = [userId, userId];

    // Aplicar filtros
    if (filters.status) {
      query += ' AND t.status = ?';
      params.push(filters.status);
    }

    if (filters.priority) {
      query += ' AND t.priority = ?';
      params.push(filters.priority);
    }

    if (filters.project_id) {
      query += ' AND t.project_id = ?';
      params.push(filters.project_id);
    }

    if (filters.assigned_to) {
      query += ' AND t.assigned_to = ?';
      params.push(filters.assigned_to);
    }

    if (filters.created_by) {
      query += ' AND t.created_by = ?';
      params.push(filters.created_by);
    }

    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.execute<RowDataPacket[]>(query, params);

    // Contar total
    let countQuery = `
      SELECT COUNT(DISTINCT t.id) as total
      FROM tasks t
      INNER JOIN projects p ON t.project_id = p.id
      LEFT JOIN project_collaborators pc ON p.id = pc.project_id
      WHERE (p.owner_id = ? OR pc.user_id = ?)
    `;

    const countParams: any[] = [userId, userId];

    if (filters.status) {
      countQuery += ' AND t.status = ?';
      countParams.push(filters.status);
    }

    if (filters.priority) {
      countQuery += ' AND t.priority = ?';
      countParams.push(filters.priority);
    }

    if (filters.project_id) {
      countQuery += ' AND t.project_id = ?';
      countParams.push(filters.project_id);
    }

    if (filters.assigned_to) {
      countQuery += ' AND t.assigned_to = ?';
      countParams.push(filters.assigned_to);
    }

    if (filters.created_by) {
      countQuery += ' AND t.created_by = ?';
      countParams.push(filters.created_by);
    }

    const [countRows] = await pool.execute<RowDataPacket[]>(countQuery, countParams);

    const total = countRows[0]!.total;
    const totalPages = Math.ceil(total / limit);

    return {
      tasks: rows as ITaskWithDetails[],
      total,
      page,
      limit,
      totalPages
    };
  }

  // Obtener tarea por ID
  static async findById(taskId: number, userId: number): Promise<ITaskWithDetails | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT t.*,
              p.name as project_name,
              u1.name as assigned_to_name, u1.email as assigned_to_email,
              u2.name as created_by_name, u2.email as created_by_email
       FROM tasks t
       INNER JOIN projects p ON t.project_id = p.id
       LEFT JOIN users u1 ON t.assigned_to = u1.id
       INNER JOIN users u2 ON t.created_by = u2.id
       LEFT JOIN project_collaborators pc ON p.id = pc.project_id
       WHERE t.id = ? AND (p.owner_id = ? OR pc.user_id = ?)`,
      [taskId, userId, userId]
    );

    return rows.length > 0 ? (rows[0] as ITaskWithDetails) : null;
  }

  // Actualizar tarea
  static async update(taskId: number, taskData: Partial<ITask>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    if (taskData.title !== undefined) {
      fields.push('title = ?');
      values.push(taskData.title);
    }

    if (taskData.description !== undefined) {
      fields.push('description = ?');
      values.push(taskData.description || null);
    }

    if (taskData.status !== undefined) {
      fields.push('status = ?');
      values.push(taskData.status);
    }

    if (taskData.priority !== undefined) {
      fields.push('priority = ?');
      values.push(taskData.priority);
    }

    if (taskData.assigned_to !== undefined) {
      fields.push('assigned_to = ?');
      values.push(taskData.assigned_to || null);
    }

    if (taskData.due_date !== undefined) {
      fields.push('due_date = ?');
      values.push(taskData.due_date || null);
    }

    if (fields.length === 0) return false;

    values.push(taskId);

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  // Eliminar tarea
  static async delete(taskId: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM tasks WHERE id = ?',
      [taskId]
    );

    return result.affectedRows > 0;
  }

  // Verificar si el usuario puede modificar la tarea
  static async canModify(taskId: number, userId: number): Promise<boolean> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT t.id FROM tasks t
       INNER JOIN projects p ON t.project_id = p.id
       WHERE t.id = ? AND (p.owner_id = ? OR t.created_by = ?)`,
      [taskId, userId, userId]
    );

    return rows.length > 0;
  }
}
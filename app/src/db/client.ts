/**
 * Database Client Module
 * Simplified database access with JSON plan storage
 */

import { Pool } from 'pg';
import { getPool } from './init';

// Singleton pool instance
let pool: Pool | null = null;

export function db(): Pool {
  if (!pool) {
    pool = getPool();
  }
  return pool;
}

// ==========================================
// USER FUNCTIONS
// ==========================================

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: 'user' | 'admin' | 'super_admin';
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  emailVerified: Date | null;
  isGuest: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await db().query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] ? mapUser(result.rows[0]) : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await db().query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] ? mapUser(result.rows[0]) : null;
}

export async function createUser(data: {
  email: string;
  name?: string;
  passwordHash?: string;
  image?: string;
  isGuest?: boolean;
}): Promise<User> {
  const result = await db().query(`
    INSERT INTO users (email, name, password_hash, image, is_guest)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [data.email, data.name || null, data.passwordHash || null, data.image || null, data.isGuest || false]);
  
  return mapUser(result.rows[0]);
}

export async function updateUser(id: string, data: Partial<{
  name: string;
  image: string;
  role: User['role'];
  status: User['status'];
}>): Promise<User | null> {
  const sets: string[] = [];
  const values: unknown[] = [];
  let idx = 1;
  
  if (data.name !== undefined) { sets.push(`name = $${idx++}`); values.push(data.name); }
  if (data.image !== undefined) { sets.push(`image = $${idx++}`); values.push(data.image); }
  if (data.role !== undefined) { sets.push(`role = $${idx++}`); values.push(data.role); }
  if (data.status !== undefined) { sets.push(`status = $${idx++}`); values.push(data.status); }
  
  if (sets.length === 0) return getUserById(id);
  
  values.push(id);
  const result = await db().query(
    `UPDATE users SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  
  return result.rows[0] ? mapUser(result.rows[0]) : null;
}

function mapUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    email: row.email as string,
    name: row.name as string | null,
    image: row.image as string | null,
    role: row.role as User['role'],
    status: row.status as User['status'],
    emailVerified: row.email_verified ? new Date(row.email_verified as string) : null,
    isGuest: row.is_guest as boolean,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

// ==========================================
// PLAN FUNCTIONS (JSON-based)
// ==========================================

export interface Plan {
  id: string;
  userId: string;
  title: string;
  planType: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  eventDate: Date | null;
  data: PlanData;
  totalBudget: number;
  spentAmount: number;
  itemsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanData {
  description?: string;
  currency?: string;
  categories?: PlanCategory[];
  items?: PlanItem[];
  checklist?: ChecklistItem[];
  guests?: Guest[];
  vendors?: Vendor[];
  timeline?: TimelineEvent[];
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface PlanCategory {
  id: string;
  name: string;
  budget: number;
  spent?: number;
  color?: string;
}

export interface PlanItem {
  id: string;
  categoryId: string;
  name: string;
  cost: number;
  status: string;
  notes?: string;
  vendorId?: string;
  dueDate?: string;
}

export interface ChecklistItem {
  id: string;
  task: string;
  category?: string;
  completed: boolean;
  dueDate?: string;
}

export interface Guest {
  id: string;
  name: string;
  email?: string;
  rsvp?: 'pending' | 'confirmed' | 'declined';
  plusOne?: boolean;
  table?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contact?: string;
  phone?: string;
  email?: string;
  website?: string;
  notes?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  description?: string;
}

export async function getPlanById(id: string): Promise<Plan | null> {
  const result = await db().query('SELECT * FROM plans WHERE id = $1', [id]);
  return result.rows[0] ? mapPlan(result.rows[0]) : null;
}

export async function getPlansByUserId(userId: string): Promise<Plan[]> {
  const result = await db().query(
    'SELECT * FROM plans WHERE user_id = $1 ORDER BY updated_at DESC',
    [userId]
  );
  return result.rows.map(mapPlan);
}

export async function createPlan(data: {
  userId: string;
  title: string;
  planType?: string;
  eventDate?: Date;
  data?: PlanData;
}): Promise<Plan> {
  const planData = data.data || {};
  const result = await db().query(`
    INSERT INTO plans (user_id, title, plan_type, event_date, data)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [data.userId, data.title, data.planType || 'wedding', data.eventDate || null, JSON.stringify(planData)]);
  
  return mapPlan(result.rows[0]);
}

export async function updatePlan(id: string, data: Partial<{
  title: string;
  planType: string;
  status: Plan['status'];
  eventDate: Date | null;
  data: PlanData;
}>): Promise<Plan | null> {
  const sets: string[] = [];
  const values: unknown[] = [];
  let idx = 1;
  
  if (data.title !== undefined) { sets.push(`title = $${idx++}`); values.push(data.title); }
  if (data.planType !== undefined) { sets.push(`plan_type = $${idx++}`); values.push(data.planType); }
  if (data.status !== undefined) { sets.push(`status = $${idx++}`); values.push(data.status); }
  if (data.eventDate !== undefined) { sets.push(`event_date = $${idx++}`); values.push(data.eventDate); }
  if (data.data !== undefined) { sets.push(`data = $${idx++}`); values.push(JSON.stringify(data.data)); }
  
  if (sets.length === 0) return getPlanById(id);
  
  values.push(id);
  const result = await db().query(
    `UPDATE plans SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  
  return result.rows[0] ? mapPlan(result.rows[0]) : null;
}

export async function deletePlan(id: string): Promise<boolean> {
  const result = await db().query('DELETE FROM plans WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

/**
 * Update plan data (merges with existing data)
 */
export async function updatePlanData(id: string, updates: Partial<PlanData>): Promise<Plan | null> {
  const plan = await getPlanById(id);
  if (!plan) return null;
  
  const newData = { ...plan.data, ...updates };
  return updatePlan(id, { data: newData });
}

/**
 * Recalculate plan totals from JSON data
 */
export async function recalculatePlanTotals(id: string): Promise<void> {
  const plan = await getPlanById(id);
  if (!plan) return;
  
  const totalBudget = plan.data.categories?.reduce((sum, cat) => sum + (cat.budget || 0), 0) || 0;
  const spentAmount = plan.data.items?.reduce((sum, item) => sum + (item.cost || 0), 0) || 0;
  const itemsCount = plan.data.items?.length || 0;
  
  await db().query(`
    UPDATE plans SET total_budget = $1, spent_amount = $2, items_count = $3 WHERE id = $4
  `, [totalBudget, spentAmount, itemsCount, id]);
}

function mapPlan(row: Record<string, unknown>): Plan {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    title: row.title as string,
    planType: row.plan_type as string,
    status: row.status as Plan['status'],
    eventDate: row.event_date ? new Date(row.event_date as string) : null,
    data: (row.data || {}) as PlanData,
    totalBudget: parseFloat(row.total_budget as string) || 0,
    spentAmount: parseFloat(row.spent_amount as string) || 0,
    itemsCount: parseInt(row.items_count as string) || 0,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

// ==========================================
// ADMIN FUNCTIONS
// ==========================================

export async function getAllUsers(options?: {
  role?: User['role'];
  status?: User['status'];
  limit?: number;
  offset?: number;
}): Promise<{ users: User[]; total: number }> {
  const conditions: string[] = [];
  const values: unknown[] = [];
  let idx = 1;
  
  if (options?.role) { conditions.push(`role = $${idx++}`); values.push(options.role); }
  if (options?.status) { conditions.push(`status = $${idx++}`); values.push(options.status); }
  
  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
  const countResult = await db().query(`SELECT COUNT(*) FROM users ${where}`, values);
  const total = parseInt(countResult.rows[0].count);
  
  const limit = options?.limit || 50;
  const offset = options?.offset || 0;
  values.push(limit, offset);
  
  const result = await db().query(
    `SELECT * FROM users ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx}`,
    values
  );
  
  return { users: result.rows.map(mapUser), total };
}

export async function logAdminAction(data: {
  adminId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  await db().query(`
    INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details, ip_address, user_agent)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `, [
    data.adminId,
    data.action,
    data.targetType || null,
    data.targetId || null,
    data.details ? JSON.stringify(data.details) : null,
    data.ipAddress || null,
    data.userAgent || null,
  ]);
}

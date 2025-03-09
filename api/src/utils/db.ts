import { Pool } from 'pg';

let pool: Pool | null = null;

export const initializePool = (config: any) => {
  pool = new Pool(config);
  return pool;
};

export const getPool = () => {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  return pool;
};
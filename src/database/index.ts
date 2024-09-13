import { Pool } from "pg";
import * as dotenv from 'dotenv';
dotenv.config();

const pgConfig = {
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(pgConfig);

const getPgConnection = async () => {
  return pool.connect();
};

export const executeQuery = async (
  query: string,
  params: any[] = []
) => {
  let client: any;  
  try {
    client = await getPgConnection();
    const results = await client.query(query, params); 
    return results.rows;
  } catch (error: any) {
    console.error("Error executing query: ", error);
    throw error; 
  } finally {
    client?.release();
  }
};
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres', // Connect to default postgres database
  });

  try {
    await client.connect();
    
    // Check if database exists
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [process.env.DB_NAME || 'appointment_doctor']
    );

    if (res.rowCount === 0) {
      // Create database if it doesn't exist
      await client.query(`CREATE DATABASE ${process.env.DB_NAME || 'appointment_doctor'}`);
      console.log(`Database "${process.env.DB_NAME || 'appointment_doctor'}" created successfully!`);
    } else {
      console.log(`Database "${process.env.DB_NAME || 'appointment_doctor'}" already exists.`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

createDatabase();
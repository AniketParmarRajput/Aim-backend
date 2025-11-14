import dotenv from 'dotenv';
import fs from 'fs';
import { Sequelize } from 'sequelize';

// Load the appropriate .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'development' ? '.env' : '.env';
dotenv.config({ path: envFile });

// Create a Sequelize instance
export const sequelize = new Sequelize(process.env.TIDB_DB_NAME, process.env.TIDB_USER, process.env.TIDB_PASSWORD, {
  host: process.env.TIDB_HOST,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      ca: fs.readFileSync(process.env.TIDB_CA_PATH),
    },
  },
  logging: process.env.NODE_ENV === 'development',
});

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database via Sequelize!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
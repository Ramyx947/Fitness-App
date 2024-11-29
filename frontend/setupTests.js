import dotenv from "dotenv";

// Determine the environment from NODE_ENV or default to development
const environment = process.env.NODE_ENV || "development";

// Load the appropriate .env file
const envFilePath = `.env.${environment}`;
dotenv.config({ path: envFilePath });


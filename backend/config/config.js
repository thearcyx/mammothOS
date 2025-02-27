import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env

export default {
  port: process.env.PORT || 5000,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  rpcUrl: process.env.RPC_URL,
  paraApiKey: process.env.PARA_API_KEY,
  encryptionKey: process.env.ENCRYPTION_KEY,
  jwtSecret: process.env.JWT_SECRET_KEY,
  adminPrivateKey: process.env.ADMIN_PRIVATE_KEY,
  dynamoDB: {
    accessKey: process.env.DYNAMO_ACCESS_KEY,
    secretKey: process.env.DYNAMO_SECRET_KEY
  }
};

import express from "express";
import cors from "cors";
import itemsRouter from "./routes/items.js";
import shutdown from "./utils/shutdown.js";
import winston from "winston";
import pool from "./utils/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

// Log incoming requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Health check route
app.get("/health", async (req, res) => {
  try {
    logger.info("Performing health check...");
    await pool.query("SELECT 1");
    logger.info("Health check passed");
    res.status(200).send({ status: "OK", database: "connected" });
  } catch (error) {
    logger.error("Health check failed", { error: error });
    res.status(500).send({ status: "ERROR", database: "disconnected", error: dbError.message });
  }
});

// Routes
app.use("/api/items", itemsRouter);

// 404 Error Handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// General Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => shutdown(server));
process.on("SIGTERM", () => shutdown(server));

// Log database configuration
logger.info("Starting backend API...");
logger.info("Database Configuration (received via ENV):", {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD ? "[REDACTED]" : "N/A",
});
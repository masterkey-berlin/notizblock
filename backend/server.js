import express from "express";
import cors from "cors";
import itemsRouter from "./routes/items.js";
import shutdown from "./utils/shutdown.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use("/api/items", itemsRouter);

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Gracefull shutdown
// SIGINT = Signal Interrupt (Ctrl+C)
// SIGTERM = Signal Terminate (kill command)
process.on("SIGINT", () => shutdown(server));
process.on("SIGTERM", () => shutdown(server));
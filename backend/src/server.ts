import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { AppDataSource } from "./config/database";
const port = Number(process.env.PORT || 5000);
AppDataSource.initialize()
  .then(() =>
    app.listen(port, () =>
      console.log(`API running on http://localhost:${port}`),
    ),
  )
  .catch((err) => {
    console.error("Database connection failed", err);
    process.exit(1);
  });

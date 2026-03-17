import express from "express";
import cors from "cors";
import studentRoutes from "./routes/student.routes";
import majorRoutes from "./routes/major.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "https://student-ui-prod.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/students", studentRoutes);
app.use("/majors", majorRoutes);
app.use("/auth", authRoutes);

export default app;

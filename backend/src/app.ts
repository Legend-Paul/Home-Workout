import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import "dotenv/config";
import sigunpRouter from "./routes/sigunp.js";
import loginRouter from "./routes/login.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth/signup", sigunpRouter);
app.use("/auth/login", loginRouter);

// error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

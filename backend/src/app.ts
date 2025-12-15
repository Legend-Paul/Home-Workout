import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import "dotenv/config";
import passportConfig from "./auth/passport.js";
import sigunpRouter from "./routes/sigunp.js";
import loginRouter from "./routes/login.js";
import forgotPaswordRouter from "./routes/forgotPassword.js";
import quickStartPlanRouter from "./routes/quickStartPlan.js";
import workoutRouter from "./routes/workout.js";
import exerciseRouter from "./routes/exercise.js";
import userWorkoutRouter from "./routes/userWorkout.js";
import passport from "passport";

const app = express();
const PORT = process.env.PORT || 5000;
passportConfig(passport);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth Routes
app.use("/auth/signup", sigunpRouter);
app.use("/auth/login", loginRouter);
app.use("/auth/forgot-password", forgotPaswordRouter);

// workout routes
app.use("/api/quick-start", quickStartPlanRouter);
app.use("/api/workout", workoutRouter);
app.use("/api/exercise", exerciseRouter);

// user Workout exercise routes
app.use("/api/workout/user", userWorkoutRouter);

// error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

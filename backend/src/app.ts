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
import resetPaswordRouter from "./routes/resetPassword.js";
import verificationEmailRouter from "./routes/verificationEmail.js";
import userRouter from "./routes/user.js";
import quickPlanRouter from "./routes/quickPlan.js";
import weeklyPlanRouter from "./routes/weeklyPlan.js";
import exerciseRouter from "./routes/exercise.js";
import passport from "passport";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;
passportConfig(passport);
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth Routes
app.use("/auth/signup", sigunpRouter);
app.use("/auth/login", loginRouter);
app.use("/auth/forgot-password", forgotPaswordRouter);
app.use("/auth/reset-password", resetPaswordRouter);
app.use("/auth/user", userRouter);
app.use("/auth/verification-email", verificationEmailRouter);

//exercise routes
app.use("/api/exercise", exerciseRouter);

// quick plan routes
app.use("/api/quick-plan", quickPlanRouter);

// weekly plan routes
app.use("/api/weekly-plan", weeklyPlanRouter);

// error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

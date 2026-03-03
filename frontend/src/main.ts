import { register, startRouter, notFound } from "./router";
import "./style.css";
import ErrorRoute from "./errorRoute/errorRoute";
import Header, { initTheme } from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Signin from "./pages/Signin/Signin";
import Signout from "./pages/Signout/Signout";
import Signup from "./pages/Signup/Signup";
import VerifyEmail from "./pages/EmailVerification.ts/SignupVerification";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import EmailConfirmation from "./pages/EmailConfirmatio/EmailConfirmation";
import Exercises from "./pages/Exercises/Exercises";
import NewExercise from "./pages/NewExercise/NewExercise";
import UpdateExercise from "./pages/UpdateExercise/UpdateExercise";
import Exercise from "./pages/Exercise/Exercise";
import QuickPlan from "./pages/QuickPlan/QuickPlan";
import NewQuickPlan from "./pages/NewQuickPlan/NewQuickPlan";
import NewQuickWeeklyPlan from "./pages/NewQuickWeeklyPlan/NewQuickWeeklyPlan";
import NewQuickWeeklyPlanExerises from "./pages/NewQuickWeeklyPlanExerises/NewQuickWeeklyPlanExerises";

initTheme();
await Header();
register("/", Home);
register("/dashboard", Home);

// auth routes
register("/auth/signin", Signin);
register("/auth/signup", Signup);
register("/auth/signout", Signout);
register("/auth/signup/verify-email", VerifyEmail);
register("/auth/signup/verify-email/resend", VerifyEmail);
register("/auth/forgot-password", ForgotPassword);
register("/auth/forgot-password/reset", ResetPassword);
register("/auth/email/confirmation", EmailConfirmation);

// api links
register("/api/exercises", Exercises);
register("/api/exercises/new", NewExercise);
register("/api/exercises/:id", Exercise);
register("/api/exercises/:id/update", UpdateExercise);
register("/api/quick-plans", QuickPlan);
register("/api/quick-plans/new", NewQuickPlan);
register("/api/quick-plans/:planId/weekly-plans/new", NewQuickWeeklyPlan);
register(
  "/api/quick-plans/:planId/weekly-plans/:id/exercises/new",
  NewQuickWeeklyPlanExerises,
);

notFound(ErrorRoute);

startRouter();

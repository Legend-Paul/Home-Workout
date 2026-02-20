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

notFound(ErrorRoute);

startRouter();

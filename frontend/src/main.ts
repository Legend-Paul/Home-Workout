import { register, startRouter, notFound } from "./router";
import "./style.css";
import ErrorRoute from "./errorRoute/errorRoute";
import Header, { initTheme } from "./components/Header/Header";
import Home from "./pages/Home/home";
import Signin from "./pages/Signin/Signin";
import Signout from "./pages/Signout/Signout";
import Signup from "./pages/Signup/Signup";
import VerifyEmail from "./pages/EmailVerification.ts/SignupVerification";

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

register("/api/exercises", () => {
  const mainApp = document.getElementById("main-app");
  mainApp!.innerHTML = `
    <h1>Exercises Page</h1>
    <p>This is the exercises page.</p>
  `;
});
notFound(ErrorRoute);

startRouter();

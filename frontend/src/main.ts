import { register, startRouter, notFound } from "./router";
import "./style.css";
import ErrorRoute from "./errorRoute/errorRoute";
import Header, { initTheme } from "./components/Header/Header";
import Home from "./pages/Home/home";

initTheme();
Header();
register("/", Home);

notFound(ErrorRoute);

startRouter();

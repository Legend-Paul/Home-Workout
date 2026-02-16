import Home from "./pages/Home/home";
import { register, startRouter, notFound } from "./router";
import ErrorRoute from "./errorRoute/errorRoute";
import "./style.css";

register("/", Home);

notFound(ErrorRoute);

startRouter();

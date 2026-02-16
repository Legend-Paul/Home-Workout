import Home from "./pages/Home/home";
import { register, startRouter, notFound } from "./router";
import ErrorRoute from "./errorRoute/errorRoute";

register("/", Home);

notFound(ErrorRoute);

startRouter();

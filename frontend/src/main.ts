import Home from "./pages/home";
import { navigate, register, startRouter, notFound } from "./router";

register("/", Home);

startRouter();

import { navigate } from "../router";
import styles from "./errorRoute.module.css";

export default function ErrorRoute() {
  const app = document.getElementById("app");
  app!.innerHTML = `
  <main class="${styles["error-container"]}">
    <h1>404 Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <a href="/" id="${styles["home-link"]}">Go back to Home</a>
  </main>
    `;

  const homeLink = document.getElementById(styles["home-link"]);
  if (homeLink) {
    homeLink.addEventListener("click", () => {
      navigate("/");
    });
  }
}

import styles from "./Signin.module.css";

export default function Signin() {
  const mainApp = document.getElementById("main-app");
  mainApp!.innerHTML = `
    <div class="${styles["signin-container"]}">
      <div class="${styles["signin-form-container"]}">
          <h1>Sign In</h1>
          <p> If already have an account <a href="/signup">Sign Up</a></p>
      </div>
      <form id="${styles["signin-form"]}">
        <div class="${styles["form-group"]}">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div class="${styles["form-group"]}">
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
    `;
}

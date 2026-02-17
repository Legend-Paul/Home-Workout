import styles from "./Signin.module.css";
import Input from "../../components/Input/Input";

export default function Signin() {
  const mainApp = document.getElementById("main-app");
  mainApp!.innerHTML = `
    <div class="${styles["signin-container"]}">
      <div class="${styles["signin-form-container"]}">
          <h1>Sign In</h1>
          <p> If already have an account <a href="/signup">Sign Up</a></p>
      </div>
      <form id="${styles["signin-form"]}">
        ${Input({
          label: "Email",
          type: "email",
          id: "email",
          name: "email",
          required: true,
        })}
        ${Input({
          label: "Password",
          type: "password",
          id: "password",
          name: "password",
          required: true,
        })}
        <button type="submit">Sign In</button>
      </form>
    </div>
    `;
}

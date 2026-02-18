import styles from "./Signup.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import isAuthenticated from "../../utils/auth";

export default async function Signup() {
  const mainApp = document.getElementById("main-app");
  const isAuth = await isAuthenticated();
  if (isAuth) {
    window.location.href = "/dashboard?alreadySignedIn=true";
    return;
  }

  mainApp!.innerHTML = `
    <div class="${styles["signup-container"]}">
      <div class="${styles["signup-form-container"]}">
          <h1>👋Welcome to Home Workout!</h1>
          <p> If already have an account <a href="/auth/signin">Sign In</a></p>
      </div>
      <div class="${styles["res-error-message"]}"></div>
      <form id="${styles["signup-form"]}">
        
        ${Input({
          label: "Email",
          type: "email",
          id: "email",
          name: "email",
          required: true,
          placeholder: "example@gmail.com",
          errorMessage: "Please enter a valid email address",
        })}
        ${Input({
          label: "Username",
          type: "text",
          id: "username",
          name: "username",
          required: true,
          placeholder: "john_doe",
          minLength: 3,
          errorMessage: "Username must be at least 3 characters",
        })}
        ${Input({
          label: "Password",
          type: "password",
          id: "password",
          name: "password",
          required: true,
          placeholder: "********",
          minLength: 8,
          errorMessage: "Password must be at least 8 characters",
        })}
        ${Input({
          label: "Confirm Password",
          type: "password",
          id: "confirm-password",
          name: "confirm-password",
          required: true,
          placeholder: "********",
          minLength: 8,
          errorMessage: "Passwords do not match",
        })}
        
        ${Button({
          label: "Sign In",
          type: "submit",
          btnClass: styles["signup-button"],
          disabled: true,
        })}
        
      </form>
    </div>
    `;
}

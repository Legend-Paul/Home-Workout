import styles from "../../assets/FormStyles.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

export default function ForgotPassword() {
  const mainApp = document.getElementById("main-app")!;
  mainApp.innerHTML = `
        <div class="${styles["auth-container"]} ${styles["forgot-password-container"]}">
            <h2 class="${styles["auth-form-container"]}">Forgot Password</h2>
            <div class="${styles["res-error-message"]}"></div>
            <form id="${styles["auth-form"]}" class="${styles["form"]}">
                ${Input({
                  label: "email",
                  type: "email",
                  id: "email",
                  name: "email",
                  placeholder: "Enter your email",
                  required: true,
                  errorMessage: "Please enter a valid email address",
                })}
                ${Button({
                  label: "Send Reset Link",
                  type: "submit",
                  btnClass: styles["submitButton"],
                })}
            </form>
        </div>
    `;
}

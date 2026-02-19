import styles from "../../assets/FormStyles.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";

export default function ResetPassword() {
  const mainApp = document.getElementById("main-app")!;
  mainApp.innerHTML = `
        <div class="${styles["auth-container"]} ${styles["forgot-password-container"]}">
        <h2 class="${styles["auth-form-container"]}">Reset Password</h2>
            <div class="${styles["res-error-message"]}"></div>
            <form id="${styles["auth-form"]}" class="${styles["form"]}" method="POST">
                ${Input({
                  label: "New Password",
                  type: "password",
                  id: "new-password",
                  name: "new-password",
                  placeholder: "Enter your new password",
                  required: true,
                  errorMessage: "Password must be at least 8 characters long.",
                })}
                ${Input({
                  label: "Confirm New Password",
                  type: "password",
                  id: "confirm-new-password",
                  name: "confirm-new-password",
                  placeholder: "Confirm your new password",
                  required: true,
                  errorMessage: "Passwords do not match.",
                })}
                ${Button({
                  label: "Reset Password",
                  type: "submit",
                  btnClass: styles["auth-button"],
                })}
            </form>
        </div>
    `;
}

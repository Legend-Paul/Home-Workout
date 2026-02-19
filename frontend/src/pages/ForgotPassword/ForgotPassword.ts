import styles from "../../assets/FormStyles.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";

export default function ForgotPassword() {
  const mainApp = document.getElementById("main-app")!;
  mainApp.innerHTML = `
        <div class="${styles["auth-container"]} ${styles["forgot-password-container"]}">
        <h2 class="${styles["auth-form-container"]}">Forgot Password</h2>
            <div class="${styles["res-error-message"]}"></div>
            <form id="${styles["auth-form"]}" class="${styles["form"]}" method="POST">
                ${Input({
                  label: "Email",
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
                  btnClass: styles["auth-button"],
                  disabled: true,
                })}
            </form>
        </div>
    `;
  const forgotPasswordContainer = mainApp.querySelector(
    `.${styles["forgot-password-container"]}`,
  ) as HTMLDivElement;
  const forgotPasswordForm = forgotPasswordContainer.querySelector(
    `#${styles["auth-form"]}`,
  ) as HTMLFormElement;
  const emailInput = forgotPasswordContainer.querySelector(
    "#email",
  ) as HTMLInputElement;
  const resErrorMessage = forgotPasswordContainer.querySelector(
    `.${styles["res-error-message"]}`,
  ) as HTMLDivElement;
  const submitButton = forgotPasswordForm.querySelector(
    `.${styles["auth-button"]}`,
  ) as HTMLButtonElement;

  function validateForm() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(emailInput.value)) {
      submitButton.disabled = false;
      submitButton.style.backgroundColor = "var(--primary-dark) !important";
    } else {
      submitButton.disabled = true;
      submitButton.style.backgroundColor = "var(--primary-light) !important";
    }
  }

  emailInput.addEventListener("input", validateForm);
}

import styles from "../../assets/FormStyles.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";

export default function ResetPassword() {
  const mainApp = document.getElementById("main-app")!;
  mainApp.innerHTML = `
        <div class="${styles["auth-container"]} ${styles["reset-password-container"]}">
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
                  minLength: 8,
                  errorMessage: "Password must be at least 8 characters long.",
                })}
                ${Input({
                  label: "Confirm New Password",
                  type: "password",
                  id: "confirm-new-password",
                  name: "confirm-new-password",
                  placeholder: "Confirm your new password",
                  minLength: 8,
                  required: true,
                  errorMessage: "Password must be at least 8 characters long.",
                })}
                ${Button({
                  label: "Reset Password",
                  type: "submit",
                  btnClass: styles["auth-button"],
                })}
            </form>
        </div>
    `;
  const resetPasswordContainer = mainApp.querySelector(
    `.${styles["reset-password-container"]}`,
  ) as HTMLDivElement;
  const resetPasswordForm = resetPasswordContainer.querySelector(
    `#${styles["auth-form"]}`,
  ) as HTMLFormElement;
  const newPasswordInput = resetPasswordForm.querySelector(
    "#new-password",
  ) as HTMLInputElement;
  const confirmNewPasswordInput = resetPasswordForm.querySelector(
    "#confirm-new-password",
  ) as HTMLInputElement;
  const resErrorMessage = resetPasswordContainer.querySelector(
    `.${styles["res-error-message"]}`,
  ) as HTMLDivElement;
  const submitButton = resetPasswordForm.querySelector(
    `.${styles["auth-button"]}`,
  ) as HTMLButtonElement;

  newPasswordInput.addEventListener("input", validateForm);
  confirmNewPasswordInput.addEventListener("input", validateForm);
  // Validate form inputs
  function validateForm(e: Event) {
    const password = newPasswordInput.value.trim();
    const confirmPassword = confirmNewPasswordInput.value.trim();

    if (e.target === confirmNewPasswordInput) {
      const errorSpan =
        confirmNewPasswordInput.nextElementSibling as HTMLSpanElement;
      console.log(
        "Validating passwords:",
        password,
        confirmPassword,
        password === confirmPassword,
      );
      if (password !== confirmPassword) {
        errorSpan.textContent = "Passwords do not match";
        errorSpan.style.opacity = "1";
        confirmNewPasswordInput.style.borderColor = "var(--error)";
      } else {
        errorSpan.textContent = "";
        errorSpan.style.opacity = "0";
        confirmNewPasswordInput.style.borderColor = "var(--success)";
      }
    }

    if (password.length >= 8 && password === confirmPassword) {
      submitButton.disabled = false;
      submitButton.style.backgroundColor = "var(--primary-dark) !important";
    } else {
      submitButton.disabled = true;
      submitButton.style.backgroundColor = "var(--primary-light) !important";
    }
  }
}

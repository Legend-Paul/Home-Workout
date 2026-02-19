import styles from "../../assets/FormStyles.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;

const errorSvg = `
      <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg> `;

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

  emailInput.addEventListener("input", validateForm);
  forgotPasswordForm.addEventListener("submit", handleForgotPassword);

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

  async function handleForgotPassword(e: Event) {
    e.preventDefault();
    const email = emailInput.value.trim();
    try {
      await sendForgotPasswordRequest(email, resErrorMessage);
    } catch (error) {
      console.error("Error sending reset link:", error);
      resErrorMessage.innerHTML = `${errorSvg}<span>An error occurred. Please try again.</span>`;
    }
  }
}

async function sendForgotPasswordRequest(
  email: string,
  resErrorMessage: HTMLDivElement,
) {
  const response = await fetch(`${backendUrl}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (response.ok) {
    Notification({
      type: "success",
      message:
        "Reset link sent! Please check your email to reset your password.",
    });
  } else {
    const data = await response.json();
    resErrorMessage.innerHTML = `${errorSvg}<span>${data.error || "Failed to send reset link. Please try again."}</span>`;
  }
}

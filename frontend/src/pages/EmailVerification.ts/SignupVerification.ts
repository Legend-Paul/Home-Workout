import styles from "./SignupVerification.module.css";
import Button from "../../components/Button/Button";
import { navigate } from "../../router";
import Notification from "../../components/Notification/Notification";
import Spinner from "../../components/Spinner/Spinner";
import Header from "../../components/Header/Header";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;

const token = window.location.search;
export default async function VerifyEmail() {
  const currentPath = window.location.pathname;
  const url = `${backendUrl}${currentPath}${token}`;

  const mainApp = document.getElementById("main-app");
  await Header();
  try {
    const response = await fetch(url, {
      method: "POST",
    });

    if (response.ok) {
      navigate("/auth/signin", { replace: true });
    } else {
      const data = await response.json();
      mainApp!.innerHTML = `
        <div class="${styles["verification-container"]}">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
          <p>⚠️ ${data.message || "Invalid or expired token. Please try again."}</p>
          ${Button({
            label: "Request Token",
          })}
        </div>
      `;
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    mainApp!.innerHTML = `
    <div class="${styles["verification-container"]}">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <h3>🤗 Email Verification Failed!</h3>
        <p>An error occurred while verifying your email. Please try again.</p>
        ${Button({
          label: "Request Token",
        })}
      </div>
    `;
  }
  const verificationContainer = document.querySelector(
    `.${styles["verification-container"]}`,
  );
  const button = verificationContainer?.querySelector("button");
  if (button)
    button.addEventListener(
      "click",
      async () => await resendVerificationEmail(button),
    );
}

async function resendVerificationEmail(button: HTMLButtonElement) {
  button.innerHTML = `${Spinner({})} Requesting...`;
  button.disabled = true;
  try {
    const response = await fetch(
      `${backendUrl}/auth/signup/verify-email/resend${token}`,
      {
        method: "POST",
      },
    );

    if (response.ok) {
      Notification({
        message:
          "A new verification email has been sent to your email address.",
        type: "success",
        duration: 5000,
      });
      button.disabled = false;
      button.innerHTML = `Request Token`;
    } else {
      const data = await response.json();
      button.disabled = false;
      button.innerHTML = `Request Token`;

      Notification({
        message:
          data.error ||
          "Failed to resend verification email. Please try again.",
        type: "error",
        duration: 5000,
      });
    }
  } catch (error) {
    button.disabled = false;
    button.innerHTML = `Request Token`;
    Notification({
      message:
        "An error occurred while resending the verification email. Please try again.",
      type: "error",
      duration: 5000,
    });
  }
}

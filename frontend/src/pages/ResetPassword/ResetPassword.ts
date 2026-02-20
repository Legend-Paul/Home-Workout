import styles from "../../assets/FormStyles.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";
import Spinner from "../../components/Spinner/Spinner";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;

const errorSvg = `
      <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg> `;

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
                  <div class="${styles["reset-password-footer"]}">      
                    <a href="/auth/signin" class="${styles["back-signup"]}">Back to Sign In</a>
                    <a  class="${styles["resend-link"]}">Resend Reset Link</a>                 
               </div>
            
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
  const resendLink = resetPasswordContainer.querySelector(
    `.${styles["resend-link"]}`,
  ) as HTMLAnchorElement;

  newPasswordInput.addEventListener("input", validateForm);
  confirmNewPasswordInput.addEventListener("input", validateForm);
  resetPasswordForm.addEventListener("submit", handleResetPassword);
  resendLink.addEventListener("click", (e) => {
    e.preventDefault();
    resendLink.innerHTML = `${Spinner({})} Resending...`;
    resendResetLink(resendLink);
  });

  // Validate form inputs
  function validateForm(e: Event) {
    const password = newPasswordInput.value.trim();
    const confirmPassword = confirmNewPasswordInput.value.trim();

    if (e.target === confirmNewPasswordInput) {
      const errorSpan =
        confirmNewPasswordInput.nextElementSibling as HTMLSpanElement;

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

  async function handleResetPassword(e: Event) {
    e.preventDefault();
    const newPassword = newPasswordInput.value.trim();
    const confirmNewPassword = confirmNewPasswordInput.value.trim();
    resErrorMessage.innerHTML = "";
    submitButton.disabled = true;
    submitButton.style.backgroundColor = "var(--primary-light) !important";
    submitButton.innerHTML = `${Spinner({})} Resetting...`;
    try {
      await resetPassword(newPassword, confirmNewPassword, resErrorMessage);
    } catch (error) {
      console.error("Error resetting password:", error);
      resErrorMessage.innerHTML = `${errorSvg}<span>An error occurred. Please try again.</span>`;
    } finally {
      submitButton.innerHTML = "Reset Password";
      submitButton.disabled = false;
      submitButton.style.backgroundColor = "var(--primary-dark) !important";
    }
  }
}

async function resetPassword(
  password: string,
  confirmPassword: string,
  resErrorMessage: HTMLDivElement,
) {
  const token = window.location.search;

  const response = await fetch(
    `${backendUrl}/auth/forgot-password/reset${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        confirmPassword,
      }),
    },
  );

  if (response.ok) {
    window.location.href = "/auth/signin?passwordReset=success";
  } else {
    const data = await response.json();
    resErrorMessage.innerHTML = `${errorSvg}<span>${data.error || "Failed to reset password. Please try again."}</span>`;
  }
}

async function resendResetLink(resendLink: HTMLAnchorElement) {
  const token = window.location.search;
  try {
    const response = await fetch(
      `${backendUrl}/auth/forgot-password/resend${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      Notification({
        type: "success",
        message:
          "Reset link resent! Please check your email to reset your password.",
      });
    } else {
      const data = await response.json();
      Notification({
        type: "error",
        message: data.error || "Failed to resend reset link. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error resending reset link:", error);
    Notification({
      type: "error",
      message: "An error occurred. Please try again.",
    });
  } finally {
    resendLink.innerHTML = "Resend Reset Link";
  }
}

import styles from "./SignupVerification.module.css";
import Button from "../../components/Button/Button";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;

export default async function VerifyEmail() {
  const token = window.location.search;
  const currentPath = window.location.pathname;
  const url = `${backendUrl}${currentPath}${token}`;

  const mainApp = document.getElementById("main-app");
  try {
    const response = await fetch(url, {
      method: "PUT",
    });

    if (response.ok) {
      window.location.href = "/auth/signin";
    } else {
      const data = await response.json();
      mainApp!.innerHTML = `
        <div class="${styles["verification-container"]}">
        <h1 class="${styles["failed-sign"]}">X</h1>
          <h3>Email Verification Failed!</h3>
          <p>🤗 ${data.message || "Invalid or expired token. Please try again."}</p>
          ${Button({
            label: "Request New Token",
          })}
        </div>
      `;
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    mainApp!.innerHTML = `
    <div class="${styles["verification-container"]}">
        <h1 class="${styles["failed-sign"]}">X</h1>
        <h3>🤗 Email Verification Failed!</h3>
        <p>An error occurred while verifying your email. Please try again.</p>
        ${Button({
          label: "Request New Token",
        })}
      </div>
    `;
  }
}

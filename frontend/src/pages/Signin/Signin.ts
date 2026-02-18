import styles from "../../assets/FormStyles.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import isAuthenticated from "../../utils/auth";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;

export default async function Signin() {
  const mainApp = document.getElementById("main-app");
  const isAuth = await isAuthenticated();
  if (isAuth) {
    window.location.href = "/dashboard?alreadySignedIn=true";
    return;
  }

  mainApp!.innerHTML = `
    <div class="${styles["auth-container"]}">
      <div class="${styles["auth-form-container"]}">
          <h1>👋Welcome Back!</h1>
          <p> If already have an account <a href="/auth/signup">Sign Up</a></p>
      </div>
      <div class="${styles["res-error-message"]}"></div>
      <form id="${styles["auth-form"]}">
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
          label: "Password",
          type: "password",
          id: "password",
          name: "password",
          required: true,
          placeholder: "********",
          minLength: 8,
          errorMessage: "Password must be at least 8 characters",
        })}
        <div class="${styles["forgot-password"]}">
          <a href="/auth/forgot-password">Forgot Password?</a>
        </div>
        ${Button({
          label: "Sign In",
          type: "submit",
          btnClass: styles["auth-button"],
          disabled: true,
        })}
        
      </form>
    </div>
    `;

  const signinForm = document.querySelector(
    `#${styles["auth-form"]}`,
  ) as HTMLFormElement;
  const emailInput = document.getElementById("email") as HTMLInputElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const submitButton = mainApp!.querySelector(
    `.${styles["auth-button"]}`,
  ) as HTMLButtonElement;
  const errorMessage = mainApp!.querySelector(
    `.${styles["res-error-message"]}`,
  ) as HTMLDivElement;

  emailInput.addEventListener("input", validateForm);
  passwordInput.addEventListener("input", validateForm);

  signinForm.addEventListener("submit", handleSignin);

  function validateForm() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isInputsValid = emailRegex.test(email) && password.length >= 8;

    submitButton.disabled = !isInputsValid;
    submitButton.style.backgroundColor = isInputsValid
      ? "var(--primary-dark) !important"
      : "var(--primary-light) !important";
  }

  async function handleSignin(event: Event) {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(email) && password.length >= 8) {
      submitButton.disabled = true;
      submitButton.style.backgroundColor = "var(--primary-light) !important";
      submitButton.innerText = "Signing In...";
      try {
        await signinUser(email, password, errorMessage);
      } catch (error) {
        console.error("Error signing in:", error);
        alert("An error occurred while signing in. Please try again.");
      } finally {
        submitButton.disabled = false;
        submitButton.style.backgroundColor = "var(--primary-dark) !important";
        submitButton.innerText = "Sign In";
      }
    }
  }
}

const errorSvg = `
      <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg> `;

async function signinUser(
  email: string,
  password: string,
  errorMessage: HTMLDivElement,
) {
  try {
    const response = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("Authorization", data.token);
      window.location.href = "/dashboard";
    } else {
      const errorData = await response.json();
      errorMessage.innerHTML = `${errorSvg} <span>${errorData.message || "An error occurred while signing in."}</span>`;
    }
  } catch (error) {
    console.error("Error signing in:", error);
    errorMessage.innerHTML = `${errorSvg} <span>An error occurred while signing in.</span>`;
  }
}

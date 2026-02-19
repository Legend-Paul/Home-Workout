import styles from "../../assets/FormStyles.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import isAuthenticated from "../../utils/auth";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;

const errorSvg = `
      <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg> `;

export default async function Signup() {
  const mainApp = document.getElementById("main-app");
  const isAuth = await isAuthenticated();
  if (isAuth) {
    window.location.href = "/dashboard";
    return;
  }

  mainApp!.innerHTML = `
    <div class="${styles["auth-container"]} ${styles["signup-container"]}">
      <div class="${styles["auth-form-container"]}">
          <h2>👋Welcome to FitTrack!</h2>
          <p> If already have an account <a href="/auth/signin">Sign In</a></p>
      </div>
      <div class="${styles["res-error-message"]}"></div>
      <form id="${styles["auth-form"]}" method="POST">
        
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
          placeholder: "Legend Paul",
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
          label: "Sign Up",
          type: "submit",
          btnClass: styles["auth-button"],
          disabled: true,
        })}
        
      </form>
    </div>
    `;
  const signupContainer = mainApp!.querySelector(
    `.${styles["signup-container"]}`,
  ) as HTMLDivElement;
  const signupForm = signupContainer!.querySelector(
    `#${styles["auth-form"]}`,
  ) as HTMLFormElement;
  const emailInput = signupContainer!.querySelector(
    "#email",
  ) as HTMLInputElement;
  const usernameInput = signupContainer!.querySelector(
    "#username",
  ) as HTMLInputElement;
  const passwordInput = signupContainer!.querySelector(
    "#password",
  ) as HTMLInputElement;
  const confirmPasswordInput = signupContainer!.querySelector(
    "#confirm-password",
  ) as HTMLInputElement;
  const submitButton = signupContainer!.querySelector(
    `.${styles["auth-button"]}`,
  ) as HTMLButtonElement;
  const errorMessage = signupContainer!.querySelector(
    `.${styles["res-error-message"]}`,
  ) as HTMLDivElement;

  emailInput.addEventListener("input", validateForm);
  usernameInput.addEventListener("input", validateForm);
  passwordInput.addEventListener("input", validateForm);
  confirmPasswordInput.addEventListener("input", validateForm);
  signupForm.addEventListener("submit", handleSignup);

  // Validate form inputs
  function validateForm(e: Event) {
    const email = emailInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (e.target === confirmPasswordInput) {
      const errorSpan =
        confirmPasswordInput.nextElementSibling as HTMLSpanElement;
      console.log(
        "Validating passwords:",
        password,
        confirmPassword,
        password === confirmPassword,
      );
      if (password !== confirmPassword) {
        errorSpan.textContent = "Passwords do not match";
        errorSpan.style.opacity = "1";
        confirmPasswordInput.style.borderColor = "var(--error)";
      } else {
        errorSpan.textContent = "";
        errorSpan.style.opacity = "0";
        confirmPasswordInput.style.borderColor = "var(--success)";
      }
    }

    if (
      emailRegex.test(email) &&
      username.length >= 3 &&
      password.length >= 8 &&
      password === confirmPassword
    ) {
      submitButton.disabled = false;
      submitButton.style.backgroundColor = "var(--primary-dark) !important";
    } else {
      submitButton.disabled = true;
      submitButton.style.backgroundColor = "var(--primary-light) !important";
    }
  }

  async function handleSignup(event: Event) {
    event.preventDefault();
    const email = emailInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    errorMessage.innerHTML = "";

    submitButton.disabled = true;
    submitButton.style.backgroundColor = "var(--primary-light) !important";
    submitButton.innerText = "Signing Up...";
    try {
      await signupUser(
        email,
        username,
        password,
        confirmPassword,
        errorMessage,
      );
    } catch (error) {
      console.error("Error signing up:", error);

      errorMessage.innerHTML = `${errorSvg}<span>An error occurred. Please try again.</span>`;
    } finally {
      submitButton.innerText = "Sign Up";
      submitButton.disabled = false;
      submitButton.style.backgroundColor = "var(--primary-dark) !important";
    }
  }
}

async function signupUser(
  email: string,
  username: string,
  password: string,
  confirmPassword: string,
  errorMessage: HTMLDivElement,
) {
  try {
    const response = await fetch(`${backendUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password, confirmPassword }),
    });

    if (response.ok) {
      window.location.href = "/auth/signin";
    } else {
      const data = await response.json();
      errorMessage.innerHTML = `${errorSvg}<span>${data.error || "Signup failed. Please try again."}</span>`;
    }
  } catch (error) {
    console.error("Error signing up:", error);
    errorMessage.innerHTML = `${errorSvg}<span>An error occurred. Please try again.</span>`;
  }
}

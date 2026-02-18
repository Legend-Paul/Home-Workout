import styles from "../../assets/FormStyles.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import isAuthenticated from "../../utils/auth";

export default async function Signup() {
  const mainApp = document.getElementById("main-app");
  const isAuth = await isAuthenticated();
  if (isAuth) {
    window.location.href = "/dashboard?alreadySignedIn=true";
    return;
  }

  mainApp!.innerHTML = `
    <div class="${styles["auth-container"]} ${styles["signup-container"]}">
      <div class="${styles["auth-form-container"]}">
          <h1>👋Welcome to FitTrack!</h1>
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
          placeholder: "john_doe",
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

  function checkPasswordsMatch() {
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (password !== confirmPassword) {
      confirmPasswordInput.nextElementSibling!.textContent =
        "Passwords do not match";
    } else {
      confirmPasswordInput.nextElementSibling!.textContent = "";
    }
  }

  emailInput.addEventListener("input", validateForm);
  usernameInput.addEventListener("input", validateForm);
  passwordInput.addEventListener("input", validateForm);
  confirmPasswordInput.addEventListener("input", validateForm);
  //   confirmPasswordInput.addEventListener("input", checkPasswordsMatch);
}

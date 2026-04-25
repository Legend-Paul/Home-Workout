import styles from "./Header.module.css";
import logo from "../../assets/logo.png";
import isAuthenticated from "../../utils/auth";

type Theme = "light" | "dark" | "auto";
const THEME_KEY = "app-theme";
const svgs = {
  light: `<svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
</svg>`,
  dark: `<svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
</svg>`,
  auto: `<svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
</svg>`,
};

export default async function Header() {
  const currentPath = window.location.pathname;
  const headerApp = document.getElementById("header-app");
  const currentTheme = (localStorage.getItem(THEME_KEY) as Theme) || "auto";
  const isAuth = await isAuthenticated();

  headerApp!.innerHTML = `
  <div class="${styles["header-container"]}">
    <div class="${styles["top-header"]}">
      <a href="/" class="${styles["logo"]}">
          <h1>FitTrack</h1>
          <img src=${logo} alt="FitTrack Logo" />
      </a>

    <div class="${styles["header-icon-container"]}">
      <div class="${styles["user-profile"]}">
          ${
            !isAuth
              ? `            
            <a href="/auth/signup" class="${styles["signup-icon"]} 
            ${styles[currentPath !== "/auth/signin" ? "active-auth-link" : "inactive-auth-link"]} ">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <p>Sign Up</p>
            </a>
             <a href="/auth/signin" class="${styles["signin-icon"]}
              ${styles[currentPath === "/auth/signin" ? "active-auth-link" : "inactive-auth-link"]} ">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <p>Sign In</p>
            </a>
            `
              : `
              <a href="/auth/signout" class="${styles["signout-icon"]}">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              <p>Sign Out</p>
          </a>`
          }
          
          
      </div>
   
      <div class="${styles["theme-toggle"]}">
        
        <div class="${styles["current-theme-contaier"]}">
            <span class="${styles["light"]} 
            ${currentTheme === "light" ? styles["current-theme"] : ""}">
              ${svgs.light}
            </span>
            <span class="${styles["dark"]} 
            ${currentTheme === "dark" ? styles["current-theme"] : ""}">
              ${svgs.dark}
            </span>
            <span class="${styles["auto"]} 
            ${currentTheme === "auto" ? styles["current-theme"] : ""}">
              ${svgs.auto}
            </span>
            <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 15L7 10h10l-5 5z"/>
            </svg>
        </div>
        <div class="${styles["theme-select"]}">
            <span data-theme="light" class=" ${styles["theme-option"]} 
            ${styles[currentTheme === "light" ? "active-theme" : ""]}">
              ${svgs.light}
              <p>Light</p>
            </span>
            <span data-theme="dark" class="${styles["theme-option"]} 
            ${styles[currentTheme === "dark" ? "active-theme" : ""]}">
              ${svgs.dark}
              <p>Dark</p>
            </span>
            <span data-theme="auto" class="${styles["theme-option"]} 
            ${styles[currentTheme === "auto" ? "active-theme" : ""]}">
            ${svgs.auto}
              <p>Auto</p> 
            </span>
        </div>
      </div>
      </div>
    </div>
    ${
      isAuth
        ? `<div class="${styles["nav-container"]}">
        <nav class="${styles["nav"]}">
            <ul>
                <li class="${styles["nav-link"]} ${styles["active-nav-link"]}"><a href="/dashboard">Dashboard</a></li>
                <li class="${styles["nav-link"]}"><a href="/exercises">Exercises</a></li>
                <li class="${styles["nav-link"]}"><a href="/quick-plans">Qick Plans</a></li>
            </ul>
        </nav>
      </div>`
        : ""
    }
    </div>
    `;
  const themeOptions = headerApp!.querySelectorAll(
    `.${styles["theme-option"]}`,
  );

  themeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedTheme = option.getAttribute("data-theme") as Theme;
      // change theme
      changeTheme(themeOptions, option, selectedTheme);

      // Update current theme icon
      updateCurrentThemeIcon(headerApp, selectedTheme);
    });
  });

  changeActiveLink(currentPath);
}

function changeActiveLink(currentPath: string) {
  const headerApp = document.getElementById("header-app");
  const activeLink = headerApp!.querySelector(`.${styles["active-nav-link"]}`);

  if (activeLink) {
    activeLink.classList.remove(styles["active-nav-link"]);
  }

  const newActiveLink = headerApp!.querySelector(`a[href="${currentPath}"]`);
  if (newActiveLink) {
    if (currentPath === "/" || currentPath === "/dashboard") {
      const dashboardLink = headerApp!.querySelector(`a[href="/dashboard"]`);
      dashboardLink?.parentElement?.classList.add(styles["active-nav-link"]);
      return;
    }
    newActiveLink.parentElement?.classList.add(styles["active-nav-link"]);
  }

  if (currentPath.includes("/exercises")) {
    const exercisesLink = headerApp!.querySelector(`a[href="/exercises"]`);
    exercisesLink?.parentElement?.classList.add(styles["active-nav-link"]);
    return;
  }

  if (currentPath.includes("/quick-plans")) {
    const plansLink = headerApp!.querySelector(`a[href="/quick-plans"]`);
    plansLink?.parentElement?.classList.add(styles["active-nav-link"]);
    return;
  }
}

function changeTheme(
  themeOptions: NodeListOf<Element>,
  option: Element,
  selectedTheme: Theme,
) {
  applyTheme(selectedTheme);
  themeOptions.forEach((opt) => opt.classList.remove(styles["active-theme"]));

  option.classList.add(styles["active-theme"]);
}

function updateCurrentThemeIcon(
  headerApp: HTMLHeadElement | null,
  selectedTheme: Theme,
) {
  const currentThemeIcons = headerApp!.querySelectorAll(
    `.${styles["current-theme"]}`,
  );
  currentThemeIcons.forEach((icon) => {
    icon.classList.remove(styles["current-theme"]);
  });

  const selectedIcon = headerApp!.querySelector(`.${styles[selectedTheme]}`);
  if (selectedIcon) {
    selectedIcon.classList.add(styles["current-theme"]);
  }
}

export function applyTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);
  if (theme === "auto") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

export function initTheme() {
  const currentTheme = (localStorage.getItem(THEME_KEY) as Theme) || "auto";
  applyTheme(currentTheme);

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (currentTheme === "auto") applyTheme("auto");
    });
}

import styles from "./Header.module.css";

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

export default function Header() {
  const headerApp = document.getElementById("header-app");
  const currentTheme = (localStorage.getItem(THEME_KEY) as Theme) || "auto";

  headerApp!.innerHTML = `
  <div class="${styles["header-container"]}">
    <div class="${styles["top-header"]}">
      <div class="${styles["logo"]}">
          <h1>Home Workout</h1>
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
            <svg class="${styles["theme-icon"]}" fill="currentColor" viewBox="0 0 24 24">
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
        <nav class="${styles["nav"]}">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/workouts">Workouts</a></li>
                <li><a href="/profile">Profile</a></li>
            </ul>
        </nav>
    </div>
    `;
  const themeOptions = headerApp!.querySelectorAll(
    `.${styles["theme-option"]}`,
  );
  themeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedTheme = option.getAttribute("data-theme") as Theme;

      applyTheme(selectedTheme);
      themeOptions.forEach((opt) =>
        opt.classList.remove(styles["active-theme"]),
      );

      option.classList.add(styles["active-theme"]);

      // Update current theme icon
      const currentThemeIcons = headerApp!.querySelectorAll(
        `.${styles["current-theme"]}`,
      );
      currentThemeIcons.forEach((icon) => {
        icon.classList.remove(styles["current-theme"]);
      });

      const selectedIcon = headerApp!.querySelector(
        `.${styles[selectedTheme]}`,
      );
      console.log("Selected Icon:", selectedIcon);
      if (selectedIcon) {
        selectedIcon.classList.add(styles["current-theme"]);
      }
    });
  });
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

import styles from "./Notification.module.css";

type NotificationProps = {
  message: string;
  type: "success" | "error" | "info";
  duration?: number; // Optional duration in milliseconds
};

export default function Notification({
  message,
  type,
  duration,
}: NotificationProps) {
  const notificationApp = document.getElementById("notification-container")!;
  notificationApp.innerHTML = `
    <div class="${styles["notification"]} ${styles[type]}">
    <p class="${styles["message"]}">
      ${message}
    </p>
      <span class="${styles["close-btn"]}">&#10006;</span>
    </div>
  `;

  const notification = document.querySelector(
    `.${styles["notification"]}`,
  ) as HTMLDivElement;
  const closeBtn = notification.querySelector(
    `.${styles["close-btn"]}`,
  ) as HTMLSpanElement;
  closeBtn.addEventListener("click", () => {
    notification.style.display = "none";
  });

  if (duration !== undefined && duration > 0) {
    setTimeout(() => {
      notification.style.display = "none";
    }, duration);
  }
}

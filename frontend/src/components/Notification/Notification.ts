import styles from "./Notification.module.css";

type NotificationProps = {
  message: string;
  type: "success" | "error" | "info";
};

export default function Notification({ message, type }: NotificationProps) {
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
}

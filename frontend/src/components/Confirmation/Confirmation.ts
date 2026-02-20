import styles from "./Confirmation.module.css";

interface ConfirmationProps {
  message: string;
  type: "success" | "error" | "info";
}

export default function Confirmation({ message, type }: ConfirmationProps) {
  return `
        <div class="${styles["confirmation-container"]} ${styles[type]}">
            <p>${message}</p>
        </div>
    `;
}

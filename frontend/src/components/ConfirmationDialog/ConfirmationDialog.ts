import Button from "../Button/Button";
import styles from "./ConfirmationDialog.module.css";

interface ConfirmationDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationDialog({
  message,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  `
  <div class="${styles["overlay"]}" id="confirmation-dialog-overlay"></div>
    <div class="${styles["confirmation-dialog"]}">
        <p class="${styles["confirmation-message"]}">${message}</p>
        <div class="${styles["button-group"]}">
            ${Button({
              label: "Cancel",
              onClick: onCancel,
              btnClass: styles["cancel-btn"],
            })}
            ${Button({
              label: "Confirm",
              onClick: onConfirm,
              btnClass: styles["confirm-btn"],
            })}
        </div>
    </div>
  </div>
`;
  const overlay = document.getElementById("confirmation-dialog-overlay");
  const dialog = document.querySelector(`.${styles["confirmation-dialog"]}`);
  if (overlay) {
    overlay.addEventListener("click", cancelHandler);
  }
  if (dialog) {
    const cancelBtn = dialog.querySelector(`.${styles["cancel-btn"]}`);
    const confirmBtn = dialog.querySelector(`.${styles["confirm-btn"]}`);
    if (cancelBtn) {
      cancelBtn.addEventListener("click", cancelHandler);
    }
    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => confirmHandler(onConfirm));
    }
  }
}

// Cancel handler
function cancelHandler() {
  const overlay = document.getElementById("confirmation-dialog-overlay");
  const dialog = document.querySelector(`.${styles["confirmation-dialog"]}`);
  if (overlay) {
    overlay.remove();
  }
  if (dialog) {
    dialog.remove();
  }
}

// Confirm handler
function confirmHandler(onConfirm: () => void) {
  onConfirm();
  cancelHandler();
}

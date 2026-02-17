import styles from "./Button.module.css";
type ButtonProps = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  btnClass?: string;
  disabled?: boolean;
};

export default function Button({
  label,
  onClick,
  type = "button",
  btnClass = "",
  disabled = false,
}: ButtonProps) {
  return `
    <button class="${styles["custom-button"]} ${btnClass}" type="${type}" 
    ${disabled ? "disabled" : ""} ${onClick ? `onclick="${onClick()}"` : ""}>
      ${label}
    </button>
  `;
}

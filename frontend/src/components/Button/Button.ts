import styles from "./Button.module.css";
type ButtonProps = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  btnClass?: string;
};

export default function Button({
  label,
  onClick,
  type = "button",
  btnClass = "",
}: ButtonProps) {
  return `
    <button class="${styles["custom-button"]} ${btnClass}" type="${type}" ${onClick ? `onclick="${onClick()}"` : ""}>
      ${label}
    </button>
  `;
}

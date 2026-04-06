import styles from "./Button.module.css";
type ButtonProps = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  btnClass?: string;
  disabled?: boolean;
  addBtn?: boolean;
  data?: string;
};

export default function Button({
  label,
  type = "button",
  btnClass = "",
  disabled = false,
  addBtn = false,
  data = "",
}: ButtonProps) {
  return `
    <button ${data ? data : ""} class="${styles["custom-button"]} ${addBtn ? styles["add-button"] : ""} ${btnClass}" type="${type}" 
    ${disabled ? "disabled" : ""}>
      ${label}
    </button>
  `;
}

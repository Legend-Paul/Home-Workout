import styles from "./Input.module.css";
type InputProps = {
  label: string;
  type?: string;
  id: string;
  name: string;
  required?: boolean;
  placeholder: string;
  minLength?: number;
  maxLength?: number;
  errorMessage?: string;
  checked?: boolean;
  className?: string;
  value?: string;
  accept?: string;
};

export default function Input({
  label,
  type = "text",
  id,
  name,
  required = false,
  placeholder,
  minLength,
  maxLength,
  errorMessage = "Invalid input",
  checked = false,
  className = "",
  value = "",
  accept = "",
}: InputProps) {
  return `
    <div class="${styles["input-container"]} ${className ? styles[className] : ""}">
      <label for="${id}">${label}</label>
      <input type="${type}" id="${id}" name="${name}"  ${value ? `value = "${value}"` : ""}
      placeholder="${placeholder}" ${required ? "required" : ""} 
      ${minLength ? `minLength="${minLength}"` : ""} 
      ${maxLength ? `maxLength="${maxLength}"` : ""} 
      ${checked ? "checked" : ""} ${accept ? `accept="${accept}"` : ""}/>
      <span class="${styles["error-message"]}">${errorMessage}</span>
    </div>
  `;
}

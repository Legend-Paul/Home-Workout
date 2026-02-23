import styles from "./Textarea.module.css";

type TextareaProps = {
  label: string;
  id: string;
  name: string;
  required?: boolean;
  placeholder: string;
  minLength?: number;
  maxLength?: number;
  errorMessage?: string;
  className?: string;
};

export default function Textarea({
  label,
  id,
  name,
  required = false,
  placeholder,
  minLength,
  maxLength,
  errorMessage = "Invalid input",
  className = "",
}: TextareaProps) {
  return `
    <div class="${styles["textarea-container"]} ${className ? styles[className] : ""}">
      <label for="${id}">${label}</label>
      <textarea id="${id}" name="${name}" row="50"
      placeholder="${placeholder}" ${required ? "required" : ""} 
      ${minLength ? `minLength="${minLength}"` : ""} 
      ${maxLength ? `maxLength="${maxLength}"` : ""} ></textarea>
      <span class="${styles["error-message"]}">${errorMessage}</span>
    </div>
  `;
}

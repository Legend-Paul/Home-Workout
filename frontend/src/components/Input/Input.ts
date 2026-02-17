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
}: InputProps) {
  return `
    <div class="${styles["input-container"]}">
      <label for="${id}">${label}</label>
      <input type="${type}" id="${id}" name="${name}"  
      placeholder="${placeholder}" ${required ? "required" : ""} 
      ${minLength ? `minLength="${minLength}"` : ""} ${maxLength ? `maxLength="${maxLength}"` : ""} />
      <span class="${styles["error-message"]}">${errorMessage}</span>
    </div>
  `;
}

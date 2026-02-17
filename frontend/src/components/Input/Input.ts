import styles from "./Input.module.css";
type InputProps = {
  label: string;
  type?: string;
  id: string;
  name: string;
  required?: boolean;
  placeholder: string;
};

export default function Input({
  label,
  type = "text",
  id,
  name,
  required = false,
  placeholder,
}: InputProps) {
  return `
    <div class="${styles["input-container"]}">
      <label for="${id}">${label}</label>
      <input type="${type}" id="${id}" name="${name}" 
      placeholder="${placeholder}" ${required ? "required" : ""} />
    </div>
  `;
}

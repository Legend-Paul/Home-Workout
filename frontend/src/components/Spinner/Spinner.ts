import style from "./Spinner.module.css";

export default function Spinner() {
  return `
    <div class="${style["spinner-container"]}">
      <div class="${style["spinner"]}"></div>
    </div>
  `;
}

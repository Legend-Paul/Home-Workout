import style from "./Spinner.module.css";

export default function Spinner({
  type = "small",
  message = "",
}: {
  type?: "small" | "large";
  message?: string;
}): string {
  return `
    <div class="${style["spinner-container"]}  ${style[type] || ""}">
      <div class="${style["spinner"]}"></div>
      ${message ? `<p>${message}</p>` : ""}
    </div>
  `;
}

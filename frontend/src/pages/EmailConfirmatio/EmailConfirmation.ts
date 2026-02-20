import Confirmation from "../../components/Confirmation/Confirmation";

export default function EmailConfirmation() {
  const type =
    new URLSearchParams(window.location.search).get("status") || "success";
  const mainApp = document.getElementById("main-app");
  mainApp!.innerHTML = `<div>${Confirmation({
    message:
      "Confirmation email sent! Please check your inbox and click the link to verify your email address.",
    type: type as "success" | "error" | "info",
  })}</div>`;
}

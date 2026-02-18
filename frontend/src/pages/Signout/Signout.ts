export default async function Signout() {
  localStorage.removeItem("Authorization");
  window.location.href = "/auth/signin";
}

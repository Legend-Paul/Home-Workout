import { navigate } from "../../router";

export default async function Signout() {
  localStorage.removeItem("Authorization");
  navigate("/auth/signin");
}

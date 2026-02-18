const backendUrl =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_DEV_URL;

export default async function isAuthenticated(): Promise<boolean> {
  const token = localStorage.getItem("token");
  console.log(token);
  if (!token) return false;

  try {
    const response = await fetch(`${backendUrl}/auth`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      localStorage.removeItem("token");
      return false;
    }
  } catch (error) {
    console.error("Error verifying authentication:", error);
    localStorage.removeItem("token");
    return false;
  }
}

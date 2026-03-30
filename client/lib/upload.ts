import { API_URL, getToken } from "./auth";

export async function uploadImage(file: File): Promise<string> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/upload/image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Upload failed");
  if (typeof data.url !== "string") throw new Error("Invalid upload response");
  return data.url;
}

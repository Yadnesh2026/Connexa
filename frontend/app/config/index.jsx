// What is Axios?
// Axios is a JavaScript library used to send HTTP requests from your frontend to a backend server.

//We are Doing frontend in redux

import axios from "axios";
//Single Instance to change the server coming from backend

export const baseURL = (
  process.env.NEXT_PUBLIC_API_URL || "https://connexa-backend-4yg5.onrender.com"
).replace(/\/+$/, "");

export const getMediaUrl = (fileName, fallback = "default.jpg") => {
  const file = String(fileName || fallback || "").trim();

  if (!file) return "";

  if (
    file.startsWith("http://") ||
    file.startsWith("https://") ||
    file.startsWith("data:") ||
    file.startsWith("blob:")
  ) {
    return file;
  }

  const cleanFile = file.replace(/^\/+/, "");

  if (cleanFile.startsWith("uploads/")) {
    return `${baseURL}/${cleanFile}`;
  }

  return `${baseURL}/uploads/${cleanFile}`;
};

export const handleImageError = (event, fallback = "default.jpg") => {
  const fallbackUrl = getMediaUrl(fallback);

  if (fallbackUrl && event.currentTarget.src !== fallbackUrl) {
    event.currentTarget.src = fallbackUrl;
  }
};






export const clientServer = axios.create({
    baseURL:baseURL,
})

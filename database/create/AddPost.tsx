import { FIREBASE_DB_URL } from "@/database/firebaseConfig";

export const addPost = async (
  title: string,
  imageUri: string,
  description: string,
  author: string
) => {
  const now = new Date();

  const formattedDate = now.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const response = await fetch(`${FIREBASE_DB_URL}/posts.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      post_title: title,
      post_imageupload: imageUri,
      post_description: description,
      post_author: author,
      post_date: formattedDate,
      post_timestamp: now.getTime(), // ✅ Add raw timestamp
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add post");
  }

  return await response.json();
};

import { FIREBASE_DB_URL } from "@/database/firebaseConfig";

export const addPost = async (
  title: string,
  imageUri: string,
  description: string,
  author: string
) => {
  const now = new Date();

  // Format the date for readability
  const formattedDate = now.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Step 1: Fetch existing posts
  const existingPostsResponse = await fetch(`${FIREBASE_DB_URL}/posts.json`);
  if (!existingPostsResponse.ok) {
    throw new Error("Failed to check existing posts");
  }

  const existingPosts = await existingPostsResponse.json();

  // Step 2: Check for duplicate titles
  const duplicate = Object.values(existingPosts || {}).some(
    (post: any) =>
      post.post_title.trim().toLowerCase() === title.trim().toLowerCase()
  );

  if (duplicate) {
    throw new Error("A post with the same title already exists.");
  }

  // Step 3: Add post if no duplicate
  const response = await fetch(`${FIREBASE_DB_URL}/posts.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      post_title: title,
      post_imageupload: imageUri,
      post_description: description,
      post_author: author,
      post_date: formattedDate,
      post_timestamp: now.getTime(),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add post");
  }

  return await response.json();
};

import { get, push, ref, set, update } from "firebase/database";
import { db } from "../firebaseConfig";

export const addCommentToPost = async (postId: string, username: string, comment: string) => {
  const commentRef = ref(db, `comments/${postId}`);
  const newCommentRef = push(commentRef);
  const timestamp = Date.now();

  // Add new comment
  await set(newCommentRef, {
    id: newCommentRef.key,
    username,
    comment,
    timestamp,
  });

  // Increment commentCount
  const countRef = ref(db, `posts/${postId}/commentCount`);
  const countSnapshot = await get(countRef);
  const currentCount = countSnapshot.exists() ? countSnapshot.val() : 0;
  console.log("Updated commentCount to:", currentCount + 1);
  
  await update(ref(db, `posts/${postId}`), {
    commentCount: currentCount + 1,
  });
};

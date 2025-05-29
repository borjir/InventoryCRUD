// getPostLogs.ts
import { db } from "@/database/firebaseConfig";
import { get, ref } from "firebase/database";

export interface PostLogEntry {
  type: "like" | "comment";
  username: string;
  timestamp: number;
  comment?: string;
}

export const getPostLogs = async (postId: string): Promise<PostLogEntry[]> => {
  const likesRef = ref(db, `posts/${postId}/likes`);
  const commentsRef = ref(db, `comments/${postId}`);

  const [likesSnap, commentsSnap] = await Promise.all([
    get(likesRef),
    get(commentsRef),
  ]);

  const logs: PostLogEntry[] = [];

  if (likesSnap.exists()) {
    likesSnap.forEach((child) => {
      const username = child.key!;
      const timestamp = child.val()?.timestamp || 0;
      logs.push({ type: "like", username, timestamp });
    });
  }

  if (commentsSnap.exists()) {
    commentsSnap.forEach((child) => {
      const commentData = child.val();
      logs.push({
        type: "comment",
        username: commentData.username,
        timestamp: commentData.timestamp,
        comment: commentData.comment,
      });
    });
  }

  // Sort latest first
  return logs.sort((a, b) => b.timestamp - a.timestamp);
};

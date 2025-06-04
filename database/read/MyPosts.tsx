import { db } from "@/database/firebaseConfig";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { equalTo, onValue, orderByChild, query, ref } from "firebase/database";

dayjs.extend(customParseFormat);

export interface Post {
  id: string;
  title: string;
  imageUri: string;
  description: string;
  date: string;
  author: string;
  likes?: Record<string, boolean>;
  commentCount?: number;
  timestamp?: number; // Add this field
}

export const listenToUserPosts = (
  username: string,
  callback: (posts: Post[]) => void,
  setLoading: (loading: boolean) => void
) => {
  const userPostsQuery = query(
    ref(db, "posts"),
    orderByChild("post_author"),
    equalTo(username)
  );

  const unsubscribe = onValue(
    userPostsQuery,
    (snapshot) => {
      const data = snapshot.val();
      let userPosts: Post[] = [];

      if (data) {
        userPosts = Object.entries(data)
          .map(([key, value]: [string, any]) => ({
            id: key,
            title: value.post_title || "",
            imageUri: value.post_imageupload || "",
            description: value.post_description || "",
            date: value.post_date || "",
            author: value.post_author || "",
            likes: value.likes || {},
            commentCount: value.commentCount || 0,
            timestamp: value.post_timestamp || 0, // Safely fallback to 0
          }))
          .sort((a, b) => b.timestamp! - a.timestamp!); // Newest first
      }

      callback(userPosts);
      setLoading(false);
    },
    (error) => {
      console.error("Error listening to user posts:", error);
      setLoading(false);
    }
  );

  return unsubscribe;
};

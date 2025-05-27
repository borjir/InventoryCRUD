// database/read/useFetchReportsData.ts
import { db } from "@/database/firebaseConfig";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  post_title: string;
  post_author: string;
  post_timestamp: number;
  likes: Record<string, boolean>;
}

interface Comment {
  timestamp: number;
}

export const useFetchReportsData = () => {
  const [postCountToday, setPostCountToday] = useState(0);
  const [commentCountWeek, setCommentCountWeek] = useState(0);
  const [topLikedPosts, setTopLikedPosts] = useState<
    { id: string; title: string; name: string; likeCount: number }[]
  >([]);

  useEffect(() => {
  const postsRef = ref(db, "posts");
  const commentsRef = ref(db, "comments");

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;

  const recentPostIds = new Set<string>();

  const unsubscribePosts = onValue(postsRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    let todayCount = 0;
    const likedPostList = [];

    for (const [id, post] of Object.entries<Post>(data)) {
      if (post.post_timestamp >= startOfToday) todayCount++;

      if (post.post_timestamp >= sevenDaysAgo) {
        recentPostIds.add(id); // 👈 collect relevant posts only
      }

      likedPostList.push({
        id,
        title: post.post_title,
        name: post.post_author,
        decsription: post.post_description,
        likeCount: post.likes ? Object.keys(post.likes).length : 0,
        date: post.post_date,
        description: post.post_description,
        imageUri: post.post_imageupload,
        timestamp: post.post_timestamp,
      });
    }

    const sorted = likedPostList.sort((a, b) => b.likeCount - a.likeCount).slice(0, 5);

    setPostCountToday(todayCount);
    setTopLikedPosts(sorted);
  });

  const unsubscribeComments = onValue(commentsRef, (snapshot) => {
    const allCommentsData = snapshot.val();
    if (!allCommentsData) return;

    let totalComments = 0;

    for (const postId in allCommentsData) {
      if (!recentPostIds.has(postId)) continue; // 👈 only count for recent posts

      for (const commentId in allCommentsData[postId]) {
        const comment: Comment = allCommentsData[postId][commentId];
        if (comment.timestamp >= sevenDaysAgo) totalComments++;
      }
    }

    setCommentCountWeek(totalComments);
  });

  return () => {
    unsubscribePosts();
    unsubscribeComments();
  };
}, []);


  return {
    postCountToday,
    commentCountWeek,
    topLikedPosts,
  };
};

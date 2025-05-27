// database/read/useFetchPosts.ts
import { db } from "@/database/firebaseConfig";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { Image } from "react-native";

interface Post {
  id: string;
  title: string;
  imageUri: string;
  name: string;
  date: string;
  description: string;
  aspectRatio: number;
  imageWidth?: number;
  imageHeight?: number;
  likes: Record<string, boolean>;
  commentCount: number;
  timestamp?: number;
}

export const useFetchPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postsRef = ref(db, "posts");

    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const entries = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          title: value.post_title,
          imageUri: value.post_imageupload,
          name: value.post_author,
          date: value.post_date,
          description: value.post_description,
          likes: value.likes || {},
          commentCount: value.commentCount || 0,
          timestamp: value.timestamp || 0,
        }));

        const fetchImageSizes = entries.map(
          (post) =>
            new Promise<Post>((resolve) => {
              if (!post.imageUri) {
                resolve({ ...post, aspectRatio: 3 / 2 });
                return;
              }

              Image.getSize(
                post.imageUri,
                (width, height) => {
                  resolve({
                    ...post,
                    imageWidth: width,
                    imageHeight: height,
                    aspectRatio: width / height,
                  });
                },
                () => {
                  resolve({
                    ...post,
                    imageWidth: 3,
                    imageHeight: 2,
                    aspectRatio: 3 / 2,
                  });
                }
              );
            })
        );

        Promise.all(fetchImageSizes).then((postsWithSize) => {
          const sorted = postsWithSize.sort((a, b) => {
            // Prefer sorting by timestamp (if available)
            return (b.timestamp ?? 0) - (a.timestamp ?? 0);
          });

          setPosts(sorted);
          setLoading(false);
        });
      } else {
        setPosts([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { posts, loading };
};

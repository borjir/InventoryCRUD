import { db } from '@/database/firebaseConfig';
import { ref, update } from 'firebase/database';

export const updatePost = async (postId: string, title: string, description: string) => {
  if (!postId) throw new Error('Post ID is required');

  const postRef = ref(db, `posts/${postId}`);

  // Update post data
  await update(postRef, {
    post_title: title,
    post_description: description,
  });
};

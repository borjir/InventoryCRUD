import { db } from '@/database/firebaseConfig';
import { ref, remove } from 'firebase/database';

export const deletePostById = async (postId: string) => {
  try {
    const postRef = ref(db, `posts/${postId}`);
    await remove(postRef);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete post:', error);
    return { success: false, error };
  }
};

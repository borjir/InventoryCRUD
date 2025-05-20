// services/addPostService.ts
import { FIREBASE_DB_URL } from '@/database/firebaseConfig';

export const addPost = async (title: string, description: string, author: string) => {
  const response = await fetch(`${FIREBASE_DB_URL}/posts.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      post_title: title,
      post_description: description,
      post_author: author,
      post_date: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to add post');
  }

  return await response.json();
};

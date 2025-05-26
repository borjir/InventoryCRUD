import { db } from '@/database/firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';
import { get, ref, remove, update } from 'firebase/database';
import React, { memo, useEffect, useState } from 'react';
import {
  Alert,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native';

export const handleDelete = async (id: string) => {
  try {
    const userRef = ref(db, `users/${id}`);
    const userSnap = await get(userRef);

    if (!userSnap.exists()) {
      ToastAndroid.show('User not found.', ToastAndroid.SHORT);
      return;
    }

    const { username } = userSnap.val();

    Alert.alert('Confirm Deletion', `Are you sure you want to delete ${username}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove(userRef); // Step 1: Remove user

            const updates = {};
            const commentCountsToAdjust = {}; // { [postId]: numToSubtract }

            const postsSnap = await get(ref(db, 'posts'));
            if (postsSnap.exists()) {
              postsSnap.forEach((child) => {
                const post = child.val();
                const postId = child.key;

                // Step 2: Anonymize post author
                if (post.post_author === username) {
                  updates[`posts/${postId}`] = null;
                }

                // Step 3: Remove user's like
                if (post.likes && post.likes[username]) {
                  updates[`posts/${postId}/likes/${username}`] = null;
                }
              });
            }

            const commentsSnap = await get(ref(db, 'comments'));
            if (commentsSnap.exists()) {
              commentsSnap.forEach((postCommentsSnap) => {
                const postId = postCommentsSnap.key;
                let userCommentCount = 0;

                postCommentsSnap.forEach((commentSnap) => {
                  const comment = commentSnap.val();
                  if (comment.username === username) {
                    updates[`comments/${postId}/${commentSnap.key}`] = null;
                    userCommentCount++;
                  }
                });

                if (userCommentCount > 0) {
                  commentCountsToAdjust[postId] = userCommentCount;
                }
              });
            }

            // Step 4: Adjust commentCount for each post
            const postKeys = Object.keys(commentCountsToAdjust);
            for (const postId of postKeys) {
              const postRef = ref(db, `posts/${postId}/commentCount`);
              const countSnap = await get(postRef);
              if (countSnap.exists()) {
                const oldCount = countSnap.val();
                const newCount = Math.max(0, oldCount - commentCountsToAdjust[postId]);
                updates[`posts/${postId}/commentCount`] = newCount;
              }
            }

            // Step 5: Apply all updates
            if (Object.keys(updates).length > 0) {
              await update(ref(db), updates);
            }

            ToastAndroid.show('User and all related data deleted.', ToastAndroid.SHORT);
          } catch (err) {
            console.error(err);
            ToastAndroid.show('Failed to delete user.', ToastAndroid.SHORT);
          }
        },
      },
    ]);
  } catch (err) {
    console.error(err);
    ToastAndroid.show('An error occurred.', ToastAndroid.SHORT);
  }
};


  export const PersonItem = memo(({ id, name, email, onDelete }) => (
    <View className="bg-[#161b22] p-[15px] rounded-lg mb-[10px] border-[1px] border-[#30363d] flex-row justify-between items-center">
      <View>
        <Text className="font-bold text-white text-[18px]">{name}</Text>
        <Text className="text-[#c9d1d9] text-[14px]">{email}</Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(id)}>
        <FontAwesome name="trash" size={24} color="#fa5e55" />
      </TouchableOpacity>
    </View>
  ));

  // Debounce helper hook
  export function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
  
    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
  
    return debouncedValue;
  }
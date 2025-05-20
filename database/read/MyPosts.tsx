import { db } from '@/database/firebaseConfig';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { equalTo, onValue, orderByChild, query, ref } from 'firebase/database';

dayjs.extend(customParseFormat);

export interface Post {
  id: string;
  title: string;
  description: string;
  date: string;
  author: string;
}

const DATE_FORMAT = 'MMM DD, YYYY, h:mm A';

export const listenToUserPosts = (
  username: string,
  callback: (posts: Post[]) => void,
  setLoading: (loading: boolean) => void
) => {
  const userPostsQuery = query(
    ref(db, 'posts'),
    orderByChild('post_author'),
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
            title: value.post_title,
            description: value.post_description,
            date: value.post_date,
            author: value.post_author,
          }))
          .sort((a, b) =>
            dayjs(b.date, DATE_FORMAT).valueOf() - dayjs(a.date, DATE_FORMAT).valueOf()
          );
      }

      callback(userPosts);
      setLoading(false);
    },
    (error) => {
      console.error('Error listening to user posts:', error);
      setLoading(false);
    }
  );

  return unsubscribe;
};

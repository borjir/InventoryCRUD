// services/authService.ts
import { FIREBASE_API_KEY, FIREBASE_DB_URL } from '@/database/firebaseConfig';

export const loginUserService = async (usernameOrEmail: string, password: string) => {
  if (!usernameOrEmail || !password) {
    throw new Error('Please fill both fields');
  }

  // 1. If user entered a username, fetch users to find their email
  let email = usernameOrEmail;
  if (!usernameOrEmail.includes('@')) {
    const res = await fetch(`${FIREBASE_DB_URL}/users.json`);
    const users = await res.json();

    const userEntry = users && Object.entries(users).find(([key, user]: any) => user.username === usernameOrEmail);
    if (!userEntry) throw new Error('User not found');
    email = userEntry[1].email;
  }

  // 2. Firebase Auth REST API login
  const authRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );

  const authData = await authRes.json();
  if (!authRes.ok) throw new Error(authData.error.message || 'Login failed');

  const { localId } = authData;

  // 3. Fetch user info
  const userRes = await fetch(`${FIREBASE_DB_URL}/users/${localId}.json`);
  const userData = await userRes.json();
  if (!userData) throw new Error('User data not found');

  return { userData, localId };
};

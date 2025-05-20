// AddUser.ts
import { FIREBASE_API_KEY, FIREBASE_DB_URL } from '@/database/firebaseConfig';

export const registerUser = async (
  email: string,
  password: string,
  username: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // 1. Check if username exists
    const usernameCheckRes = await fetch(`${FIREBASE_DB_URL}/users.json`);
    const users = await usernameCheckRes.json();
    const usernameTaken = users && Object.values(users).some((user: any) => user.username === username);

    if (usernameTaken) {
      return { success: false, error: 'Username is already taken.' };
    }

    // 2. Create user in Firebase Auth
    const authRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );

    const authData = await authRes.json();
    if (!authRes.ok) {
      if (authData.error.message === 'EMAIL_EXISTS') {
        return { success: false, error: 'This email is already in use.' };
      }
      return { success: false, error: authData.error.message };
    }

    const { localId } = authData;

    // 3. Store user info in DB
    await fetch(`${FIREBASE_DB_URL}/users/${localId}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, role: 'user' }),
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Registration failed' };
  }
};

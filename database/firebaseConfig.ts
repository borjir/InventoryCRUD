// firebaseConfig.js
export const FIREBASE_API_KEY = "AIzaSyC0nwqjdGXBror11nF3V9LhCEn363xYHRw";
export const FIREBASE_DB_URL = "https://inventorycrud-122a6-default-rtdb.asia-southeast1.firebasedatabase.app";

const firebaseConfig = {
  apiKey: "AIzaSyC0nwqjdGXBror11nF3V9LhCEn363xYHRw",
  databaseURL: "https://inventorycrud-122a6-default-rtdb.asia-southeast1.firebasedatabase.app",
};

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
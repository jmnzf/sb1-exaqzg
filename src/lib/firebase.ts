import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBj8PYQZpfqo9DwzX5Z5vJIjMWGXvqGvzY",
  authDomain: "helpdesk-demo-app.firebaseapp.com",
  projectId: "helpdesk-demo-app",
  storageBucket: "helpdesk-demo-app.appspot.com",
  messagingSenderId: "847229384727",
  appId: "1:847229384727:web:3f4b7d8f9c9f9f9f9f9f9f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// firebaseConfig.tsx

// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1NNkLZAW7hsEYxzmc5XeU74NHPYEUMRo",
  authDomain: "vastravibez-47cb8.firebaseapp.com",
  projectId: "vastravibez-47cb8",
  storageBucket: "vastravibez-47cb8.appspot.com",
  messagingSenderId: "417991654275",
  appId: "1:417991654275:web:90a441c171b933cfe0d4b6",
};

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const fireDB = getFirestore(app);
export const auth = getAuth(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4UnlMAsyo90brcIx3kXTvNEk5IiDUbCM",
  authDomain: "cafes-los-angeles-39eb0.firebaseapp.com",
  projectId: "cafes-los-angeles-39eb0",
  storageBucket: "cafes-los-angeles-39eb0.firebasestorage.app",
  messagingSenderId: "504133561806",
  appId: "1:504133561806:web:2de9c0f450b61dc9800f9f",
  measurementId: "G-7DKM97QJMH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
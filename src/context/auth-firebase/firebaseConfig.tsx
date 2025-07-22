// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlCAl7Fk_ygcecrOwEazig02A5eqxXTcQ",
  authDomain: "caronafc-dd17a.firebaseapp.com",
  projectId: "caronafc-dd17a",
  storageBucket: "caronafc-dd17a.firebasestorage.app",
  messagingSenderId: "258403147124",
  appId: "1:258403147124:web:d177c584dc17b0034a2021",
  measurementId: "G-JL4L9MPPBP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export default analytics;
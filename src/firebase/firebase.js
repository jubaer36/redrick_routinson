import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6WFM652488FQQVq9TEZfekbfyUT8vivY",
  authDomain: "fir-6561e.firebaseapp.com",
  projectId: "fir-6561e",
  storageBucket: "fir-6561e.appspot.com",
  messagingSenderId: "982148730376",
  appId: "1:982148730376:web:4fb34f01168db789d2cbbd",
  measurementId: "G-1FHRLZ8SGF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)



export { app, auth };

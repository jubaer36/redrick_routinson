import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

// Function for creating a new user with email and password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user);
  return userCredential;
};

// Function for signing in with email and password
export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Function for signing in with Google, with domain restriction
export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if the email is from 'iut.dhaka.edu' domain
    if (!user.email.endsWith('@iut-dhaka.edu')) {
      // If the email is not from the correct domain, sign out the user
      await doSignOut();
      throw new Error("Only emails from iut-dhaka.edu are allowed.");
    }

    // add user to firestore (You can handle this according to your needs)

    return user;
  } catch (error) {
    console.error("Google sign-in error: ", error);
    throw error;
  }
};

// Function for signing out the user
export const doSignOut = () => {
  return auth.signOut();
};

// Function for resetting the password
export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// Function for changing the current user's password
export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

// Function for sending email verification
export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { collection, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtJMSDCivJXI9o72TKUIeYOfYeCdaUdV8",
  authDomain: "lastredrick-28e65.firebaseapp.com",
  projectId: "lastredrick-28e65",
  storageBucket: "lastredrick-28e65.firebasestorage.app",
  messagingSenderId: "880296011477",
  appId: "1:880296011477:web:e7c821985cc02786c1645c",
  measurementId: "G-0YMYYXDPJ8",
};
// // 2nd Demo Project
// const firebaseConfig = {
//   apiKey: "AIzaSyBCd9S0rvxs8i2hKZ3iNj_ILHeCIMk5ARc",
//   authDomain: "demo2-f1c97.firebaseapp.com",
//   projectId: "demo2-f1c97",
//   storageBucket: "demo2-f1c97.firebasestorage.app",
//   messagingSenderId: "561462620151",
//   appId: "1:561462620151:web:be1c0090915bbc9fc108f2",
//   measurementId: "G-BWJ3DYHWJB"
// };

// 2nd Demo Project
// const firebaseConfig = {
//   apiKey: "AIzaSyDVAZFRD3LdV3ZBFWJQozlVOWaRkEoEDxM",
//   authDomain: "fir-6561e.firebaseapp.com",
//   projectId: "fir-6561e",
//   storageBucket: "fir-6561e.firebasestorage.app",
//   messagingSenderId: "982148730376",
//   appId: "1:982148730376:web:3476ef0855d3259ad2cbbd",
//   measurementId: "G-X4JS0HCEH5",
// };

// 3rd Demo Project
// const firebaseConfig = {
//   apiKey: "AIzaSyBux2VuIY0lo3GBbUGZKBcIFx42-vLK_Vs",
//   authDomain: "redbrick-18b6b.firebaseapp.com",
//   projectId: "redbrick-18b6b",
//   storageBucket: "redbrick-18b6b.firebasestorage.app",
//   messagingSenderId: "564418787802",
//   appId: "1:564418787802:web:9e8bf4c67b7318c9b7a8e3",
//   measurementId: "G-Z3WX37SD0C",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export const db = getFirestore();

export { collection, doc, setDoc };

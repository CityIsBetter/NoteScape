import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

import { getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "notescape-auth.firebaseapp.com",
  projectId: "notescape-auth",
  storageBucket: "notescape-auth.appspot.com",
  messagingSenderId: "1058946535188",
  appId: "1:1058946535188:web:4d5236dc9a01b7767a3c01",
  measurementId: "G-P22QM7277T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider()

const db = getFirestore(app);
export default db;
export {auth, provider};

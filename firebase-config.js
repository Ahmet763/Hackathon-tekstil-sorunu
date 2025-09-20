// Firebase importları
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase config (kendi bilgilerinle değiştir)
const firebaseConfig = {
  apiKey: "AIzaSyDfQ5AWp8HRPTBA1v46d3FkAxnamRaNqC8",
  authDomain: "rewear-cc36b.firebaseapp.com",
  projectId: "rewear-cc36b",
  storageBucket: "rewear-cc36b.firebasestorage.app",
  messagingSenderId: "727486583581",
  appId: "1:727486583581:web:8f21e8aeeaecb7846c07f4",
  measurementId: "G-350851XWQG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

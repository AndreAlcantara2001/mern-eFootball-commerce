// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "efootballcommerce-bed4b.firebaseapp.com",
    projectId: "efootballcommerce-bed4b",
    storageBucket: "efootballcommerce-bed4b.appspot.com",
    messagingSenderId: "563053054747",
    appId: "1:563053054747:web:72e7eb3c603ae45fec61be"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
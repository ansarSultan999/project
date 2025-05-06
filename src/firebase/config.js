import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration - replace with your own config
const firebaseConfig = {
  apiKey: "AIzaSyC7X4LOl7HLie2laSk5aSiWlShA7CL7uds",
  authDomain: "fazi-data.firebaseapp.com",
  projectId: "fazi-data",
  storageBucket: "fazi-data.firebasestorage.app",
  messagingSenderId: "1028652571780",
  appId: "1:1028652571780:web:5bee841b6239d054e5f6d1",
  measurementId: "G-GG70VMW650"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
import { initializeApp } from "firebase/app"; // InitializeApp function
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth"; // Firebase Authentication function
import { getFirestore } from "firebase/firestore"; // Firestore function from Firebase
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyA-A5qJ3KWvErVVMCRa8WqWIKXt75_wY2Y",
  authDomain: "wordbyword-bad31.firebaseapp.com",
  projectId: "wordbyword-bad31",
  storageBucket: "wordbyword-bad31.appspot.com",
  messagingSenderId: "825862154314",
  appId: "1:825862154314:web:dbef16fa9becd457369eb3",
  measurementId: "G-1PR82Z99VJ"
};




// Initialize Firebase app with the provided configuration
const FIREBASE_APP = initializeApp(firebaseConfig);

// Get Firestore database instance
const FIREBASE_DB = getFirestore(FIREBASE_APP);

// Initialize Firebase authentication
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB, getAuth };
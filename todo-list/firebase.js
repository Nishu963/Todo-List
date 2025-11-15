import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyC3f1uuujP3RXYBgArOcqHQb_0heYruTH4",
  authDomain: "expo-login-app-c0179.firebaseapp.com",
  projectId: "expo-login-app-c0179",
  storageBucket: "expo-login-app-c0179.appspot.com",
  messagingSenderId: "95225451486",
  appId: "1:95225451486:web:03300944153eeee79e434f"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("✅ Firebase initialized");
}

export const auth = firebase.auth();
export const db = firebase.firestore();


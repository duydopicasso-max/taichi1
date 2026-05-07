import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCZFTxFBX_gpk4rrS_8j6TupArBpI3uca4",
  authDomain: "taichinh-a5a3c.firebaseapp.com",
  projectId: "taichinh-a5a3c",
  storageBucket: "taichinh-a5a3c.firebasestorage.app",
  messagingSenderId: "72611754595",
  appId: "1:72611754595:web:1e3b8aa000f34d3946fe56",
  measurementId: "G-W1WGS60MSS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

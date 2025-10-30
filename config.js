/* Paste your Firebase web config object here. Example:
const firebaseConfig = {
  apiKey: "XXXX",
  authDomain: "PROJECT.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT.appspot.com",
  messagingSenderId: "12345",
  appId: "1:123:web:abcd"
};
*/
const firebaseConfig = {}; // REPLACE with your Firebase config

if (Object.keys(firebaseConfig).length) {
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase initialized');
} else {
  console.log('Firebase config empty — demo mode');
}

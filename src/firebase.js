// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase';


const firebaseApp = firebase.initializeApp({
apiKey: "AIzaSyBnZ8xQmDlpFfBSPAZ8PgVi7t0_YDdzqf8",
authDomain: "insta-demo-1573e.firebaseapp.com",
projectId: "insta-demo-1573e",
storageBucket: "insta-demo-1573e.appspot.com",
messagingSenderId: "933797274961",
appId: "1:933797274961:web:543f7269db6cbb98c59f70",
measurementId: "G-WHZGFCS4NM"
});



const db = firebaseApp.firestore();

const auth = firebase.auth();

const storage = firebase.storage();

export { db, auth, storage };
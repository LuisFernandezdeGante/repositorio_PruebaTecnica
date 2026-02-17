import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    query, 
    where 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyDArTw0c7wLI6AivQAQkX9OoTm3lepBuVM",
  authDomain: "ipconsulta-e226c.firebaseapp.com",
  projectId: "ipconsulta-e226c",
  storageBucket: "ipconsulta-e226c.firebasestorage.app",
  messagingSenderId: "701539338399",
  appId: "1:701539338399:web:13e4bb90d0fb758ebc3aaa",
  measurementId: "G-RRS8VGRD0N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, deleteDoc, doc, query, where };

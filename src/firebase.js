// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "@firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCOElSNlcQ0hC2q6IfjT5qUYlnzpWsE9JM",

  authDomain: "facturacion-salud.firebaseapp.com",

  projectId: "facturacion-salud",

  storageBucket: "facturacion-salud.appspot.com",

  messagingSenderId: "374526329208",

  appId: "1:374526329208:web:32f64f666085f921b5888d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const facturasDB = collection(db, "facturas");
export const obrasSocialesDB = collection(db, "obra_sociales");
export const puntosDeVentaDB = collection(db, "puntos_de_venta");
export const estadosDB = collection(db, "estado");
export { getDocs, getDoc, addDoc, updateDoc, doc, deleteDoc };

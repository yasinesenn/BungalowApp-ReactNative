import { initializeApp } from "firebase/app";
import { addDoc,getDoc,  getFirestore,collection,doc,setDoc} from "firebase/firestore";
import { getStorage, getDownloadURL,uploadFile, ref} from "firebase/storage";

import { initializeAuth, getReactNativePersistence ,getUser} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';



const firebaseConfig = {
  apiKey: "AIzaSyABsMLQr7_MMYp4YBmRXYPVJlnkDTpn9Zw",
  authDomain: "bungalowreact.firebaseapp.com",
  projectId: "bungalowreact",
  storageBucket: "bungalowreact.appspot.com",
  messagingSenderId: "470171358970",
  appId: "1:470171358970:web:74ec9cc3be20e2baaf5b43",
  measurementId: "G-F6SRN1L5E9"
};
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db=getFirestore(app);
const storage=getStorage(app);


export  {db,collection,addDoc,getFirestore,app,auth,getDoc,doc,setDoc,getUser,uploadFile,ref,storage,getDownloadURL};
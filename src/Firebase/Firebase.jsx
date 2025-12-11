// Imports for the firebase setup
import { initializeApp } from "firebase/app";
import { createContext, useContext } from "react";
import { getDatabase, set, ref } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Firebase configkeys
const firebaseConfig = {
    apiKey: "AIzaSyCyCWPi3OX6jVqCDsR-6IOdZChq_hUZzl4",
    authDomain: "new-firebase-chat-11c76.firebaseapp.com",
    projectId: "new-firebase-chat-11c76",
    storageBucket: "new-firebase-chat-11c76.firebasestorage.app",
    messagingSenderId: "278140927054",
    appId: "1:278140927054:web:23441781c3e72dcdc5171f"
};

export const app = initializeApp(firebaseConfig);
export const FirebaseContext = createContext(null);

// Firebase services 
export const firebaseAuth = getAuth(app);
export const firebaseDatabase = getDatabase(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app)
// coustome hook to use firebase
export const UseFirebase = () => useContext(FirebaseContext);

const FirebaseProvider = ({ children }) => {
    // Create new user (register)
    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(firebaseAuth, email, password)
            .catch((err) => console.log(err));
    };

    // Write to Realtime Database
    const putData = (key, data) => set(ref(database, key), data);

    // Set data in firebase fireStore
    const setFirestoreData = (data) => {
        return addDoc(collection(firestore, "users"), data);
    }


    return (
        <FirebaseContext.Provider value={{
            createUser,
            putData,
            setFirestoreData
        }}>
            {children}
        </FirebaseContext.Provider>
    );
};
export default FirebaseProvider;
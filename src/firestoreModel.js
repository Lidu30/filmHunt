import { initializeApp } from "firebase/app"
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"
import {
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"
import { reaction, runInAction } from "mobx"
import { router } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { firebaseConfig } from "./firebaseConfig.js"
import { reactiveModel } from "./bootstrapping"


const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})

// make doc and setDoc available at the Console for testing
global.doc = doc
global.setDoc = setDoc
global.db = db

const COLLECTION = "filmHunt"

function userDocRef(uid) {
    return doc(db, COLLECTION, uid)
  }

export async function signUp(email, password, name, phone) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    console.log("User signed up:", user)
    await setDoc(
      userDocRef(user.uid),
      {
        "UserID": user.uid,
        "Full Name": name,
        "Email": email,
        "Phone Number": phone,
        "Watchlist":     [],
      },
      { merge: true },
    )

    runInAction(() => {
      reactiveModel.userDetails = { id: user.uid, name, email, phone }
      reactiveModel.watchlist = []
      reactiveModel.ready = true
    })

    return userCredential
  } catch (error) {
    console.error("Sign Up Error:", error.message)
    throw error
  }
}


  export async function signIn(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    console.log("Signed in:", user.email)

    runInAction(() => {
      reactiveModel.userDetails = { id: user.uid, name: "", email: user.email, phone: "" }
      reactiveModel.watchlist = []
      reactiveModel.ready = false
    })
  
    await connectToPersistence()
    return userCredential
  }

  export async function logOut() {
    await signOut(auth)
    runInAction(() => {
      reactiveModel.userDetails = { id: null, name: "", email: "", phone: "" }
      reactiveModel.watchlist = []
      reactiveModel.ready = false
    })
    console.log("Signed out")
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user.uid)
      runInAction(() => {
        reactiveModel.userDetails = { id: user.uid, name: "", email: user.email, phone: "" }
        reactiveModel.watchlist = []
        reactiveModel.ready = false
      })
      connectToPersistence()
      router.replace("/(tabs)/home")
      } else {
        runInAction(() => {
          reactiveModel.userDetails = { id: null, name: "", email: "", phone: "" }
          reactiveModel.watchlist = []
          reactiveModel.ready = false
        })
        router.replace("/login")
    }
  })

  
  export function connectToPersistence() {
    const uid = reactiveModel.userDetails.id
    if (!uid) {
        console.warn("No user ID in model; skipping persistence")
      return
    }
  
    reactiveModel.ready = false
    const initialFetch = getDoc(userDocRef(uid))
      .then((snapshot) => {
        const data = snapshot.data() || {}
        runInAction(() => {
          reactiveModel.watchlist = data["Watchlist"] || []
          reactiveModel.userDetails = {
            id: data["UserID"]          ?? uid,
            name: data["Full Name"]     ?? reactiveModel.userDetails.name,
            email: data["Email"]        ?? reactiveModel.userDetails.email,
            phone: data["Phone Number"] ?? reactiveModel.userDetails.phone,
          }
          reactiveModel.ready = true
        })
      })
      .catch((err) => {
        console.error("Error reading user document:", err)
        runInAction(() => {
          reactiveModel.ready = true
        })
      })

    onSnapshot(userDocRef(uid), (snapshot) => {
      const data = snapshot.data() || {}
      runInAction(() => {
        reactiveModel.watchlist = data["Watchlist"] || reactiveModel.watchlist
        reactiveModel.userDetails = {
          id: data["UserID"]          ?? reactiveModel.userDetails.id,
          name: data["Full Name"]     ?? reactiveModel.userDetails.name,
          email: data["Email"]        ?? reactiveModel.userDetails.email,
          phone: data["Phone Number"] ?? reactiveModel.userDetails.phone,
        }
      })
    }, (err) => console.error("Firestore onSnapshot error:", err)
    )
  
    reaction(
      () => [
        reactiveModel.watchlist,
        reactiveModel.userDetails.name,
        reactiveModel.userDetails.email,
        reactiveModel.userDetails.phone,
      ],
      async ([watchlist, name, email, phone], _prev) => {
        if (!reactiveModel.ready) {
          return reactiveModel.ready = false
        }
        try {
          await setDoc(
            userDocRef(uid),
            {
              "Watchlist": watchlist,
              "Full Name":    name,
              "Email":        email,
              "Phone Number": phone,
            },
            { merge: true }
          )
        } catch (err) {
          console.error("Error writing user document:", err)
        }
        runInAction(() => { reactiveModel.ready = true })
      },
    )
    return initialFetch
  }


// export function connectToPersistence(reactiveModel, watchFunction) {
//     if (!reactiveModel.userDetails.id) return
//     function getModelStateACB() {
//         return [ reactiveModel.watchlist, 
//             reactiveModel.userDetails.name,
//             reactiveModel.userDetails.email,
//             reactiveModel.userDetails.phone
//             ]
//     }

//     function persistenceModelACB() {
//         const refObject = userDocRef(reactiveModel.userDetails.id)
//         if (reactiveModel.ready) {
//             setDoc(
//                 refObject,
//                 {
//                 "Watchlist": reactiveModel.watchlist,
//                 "Full Name": reactiveModel.userDetails.name,
//                 "Email": reactiveModel.userDetails.email,
//                 "Phone Number": reactiveModel.userDetails.phone
//                 },
//                 { merge: true },
//             )
//         }
//     }

//     // Why does the section below needs to be only just before or after installing the side effect

//     function errorACB(error) {
//         console.error(
//             "Could not reach cloud Firestore backend. Connection failed 1 times:", error)
//     } 

//     function readyACB(docSnap) {
//       const data = docSnap.data() || {}
//       reactiveModel.setUserDetails({
//         id:    docSnap.id,
//         name:  data["Full Name"]    ?? reactiveModel.userDetails.name,
//         email: data["Email"]        ?? reactiveModel.userDetails.email,
//         phone: data["Phone Number"] ?? reactiveModel.userDetails.phone,
//       })
//       reactiveModel.watchlist = data["Watchlist"] ?? reactiveModel.watchlist
//       reactiveModel.ready = true
//     }

//     watchFunction(getModelStateACB, persistenceModelACB);
//     reactiveModel.ready = false
//     const refObject = userDocRef(reactiveModel.userDetails.id);
//     return getDoc(refObject).then(readyACB).catch(errorACB);
// }

// const firestoreDoc= doc(db, "filmHunt", "modelData")
// setDoc(firestoreDoc, {dummyField: "dummyValue"}, {merge:true})
//     // .then(() => console.log("Document written successfully!"))
//     // .catch(error => console.error("Error writing document:", error));

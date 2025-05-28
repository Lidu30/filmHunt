import { initializeApp } from "firebase/app"
import { 
  doc, 
  getDoc, 
  getFirestore, 
  setDoc, 
  getDocs, 
  collection, 
  where, 
  query,
  serverTimestamp 
} from "firebase/firestore"
import {
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getAuth
} from "firebase/auth" 
import { firebaseConfig } from "./firebaseConfig.js"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
import { reactiveModel } from "./bootstrapping.js"

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

global.doc = doc
global.setDoc = setDoc
global.db = db

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})

const COLLECTION = "filmHunt"

export function connectToPersistence(reactiveModel, watchFunction) {
  reactiveModel.ready = false

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.warn("User not authenticated, skipping Firestore sync")
      return
    }

    const userDocRef = doc(db, COLLECTION, user.uid)

    watchFunction(getModelStateACB, saveModelToFirestoreACB)

    function getModelStateACB() {
      return [reactiveModel.watchlist, reactiveModel.userDetails.name, reactiveModel.userDetails.phone]
    }

    function saveModelToFirestoreACB() {
      if (!reactiveModel.ready) return
      setDoc(
        userDocRef,
        {
          Watchlist: reactiveModel.watchlist,
          "Full Name": reactiveModel.userDetails.name,
          "Phone Number": reactiveModel.userDetails.phone,
          Email: reactiveModel.userDetails.email,
          UserID: user.uid
        },
        { merge: true },
      ).catch((error) => {
        console.error("Firestore write error:", error)
      })
    }

    getDoc(userDocRef)
      .then((snapshot) => {
        const data = snapshot.exists() ? snapshot.data() : {}

        reactiveModel.watchlist = data.Watchlist ?? []
        reactiveModel.userDetails = {
          id: data.UserID ?? user.uid,
          name: data["Full Name"] ?? "",
          phone: data["Phone Number"] ?? "",
          email: data.Email ?? user.email
        }
        reactiveModel.ready = true
      })
      .catch((error) => {
        console.error("Firestore read error:", error)
        reactiveModel.watchlist = []
        reactiveModel.userDetails = {
          id: user.uid,
          name: "",
          phone: "",
          email: user.email
        }
        reactiveModel.ready = true
      })
  })
}

export async function signIn(email, password) {
  reactiveModel.clearModel()
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      reactiveModel.clearModel()
      console.log("Signed in:", userCredential.user)
      router.push("/profile")
      return userCredential.user
    })
    .catch((error) => {
      console.error("Sign in error:", error)
      throw error
    })
}

export async function signUp(email, password, name, phone) {
  try {
    const auth = getAuth()
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await setDoc(doc(db, COLLECTION, user.uid), {
      UserID: user.uid,
      "Full Name": name,
      "Phone Number": phone,
      Email: email,
      Watchlist: []
    });

    return user;
  } catch (error) {
    console.error("Signup error:", error)
    throw error
  }
}

export function logout() {
  return signOut(auth)
    .then(() => {
      console.log("Signed out")
      reactiveModel.userDetails = { id: null, name: "", email: "", phone: "" }
      reactiveModel.watchlist = []
      reactiveModel.clearModel()
      reactiveModel.ready = false
    })
    .catch((error) => {
      console.error("Sign out error:", error)
      throw error
    }).finally(() => {  
      router.push("/login")
    })
}

export async function fetchFullNameMap() {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION))
    const idToFullName = {}
    querySnapshot.docs.forEach((docSnap) => {
      const data = docSnap.data()
      idToFullName[docSnap.id] = data["Full Name"] || null
    })
    return idToFullName
  } catch (error) {
    console.error("Error fetching full name map:", error)
    return {}
  }
}

export async function getFullNameById(documentId) {
  try {
    const nameMap = await fetchFullNameMap()
    return nameMap[documentId] || null
  } catch (error) {
    console.error("Error getting full name by ID:", error)
    return null
  }
}

export async function getWatchlistById(documentId) {
  try {
    const docRef = doc(db, COLLECTION, documentId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data().Watchlist || []
    }
    return []
  } catch (error) {
    console.error("Error getting watchlist by ID:", error)
    return []
  }
}

export async function submitWatchlistFeedback(targetUserId, commenterId, feedback) {
  if (!feedback.comment && feedback.rating == null) {
    throw new Error("Must provide either comment or rating.")
  }

  const docId = `${targetUserId}_${commenterId}`
  const feedbackRef = doc(db, "watchlist_feedback", docId)

  const payload = {
    targetUserId,
    commenterId,
    commenterName: feedback.commenterName || "",
    timestamp: serverTimestamp(),
  }

  if (feedback.rating != null) payload.rating = feedback.rating
  if (feedback.comment) payload.comment = feedback.comment

  await setDoc(feedbackRef, payload, { merge: true })
}

export async function getFeedbackForWatchlist(targetUserId) {
  const q = query(
    collection(db, "watchlist_feedback"),
    where("targetUserId", "==", targetUserId)
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => doc.data())
}

export async function getAverageRatingForWatchlist(targetUserId) {
  const feedback = await getFeedbackForWatchlist(targetUserId)
  if (!feedback.length) return null

  const sum = feedback.reduce((acc, cur) => acc + (cur.rating || 0), 0)
  return sum / feedback.length
}
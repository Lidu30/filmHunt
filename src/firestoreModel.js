import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  getDocs,
  collection,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import {
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { reaction, runInAction } from "mobx";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "./firebaseConfig.js";
import { reactiveModel } from "./bootstrapping";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// make doc and setDoc available at the Console for testing
global.doc = doc;
global.setDoc = setDoc;
global.db = db;

const COLLECTION = "filmHunt";

function userDocRef(uid) {
  return doc(db, COLLECTION, uid);
}

export async function signUp(email, password, name, phone) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("User signed up:", user);
    await setDoc(
      userDocRef(user.uid),
      {
        UserID: user.uid,
        "Full Name": name,
        Email: email,
        "Phone Number": phone,
        Watchlist: [],
      },
      { merge: true }
    );

    runInAction(() => {
      reactiveModel.clearModel();
      reactiveModel.userDetails = { id: user.uid, name, email, phone };
      reactiveModel.watchlist = [];
      reactiveModel.ready = true;
    });

    return userCredential;
  } catch (error) {
    console.error("Sign Up Error:", error.message);
    throw error;
  }
}

export async function signIn(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  console.log("Signed in:", user.email, user.uid, user.displayName);

  runInAction(() => {
    reactiveModel.clearModel();
    reactiveModel.userDetails = {
      id: user.uid,
      name: "",
      email: user.email,
      phone: "",
    };
    reactiveModel.watchlist = [];
    reactiveModel.ready = false;
  });

  await connectToPersistence();
  return userCredential;
}

export async function logOut() {
  
  runInAction(() => {
    reactiveModel.clearModel();
    reactiveModel.userDetails = { id: null, name: "", email: "", phone: "" };
    reactiveModel.watchlist = [];
    reactiveModel.ready = false;
    reactiveModel.clearModel();
  });
  await signOut(auth);
  console.log("Signed out");
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    reactiveModel.clearModel();
    console.log("User is signed in:", user.uid);
    runInAction(() => {
      reactiveModel.userDetails = {
        id: user.uid,
        name: "",
        email: user.email,
        phone: "",
      };
      reactiveModel.watchlist = [];
      reactiveModel.ready = false;
    });
    connectToPersistence();
    router.push("/(tabs)/home");
  } else {
    runInAction(() => {
      reactiveModel.clearModel();
      reactiveModel.userDetails = { id: null, name: "", email: "", phone: "" };
      reactiveModel.watchlist = [];
      reactiveModel.ready = false;
      reactiveModel.clearModel();
    });
    router.push("/login");
  }
});

export function connectToPersistence() {
  const uid = reactiveModel.userDetails.id;
  if (!uid) {
    console.warn("No user ID in model; skipping persistence");
    return;
  }

  reactiveModel.ready = false;
  const initialFetch = getDoc(userDocRef(uid))
    .then((snapshot) => {
      const data = snapshot.data() || {};
      runInAction(() => {
        reactiveModel.watchlist = data["Watchlist"] || [];
        reactiveModel.userDetails = {
          id: data["UserID"],
          name: data["Full Name"] ,
          email: data["Email"] ,
          phone: data["Phone Number"],
        };
        reactiveModel.ready = true;
      });
    })
    .catch((err) => {
      console.error("Error reading user document:", err);
      runInAction(() => {
        reactiveModel.ready = true;
      });
    });

  onSnapshot(
    userDocRef(uid),
    (snapshot) => {
      const data = snapshot.data() || {};
      runInAction(() => {
        reactiveModel.watchlist = data["Watchlist"] || reactiveModel.watchlist;
        reactiveModel.userDetails = {
          id: data["UserID"] ?? reactiveModel.userDetails.id,
          name: data["Full Name"] ?? reactiveModel.userDetails.name,
          email: data["Email"] ?? reactiveModel.userDetails.email,
          phone: data["Phone Number"] ?? reactiveModel.userDetails.phone,
        };
      });
    },
    (err) => console.error("Firestore onSnapshot error:", err)
  );

  reaction(
    () => [
      reactiveModel.watchlist,
      reactiveModel.userDetails.name,
      reactiveModel.userDetails.email,
      reactiveModel.userDetails.phone,
    ],
    async ([watchlist, name, email, phone], _prev) => {
      if (!reactiveModel.ready) {
        return (reactiveModel.ready = false);
      }
      try {
        await setDoc(
          userDocRef(uid),
          {
            Watchlist: watchlist,
            "Full Name": name,
            Email: email,
            "Phone Number": phone,
          },
          { merge: true }
        );
      } catch (err) {
        console.error("Error writing user document:", err);
      }
      runInAction(() => {
        reactiveModel.ready = true;
      });
    }
  );
  return initialFetch;
}

export async function fetchFullNameMap() {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION));
    const idToFullName = {};
    querySnapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      idToFullName[docSnap.id] = data["Full Name"] || null;
    });
    console.log("ID to Full Name Map:", idToFullName);
    return idToFullName;
  } catch (error) {
    console.error("Error fetching full name map:", error);
    return {};
  }
}

export async function getFullNameById(documentId) {
  try {
    const nameMap = await fetchFullNameMap();
    return nameMap[documentId] || null;
  } catch (error) {
    console.error("Error getting full name by ID:", error);
    return null;
  }
}

export async function getWatchlistById(documentId) {
  try {
    const docRef = doc(db, COLLECTION, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && Array.isArray(data.Watchlist)) {
        console.log(data.Watchlist);
        return data.Watchlist;
      } else {
        console.log("Watchlist array not found in document:", documentId);
        return [];
      }
    } else {
      console.log("No such document:", documentId);
      return [];
    }
  } catch (error) {
    console.error("Error getting watchlist by ID:", error);
    return [];
  }
}

export async function submitWatchlistFeedback(targetUserId, commenterId, feedback) {
  if (!feedback.comment && feedback.rating == null) {
    throw new Error("Must provide either comment or rating.");
  }

  const docId = `${targetUserId}_${commenterId}`;
  const feedbackRef = doc(db, "watchlist_feedback", docId);

  const payload = {
    targetUserId,
    commenterId,
    commenterName: feedback.commenterName || "",
    timestamp: serverTimestamp(),
  };

  if (feedback.rating != null) payload.rating = feedback.rating;
  if (feedback.comment) payload.comment = feedback.comment;

  await setDoc(feedbackRef, payload, { merge: true });
}

export async function getFeedbackForWatchlist(targetUserId) {
  const q = query(
    collection(db, "watchlist_feedback"),
    where("targetUserId", "==", targetUserId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

export async function getAverageRatingForWatchlist(targetUserId) {
  const feedback = await getFeedbackForWatchlist(targetUserId);
  if (!feedback.length) return null;

  const sum = feedback.reduce((acc, cur) => acc + cur.rating, 0);
  return sum / feedback.length;
}
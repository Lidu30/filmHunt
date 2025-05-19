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
import { router } from "expo-router"; // Assuming expo-router is used for navigation
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "./firebaseConfig.js";
import { reactiveModel } from "./bootstrapping"; // Make sure reactiveModel has clearModel method

// --- Global variables for listener cleanup ---
let unsubscribeFromFirestoreSnapshot = null;
let disposeProfileReaction = null;
// ---

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// For console testing (optional)
global.doc = doc;
global.setDoc = setDoc;
global.db = db;

const COLLECTION = "filmHunt";

function userDocRef(uid) {
  if (!uid) {
    console.error("[userDocRef] UID is undefined or null.");
    // Potentially throw an error or return a dummy ref to prevent further issues
    // For now, logging an error. This should be caught earlier.
    return doc(db, COLLECTION, "INVALID_UID"); // Avoid crashing, but this is an error state
  }
  return doc(db, COLLECTION, uid);
}

export async function signUp(email, password, name, phone) {
  console.log("[signUp] Attempting to sign up user:", email);
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("[signUp] User signed up successfully. UID:", user.uid);

    await setDoc(
      userDocRef(user.uid),
      {
        UserID: user.uid,
        "Full Name": name,
        Email: email,
        "Phone Number": phone,
        Watchlist: [],
        createdAt: serverTimestamp(), // Good practice to add a creation timestamp
      },
      { merge: true } // Merge true is good if you might add more fields later without overwriting
    );
    console.log("[signUp] User document created in Firestore for UID:", user.uid);

    // The onAuthStateChanged listener will handle setting the reactiveModel
    // for the newly signed-up user, including calling connectToPersistence.
    // So, no need to directly manipulate reactiveModel here.

    return userCredential;
  } catch (error) {
    console.error("[signUp] Error:", error.message, error.code);
    throw error;
  }
}

export async function signIn(email, password) {
  console.log("[signIn] Attempting to sign in user:", email);
  try {
    // This call, on success, will trigger the onAuthStateChanged listener.
    // All model updates and persistence connections will be handled there.
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("[signIn] Firebase signInWithEmailAndPassword successful for:", email, "UID:", userCredential.user.uid);
    return userCredential;
  } catch (error) {
    console.error("[signIn] Error:", error.message, error.code);
    throw error;
  }
}

export async function logOut() {
  const currentUserID = reactiveModel.userDetails.id;
  console.log("[logOut] Attempting to log out current user. Current reactiveModel UID:", currentUserID);
  try {
    await signOut(auth);
    // onAuthStateChanged will handle model clearing and listener cleanup.
    console.log("[logOut] Firebase signOut successful. User should be logged out.");
  } catch (error) {
    console.error("[logOut] Error during sign out:", error.message);
    throw error; // Rethrow or handle as needed
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in or state persisted
    console.log("[onAuthStateChanged] User IS signed in. UID:", user.uid, "Email:", user.email);

    runInAction(() => {
      console.log("[onAuthStateChanged] Clearing model for new/active user session.");
      reactiveModel.clearModel(); // Clear any previous user's data
      reactiveModel.userDetails = {
        id: user.uid,
        name: "", // Will be populated by connectToPersistence
        email: user.email, // Email from auth is authoritative
        phone: "", // Will be populated by connectToPersistence
      };
      reactiveModel.watchlist = []; // Initialize as empty, connectToPersistence will fill
      reactiveModel.ready = false; // Set to false until data is loaded
    });

    connectToPersistence(); // Setup listeners and fetch data for the new user

    // Navigate only after ensuring the model is ready or based on your app's flow.
    // Consider moving navigation into connectToPersistence's .then() or after reactiveModel.ready is true
    // For now, keeping it here as per original structure.
    if (router && typeof router.push === 'function') {
        console.log("[onAuthStateChanged] Navigating to /tabs/home for user:", user.uid);
        router.push("/(tabs)/home");
    } else {
        console.warn("[onAuthStateChanged] Router not available or push is not a function.");
    }

  } else {
    // User is signed out
    console.log("[onAuthStateChanged] User IS NOT signed in (logged out). Cleaning up.");

    // Clean up Firestore listener
    if (unsubscribeFromFirestoreSnapshot) {
      console.log("[onAuthStateChanged] Unsubscribing from Firestore snapshot listener due to logout.");
      unsubscribeFromFirestoreSnapshot();
      unsubscribeFromFirestoreSnapshot = null;
    }
    // Clean up MobX reaction
    if (disposeProfileReaction) {
      console.log("[onAuthStateChanged] Disposing MobX reaction due to logout.");
      disposeProfileReaction();
      disposeProfileReaction = null;
    }

    runInAction(() => {
      console.log("[onAuthStateChanged] Clearing model due to logout.");
      reactiveModel.clearModel(); // This should reset userDetails, watchlist, ready state etc.
    });
    
    if (router && typeof router.push === 'function') {
        console.log("[onAuthStateChanged] Navigating to /login due to logout.");
        router.push("/login");
    } else {
        console.warn("[onAuthStateChanged] Router not available or push is not a function during logout.");
    }
  }
});

export function connectToPersistence() {
  // 1. Clean up any existing listeners from a previous session
  if (unsubscribeFromFirestoreSnapshot) {
    console.log("[connectToPersistence] Cleaning up PREVIOUS Firestore snapshot listener.");
    unsubscribeFromFirestoreSnapshot();
    unsubscribeFromFirestoreSnapshot = null;
  }
  if (disposeProfileReaction) {
    console.log("[connectToPersistence] Cleaning up PREVIOUS MobX reaction.");
    disposeProfileReaction();
    disposeProfileReaction = null;
  }

  const uid = reactiveModel.userDetails.id;
  console.log("[connectToPersistence] Attempting to connect for UID:", uid);

  if (!uid) {
    console.warn("[connectToPersistence] No user ID in model (reactiveModel.userDetails.id is null/undefined). Skipping persistence setup.");
    runInAction(() => {
        reactiveModel.ready = true; // Or false, indicate that setup couldn't complete
    });
    return; // Cannot proceed without a UID
  }

  runInAction(() => {
    reactiveModel.ready = false; // Set to false while fetching/setting up
  });

  // 2. Fetch initial document data
  const docRef = userDocRef(uid);
  const initialFetch = getDoc(docRef)
    .then((snapshot) => {
      const data = snapshot.data() || {}; // Ensure data is an object even if doc doesn't exist
      console.log("[connectToPersistence] Initial Firestore document fetched for UID:", uid, "Data:", data);
      runInAction(() => {
        reactiveModel.watchlist = data["Watchlist"] || [];
        reactiveModel.userDetails = {
          // Spread existing details first to keep email from auth if not in DB
          ...reactiveModel.userDetails, // Keeps the user.email from onAuthStateChanged
          id: uid, // Reinforce UID from auth
          name: data["Full Name"] || "",
          phone: data["Phone Number"] || "",
          // UserID from DB (data["UserID"]) should match uid, but prioritize uid from auth.
        };
        reactiveModel.ready = true;
        console.log("[connectToPersistence] Model updated from initial fetch. reactiveModel.ready: true for UID:", uid);
      });
    })
    .catch((err) => {
      console.error("[connectToPersistence] Error fetching initial user document for UID:", uid, err);
      runInAction(() => {
        reactiveModel.ready = true; // Set to true even on error to unblock UI, or handle error state
      });
    });

  // 3. Setup real-time listener for document changes
  console.log("[connectToPersistence] Setting up NEW Firestore onSnapshot listener for UID:", uid);
  unsubscribeFromFirestoreSnapshot = onSnapshot(
    docRef,
    (snapshot) => {
      const data = snapshot.data() || {};
      console.log("[onSnapshot] Real-time data received for UID:", uid, "Data:", data);
      runInAction(() => {
        // Merge data carefully, especially if other parts of app can modify model
        reactiveModel.watchlist = data["Watchlist"] !== undefined ? data["Watchlist"] : reactiveModel.watchlist;
        reactiveModel.userDetails = {
          ...reactiveModel.userDetails, // Preserve existing details like email from auth
          id: uid, // Ensure UID from auth is the source of truth
          name: data["Full Name"] !== undefined ? data["Full Name"] : reactiveModel.userDetails.name,
          phone: data["Phone Number"] !== undefined ? data["Phone Number"] : reactiveModel.userDetails.phone,
        };
        // reactiveModel.ready should already be true from initial fetch or set here if it wasn't
        if (!reactiveModel.ready) reactiveModel.ready = true;
         console.log("[onSnapshot] Model updated from real-time event for UID:", uid);
      });
    },
    (error) => { // Error callback for onSnapshot
      console.error("[onSnapshot] Firestore snapshot listener error for UID:", uid, error);
      // Optionally, try to clean up the listener if it's a persistent error
      if (unsubscribeFromFirestoreSnapshot) {
        unsubscribeFromFirestoreSnapshot();
        unsubscribeFromFirestoreSnapshot = null;
      }
      runInAction(() => {
        reactiveModel.ready = true; // Or handle error state appropriately
      });
    }
  );

  // 4. Setup MobX reaction to persist model changes back to Firestore
  console.log("[connectToPersistence] Setting up NEW MobX reaction for UID:", uid);
  disposeProfileReaction = reaction(
    () => ({ // Return an object of what to track
      watchlist: JSON.stringify(reactiveModel.watchlist), // Stringify for reliable change detection of array/object
      name: reactiveModel.userDetails.name,
      // email: reactiveModel.userDetails.email, // Usually email is not changed via profile edits this way
      phone: reactiveModel.userDetails.phone,
    }),
    async (trackedData, _previousTrackedData) => {
      // Ensure model is ready and the UID matches the one this reaction was set up for.
      // This check is important to prevent a reaction from a previous user session
      // (if cleanup somehow failed) from writing to the new user's document.
      if (!reactiveModel.ready || reactiveModel.userDetails.id !== uid) {
        console.warn("[Reaction] Skipped. Model not ready or UID mismatch. Current Model UID:", reactiveModel.userDetails.id, "Reaction UID:", uid);
        return;
      }

      console.log("[Reaction] Changes detected in reactiveModel for UID:", uid, "Attempting to save to Firestore. Data:", trackedData);
      try {
        await setDoc(
          userDocRef(uid), // Use the UID this reaction was set up for
          {
            Watchlist: JSON.parse(trackedData.watchlist), // Parse back from JSON
            "Full Name": trackedData.name,
            // Email is typically managed by Firebase Auth, not directly written here unless intended
            "Phone Number": trackedData.phone,
            updatedAt: serverTimestamp(), // Good practice
          },
          { merge: true } // Merge to avoid overwriting fields not managed by this reaction
        );
        console.log("[Reaction] Successfully saved changes to Firestore for UID:", uid);
      } catch (err) {
        console.error("[Reaction] Error writing user document to Firestore for UID:", uid, err);
      }
    },
    {
      fireImmediately: false, // Don't run immediately on setup
      delay: 500, // Optional: debounce saves to Firestore
      equals: (a, b) => JSON.stringify(a) === JSON.stringify(b) // Custom equality for the tracked object
    }
  );
  return initialFetch; // Return the promise of the initial fetch
}


// --- Other utility functions (largely unchanged but with some logging) ---

export async function fetchFullNameMap() {
  console.log("[fetchFullNameMap] Fetching all user documents for ID-to-Name map.");
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION));
    const idToFullName = {};
    querySnapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      idToFullName[docSnap.id] = data["Full Name"] || null;
    });
    console.log("[fetchFullNameMap] ID to Full Name Map created:", idToFullName);
    return idToFullName;
  } catch (error) {
    console.error("[fetchFullNameMap] Error:", error);
    return {}; // Return empty object on error
  }
}

export async function getFullNameById(documentId) {
  console.log("[getFullNameById] Getting full name for document ID:", documentId);
  try {
    const nameMap = await fetchFullNameMap();
    return nameMap[documentId] || null;
  } catch (error) {
    console.error("[getFullNameById] Error for ID:", documentId, error);
    return null;
  }
}

export async function getWatchlistById(documentId) {
  console.log("[getWatchlistById] Getting watchlist for document ID:", documentId);
  if (!documentId) {
    console.warn("[getWatchlistById] documentId is null or undefined.");
    return [];
  }
  try {
    const docRef = userDocRef(documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && Array.isArray(data.Watchlist)) {
        console.log("[getWatchlistById] Watchlist found for ID:", documentId, data.Watchlist);
        return data.Watchlist;
      } else {
        console.log("[getWatchlistById] Watchlist array not found in document for ID:", documentId);
        return [];
      }
    } else {
      console.log("[getWatchlistById] No such document for ID:", documentId);
      return [];
    }
  } catch (error) {
    console.error("[getWatchlistById] Error for ID:", documentId, error);
    return [];
  }
}

export async function submitWatchlistFeedback(targetUserId, commenterId, feedback) {
  console.log("[submitWatchlistFeedback] Submitting feedback from", commenterId, "for", targetUserId);
  if (!feedback.comment && feedback.rating == null) {
    console.error("[submitWatchlistFeedback] Feedback must provide either comment or rating.");
    throw new Error("Must provide either comment or rating.");
  }

  const docId = `${targetUserId}_${commenterId}`; // Consider a subcollection for feedback
  const feedbackRef = doc(db, "watchlist_feedback", docId);

  const payload = {
    targetUserId,
    commenterId,
    commenterName: feedback.commenterName || "", // Ensure commenterName is provided or handled
    timestamp: serverTimestamp(),
  };

  if (feedback.rating != null) payload.rating = feedback.rating;
  if (feedback.comment) payload.comment = feedback.comment;

  try {
    await setDoc(feedbackRef, payload, { merge: true });
    console.log("[submitWatchlistFeedback] Feedback submitted successfully. Doc ID:", docId);
  } catch (error) {
    console.error("[submitWatchlistFeedback] Error submitting feedback:", error);
    throw error;
  }
}

export async function getFeedbackForWatchlist(targetUserId) {
  console.log("[getFeedbackForWatchlist] Fetching feedback for targetUserID:", targetUserId);
  if (!targetUserId) {
    console.warn("[getFeedbackForWatchlist] targetUserId is null or undefined.");
    return [];
  }
  const q = query(
    collection(db, "watchlist_feedback"),
    where("targetUserId", "==", targetUserId)
  );

  try {
    const snapshot = await getDocs(q);
    const feedbackList = snapshot.docs.map((doc) => doc.data());
    console.log("[getFeedbackForWatchlist] Feedback fetched for", targetUserId, ":", feedbackList);
    return feedbackList;
  } catch (error) {
    console.error("[getFeedbackForWatchlist] Error fetching feedback for", targetUserId, ":", error);
    return [];
  }
}

export async function getAverageRatingForWatchlist(targetUserId) {
  console.log("[getAverageRatingForWatchlist] Calculating average rating for targetUserID:", targetUserId);
  const feedback = await getFeedbackForWatchlist(targetUserId);
  if (!feedback || !feedback.length) {
    console.log("[getAverageRatingForWatchlist] No feedback found or empty for", targetUserId);
    return null;
  }

  const ratings = feedback.filter(f => typeof f.rating === 'number');
  if (!ratings.length) {
    console.log("[getAverageRatingForWatchlist] No valid ratings found in feedback for", targetUserId);
    return null;
  }
  const sum = ratings.reduce((acc, cur) => acc + cur.rating, 0);
  const average = sum / ratings.length;
  console.log("[getAverageRatingForWatchlist] Average rating for", targetUserId, "is", average);
  return average;
}

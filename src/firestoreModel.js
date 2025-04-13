import { initializeApp } from "firebase/app"
// initialize Firestore
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore"
import { firebaseConfig } from "src/firebaseConfig.js"

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// make doc and setDoc available at the Console for testing
global.doc = doc
global.setDoc = setDoc
global.db = db

const COLLECTION = "filmHunt"

export function connectToPersistence(model, watchFunction) {
    function getModelStateACB() {
        return [ model.watchlist, 
            model.userDetails.name,
            model.userDetails.email,
            model.userDetails.phone
            ]
    }

    function persistenceModelACB() {
        const refObject = doc(db, COLLECTION, "modelData")
        if (model.ready) {
            setDoc(
                refObject,
                {
                watchlist: model.watchlist,
                userDetailsName: model.userDetails.name,
                userDetailsEmail: model.userDetails.email,
                userDetailsPhone: model.userDetails.phone
                },
                { merge: true },
            )
        }
    }

    // Why does the section below needs to be only just before or after installing the side effect

    function errorACB(error) {
        console.error(
            "Could not reach cloud Firestore backend. Connection failed 1 times:", error)
    } 

    function readyACB(docSnap) {
        console.log("Firestore document snapshot:", docSnap.exists(), docSnap.data());

        const data = docSnap.data();
        if (data) {
            model.watchlist = data.watchlist || [];
            model.userDetails.name = data.userDetailsName;
            model.userDetails.email = data.userDetailsEmail;
            model.userDetails.phone = data.userDetailsPhone;
        } else {
            model.watchlist = [];
            model.userDetails.name = "DummyName";
            model.userDetails.email = "dummy@email.com";
            model.userDetails.phone = "123456789";
        }
        model.ready = true;
    }

    watchFunction(getModelStateACB, persistenceModelACB);
    model.ready = false
    const refObject = doc(db, COLLECTION, "modelData");
    getDoc(refObject).then(readyACB).catch(errorACB);
}

const firestoreDoc= doc(db, "filmHunt", "modelData")
setDoc(firestoreDoc, {dummyField: "dummyValue"}, {merge:true})
    // .then(() => console.log("Document written successfully!"))
    // .catch(error => console.error("Error writing document:", error));

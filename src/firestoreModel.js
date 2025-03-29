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
        return [/* model.numberOfGuests, model.dishes, model.currentDishId */]
    }

    
    function persistenceModelACB() {
        const refObject = doc(db, COLLECTION, "modelData")
        if (model.ready) {
            setDoc(
                refObject,
                {
                /*
                numberOfGuests: model.numberOfGuests,
                dishes: model.dishes,
                currentDishId: model.currentDishId,
                */
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
        const data = docSnap.data();
        if (data) {
            /*
            model.numberOfGuests = data.numberOfGuests || 2;
            model.dishes = data.dishes || [];
            model.currentDishId = data.currentDishId || null;
            */
        } else {
            /*
            model.numberOfGuests = 2;
            model.dishes = [];
            model.currentDishId = null;
            */
        }
        model.ready = true;   
    }

    watchFunction(getModelStateACB, persistenceModelACB);

    model.ready = false

    const refObject = doc(db, COLLECTION, "modelData");
    getDoc(refObject).then(readyACB).catch(errorACB);    
}

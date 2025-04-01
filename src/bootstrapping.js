import { observable, configure, reaction } from "mobx";
import { connectToPersistence } from "./firestoreModel"
import { model } from "./app/model.js"

configure({ enforceActions: "always" });
// TODO, add a proper model object:
export const reactiveModel = observable(model);
// TODO side effects, connect to persistence etc
global.myModel = reactiveModel; // make application state available in Console

connectToPersistence(reactiveModel, reaction); 

// const firestoreDoc= doc(db, "test collection", "test document")
// setDoc(firestoreDoc, {dummyField: "dummyValue"}, {merge:true})

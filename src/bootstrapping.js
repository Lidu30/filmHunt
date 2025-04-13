import { observable, configure, reaction, makeAutoObservable } from "mobx";
import { connectToPersistence } from "./firestoreModel"
import { model } from "./app/model.js"
import { searchMovies } from "/src/apiConfig"

configure({ enforceActions: "never" });
// TODO, add a proper model object:
export const reactiveModel = makeAutoObservable({
  ...model,  // Keep all the original model functions and properties
  ready: false,  // Add the ready property
  
  // Add only functions that don't exist in the original model
  setReady(value) {
    this.ready = value;
  },
  
  setUser(user) {
    this.user = user;
  }
  });

// TODO side effects, connect to persistence etc
global.myModel = reactiveModel; // make application state available in Console

function setDummyMovie(results) {
    const firstMovie = results[0]; // grab the first result
    if (firstMovie) {
        myModel.currentMovie = firstMovie; // assign to model
    }
}

searchMovies({ query: "greatest showman" })
    .then(setDummyMovie)
    .then(console.log)

connectToPersistence(reactiveModel, reaction); 
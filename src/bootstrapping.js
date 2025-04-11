import { observable, configure, reaction } from "mobx";
import { connectToPersistence } from "./firestoreModel"
import { model } from "./app/model.js"
import { searchMovies } from "/src/apiConfig"

configure({ enforceActions: "always" });
// TODO, add a proper model object:
export const reactiveModel = observable(model);
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
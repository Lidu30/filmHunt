import { observable, configure, reaction } from "mobx";
import { connectToPersistence, fetchFullNamesArray } from "./firestoreModel"
import { model } from "./model.js"
import { searchMovies, loadAllGenres } from './apiConfig'

configure({ enforceActions: "never" });
// TODO, add a proper model object:
export const reactiveModel = observable(model)
reactiveModel.user = null; //?

reactiveModel.ready = true;

// TODO side effects, connect to persistence etc
global.myModel = reactiveModel; // make application state available in Console

// Load genre names at startup
reactiveModel.loadAllGenres();

// Load reviewed movies at startup
reactiveModel.loadReviewedMovies();

function setDummyMovie(results) {
    const firstMovie = results.results[0]; // grab the first result from results array
    if (firstMovie) {
        myModel.setCurrentMovie(firstMovie); // assign to model
    }
}

reaction(
    () => reactiveModel.currentMovie,
    (currentMovie) => {
        if (currentMovie) {
            console.log("Current movie changed:", currentMovie);
        }
    }
);

searchMovies({ query: "greatest showman" })
    .then(setDummyMovie)
    .then(console.log)

connectToPersistence(reactiveModel, reaction); 
/* fetchFullNamesArray(); *//* console.log("userDetails", reactiveModel.userDetails); */
import { reactiveModel } from "./reactiveModel";
import { connectToPersistence, fetchFullNamesArray } from "./firestoreModel";
import { searchMovies } from "./apiConfig";

global.myModel = reactiveModel;

reactiveModel.loadAllGenres();

function setDummyMovie(results) {
  const firstMovie = results[0];
  if (firstMovie) {
    myModel.currentMovie = firstMovie;
  }
}

searchMovies({ query: "greatest showman" })
  .then(setDummyMovie)
  .then(console.log);


connectToPersistence(reactiveModel, reaction);

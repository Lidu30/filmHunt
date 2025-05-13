import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { getMovieDetails } from "../apiConfig";
import { DetailsView } from "src/views/detailsView";
import { SuspenseView } from "src/views/suspenseView";
import { reactiveModel } from "../bootstrapping";

export const Details = observer(function Details(props) {
    const movieId = props.model.currentMovie?.id; 
    console.log("movieID: " + movieId)

    if (!movieId) {
        return <div>No movie selected</div>;    }

    return <DetailsView 
                movie={props.model.currentMovie} 
                movieGenres={props.model.currentMovieGenres.join(" | ")}
            />;

    const currentMovie = props.model.currentMovie

    const currentDishPromiseState = props.model.currentDishPromiseState;
    // const isDishInMenu = !!props.model.dishes.find(checkDishInMenu)
    // if (currentDishPromiseState.data) {
        return <DetailsView
            movie = {currentMovie}
            /*
            dishData = {currentDishPromiseState.data}
            guests = {props.model.numberOfGuests}
            isDishInMenu = {isDishInMenu} 
            userWantsToAddDish = {addDishACB}
            */
        />;
    // }
    
    return <SuspenseView
        promise ={currentDishPromiseState.promise}
        error = {currentDishPromiseState.error} 
    />;
})

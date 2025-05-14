import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { getMovieDetails } from "../apiConfig";
import { DetailsView } from "src/views/detailsView";
import { EmptyDetailsView } from "src/views/emptyDetailsView";
import { SuspenseView } from "src/views/suspenseView";
import { reactiveModel } from "../bootstrapping";
import {
    Text,
    View,
  } from "react-native"

export const Details = observer(function Details(props) {
    const movieId = props.model.currentMovie?.id; 
    //console.log("movieID: " + movieId)
    // console.log("movie:", props.model.currentMovie)

    if (!movieId) {
        return <EmptyDetailsView/>
        /*
        return <View>
                <Text>No movie selected</Text>   
            </View>
        */
    }

    function addToWatchListACB(){
        console.log('Adding movie to watchlist:', props.model.currentMovie);
        props.model.addToWatchlist(props.model.currentMovie)
        console.log('Watchlist:', props.model.watchlist);
    }

    return <DetailsView 
                movie={props.model.currentMovie} 
                movieGenres={props.model.currentMovieGenres.join(" | ")}
                movieCast={props.model.currentMovieCast}
                streamingPlatforms={props.model.currentMoviePlatforms.join("\n")}
                addingToWatchList={addToWatchListACB}
                inWatchList={props.model.watchlistHas(movieId)}
            />;

    // const currentMovie = props.model.currentMovie

    //const currentDishPromiseState = props.model.currentDishPromiseState;
    // const isDishInMenu = !!props.model.dishes.find(checkDishInMenu)
    // if (currentDishPromiseState.data) {
        // return <DetailsView
            // movie = {currentMovie}
            /*
            dishData = {currentDishPromiseState.data}
            guests = {props.model.numberOfGuests}
            isDishInMenu = {isDishInMenu} 
            userWantsToAddDish = {addDishACB}
            */
        // />;
    // }
    
    // return <SuspenseView
        // promise ={currentDishPromiseState.promise}
        // error = {currentDishPromiseState.error} 
    // />;
})

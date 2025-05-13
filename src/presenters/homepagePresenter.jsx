import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { HomepageView } from "../views/homepageView";
import { getTopRatedMovies } from "../apiConfig";
import model from "../model";
import { reactiveModel } from "../bootstrapping";

export const Homepage = observer(function Homepage(props) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchMovies(page = 1) {
    setIsLoading(true);
    try {
      const movieData = await getTopRatedMovies(page);
      console.log(movieData);
      
      if (movieData && movieData.results) {
        if (page === 1) {
          setMovies(movieData.results);
        } else {
          setMovies(prevMovies => [...prevMovies, ...movieData.results]);
        }
        setTotalPages(movieData.total_pages || 1);
        setCurrentPage(page);
      } else {
        console.error("nonsense API response format:", movieData);
      }
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchMoreMovies(nextPage) {
    if (nextPage <= totalPages) {
      return fetchMovies(nextPage);
    }
  }

  function addToWatchlist(movie){
    reactiveModel.addToWatchlist(movie);
    console.log("adding to watchlist:", [...reactiveModel.watchlist]);
  }

  function handleMovieSelect(movie){
    reactiveModel.setCurrentMovie(movie)
    console.log("set current movie to", movie.original_title)
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  return <HomepageView 
    moviesarray={movies}
    isLoading={isLoading}
    searchMovies={searchMovies} // doesnt work
    addToWatchlist={addToWatchlist}
    fetchMoreMovies={fetchMoreMovies}
    onMovieSelect={handleMovieSelect}
  />;
});
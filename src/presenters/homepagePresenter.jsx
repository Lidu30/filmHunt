import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { HomepageView } from "../views/homepageView";
import { getTopRatedMovies } from "../apiConfig";

export const Homepage = observer(function Homepage(props) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchMovies() {
    try {
      const movieData = await getTopRatedMovies();
      setMovies(movieData);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  return <HomepageView moviesarray={movies} isLoading={isLoading} />;
});
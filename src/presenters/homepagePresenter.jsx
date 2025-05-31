import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { HomepageView } from "../views/homepageView";
import { getTopRatedMovies, getMovieDetails, searchMovies } from "../apiConfig";
import { reactiveModel } from "../bootstrapping";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

export const Homepage = observer(function Homepage(props) {
  const router = useRouter();

  // main
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // serch
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const [searchLoadingMore, setSearchLoadingMore] = useState(false);

  async function fetchMovies(page = 1) {
    if (page === 1) {
      setIsLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const movieData = await getTopRatedMovies(page);
      
      if (movieData && movieData.results) {
        if (page === 1) {
          setMovies(movieData.results);
        } else {
          setMovies(prevMovies => [...prevMovies, ...movieData.results]);
        }
        setTotalPages(movieData.total_pages || 1);
        setCurrentPage(page);
      } else {
        console.error("Invalid API response format:", movieData);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  }

  async function fetchMoreMovies() {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages && !loadingMore) {
      await fetchMovies(nextPage);
    }
  }

  function handleSearchChange(text) {
    setSearchQuery(text);
    if (text.length === 0) {
      setIsSearching(false);
      setSearchResults([]);
      setSearchCurrentPage(1);
    }
  }

  async function handleSearch(page = 1) {
    if (searchQuery.trim() === "") return;

    if (page === 1) {
      setIsSearching(true);
      setIsLoadingSearch(true);
      setSearchResults([]);
    } else {
      setSearchLoadingMore(true);
    }

    try {
      const response = await searchMovies({
        query: searchQuery,
        include_adult: false,
        language: "en-US",
        page: page,
      });

      if (response && Array.isArray(response)) {
        if (page === 1) {
          setSearchResults(response);
        } else {
          setSearchResults((prev) => [...prev, ...response]);
        }
        setSearchTotalPages(Math.min(10, Math.ceil(response.length / 20) + page));
      } else if (response && response.results) {
        if (page === 1) {
          setSearchResults(response.results);
        } else {
          setSearchResults((prev) => [...prev, ...response.results]);
        }
        setSearchTotalPages(response.total_pages || 1);
      }
      setSearchCurrentPage(page);
    } catch (error) {
      console.error("Search error:", error);
      if (page === 1) setSearchResults([]);
    } finally {
      setIsLoadingSearch(false);
      setSearchLoadingMore(false);
    }
  }

  async function handleSearchMore() {
    const nextPage = searchCurrentPage + 1;
    if (nextPage <= searchTotalPages && !searchLoadingMore && !isLoadingSearch) {
      await handleSearch(nextPage);
    }
  }

  function clearSearch() {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    setSearchCurrentPage(1);
  }

  function addToWatchlist(movie) {
    reactiveModel.addToWatchlist(movie);
  }

  async function handleMovieSelect(movie) {
    console.log("Movie received:", movie);
    reactiveModel.setCurrentMovie(await getMovieDetails(movie.id));
    console.log("Set current movie to", movie.original_title);
  }

  function isMovieInWatchlist(movieId) {
    return reactiveModel.watchlist.some((m) => m.id === movieId);
  }

  function handleGoToDetails(movie) {
    handleMovieSelect(movie);
    router.push("./details");
  }

  function handleAddToWatchlistWithAlert(movie) {
    if (!isMovieInWatchlist(movie.id)) {
      addToWatchlist(movie);
    } else {
      Alert.alert(
        "Already in Watchlist",
        `"${movie.title}" is already in your watchlist.`,
        [{ text: "OK" }],
        { cancelable: true }
      );
    }
  }

  function handleLoadMore() {
    if (isSearching) {
      handleSearchMore();
    } else {
      fetchMoreMovies();
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  // calc values
  const moviesToDisplay = isSearching ? searchResults : movies;
  const displayCurrentPage = isSearching ? searchCurrentPage : currentPage;
  const displayTotalPages = isSearching ? searchTotalPages : totalPages;
  const isCurrentlyLoading = isSearching ? isLoadingSearch : isLoading;
  const isCurrentlyLoadingMore = isSearching ? searchLoadingMore : loadingMore;
  const hasMorePages = isSearching 
    ? searchCurrentPage < searchTotalPages 
    : currentPage < totalPages;

  const ids = moviesToDisplay.map(movie => movie.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length > 0) {
    console.warn("🚨 Duplicate movie IDs detected:", duplicates);
  }

  return (
    <HomepageView 
      // main page
      movies={movies}
      isLoading={isLoading}
      loadingMore={loadingMore}
      currentPage={currentPage}
      totalPages={totalPages}
      onFetchMoreMovies={fetchMoreMovies}
      
      // searchh
      searchQuery={searchQuery}
      searchResults={searchResults}
      isSearching={isSearching}
      isLoadingSearch={isLoadingSearch}
      searchCurrentPage={searchCurrentPage}
      searchTotalPages={searchTotalPages}
      searchLoadingMore={searchLoadingMore}
      onSearchChange={handleSearchChange}
      onSearch={handleSearch}
      onSearchMore={handleSearchMore}
      onClearSearch={clearSearch}
      
      // calc for pages
      moviesToDisplay={moviesToDisplay}
      displayCurrentPage={displayCurrentPage}
      displayTotalPages={displayTotalPages}
      isCurrentlyLoading={isCurrentlyLoading}
      isCurrentlyLoadingMore={isCurrentlyLoadingMore}
      hasMorePages={hasMorePages}
      
      // funcs
      onGoToDetails={handleGoToDetails}
      onAddToWatchlistWithAlert={handleAddToWatchlistWithAlert}
      onLoadMore={handleLoadMore}
      
      // checker
      isMovieInWatchlist={isMovieInWatchlist}
    />
  );
});
import "./App.css";

import React, { useEffect, useState } from "react";
import HorizontalMovies from "./HorizontalMovies";

function Discover() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);

  const API_KEY = "3d0ac201ad49d76eb1e30e54903dcc54";

  const fetchTrendingMovies = () => {
    return fetch(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => setTrendingMovies(data.results));
  };

  const fetchPopularMovies = () => {
    return fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US`
    )
      .then((response) => response.json())
      .then((data) => setPopularMovies(data.results));
  };

  useEffect(() => {
    fetchTrendingMovies();
    fetchPopularMovies();
    document.title = "Discover Movies | Movie Rater";
  }, []);

  return (
    <>
      <div>
        <div class="container container-md">
          <h2 class="mt-4 mb-3 nav-bold">Popular Movies</h2>
          <HorizontalMovies moviesList={popularMovies}></HorizontalMovies>
          <h2 class="mt-4 mb-3 nav-bold">Trending Movies Today</h2>
          <HorizontalMovies moviesList={trendingMovies}></HorizontalMovies>
          <div class="mb-5 "></div>
        </div>
      </div>
    </>
  );
}

export default Discover;

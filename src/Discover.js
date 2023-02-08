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
  }, []);

  return (
    <>
      <div>
        <div class="container container-md">
          <h1 class="mt-4">Popular Movies</h1>
          <HorizontalMovies moviesList={popularMovies}></HorizontalMovies>
          <h1 class="mt-4">Trending Movies Today</h1>
          <HorizontalMovies moviesList={trendingMovies}></HorizontalMovies>
          <div class="row"></div>
        </div>
      </div>
    </>
  );
}

export default Discover;

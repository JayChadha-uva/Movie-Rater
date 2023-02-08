import "./App.css";

import React, { useEffect, useState } from "react";
import HorizontalMovies from "./HorizontalMovies";

function Discover() {
  const [trendingMovies, setTrendingMovies] = useState([]);

  const API_KEY = "3d0ac201ad49d76eb1e30e54903dcc54";

  const fetchTrendingMovies = () => {
    return fetch(
      "https://api.themoviedb.org/3/trending/movie/week?api_key=" + API_KEY
    )
      .then((response) => response.json())
      .then((data) => setTrendingMovies(data.results));
  };

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  return (
    <>
      <div>
        <div class="container container-md">
          <h1 class="mt-4">Trending Movies</h1>
          <HorizontalMovies moviesList={trendingMovies}></HorizontalMovies>

          <div class="row"></div>
        </div>
      </div>
    </>
  );
}

export default Discover;

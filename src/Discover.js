/* eslint-disable react/style-prop-object */
import { Link } from "react-router-dom";
import "./App.css";

import React, { useEffect, useState } from "react";
import HorizontalMovies from "./HorizontalMovies";

function Discover() {
  const [movies, setMovies] = useState([]);

  const img_URL = "https://image.tmdb.org/t/p/original";
  const API_KEY = "3d0ac201ad49d76eb1e30e54903dcc54";

  const fetchData = () => {
    return fetch(
      "https://api.themoviedb.org/3/trending/movie/week?api_key=" + API_KEY
    )
      .then((response) => response.json())
      .then((data) => setMovies(data.results));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div>
        <div class="container container-md">
          <h1 class="mt-4">Trending Movies</h1>
          <HorizontalMovies moviesList={movies}></HorizontalMovies>

          <div class="row"></div>
        </div>
      </div>
    </>
  );
}

export default Discover;

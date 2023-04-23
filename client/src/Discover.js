import "./App.css";

import React, { useEffect, useState } from "react";
import HorizontalMovies from "./HorizontalMovies";
import Cookies from "js-cookie";

function Discover() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);

  const API_KEY = process.env.REACT_APP_TMDB_API;
  const myCookieValue = Cookies.get("emailCookie");
  console.log(myCookieValue);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        setTrendingMovies(data.results);
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`);
      });

    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US`
    )
      .then((response) => response.json())
      .then((data) => {
        setPopularMovies(data.results);
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`);
      });
  }, [API_KEY]);

  return (
    <>
      <div class="container container-md height-requirement">
        <p>Cookie value: {myCookieValue}</p>
        <h2 class="mt-4 mb-3 nav-bold">Popular Movies</h2>
        <HorizontalMovies moviesList={popularMovies}></HorizontalMovies>
        <h2 class="mt-4 mb-3 nav-bold">Trending Movies Today</h2>
        <HorizontalMovies moviesList={trendingMovies}></HorizontalMovies>
        <div class="mb-5 "></div>
      </div>
    </>
  );
}

export default Discover;

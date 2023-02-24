import "./App.css";

import React, { useEffect, useState } from "react";
import HorizontalMovies from "./HorizontalMovies";

function Discover() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);

  const API_KEY = process.env.REACT_APP_TMDB_API;

  // const fetchTrendingMovies = () => {
  //   return fetch(
  //     `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => setTrendingMovies(data.results));
  // };

  // const fetchPopularMovies = () => {
  //   return fetch(
  //     `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => setPopularMovies(data.results));
  // };

  // async function fetchTrendingMovies() {
  //   const response = await fetch(
  //     `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
  //   );
  //   const movies = await response.json();
  //   return movies;
  // }
  // fetchTrendingMovies().then((movies) => {
  //   setTrendingMovies(movies.results); // fetched movies
  // });

  async function fetchTrendingAndPopular() {
    const [trendingResponse, popularResponse] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US`
      ),
    ]);
    const trendingMovies = await trendingResponse.json();
    const popularMovies = await popularResponse.json();
    return [trendingMovies, popularMovies];
  }
  fetchTrendingAndPopular()
    .then(([trendingMovies, popularMovies]) => {
      setTrendingMovies(trendingMovies.results);
      setPopularMovies(popularMovies.results);
    })
    .catch((error) => {});

  useEffect(() => {
    fetchTrendingAndPopular();
    document.title = "Discover Movies | Movie Rater";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div class="container container-md height-requirement">
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

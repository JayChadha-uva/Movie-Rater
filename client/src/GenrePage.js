import "./App.css";
import axios from "axios";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HorizontalMovies from "./HorizontalMovies";

function GenrePage() {
  const { genreID, genreName } = useParams();
  const [popularGenreMovies, setPopularGenreMovies] = useState([]);
  const [highlyRated, setHighlyRated] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const currentEmail = sessionStorage.getItem("email");

  useEffect(() => {
    if (
      sessionStorage.getItem("email") &&
      sessionStorage.getItem("email") !== ""
    ) {
      setLoggedIn(true);
    }
  }, [sessionStorage.getItem("email")]);

  const API_KEY = process.env.REACT_APP_TMDB_API;

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreID}`
    )
      .then((response) => response.json())
      .then((data) => {
        setPopularGenreMovies(data.results);
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`);
      });

    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=1&vote_count.gte=200&with_genres=${genreID}`
    )
      .then((response) => response.json())
      .then((data) => {
        setHighlyRated(data.results);
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`);
      });
  }, [API_KEY, genreID]);

  // useEffect(() => {
  //   document.title = `${movie.title} | Movie Rater`;

  //   const movieSubmit = {
  //     movieID: id,
  //     title: movie.title,
  //     imgURL: movie.poster_path,
  //   };

  //   axios
  //     .post("http://localhost:1234/insert/movie", movieSubmit)
  //     .then(() => {})
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, [movie.title]);

  return (
    <>
      <div class="container container-md mb-5 height-requirement">
        <h2 class="mt-4 mb-3 nav-bold">Popular {genreName} Movies</h2>
        <div class="mt-2">
          {popularGenreMovies && popularGenreMovies.length > 0 ? (
            <div>
              <HorizontalMovies
                moviesList={popularGenreMovies}
              ></HorizontalMovies>
            </div>
          ) : (
            <></>
          )}
        </div>
        <h2 class="mt-5 mb-3 nav-bold">Highly Rated {genreName} Movies</h2>
        <div class="mt-2">
          {highlyRated && highlyRated.length > 0 ? (
            <div>
              <HorizontalMovies moviesList={highlyRated}></HorizontalMovies>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

export default GenrePage;

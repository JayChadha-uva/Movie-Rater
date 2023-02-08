/* eslint-disable react/style-prop-object */
import "./App.css";

import "react-select-search/style.css";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HorizontalMovies from "./HorizontalMovies";

function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);

  const API_KEY = "3d0ac201ad49d76eb1e30e54903dcc54";
  const img_URL = "https://image.tmdb.org/t/p/original";

  const fetchMovie = () => {
    return fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => setMovie(data));
  };

  const fetchSimilar = () => {
    return fetch(
      `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => setSimilarMovies(data.results));
  };

  useEffect(() => {
    fetchSimilar();
    fetchMovie();
  }, [id]);

  return (
    <>
      <div>
        <div class="container container-md">
          <div class="card my-4" key={movie.title}>
            <div class="row ">
              <div class="col-4">
                <img
                  src={img_URL + movie.poster_path}
                  class="card-img-top"
                  alt="..."
                />
              </div>
              <div class="card-body col-8">
                <h2 class="card-title">{movie.title}</h2>
                <div class="mt-3 mb-2 hstack gap-3 ">
                  <p class="card-text my-auto">
                    {String(movie.release_date).split("-")[0]}
                  </p>
                  <div class="vr"></div>
                  <p class="card-text my-auto">{movie.runtime} mins</p>
                  <div class="vr"></div>
                  {movie.genres &&
                    movie.genres.length > 0 &&
                    movie.genres.map((genre, index) => (
                      <p class="my-auto" key={genre.id}>
                        {genre.name}
                      </p>
                    ))}
                </div>
                <p class="card-text">{movie.overview}</p>
              </div>
            </div>
          </div>
          <div>
            <h4 class="mt-3">Similar Movies</h4>
            <HorizontalMovies moviesList={similarMovies}></HorizontalMovies>
          </div>
        </div>
      </div>
    </>
  );
}

export default Movie;

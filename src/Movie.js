/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/style-prop-object */
import "./App.css";

import "react-select-search/style.css";
import defaultImg from "./Assets/defaultImage.png";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HorizontalMovies from "./HorizontalMovies";

function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [watchProviders, setWatchProviders] = useState([]);

  const API_KEY = "3d0ac201ad49d76eb1e30e54903dcc54";
  const img_URL = "https://image.tmdb.org/t/p/w500";

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

  const fetchWatchProviders = () => {
    return fetch(
      `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => setWatchProviders(data.results.US));
  };

  useEffect(() => {
    fetchSimilar();
    fetchMovie();
    fetchWatchProviders();
    document.title = `${movie.title} | Movie Rater`;
  }, [id, movie]);

  return (
    <>
      <div>
        <div class="container container-md mb-5">
          <div class="card my-4 rounded-4 movie-card-custom " key={movie.title}>
            <div class="row ">
              <div class="col-4">
                <img
                  src={
                    Object.is(movie.poster_path, null)
                      ? defaultImg
                      : img_URL + movie.poster_path
                  }
                  class="card-img-top rounded-4 "
                  alt="..."
                />
              </div>
              <div class="card-body col-8">
                <h2 class="card-title nav-bold">{movie.title}</h2>
                <div class="mt-3 mb-1 hstack gap-3 nav-bold">
                  <div>
                    <i class="bi bi-star-fill star-color"></i>{" "}
                    {Math.round(movie.vote_average * 10) / 10}
                  </div>
                  <div class="vr"></div>
                  <p class="card-text mt-0 mb-0">{movie.runtime} mins</p>
                  <div class="vr"></div>
                  <p class="card-text mt-0 mb-0">
                    {String(movie.release_date).split("-")[0]}
                  </p>
                </div>
                <p class="card-text mt-3">{movie.overview}</p>
                <div class="my-3 hstack gap-3 flex-wrap">
                  {movie.genres &&
                    movie.genres.length > 0 &&
                    movie.genres.map((genre, index) => (
                      <>
                        <p class="card-text mt-0 mb-0" key={genre.id}>
                          {genre.name}
                        </p>
                        {index + 1 !== movie.genres.length ? (
                          <div class="vr"></div>
                        ) : (
                          <></>
                        )}
                      </>
                    ))}
                </div>
                {watchProviders &&
                watchProviders.rent &&
                watchProviders.rent.length > 0 ? (
                  <h5 class="mt-4 nav-bold">Rent From</h5>
                ) : (
                  watchProviders &&
                  watchProviders.buy &&
                  watchProviders.buy.length > 0 && (
                    <h5 class="mt-4 nav-bold">Buy From</h5>
                  )
                )}
                <div class="row">
                  {watchProviders &&
                  watchProviders.rent &&
                  watchProviders.rent.length > 0
                    ? watchProviders.rent.map((provid, index) => (
                        <p
                          class="col-md-6 col-lg-4 col-xl-3 my-0"
                          key={provid.provider_id}
                        >
                          {provid.provider_name}
                        </p>
                      ))
                    : watchProviders &&
                      watchProviders.buy &&
                      watchProviders.buy.length > 0 &&
                      watchProviders.buy.map((provid, index) => (
                        <p
                          class="col-md-6 col-lg-4 col-xl-3 my-0"
                          key={provid.provider_id}
                        >
                          {provid.provider_name}
                        </p>
                      ))}
                </div>
              </div>
            </div>
          </div>
          {similarMovies && similarMovies.length > 0 ? (
            <div>
              <h4 class="mt-4 mb-3 nav-bold">Similar Movies</h4>
              <HorizontalMovies moviesList={similarMovies}></HorizontalMovies>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

export default Movie;

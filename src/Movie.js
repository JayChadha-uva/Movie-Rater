import "./App.css";

import defaultImg from "./Assets/defaultImage.png";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HorizontalMovies from "./HorizontalMovies";

function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [watchProviders, setWatchProviders] = useState([]);

  const img_URL = "https://image.tmdb.org/t/p/w500";
  const API_KEY = process.env.REACT_APP_TMDB_API;

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        setMovie(data);
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`);
      });

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        setRecommendedMovies(data.results);
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`);
      });

    fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        setSimilarMovies(data.results);
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`);
      });

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        setWatchProviders(data.results.US);
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`);
      });
  }, [API_KEY, id]);

  useEffect(() => {
    document.title = `${movie.title} | Movie Rater`;
  }, [movie]);

  return (
    <>
      <div class="container container-md mb-5 height-requirement">
        <div class="card my-4 rounded-4 movie-card-custom " key={movie.title}>
          <div class="row ">
            <div class="col-4">
              <img
                src={
                  Object.is(movie.poster_path, null)
                    ? defaultImg
                    : img_URL + movie.poster_path
                }
                class="card-img rounded-0 rounded-start-4 "
                alt="..."
              />
            </div>
            <div class="card-body col-8 ps-0 ps-md-2 ps-lg-3">
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
              watchProviders.flatrate &&
              watchProviders.flatrate.length > 0 ? (
                <button
                  type="button"
                  class="btn btn-outline-secondary mt-2 me-3"
                  data-bs-toggle="modal"
                  data-bs-target="#streamingModal"
                >
                  Stream <i class="bi bi-arrow-up-right-square"></i>
                </button>
              ) : (
                <></>
              )}

              {watchProviders &&
              watchProviders.rent &&
              watchProviders.rent.length > 0 ? (
                <button
                  type="button"
                  class="btn btn-outline-secondary mt-2"
                  data-bs-toggle="modal"
                  data-bs-target="#rentModal"
                >
                  Rent <i class="bi bi-arrow-up-right-square"></i>
                </button>
              ) : (
                watchProviders &&
                watchProviders.buy &&
                watchProviders.buy.length > 0 && (
                  <button
                    type="button"
                    class="btn btn-outline-secondary mt-2"
                    data-bs-toggle="modal"
                    data-bs-target="#buyModal"
                  >
                    Buy <i class="bi bi-arrow-up-right-square"></i>
                  </button>
                )
              )}
              <div class="modal fade" id="streamingModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">
                        Stream {movie.title} from
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <div class="vstack gap-3">
                        {watchProviders &&
                          watchProviders.flatrate &&
                          watchProviders.flatrate.length > 0 &&
                          watchProviders.flatrate.map((provid, index) => (
                            <div class="d-flex justify-content-start align-items-center">
                              <img
                                class="icon-img rounded-3"
                                src={img_URL + provid.logo_path}
                                alt=""
                              />{" "}
                              <h5 class="ms-2" key={provid.provider_id}>
                                {provid.provider_name}
                              </h5>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-between">
                      <div>Provided by JustWatch</div>
                      <div>
                        <button
                          type="button"
                          class="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal fade" id="rentModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">
                        Rent {movie.title} from
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <div class="vstack gap-3">
                        {watchProviders &&
                          watchProviders.rent &&
                          watchProviders.rent.length > 0 &&
                          watchProviders.rent.map((provid, index) => (
                            <div class="d-flex justify-content-start align-items-center">
                              <img
                                class="icon-img rounded-3"
                                src={img_URL + provid.logo_path}
                                alt=""
                              />{" "}
                              <h5 class="ms-2" key={provid.provider_id}>
                                {provid.provider_name}
                              </h5>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-between">
                      <div>Provided by JustWatch</div>
                      <div>
                        <button
                          type="button"
                          class="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal fade" id="buyModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">
                        Buy {movie.title} from
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <div class="vstack gap-3">
                        {watchProviders &&
                          watchProviders.buy &&
                          watchProviders.buy.length > 0 &&
                          watchProviders.buy.map((provid, index) => (
                            <div class="d-flex justify-content-start align-items-center">
                              <img
                                class="icon-img rounded-3"
                                src={img_URL + provid.logo_path}
                                alt=""
                              />{" "}
                              <h5 class="ms-2" key={provid.provider_id}>
                                {provid.provider_name}
                              </h5>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-between">
                      <div>Provided by JustWatch</div>
                      <div>
                        <button
                          type="button"
                          class="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-5">
          {recommendedMovies && recommendedMovies.length > 0 ? (
            <div>
              <h4 class="mt-4 mb-3 nav-bold">Recommended Movies</h4>
              <HorizontalMovies
                moviesList={recommendedMovies}
              ></HorizontalMovies>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div>
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

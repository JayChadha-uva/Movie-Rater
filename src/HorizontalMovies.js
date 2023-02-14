/* eslint-disable react/style-prop-object */
import { Link } from "react-router-dom";
import defaultImg from "./Assets/defaultImage.png";
import "./App.css";

function HorizontalMovies({ moviesList }) {
  const img_URL = "https://image.tmdb.org/t/p/w500";
  return (
    <>
      <div class="container horizontal-scroll-movie">
        <div class="row text-center row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5">
          {moviesList &&
            moviesList.length > 0 &&
            moviesList.map((movie, index) => (
              <div class="col me-3 px-0">
                <div
                  class="card mb-3  movie-card-custom rounded-3"
                  key={movie.id}
                >
                  <Link to={`/movie/${movie.id}`}>
                    <img
                      src={
                        Object.is(movie.poster_path, null)
                          ? defaultImg
                          : img_URL + movie.poster_path
                      }
                      class="img-fluid rounded-top-3 "
                      alt={movie.title}
                    />
                  </Link>

                  <p class="card-title mt-2 ms-2 text-truncate text-start nav-bold">
                    {movie.title}
                  </p>
                  <div class="hstack gap-2 mb-3 ms-2">
                    <div class="card-text text-start">
                      <i class="bi bi-star-fill star-color"></i>{" "}
                      {Math.round(movie.vote_average * 10) / 10}
                    </div>
                    <div class="vr"></div>
                    <div class="card-text">
                      {String(movie.release_date).split("-")[0]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default HorizontalMovies;

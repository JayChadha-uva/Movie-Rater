/* eslint-disable react/style-prop-object */
import { Link } from "react-router-dom";
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
                  class="card mb-3 p-1 movie-card-custom rounded-4"
                  key={movie.id}
                >
                  <Link to={`/movie/${movie.id}`}>
                    <img
                      src={img_URL + movie.poster_path}
                      class="img-fluid rounded-4 "
                      alt={movie.title}
                    />
                  </Link>

                  <p class="card-title mt-2 ms-2 text-truncate text-start nav-bold">
                    {movie.title}
                  </p>
                  <div class="card-text text-start ms-2 mb-3">
                    <i class="bi bi-star-fill star-color"></i>{" "}
                    {movie.vote_average}
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

/* eslint-disable react/style-prop-object */
import { Link } from "react-router-dom";
import "./App.css";

function HorizontalMovies({ moviesList }) {
  const img_URL = "https://image.tmdb.org/t/p/w500";
  return (
    <>
      <div class="container horizontal-scroll-movie">
        <div class="row text-center row-cols-3 row-cols-lg-5">
          {moviesList &&
            moviesList.length > 0 &&
            moviesList.map((movie, index) => (
              <div class="col me-4 px-0">
                <div class="card my-4" key={movie.id}>
                  <Link to={`/movie/${movie.id}`}>
                    <img
                      src={img_URL + movie.poster_path}
                      class="img-fluid rounded "
                      alt={movie.title}
                    />
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default HorizontalMovies;

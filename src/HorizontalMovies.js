/* eslint-disable react/style-prop-object */
import { Link } from "react-router-dom";
import "./App.css";

function HorizontalMovies({ moviesList }) {
  const img_URL = "https://image.tmdb.org/t/p/original";
  return (
    <>
      <div class="container horizontal-scroll-movie">
        <div class="row text-center gap-2">
          {moviesList &&
            moviesList.length > 0 &&
            moviesList.map((movie, index) => (
              <div class="col-2">
                <div class="card my-4" key={movie.id}>
                  <div class="row ">
                    <div class="col d-flex align-items-center">
                      <Link to={`/movie/${movie.id}`}>
                        <img
                          src={img_URL + movie.poster_path}
                          class="card-img-top rounded "
                          alt={movie.title}
                        />
                      </Link>
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

import "./App.css";
import ImageRoll from "./ImageRoll";

function HorizontalMovies({ moviesList }) {
  return (
    <>
      <div class="container horizontal-scroll-movie">
        <div class="row text-center row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5">
          {moviesList &&
            moviesList.length > 0 &&
            moviesList.map((movie, index) => (
              <div class="col me-3 px-0" key={index}>
                <div
                  class="card mb-3  movie-card-custom rounded-3"
                  key={movie.id}
                >
                  <ImageRoll movieInput={movie}></ImageRoll>
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

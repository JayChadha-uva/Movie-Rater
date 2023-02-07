/* eslint-disable react/style-prop-object */
import "./App.css";

import "react-select-search/style.css";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Movie() {
  const { id } = useParams();
  const [user, setUser] = useState([]);

  const API_KEY = "3d0ac201ad49d76eb1e30e54903dcc54";
  const img_URL = "https://image.tmdb.org/t/p/original";

  const fetchMovie = () => {
    return fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => setUser(data));
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  return (
    <>
      <p>This is the movie sectoin of the website id; {id}</p>

      <div>
        <div class="container container-md">
          <div class="row row-cols-2">
            <div class="col">
              <div class="card my-4" key={user.original_title}>
                <div class="row ">
                  <div class="col-4">
                    <img
                      src={img_URL + user.poster_path}
                      class="card-img-top"
                      alt="..."
                    />
                  </div>
                  <div class="card-body col-8">
                    <div class="d-flex justify-content-between">
                      <h5 class="card-title">{user.original_title}</h5>
                      <p class="card-text me-5">{user.release_date}</p>
                    </div>
                    <p class="card-text">{user.overview}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Movie;

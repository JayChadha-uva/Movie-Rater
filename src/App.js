/* eslint-disable react/style-prop-object */
import "./App.css";

import Discover from "./Discover";
import SelectSearch from "react-select-search";
import "react-select-search/style.css";

import React, { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState([]);
  const [idVal, setIdVal] = useState(null);

  const img_URL = "https://image.tmdb.org/t/p/original";
  const API_KEY = "3d0ac201ad49d76eb1e30e54903dcc54";

  const fetchMovie = () => {
    return fetch(
      `https://api.themoviedb.org/3/movie/${idVal}?api_key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => setUser(data));
  };

  useEffect(() => {
    fetchMovie();
  }, [idVal]);

  return (
    <>
      <nav class="navbar sticky-top bg-body-tertiary">
        <div class="container-md my-2">
          <a class="navbar-brand h1">Movie Rater</a>
          <SelectSearch
            options={[]}
            getOptions={(query) => {
              return new Promise((resolve, reject) => {
                fetch(
                  `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${String(
                    query
                  ).replace(/ /g, "+")}`
                )
                  .then((response) => response.json())
                  .then((movies) => {
                    resolve(
                      movies.results.map(({ original_title, id }) => ({
                        value: id,
                        name: original_title,
                      }))
                    );
                  })
                  .catch(reject);
              });
            }}
            search
            onChange={setIdVal}
            placeholder="Search Movies"
          />
        </div>
      </nav>

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

export default App;

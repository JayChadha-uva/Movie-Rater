/* eslint-disable react/style-prop-object */
import "./App.css";

import SelectSearch from "react-select-search";
import "react-select-search/style.css";

import React, { useEffect, useState } from "react";

function Navbar() {
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
    </>
  );
}

export default Navbar;

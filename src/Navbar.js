/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
// import "react-select-search/style.css";
import "./selectSearch.css";

import SelectSearch from "react-select-search";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [idVal, setIdVal] = useState(null);
  const API_KEY = "3d0ac201ad49d76eb1e30e54903dcc54";

  const navigate = useNavigate();

  useEffect(() => {
    if (idVal != null) {
      navigate(`/movie/${idVal}`);
    }
  }, [idVal]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css"
      ></link>
      <nav class="navbar navbar-dark sticky-top navbar-custom shadow">
        <div class="container-md my-2">
          <Link to={"/"} class="navbar-brand nav-bold">
            <i class="bi bi-film"></i> Movie Rater
          </Link>
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

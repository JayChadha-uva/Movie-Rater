/* eslint-disable react/style-prop-object */
import { Link } from "react-router-dom";
import "./App.css";

import React, { useEffect, useState } from "react";

function Discover() {
  const [user, setUser] = useState([]);

  const img_URL = "https://image.tmdb.org/t/p/original";
  const API_KEY = "3d0ac201ad49d76eb1e30e54903dcc54";

  const fetchData = () => {
    return fetch(
      "https://api.themoviedb.org/3/trending/movie/week?api_key=" + API_KEY
    )
      .then((response) => response.json())
      .then((data) => setUser(data.results));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div>
        <div class="container container-md">
          <h1 class="my-4">Discover New Movies</h1>
          <div class="row row-cols-2">
            {user &&
              user.length > 0 &&
              user.map((userObj, index) => (
                <div class="col">
                  <div class="card my-4" key={userObj.original_title}>
                    <div class="row ">
                      <div class="col-4">
                        <img
                          src={img_URL + userObj.poster_path}
                          class="card-img-top"
                          alt="..."
                        />
                      </div>
                      <div class="card-body col-8">
                        <div class="d-flex justify-content-between">
                          <Link to={`/movie/${userObj.id}`}>
                            <h5 class="card-title">{userObj.original_title}</h5>
                          </Link>
                          <p class="card-text me-5">{userObj.release_date}</p>
                        </div>
                        <p class="card-text">{userObj.overview}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Discover;

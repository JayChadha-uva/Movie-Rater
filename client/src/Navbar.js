/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import SelectSearch from "react-select-search";
// import axios from "axios";

import "./App.css";
import "./selectSearch.css";

function Navbar() {
  const API_KEY = process.env.REACT_APP_TMDB_API;
  const [idVal, setIdVal] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      sessionStorage.getItem("email") ||
      sessionStorage.getItem("email") !== ""
    ) {
      setLoggedIn(true);
    }
  }, [sessionStorage.getItem("email")]);

  const handleLogOut = () => {
    sessionStorage.setItem("email", "");
    setLoggedIn(false);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const currentEmail = sessionStorage.getItem("email");

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
          <div class="d-flex justify-content-end align-items-center">
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
          {loggedIn ? (
            <a
              class="nav-link"
              style={{ color: "white", fontWeight: "bold" }}
              href="/profile"
            >
              My Profile
            </a>
          ) : (
            <></>
          )}
          {loggedIn ? (
            <button type="button" class="btn btn-light" onClick={handleLogOut}>
              Log out
            </button>
          ) : (
            <a
              class="nav-link"
              style={{ color: "white", fontWeight: "bold" }}
              href="/login"
            >
              Log in
            </a>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;

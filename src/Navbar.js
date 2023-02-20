/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
// import "react-select-search/style.css";

import SelectSearch from "react-select-search";
import "./selectSearch.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";

function Navbar() {
  const [idVal, setIdVal] = useState(null);
  const API_KEY = process.env.REACT_APP_TMDB_API;

  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

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
          <div class="d-flex justify-content-end align-items-center">
            {/* <input class="form-control" placeholder="Search Movies" /> */}
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
            {/* <div class="ms-3">
              {profile ? (
                <div>
                  <p>Name: {profile.name}</p>
                  <p>Access- token: {user.access_token}</p>
                  <button type="button" class="btn btn-light" onClick={logOut}>
                    Log out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  class="btn btn-light"
                  onClick={() => login()}
                >
                  Sign in with Google
                </button>
              )}
            </div> */}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

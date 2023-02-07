/* eslint-disable react/style-prop-object */
import "./App.css";
import Movie from "./Movie";
import Discover from "./Discover";

import SelectSearch from "react-select-search";
import "react-select-search/style.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <>
              <Discover></Discover>
            </>
          }
        />
        <Route path="/movie/:id" element={<Movie />} />
      </Routes>
    </>
  );
}

export default App;

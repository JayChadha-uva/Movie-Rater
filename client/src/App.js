import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "./App.css";
import Movie from "./Movie";
import Discover from "./Discover";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Login from "./Login";
import Profile from "./Profile.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GenrePage from "./GenrePage";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route exact path="/" element={<Discover />} />
        <Route path="/login" element={<Login />} />
        <Route path="/genre/:genreID/:genreName" element={<GenrePage />} />
      </Routes>
      <Footer></Footer>
    </>
  );
}

export default App;

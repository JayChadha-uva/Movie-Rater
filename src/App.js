/* eslint-disable react/style-prop-object */
import "./App.css";
import Movie from "./Movie";
import Discover from "./Discover";
import Navbar from "./Navbar";
import Footer from "./Footer";

// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <head>
        <meta name="theme-color" content="#576f72" />
      </head>
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
      <Footer></Footer>
    </>
  );
}

export default App;

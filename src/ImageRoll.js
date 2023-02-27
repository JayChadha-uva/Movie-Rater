import { Link } from "react-router-dom";
import React, { useState } from "react";
import defaultImg from "./Assets/defaultImage.png";
import "./App.css";

function ImageRoll({ movieInput }) {
  const [loading, setLoading] = useState(false);

  const img_URL = "https://image.tmdb.org/t/p/w500";
  return (
    <>
      <Link to={`/movie/${movieInput.id}`}>
        <img
          src={defaultImg}
          alt=""
          class="img-fluid rounded-top-3 "
          style={loading ? { display: "none" } : {}}
        />
        <img
          src={img_URL + movieInput.poster_path}
          alt={movieInput.title}
          class="img-fluid rounded-top-3 "
          onLoad={() => setLoading(true)}
          style={loading ? {} : { display: "none" }}
        />
      </Link>
    </>
  );
}
export default ImageRoll;

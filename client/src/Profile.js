import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import ProfileReviews from "./components/ProfileReviews";

function Profile() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (
      sessionStorage.getItem("email") ||
      sessionStorage.getItem("email") !== ""
    ) {
      setLoggedIn(true);
    }
  }, [sessionStorage.getItem("email")]);

  const currentEmail = sessionStorage.getItem("email");

  return (
    <div className="container-md height-requirement">
      <h2 class="mt-4 mb-3 nav-bold">My Reviews</h2>
      {loggedIn ? <ProfileReviews email={currentEmail} /> : <></>}
    </div>
  );
}

export default Profile;

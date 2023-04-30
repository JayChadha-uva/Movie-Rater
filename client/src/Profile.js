import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ProfileReviews from "./components/ProfileReviews";
import Genre from "./components/Genre";
import Track from "./components/Track";

function Profile() {
  let { email } = useParams();
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileEmail, setProfileEmail] = useState();
  const [profileName, setProfileName] = useState();

  useEffect(() => {
    if (
      sessionStorage.getItem("email") &&
      sessionStorage.getItem("email") !== ""
    ) {
      setLoggedIn(true);
    }
  }, [sessionStorage.getItem("email")]);

  const currentEmail = sessionStorage.getItem("email");
  // Base /profile url defaults to the user's

  useEffect(() => {
    if (email === undefined) {
      if (currentEmail === "" || currentEmail === undefined) {
        window.location.href = "/login";
      }
      setProfileEmail(currentEmail);
    } else {
      Axios.post("http://localhost:1234/api/user/get", {
        email: email,
      }).then((response) => {
        if (response.data.length > 0) {
          setProfileEmail(email);
          setProfileName(
            response.data[0].first_name + " " + response.data[0].last_name
          );
        }
      });
    }
  }, []);

  return (
    <div key={profileEmail} className="container-md height-requirement">
      <h2 class="mt-4 mb-3 nav-bold">
        {profileName ? profileName + "'s" : "My"} Reviews
      </h2>
      {loggedIn ? <ProfileReviews email={profileEmail} /> : <></>}
      <h2 class="mt-4 mb-3 nav-bold">Favorite Genres</h2>
      {loggedIn ? <Genre email={profileEmail} favorite={"true"} /> : <></>}
      <h2 class="mt-4 mb-3 nav-bold">Tracked Movies</h2>
      {loggedIn ? <Track email={profileEmail} /> : <></>}
    </div>
  );
}

export default Profile;

import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ProfileReviews from "./components/ProfileReviews";
import Genre from "./components/Genre";
import Track from "./components/Track";
import FollowFeed from "./components/FollowFeed";

function Profile() {
  let { email } = useParams();
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileEmail, setProfileEmail] = useState();
  const [profileName, setProfileName] = useState();
  const [following, setFollowing] = useState("Follow");
  const [toggleFollowing, setToggleFollowing] = useState(false);

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
    } else if (email === currentEmail) {
      window.location.href = "/profile";
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

  useEffect(() => {
    if (currentEmail !== "" && currentEmail !== undefined) {
      Axios.post("http://localhost:1234/api/user/get/follow", {
        email: email,
        f_email: currentEmail,
      }).then((response) => {
        setFollowing(response.data.length > 0 ? "Unfollow" : "Follow");
      });
    }
  }, [toggleFollowing, loggedIn]);

  const handleFollow = () => {
    const followUser = {
      email: email,
      f_email: currentEmail,
    };

    Axios.post("http://localhost:1234/api/user/follow", { followUser })
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });

    setToggleFollowing(!toggleFollowing);
  };

  const handleUnfollow = () => {
    console.log(email + " " + currentEmail);
    const unfollowUser = {
      email: email,
      f_email: currentEmail,
    };

    Axios.delete("http://localhost:1234/api/user/unfollow", {
      data: unfollowUser,
    })
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });

    setToggleFollowing(!toggleFollowing);
  };

  return (
    <div key={profileEmail} className="container-md height-requirement">
      {!profileEmail ? (
        <div class="mt-4">User not found.</div>
      ) : (
        <>
          {profileName ? (
            <div style={{ display: "flex", columnGap: "1em" }}>
              <h2 class="mt-4 mb-3 nav-bold">{profileName + "'s"} Reviews</h2>
              <button
                class="mt-4 mb-3 btn btn-secondary"
                type="button"
                onClick={() => {
                  following === "Unfollow" ? handleUnfollow() : handleFollow();
                }}
              >
                {following}
              </button>
            </div>
          ) : (
            <h2 class="mt-4 mb-3 nav-bold">My Reviews</h2>
          )}
          {loggedIn ? <ProfileReviews email={profileEmail} /> : <></>}
          {loggedIn && email === undefined ? (
            <>
              <h2 class="mt-4 mb-3 nav-bold">Recent Reviews From Followed</h2>
              <FollowFeed email={profileEmail} />
            </>
          ) : (
            <></>
          )}
          <h2 class="mt-4 mb-3 nav-bold">Favorite Genres</h2>
          {loggedIn ? <Genre email={profileEmail} favorite={"true"} /> : <></>}
          <h2 class="mt-4 mb-3 nav-bold">Tracked Movies</h2>
          {loggedIn ? <Track email={profileEmail} /> : <></>}
        </>
      )}
    </div>
  );
}

export default Profile;

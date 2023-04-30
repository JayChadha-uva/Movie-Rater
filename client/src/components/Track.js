import React from "react";
import { Component } from "react";
import axios from "axios";

class Track extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
      tracks: [],
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    fetch(`/api/track/${this.state.email}`).then((res) =>
      res.json().then((tracksData) => {
        this.setState({ tracks: tracksData });
      })
    );
  }

  handleUpdate(email, movie_id, new_status) {
    const trackMovie = {
      email,
      movie_id: parseInt(movie_id),
      new_status,
    };

    axios
      .post("http://localhost:1234/api/track/update", { trackMovie })
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });

    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  handleDelete(email, movie_id) {
    const deleteTrack = {
      email,
      movie_id: parseInt(movie_id),
    };

    axios
      .delete("http://localhost:1234/api/track/delete", {
        data: deleteTrack,
      })
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });

    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  render() {
    return (
      <>
        {this.state.tracks.map((track) => (
          <div class="card mb-3 rounded-4 border-0">
            <div class="card-body">
              <div className="d-flex justify-content-between">
                <h5 class="card-title">{track.title}</h5>
                <div class="dropdown">
                  <button
                    class="btn btn-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {track.status}
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <button class="dropdown-item" onClick={() => this.handleUpdate(this.state.email, track.movie_id, "Plan to watch")}>Plan to watch</button>
                      <button class="dropdown-item" onClick={() => this.handleUpdate(this.state.email, track.movie_id, "Watched")}>Watched</button>
                      <button class="dropdown-item" onClick={() => this.handleUpdate(this.state.email, track.movie_id, "Dropped")}>Dropped</button>
                      <button class="dropdown-item" onClick={() => this.handleDelete(this.state.email, track.movie_id)}>Untrack</button>
                    </li>
                  </ul>
                </div>
              </div>
              <h6 class="card-subtitle mb-2 text-body-secondary">
                Last updated -{" "}
                {new Date(track.track_date).toLocaleString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
              </h6>
            </div>
          </div>
        ))}
      </>
    );
  }
}

export default Track;

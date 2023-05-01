import React from "react";
import { Component } from "react";
import axios from "axios";

class Track extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
      tracks: [],
      genres: [],
      filters: [],
      toggle: false,
    };
    this.currentEmail = sessionStorage.getItem("email");

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  componentDidMount() {
    fetch(`/api/track/${this.state.email}`).then((res) =>
      res.json().then((tracksData) => {
        this.setState({ tracks: tracksData });
      })
    );

    fetch(`/api/genres`).then((res) =>
      res.json().then((genresData) => {
        this.setState({ genres: genresData });
      })
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.toggle !== prevState.toggle ||
      JSON.stringify(this.state.filters) !== JSON.stringify(prevState.filters)
    ) {
      if (this.state.filters.length === 0) {
        fetch(`/api/track/${this.state.email}`).then((res) =>
          res.json().then((tracksData) => {
            this.setState({ tracks: tracksData });
          })
        );
      } else {
        let filterStr = "(";
        this.state.filters.map((filter) => {
          filterStr += "" + filter.value + ", ";
        });
        filterStr = filterStr.substring(0, filterStr.length - 2) + ")";
        console.log(filterStr);

        fetch(`/api/track/${this.state.email}/filter/${filterStr}`).then(
          (res) =>
            res.json().then((tracksData) => {
              this.setState({ tracks: tracksData });
            })
        );
      }
    }
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
    this.setState({ toggle: !this.state.toggle });
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
    this.setState({ toggle: !this.state.toggle });
  }

  handleFilter(e, value) {
    if (e.target.checked) {
      this.setState({ filters: [...this.state.filters, { value }] });
    } else {
      this.setState({
        filters: this.state.filters.filter((genre) => genre.value !== value),
      });
    }
  }

  render() {
    return (
      <>
        {this.state.genres.map((genre, index) => (
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="checkbox"
              id={"genre" + index}
              onChange={(e) => this.handleFilter(e, genre.genre_id)}
            />
            <label class="form-check-label" for={"genre" + index}>
              {genre.genre_name}
            </label>
          </div>
        ))}
        {this.state.tracks.length === 0 ? (
          <div class="mt-3 mb-3">There are no movies tracked.</div>
        ) : (
          this.state.tracks.map((track, index) => (
            <div
              class="card mt-3 mb-3 rounded-4 border-0"
              key={index}
              style={{ display: "flex" }}
            >
              <div class="card-body">
                <div class="row ">
                  <div class="col-1">
                    <a
                      class="text-reset text-decoration-none"
                      href={"/movie/" + track.movie_id}
                    >
                      <img
                        src={
                          "https://image.tmdb.org/t/p/w500" + track.image_url
                        }
                        class="card-img rounded-0"
                        alt="..."
                      />
                    </a>
                  </div>
                  <div className="d-flex justify-content-between col">
                    <div>
                      <h5 class="card-title">
                        <a
                          class="text-reset text-decoration-none"
                          href={"/movie/" + track.movie_id}
                        >
                          {track.title}
                        </a>
                      </h5>
                      <h6 class="card-subtitle mb-2 text-body-secondary">
                        Last updated -{" "}
                        {new Date(track.track_date).toLocaleString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </h6>
                    </div>
                    {this.state.email === this.currentEmail ? (
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
                            <button
                              class="dropdown-item"
                              onClick={() =>
                                this.handleUpdate(
                                  this.state.email,
                                  track.movie_id,
                                  "Plan to watch"
                                )
                              }
                            >
                              Plan to watch
                            </button>
                            <button
                              class="dropdown-item"
                              onClick={() =>
                                this.handleUpdate(
                                  this.state.email,
                                  track.movie_id,
                                  "Watched"
                                )
                              }
                            >
                              Watched
                            </button>
                            <button
                              class="dropdown-item"
                              onClick={() =>
                                this.handleUpdate(
                                  this.state.email,
                                  track.movie_id,
                                  "Dropped"
                                )
                              }
                            >
                              Dropped
                            </button>
                            <button
                              class="dropdown-item"
                              onClick={() =>
                                this.handleDelete(
                                  this.state.email,
                                  track.movie_id
                                )
                              }
                            >
                              Untrack
                            </button>
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <button class="btn btn-secondary">{track.status}</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </>
    );
  }
}

export default Track;

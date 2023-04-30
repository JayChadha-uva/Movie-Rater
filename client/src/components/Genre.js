import { Component } from "react";
import React from "react";
import axios from "axios";

class Genre extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
      favorite: props.favorite,
      genres: [],
    };
    this.currentEmail = sessionStorage.getItem("email");

    this.handleFavorite = this.handleFavorite.bind(this);
  }

  componentDidMount() {
    if (this.state.favorite === "true") {
      fetch(`/api/genre/favorite/${this.state.email}`).then((res) =>
        res.json().then((genresData) => {
          this.setState({ genres: genresData });
        })
      );
    } else {
      fetch(`/api/genres`).then((res) =>
        res.json().then((genresData) => {
          this.setState({ genres: genresData });
        })
      );
    }
  }

  handleDelete(email, genre_idInp) {
    const genre_id = parseInt(genre_idInp);
    // console.log(genre_id);

    const deleteGenre = {
      email,
      genre_id,
    };

    axios
      .delete("http://localhost:1234/api/genre/favorite/delete", {
        data: deleteGenre,
      })
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });

    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  handleFavorite(email, genre_idInp) {
    const genre_id = parseInt(genre_idInp);
    // console.log(genre_id);
    const deleteReview = {
      email,
      genre_id,
    };
    axios
      .post("http://localhost:1234/api/genre/favorite", deleteReview)
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
        {this.state.genres.length == 0 ? (
          <>There are no genres favorited.</>
        ) : (
          <div class="mt-3 row">
            {this.state.genres.map((genre, index) => (
              <div class="col me-3 mb-3" key={index}>
                <div class="card" style={{ width: "18rem" }}>
                  <div class="card-body">
                    <h5 class="card-title">{genre.genre_name} Movies</h5>
                    <div class="d-flex justify-content-between">
                      <a
                        href={`/genre/${genre.genre_id}/${genre.genre_name}`}
                        class="btn btn-secondary"
                      >
                        View
                      </a>
                      {this.state.email === this.currentEmail ? (
                        this.state.favorite === "false" ? (
                          <button
                            type="button"
                            class="btn btn-outline-success"
                            onClick={() =>
                              this.handleFavorite(
                                this.state.email,
                                genre.genre_id
                              )
                            }
                          >
                            Favorite
                          </button>
                        ) : (
                          <button
                            type="button"
                            class="btn btn-outline-danger"
                            onClick={() =>
                              this.handleDelete(
                                this.state.email,
                                genre.genre_id
                              )
                            }
                          >
                            Delete
                          </button>
                        )
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }
}

export default Genre;

import { Component } from "react";
import React from "react";

class Genre extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genres: [],
    };
  }

  componentDidMount() {
    fetch(`/api/genres`).then((res) =>
      res.json().then((genresData) => {
        this.setState({ genres: genresData });
      })
    );
  }

  render() {
    return (
      <div class="mt-3 row">
        {this.state.genres.map((genre) => (
          <div class="col me-3 mb-3">
            <div class="card" style={{ width: "18rem" }}>
              <div class="card-body">
                <h5 class="card-title">{genre.genre_name} Movies</h5>
                <a
                  href={`/genre/${genre.genre_id}/${genre.genre_name}`}
                  class="btn btn-outline-secondary"
                >
                  View
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Genre;

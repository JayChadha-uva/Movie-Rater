import React, { Component } from "react";
import axios from "axios";

class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movieID: props.movieID,
      rating: 0,
      reviewTitle: "",
      reviewText: "",
    };
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleRangeChange = (e) => {
    this.setState({
      rating: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { movieID, rating, reviewTitle, reviewText } = this.state;

    const book = {
      movieID,
      rating,
      reviewTitle,
      reviewText,
    };

    axios
      .post("http://localhost:1234/create", book)
      .then(() => console.log("Book Created"))
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    return (
      <div>
        <h3 class="nav-bold mt-5">Write a Review</h3>
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label for="customRange2" class="form-label me-3">
                Rating
              </label>
              <label for="customRange2" class="form-label">
                <i class="bi bi-star-fill star-color"></i> {this.state.rating}{" "}
                stars
              </label>
              <input
                type="range"
                class="form-range"
                name="rating"
                onChange={this.handleRangeChange}
                value={this.state.rating}
                min="0"
                max="5"
                step="0.25"
                id="customRange2"
              ></input>
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                name="reviewTitle"
                placeholder="Review Title"
                onChange={this.handleInputChange}
              />
            </div>
            <br />
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                name="reviewText"
                placeholder="Review"
                onChange={this.handleInputChange}
              />
            </div>
            <br />
            <div style={{ width: "30%" }}>
              <button className="btn btn-success" type="submit">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Create;

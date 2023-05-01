import React, { Component } from "react";
import axios from "axios";

class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movieID: props.movieID,
      email: props.email,
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

    const { movieID, email, rating, reviewTitle, reviewText } = this.state;

    const sixHoursAgo = new Date();
    sixHoursAgo.setHours(sixHoursAgo.getHours() - 4);

    const book = {
      movieID,
      email,
      rating,
      reviewTitle,
      reviewText,
      date: sixHoursAgo.toISOString().slice(0, 19).replace("T", " "),
    };

    axios
      .post("http://localhost:1234/create", book)
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });

    this.setState({
      rating: 0,
      reviewTitle: "",
      reviewText: "",
    });

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  render() {
    return (
      <div>
        <h3 class="nav-bold mt-5">Write a Review</h3>
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group" class="d-flex flex-nowrap">
              <label for="customRange2" class="form-label">
                <i class="bi bi-star-fill star-color"></i>
                {" " + this.state.rating + " stars"}
              </label>
              <input
                type="range"
                required={true}
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
                required={true}
                type="text"
                className="form-control"
                name="reviewTitle"
                placeholder="Review Title"
                value={this.state.reviewTitle}
                onChange={this.handleInputChange}
              />
            </div>
            <br />
            <div className="form-group">
              <textarea
                required={true}
                type="text"
                className="form-control"
                name="reviewText"
                placeholder="Write your review"
                rows={3}
                value={this.state.reviewText}
                onChange={this.handleInputChange}
              ></textarea>
            </div>
            <br />
            <div>
              <button className="btn btn-success" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Create;

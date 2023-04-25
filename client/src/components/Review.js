import { Component } from "react";
import React from "react";

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieID: props.movieID,
      reviews: [],
      sort: "review_date",
      sortOrder: "DESC",
    };
  }

  componentDidMount() {
    fetch(`/api/movie/${this.state.movieID}`).then((res) =>
      res.json().then((reviews) => {
        this.setState({ reviews: reviews });
      })
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.sort !== prevState.sort ||
      this.state.sortOrder !== prevState.sortOrder
    ) {
      fetch(
        `/api/movie/${this.state.sort}/${this.state.sortOrder}/${this.state.movieID}`
      ).then((res) =>
        res.json().then((reviews) => {
          this.setState({ reviews: reviews });
        })
      );
    }
  }

  render() {
    return (
      <div class="mt-3">
        <h3 class="nav-bold">Reviews</h3>

        <div class="btn-group mb-3">
          <button
            type="button"
            class="btn btn-secondary"
            id="dropdownReviewSortButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Sort by{" "}
            {this.state.sort === "review_date" ? "review date" : "rating"}
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownReviewSortButton">
            <li>
              <button
                class="dropdown-item"
                onClick={() => this.setState({ sort: "review_date" })}
              >
                Date
              </button>
            </li>
            <li>
              <button
                class="dropdown-item"
                onClick={() => this.setState({ sort: "rating" })}
              >
                Rating
              </button>
            </li>
          </ul>

          <div
            class={
              "btn-group " +
              (this.state.sortOrder === "ASC" ? "dropup" : "dropdown")
            }
          >
            <button class="btn btn-secondary p-0"></button>
            <button
              type="button"
              class="btn btn-secondary dropdown-toggle dropdown-toggle-split rounded-right"
              onClick={() =>
                this.setState({
                  sortOrder: this.state.sortOrder === "ASC" ? "DESC" : "ASC",
                })
              }
            />
          </div>
        </div>

        {this.state.reviews.map((review) => (
          <div class="card mb-3 rounded-4 border-0">
            <div class="card-body">
              <h5 class="card-title">{review.review_title}</h5>
              <h6 class="card-subtitle mb-2 text-body-secondary">
                <i class="bi bi-star-fill star-color"></i> {review.rating} -{" "}
                {new Date(review.review_date).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
              </h6>
              <h6 class="card-subtitle mb-2 text-body-secondary">
                {review.email}
              </h6>

              <p class="card-text">{review.review_text}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Review;

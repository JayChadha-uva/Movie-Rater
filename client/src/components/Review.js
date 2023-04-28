import { Component } from "react";
import React from "react";
import axios from "axios";

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieID: props.movieID,
      reviews: [],
      averageReview: [],
      sort: "review_date",
      sortOrder: "DESC",
      email: props.email,
    };

    this.handleRate = this.handleRate.bind(this);
    this.handleDeleteRate = this.handleDeleteRate.bind(this);
  }

  componentDidMount() {
    fetch(
      `/api/movie/${this.state.movieID}/${this.state.email}/${this.state.sort}/${this.state.sortOrder}`
    ).then((res) =>
      res.json().then((reviews) => {
        this.setState({ reviews: reviews });
      })
    );

    fetch(`/api/averageReview/${this.state.movieID}`).then((res) =>
      res.json().then((avgReview) => {
        this.setState({ averageReview: avgReview });
      })
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.sort !== prevState.sort ||
      this.state.sortOrder !== prevState.sortOrder
    ) {
      fetch(
        `/api/movie/${this.state.movieID}/${this.state.email}/${this.state.sort}/${this.state.sortOrder}`
      ).then((res) =>
        res.json().then((reviews) => {
          this.setState({ reviews: reviews });
        })
      );
    }
  }

  handleRate(email, review_id, is_like) {
    if (email === "") {
      window.location.href = "/login";
    }

    const rateReview = {
      email,
      review_id: parseInt(review_id),
      is_like: parseInt(is_like),
    };
    console.log("Rate 1");
    axios
      .post("http://localhost:1234/api/review/rate", { rateReview })
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });

    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  handleDeleteRate(email, review_id) {
    const deleteRate = {
      email,
      review_id: parseInt(review_id),
    };

    axios
      .delete("http://localhost:1234/api/review/rate/delete", {
        data: deleteRate,
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
      <div class="mt-3">
        <h3 class="nav-bold">Reviews</h3>
        {this.state.averageReview.map((avgReview) => (
          <h5 class="mb-3">
            {avgReview.avgRating != null ? (
              <>
                Average User Ratings: <i class="bi bi-star-fill star-color"></i>{" "}
                {avgReview.avgRating}
              </>
            ) : (
              <>No Reviews</>
            )}
          </h5>
        ))}

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

              <div class="container">
                <div class="row">
                  <div class="col-sm-1">
                    {review.is_like === 1 ? (
                      <i
                        class={"bi bi-hand-thumbs-up-fill"}
                        onClick={() =>
                          this.handleDeleteRate(
                            this.state.email,
                            review.review_id
                          )
                        }
                      />
                    ) : (
                      <i
                        class={"bi bi-hand-thumbs-up"}
                        onClick={() =>
                          this.handleRate(this.state.email, review.review_id, 1)
                        }
                      />
                    )}
                    <span>{review.likes}</span>
                  </div>
                  <div class="col-sm-1">
                    {review.is_like === 0 ? (
                      <i
                        class={"bi bi-hand-thumbs-down-fill"}
                        onClick={() =>
                          this.handleDeleteRate(
                            this.state.email,
                            review.review_id
                          )
                        }
                      />
                    ) : (
                      <i
                        class={"bi bi-hand-thumbs-down"}
                        onClick={() =>
                          this.handleRate(this.state.email, review.review_id, 0)
                        }
                      />
                    )}
                    <span>{review.dislikes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Review;

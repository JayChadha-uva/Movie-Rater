import React from "react";
import { Component } from "react";
import axios from "axios";

class FollowFeed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: props.email,
      reviews: [],
    };
  }

  componentDidMount() {
    fetch(`/api/${this.state.email}/follow`).then((res) =>
      res.json().then((reviews) => {
        this.setState({ reviews: reviews });
      })
    );
  }

  render() {
    return (
      <>
        {this.state.reviews.length == 0 ? (
          <>There are no reviews.</>
        ) : (
          this.state.reviews.map((review, index) => (
            <div class="card mb-3 rounded-4 border-0" key={index}>
              <div class="card-body">
                <div className="d-flex justify-content-between">
                  <h5 class="card-title">
                    {review.review_title} - {review.movie_id}
                  </h5>
                  {this.state.email === this.currentEmail ? (
                    <button
                      type="button"
                      class="btn btn-danger"
                      onClick={() =>
                        this.handleDelete(
                          this.state.email,
                          review.review_title,
                          review.movie_id
                        )
                      }
                    >
                      Delete
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
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
                  <a
                    class="text-reset text-decoration-none"
                    href={"/profile/" + review.email}
                  >
                    {review.email}
                  </a>
                </h6>

                <p class="card-text">{review.review_text}</p>
              </div>
            </div>
          ))
        )}
      </>
    );
  }
}

export default FollowFeed;

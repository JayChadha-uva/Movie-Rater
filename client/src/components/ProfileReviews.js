import React from "react";
import { Component } from "react";
import axios from "axios";

class ProfileReviews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: props.email,
      reviews: [],
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    fetch(`/api/${this.state.email}`).then((res) =>
      res.json().then((reviews) => {
        this.setState({ reviews: reviews });
      })
    );
  }

  handleDelete(email, review_title, movieIDInput) {
    const movieID = parseInt(movieIDInput);
    // console.log(movieID);

    const deleteReview = {
      email,
      review_title,
      movie_id: movieID,
    };

    axios
      .delete("http://localhost:1234/api/review/delete", { data: deleteReview })
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
        {this.state.reviews.map((review, index) => (
          <div class="card mb-3 rounded-4 border-0" key={index}>
            <div class="card-body">
              <div className="d-flex justify-content-between">
                <h5 class="card-title">
                  {review.review_title} - {review.movie_id}
                </h5>
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
                {review.email}
              </h6>

              <p class="card-text">{review.review_text}</p>
            </div>
          </div>
        ))}
      </>
    );
  }
}

export default ProfileReviews;

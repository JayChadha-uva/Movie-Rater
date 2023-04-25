import React from "react";
import { Component } from "react";

class ProfileReviews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: props.email,
      reviews: [],
    };
  }

  componentDidMount() {
    fetch(`/api/${this.state.email}`).then((res) =>
      res.json().then((reviews) => {
        this.setState({ reviews: reviews });
      })
    );
  }

  render() {
    return (
      <>
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
      </>
    );
  }
}

export default ProfileReviews;

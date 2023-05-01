import React from "react";
import { Component } from "react";
// import axios from "axios";

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
        {this.state.reviews.length === 0 ? (
          <>There are no reviews.</>
        ) : (
          this.state.reviews.map((review, index) => (
            <div class="card mb-3 rounded-4 border-0" key={index}>
              <div class="card-body">
                <div class="row ">
                  <div class="col-1">
                    <a
                      class="text-reset text-decoration-none"
                      href={"/movie/" + review.movie_id}
                    >
                      <img
                        src={
                          "https://image.tmdb.org/t/p/w500" + review.image_url
                        }
                        class="card-img rounded-0 "
                        alt="..."
                      />
                    </a>
                  </div>
                  <div className="d-flex justify-content-between col">
                    <div>
                      <h5 class="card-title"></h5>
                      <h5 class="card-title">
                        <a
                          class="text-reset text-decoration-none"
                          href={"/movie/" + review.movie_id}
                        >
                          {review.review_title} - {review.title}
                        </a>
                      </h5>
                      <h6 class="card-subtitle mb-2 text-body-secondary">
                        <i class="bi bi-star-fill star-color"></i>{" "}
                        {review.rating} -{" "}
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
                </div>
              </div>
            </div>
          ))
        )}
      </>
    );
  }
}

export default FollowFeed;

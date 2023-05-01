import React from "react";
import { Component } from "react";
import axios from "axios";

class ProfileReviews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: props.email,
      reviews: [],
      showInput: false,
      editReviewDate: "",
      editTitle: "",
    };
    this.currentEmail = sessionStorage.getItem("email");

    this.handleDelete = this.handleDelete.bind(this);
    // this.handleSetState = this.handleSetState.bind(this);
    // this.handleTitle = this.handleTitle.bind(this);
  }

  componentDidMount() {
    fetch(`/api/${this.state.email}`).then((res) =>
      res.json().then((reviews) => {
        this.setState({ reviews: reviews });
      })
    );
  }

  handleSetState(review_date) {
    this.setState({ showInput: true, editReviewDate: review_date });
  }

  handleTitle(title) {
    this.setState({ editTitle: title });
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

  handleEdit(review_id) {
    const sixHoursAgo = new Date();
    sixHoursAgo.setHours(sixHoursAgo.getHours() - 4);

    const updatedReview = {
      review_title: this.state.editTitle,
      review_date: sixHoursAgo.toISOString().slice(0, 19).replace("T", " "),
    };

    axios
      .post(
        `http://localhost:1234/api/review/update/${review_id}`,
        updatedReview
      )
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
        {this.state.reviews.length === 0 ? (
          <div class="mt-3">There are no reviews.</div>
        ) : (
          this.state.reviews.map((review, index) => (
            <div class="card mb-3 rounded-4 border-0" key={index}>
              <div class="card-body">
                <div className="d-flex justify-content-between">
                  <h5 class="card-title">
                    {review.review_title} - {review.movie_id}
                  </h5>
                  {this.state.email === this.currentEmail ? (
                    <div class="">
                      <button
                        type="button"
                        class="btn btn-secondary me-4"
                        onClick={() => this.handleSetState(review.review_date)}
                      >
                        Edit
                      </button>
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
                  {review.email}
                </h6>

                <p class="card-text">{review.review_text}</p>
                {this.state.showInput === true &&
                review.review_date === this.state.editReviewDate ? (
                  <div>
                    <form action="">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Update Review Title"
                        onChange={(e) => this.handleTitle(e.target.value)}
                      />
                      <button
                        class="mt-3 mb-1 btn btn-success"
                        onClick={() => this.handleEdit(review.review_id)}
                      >
                        Update
                      </button>
                    </form>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          ))
        )}
      </>
    );
  }
}

export default ProfileReviews;

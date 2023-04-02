import { Component } from "react";

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieID: props.movieID,
      reviews: [],
    };
  }

  componentDidMount() {
    fetch(`/api/movie/${this.state.movieID}`).then((res) =>
      res.json().then((reviews) => {
        this.setState({ reviews: reviews });
      })
    );
  }

  render() {
    return (
      <div class="mt-3">
        <h3 class="nav-bold">Reviews</h3>
        {this.state.reviews.map((review) => (
          <div class="card mb-3 rounded-4">
            <div class="card-body">
              <h5 class="card-title">{review.reviewTitle}</h5>
              <h6 class="card-subtitle mb-2 text-body-secondary">
                <i class="bi bi-star-fill star-color"></i> {review.rating}
              </h6>
              <p class="card-text">{review.reviewText}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Review;

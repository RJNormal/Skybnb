import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserReviews, updateReview } from "../../store/reviews.js";
import { deleteReview } from "../../store/reviews.js";
import './ManageReviews.css'
import { fetchSpots } from "../../store/spots";



const ManageReviews = () => {
  const dispatch = useDispatch();
  const userReviews = useSelector((state) => state.reviews.userReviews);
  const [errors, setErrors] = useState([]);
  const spots = useSelector((state) => state.spots.allSpots);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [updatedReview, setUpdatedReview] = useState("");
  const [updatedStars, setUpdatedStars] = useState(1);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);



  useEffect(() => {
    dispatch(fetchUserReviews())
      .catch((error) => {
        setErrors([error.message]); 
      });
  }, [dispatch]);

  const handleDelete = (reviewId) => {
    dispatch(deleteReview(reviewId))
      .catch((error) => {
        setErrors([error.message]); 
      });
    setReviewToDelete(null);
  };

  const handleUpdate = (reviewId) => {
    dispatch(updateReview(reviewId, { review: updatedReview, stars: updatedStars }))
      .then(() => {
        setReviewToEdit(null);
        setUpdatedReview("");
        setUpdatedStars(1);
      });
  };

  return (
    <div>
      <h2>Manage Your Reviews</h2>
      {userReviews.length > 0 ? (
        <ul>
          {userReviews.map((review) => {
            
            const spot = spots.find((spot) => spot.id === review.spotId);

            return (
              <li key={review.id}>
                {/* Render spot name if found */}
                <h3>{spot ? spot.name : 'No spot found'}</h3>
                <p>Review: {review.review}</p>
                <p>Stars: {review.stars}</p>
                <button onClick={() => setReviewToDelete(review.id)}>Delete</button>
                <button onClick={() => {
                  setReviewToEdit(review.id);
                  setUpdatedReview(review.review);
                  setUpdatedStars(review.stars);
                }}>Edit</button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>You have not posted any reviews yet.</p>
      )}

      {reviewToDelete && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <button onClick={() => handleDelete(reviewToDelete)} className="delete-button">
              Yes (Delete Review)
            </button>
            <button onClick={() => setReviewToDelete(null)} className="cancel-button">
              No (Keep Review)
            </button>
          </div>
        </div>
      )}

      {reviewToEdit && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update Your Review</h2>
            {errors.length > 0 && <ul>{errors.map((err, i) => <li key={i}>{err}</li>)}</ul>}

            <textarea
              value={updatedReview}
              onChange={(e) => setUpdatedReview(e.target.value)}
              placeholder="Update your review here..."
            />
            
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((rating) => (
                <span
                  key={rating}
                  className={`star ${updatedStars >= rating ? 'filled' : ''}`}
                  onClick={() => setUpdatedStars(rating)}  
                  role="button"
                  aria-label={`Rate ${rating} stars`}
                >
                  ★
                </span>
              ))}
            </div>

            <button
              className="update-button"
              onClick={(e) => {
                e.preventDefault();
                handleUpdate(reviewToEdit); 
              }}
            >
              Update Review
            </button>
            
            <button
              className="cancel-button"
              onClick={() => setReviewToEdit(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;
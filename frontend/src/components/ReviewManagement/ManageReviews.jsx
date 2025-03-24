import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserReviews } from "../../store/reviews,js";
import { deleteReview } from "../../store/reviews,js";
import './ManageReviews.css'


const ManageReviews = () => {
  const dispatch = useDispatch();
  const userReviews = useSelector((state) => state.reviews.userReviews);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  

  useEffect(() => {
    dispatch(fetchUserReviews());
  }, [dispatch]);

  const handleDelete = (reviewId) => {
    dispatch(deleteReview(reviewId));  
    setReviewToDelete(null);  
  };

  return (
    <div>
      <h2>Manage Your Reviews</h2>
      {userReviews.length > 0 ? (
        <ul>
          {userReviews.map((review) => (
            <li key={review.id}>
              <h3>{review.Spot.name}</h3>
              <p>Review: {review.review}</p>
              <p>Stars: {review.stars}</p>
              <button onClick={() => setReviewToDelete(review.id)}>Delete</button>
            </li>
          ))}
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
    </div>
  );
};

export default ManageReviews;
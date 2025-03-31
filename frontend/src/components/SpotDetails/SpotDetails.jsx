import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ReviewForm from "../ReviewManagement/ReviewForm";
import { fetchSpotReviews, deleteReview, updateReview } from "../../store/reviews.js";
import { fetchSpot } from "../../store/spots.js";
import './SpotDetails.css'


const SpotDetails = () => {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spot.spot);
  const reviews = useSelector((state) => state.reviews[spotId] || []);
  const [isLoaded] = useState(false);
  const sessionUser = useSelector(state => state.session.user);
  const userReviews = useSelector(state => state.reviews.userReviews);
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [reviewToEdit, setReviewToEdit] = useState(null);  
  const [updatedReview, setUpdatedReview] = useState("");
  const [errors, setErrors] = useState([]);
  const [updatedStars, setUpdatedStars] = useState(1);
  


  useEffect(() => {
    dispatch(fetchSpot(spotId)); 
  }, [dispatch, spotId]);

  useEffect(() => {
    dispatch(fetchSpotReviews(spotId));
  }, [dispatch, spotId]);




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
      dispatch(fetchSpotReviews(spotId)); 
      setReviewToEdit(null);
      setUpdatedReview("");
      setUpdatedStars(1);
    })
    .catch((error) => {
      setErrors([error.message]);
    });
};

  if (!isLoaded) return <h2>Loading...</h2>;
  if (!spot || Object.keys(spot).length === 0) return <h2>Spot not found</h2>;
  
  const hasReviewed = userReviews.some(review => review.spotId === spot.id);
  const isOwner = sessionUser?.id === spot.ownerId;

  return (
    <div className="spot-details">
      <h1>{spot.name}</h1>
      <p>Location: {spot.city}, {spot.state}, {spot.country}</p>

      <h3>Images</h3>
      <div className="spot-images">
        {spot.SpotImages?.map((image) => (
          <img key={image.id} src={image.url} alt="Spot image" />
        ))}
      </div>

      <p>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</p>
      <p>{spot.description}</p>

      <div className="callout-box">
        <div className="callout-price">
          <p><strong>${spot.price}</strong> / night</p>
          <h2>
            ⭐
            {(() => {
              if (spot.avgStarRating && spot.avgStarRating > 0) {
                return Math.round(spot.avgStarRating * 10) / 10;
              } else {
                return "New";
              }
            })()}
            {(() => {
              if (spot.numReviews > 0) {
                return ` · ${spot.numReviews} ${spot.numReviews === 1 ? "Review" : "Reviews"}`;
              } else {
                return "";
              }
            })()}
          </h2>
        </div>
        <button onClick={() => alert("Feature coming soon")}>Reserve</button>
      </div>

   

      <div className="review-summary">
  <h2>
    ⭐
    {(() => {
       if (spot.avgStarRating && spot.avgStarRating > 0) {
        return Math.round(spot.avgStarRating * 10) / 10; 
      } else {
        return "New";
      }
    })()}
    {(() => {
      if (spot.numReviews > 0) {
        return ` · ${spot.numReviews} ${spot.numReviews === 1 ? "Review" : "Reviews"}`;
      } else {
        return "";
      }
    })()}
  </h2>
</div>
<div>
      {sessionUser && !isOwner && !hasReviewed && (
        <button onClick={() => setShowModal(true)}>Post Your Review</button>
      )}

      {showModal && (
        <div className="modal">
          <ReviewForm spotId={spot.id} closeModal={() => setShowModal(false)} />
        </div>
      )}
    </div>

    <div className="reviews">
    <h3>Reviews</h3>
    {isLoaded ? (
        reviews.length > 0 ? (
            reviews.map((review) => (
                <div key={review.id} className="review">
                    <h4>{review.User?.firstName} {review.User?.lastName}</h4>
                    <p>
                        {new Date(review.createdAt).toLocaleString('en-US', {
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                    <p><strong>{review.User?.username}:</strong> {review.review}</p>

                    {sessionUser && sessionUser.id === review.userId && (
                        <>
                            <button onClick={() => setReviewToDelete(review.id)}>Delete</button>
                            <button onClick={() => { setReviewToEdit(review.id); setUpdatedReview(review.review); }}>Edit</button>
                        </>
                    )}
                </div>
            ))
          ) : (
            sessionUser && !spot.isOwner && <p>Be the first to post a review!</p>
          )
        ) : (
          <p>Loading reviews...</p>
        )}
      </div>

      {/* Modal for confirming review deletion */}
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

export default SpotDetails;
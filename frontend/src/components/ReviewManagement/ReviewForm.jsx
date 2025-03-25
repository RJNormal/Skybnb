import { useState } from "react";
import { useDispatch } from "react-redux";
import { addReview } from "../../store/reviews.js";
import './ReviewForm.css'

const ReviewForm = ({ spotId, closeModal }) => {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newReview = { review, stars };
    const response = await dispatch(addReview(spotId, newReview));
    window.location.reload

    if (response?.errors) {
      setErrors(response.errors);
    } else {
      closeModal();
    }
  };

  const handleStarClick = (rating) => {
    setStars(rating);  
  };

  return (
    <div className="review-modal">
      <h2>How was your stay?</h2>
      {errors.length > 0 && <ul>{errors.map((err, i) => <li key={i}>{err}</li>)}</ul>}

      <textarea
        placeholder="Leave your review here..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((rating) => (
          <span
            key={rating}
            className={`star ${stars >= rating ? 'filled' : ''}`}
            onClick={() => handleStarClick(rating)}  
            role="button"
            aria-label={`Rate ${rating} stars`}
          >
            ★
          </span>
        ))}
      </div>

      <div className="button-group">
        <button 
          onClick={handleSubmit} 
          disabled={review.length < 10 || stars < 1}
        >
          Submit Your Review
        </button>

        <button 
          onClick={closeModal}  
          className="cancel-button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addReview } from "../../store/reviews,js";

const ReviewForm = ({ spotId, closeModal }) => {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newReview = { review, stars };
    const response = await dispatch(addReview(spotId, newReview));

    if (response?.errors) {
      setErrors(response.errors);
    } else {
      closeModal();
    }
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
      
      <label>
        Stars:
        <input
          type="number"
          min="1"
          max="5"
          value={stars}
          onChange={(e) => setStars(Number(e.target.value))}
        />
      </label>

      <button 
        onClick={handleSubmit} 
        disabled={review.length < 10 || stars < 1}
      >
        Submit Your Review
      </button>
    </div>
  );
};

export default ReviewForm;
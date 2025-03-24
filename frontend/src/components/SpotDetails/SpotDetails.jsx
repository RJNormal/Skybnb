import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ReviewForm from "../ReviewManagement/ReviewForm";
import './SpotDetails.css'


const SpotDetails = () => {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector(state => state.session.user);
  const userReviews = useSelector(state => state.reviews.userReviews);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    const fetchSpot = async () => {
      setIsLoaded(false); 
  
      try {
        const response = await fetch(`/api/spots/${spotId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch spot details"); 
        }
  
        const data = await response.json();
        setSpot(data); 
        console.log(data)
      } catch (err) {
        console.error("Error fetching spot:", err);
      }
  
      setIsLoaded(true); 
    };
  
    fetchSpot();
  }, [spotId]);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoaded(false); 

      try {
        const response = await fetch(`/api/spots/${spotId}/reviews`);
        if (!response.ok) {
          throw new Error("Failed to fetch review details"); 
        }

        const data = await response.json();
        console.log("Fetched data: ", data); 
        setReviews(data.Reviews); 

      } catch (err) {
        console.error("Error fetching reviews:", err);
      }

      setIsLoaded(true); 
    };

    fetchReviews();
}, [spotId]);

 

  if (!isLoaded) return <h2>Loading...</h2>;
  if (!spot || Object.keys(spot).length === 0) return <h2>Spot not found</h2>;
  
  const hasReviewed = userReviews.some(review => review.spotId === spot.id);
  const isOwner = sessionUser?.id === spot.ownerId;

  return (
    <div className="spot-details">
      <h1>{spot.name}</h1>
      <p>Location: {spot.city}, {spot.state}, {spot.country}</p>

      <div className="spot-images">
        <img src={spot.previewImage} alt={spot.name} className="large-image" />
        <div className="small-images">
          {spot.images?.slice(1, 5).map((img, index) => (
            <img key={index} src={img} alt={`Spot Image ${index + 1}`} />
          ))}
        </div>
      </div>

      <p>Hosted by {spot.owner?.firstName} {spot.owner?.lastName}</p>
      <p>{spot.description}</p>

      <div className="review-summary">
  <h2>
    ⭐
    {(() => {
      if (spot.avgStarRating && spot.avgStarRating > 0) {
        return spot.avgStarRating.toFixed(1);
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

<div className="reviews">
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
          <p>{review.review}</p>
        </div>
      ))
    ) : (
      <p>Be the first to post a review!</p>
    )
  ) : (
    <p>Loading reviews...</p>
  )}
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

      <div className="callout-box">
        <p><strong>${spot.price}</strong> / night</p>
        <button onClick={() => alert("Feature coming soon")}>Reserve</button>
      </div>

    </div>
  );
};

export default SpotDetails;
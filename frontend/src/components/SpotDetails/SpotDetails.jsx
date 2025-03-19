import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotDetails } from "../../store/spots";

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.spotDetails);
  const loggedInUser = useSelector((state) => state.session.user); 

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  if (!spot) return <h2>Loading...</h2>;

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

     
      <p>Hosted by {spot.owner.firstName} {spot.owner.lastName}</p>

     
      <p>{spot.description}</p>

      <div className="review-summary">
        <h2>⭐ {spot.avgRating ? spot.avgRating.toFixed(1) : "New"}
          {spot.reviewCount > 0 && ` · ${spot.reviewCount} ${spot.reviewCount === 1 ? "Review" : "Reviews"}`}
        </h2>
      </div>

      
      <div className="reviews">
        {spot.Reviews.length > 0 ? (
          spot.Reviews.map((review) => (
            <div key={review.id} className="review">
              <h4>{review.User.firstName}</h4>
              <p>{new Date(review.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })}</p>
              <p>{review.review}</p>
            </div>
          ))
        ) : (
          loggedInUser?.id !== spot.ownerId && <p>Be the first to post a review!</p>
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
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import { deleteSpot } from "../../store/spots"; // Import deleteSpot action
import DeleteModal from "../SpotManagement/DeleteModal"; // Import delete modal
import { useNavigate } from "react-router-dom";
import './SpotDetails.css'


const SpotDetails = () => {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector(state => state.session.user);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      } catch (err) {
        console.error("Error fetching spot:", err);
      }
  
      setIsLoaded(true); 
    };
  
    fetchSpot();
  }, [spotId]);

  const handleDelete = async () => {
    await dispatch(deleteSpot(spotId));
    setShowDeleteModal(false);
    navigate("/"); // Redirect after deletion
  };

  if (!isLoaded) return <h2>Loading...</h2>;
  if (!spot || Object.keys(spot).length === 0) return <h2>Spot not found</h2>;

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
        <h2>⭐ {spot.avgRating ? spot.avgRating.toFixed(1) : "New"}
          {spot.reviewCount > 0 && ` · ${spot.reviewCount} ${spot.reviewCount === 1 ? "Review" : "Reviews"}`}
        </h2>
      </div>

      <div className="reviews">
        {spot.Reviews?.length > 0 ? (
          spot.Reviews.map((review) => (
            <div key={review.id} className="review">
              <h4>{review.User?.firstName}</h4>
              <p>{new Date(review.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })}</p>
              <p>{review.review}</p>
            </div>
          ))
        ) : (
          <p>Be the first to post a review!</p>
        )}
      </div>

      <div className="callout-box">
        <p><strong>${spot.price}</strong> / night</p>
        <button onClick={() => alert("Feature coming soon")}>Reserve</button>
      </div>
      {/* DELETE BUTTON (Visible only to the spot owner) */}
      {sessionUser && spot.ownerId === sessionUser.id && (
        <button onClick={() => setShowDeleteModal(true)} className="delete-button">
          Delete Spot
        </button>
      )}

      {showDeleteModal && (
        <DeleteModal
          title="Confirm Delete"
          message="Are you sure you want to remove this spot?"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

   <button onClick={() => navigate(`/spots/${spot.id}/edit`)}>Update</button>
    </div>
  );
};

export default SpotDetails;
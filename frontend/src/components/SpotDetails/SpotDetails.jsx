import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotDetails } from "../../store/spots";

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.spotDetails);

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  if (!spot) return <h2>Loading...</h2>;

  return (
    <div className="spot-details">
      <h1>{spot.name}</h1>
      <p>Location: {spot.city}, {spot.state}, {spot.country}</p>

      {/* Display Images */}
      <div className="spot-images">
        <img src={spot.previewImage} alt={spot.name} className="large-image" />
        <div className="small-images">
          {spot.images?.slice(1, 5).map((img, index) => (
            <img key={index} src={img} alt={`Spot Image ${index + 1}`} />
          ))}
        </div>
      </div>

      {/* Host Information */}
      <p>Hosted by {spot.owner.firstName} {spot.owner.lastName}</p>

      {/* Spot Description */}
      <p>{spot.description}</p>

      {/* Callout Box */}
      <div className="callout-box">
        <p><strong>${spot.price}</strong> / night</p>
        <button onClick={() => alert("Feature coming soon")}>Reserve</button>
      </div>
    </div>
  );
};

export default SpotDetails;
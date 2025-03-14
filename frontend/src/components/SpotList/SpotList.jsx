import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots";
import { useNavigate } from "react-router-dom";
import "./SpotList.css";

const SpotsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector((state) => state.spots.allSpots || []);

  useEffect(() => {
    console.log("✅ SpotList component mounted!"); // Log when component loads
    dispatch(fetchSpots());
  }, [dispatch]);

  return (
    <div className="spots-grid">
      {spots.map((spot) => (
        <div 
          key={spot.id} 
          className="spot-tile"
          onClick={() => navigate.push(`/spots/${spot.id}`)}
          title={spot.name} 
        >
          <img src={spot.previewImage} alt={spot.name} className="spot-thumbnail" />
          <div className="spot-info">
            <p>{spot.city}, {spot.state}</p>
            <p className="spot-rating">{spot.avgRating === "New" ? "New" : `⭐ ${spot.avgRating}`}</p>
            <p className="spot-price">${spot.price} / night</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpotsList;


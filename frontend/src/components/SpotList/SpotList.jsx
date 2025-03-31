import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots";
import { useNavigate } from "react-router-dom";
import "./SpotList.css";

const SpotsList = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spots = useSelector((state) => state.spots.allSpots);
  
    useEffect(() => {
      dispatch(fetchSpots());
      console.log("Here are spots", spots);
    }, [dispatch]);
  
 
  
    if (!spots || spots.length === 0) {
      return <h2>No spots found. Try reloading.</h2>;
    }


 


  return (
    <div className="spots-grid">
      {spots.map((spot) => (
        <div 
          key={spot.id} 
          className="spot-tile"
          onClick={() => navigate(`/spots/${spot.id}`)}
          title={spot.name} 
        ><div className="spot-thumbnail">
        {spot.previewImage ? (
          <img src={spot.previewImage} alt="Spot image" />
        ) : (
          <p>No images available</p>
        )}
      </div>
          <div className="tooltip">{spot.name}</div>
          <div className="spot-info">
            <p>{spot.city}, {spot.state}</p>
            <p className="spot-rating">
            {spot.avgRating != null && !isNaN(spot.avgRating) ? `⭐ ${Math.round(spot.avgRating * 10) / 10}` : "New"}
            </p>
            <p className="spot-price">${spot.price} / night</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SpotsList;


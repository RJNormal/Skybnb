import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteSpot } from "../../store/spots"; 
import DeleteModal from "../SpotManagement/DeleteModal"; 
import './ManageSpots.css';
import { useModal } from "../../context/Modal";
import UpdateSpotFormModal from "./UpdateSpotForm";

const ManageSpots = () => {
  const [spots, setSpots] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector(state => state.session.user);
  const [selectedSpot, setSelectedSpot] = useState(null); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal(); 
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [spotData, setSpotData] = useState(null);  

  useEffect(() => {
    const fetchSpots = async () => {
      setIsLoaded(false); 

      if (!user || !user.id) {
        console.error("User not logged in or invalid user data.");
        return;
      }

      try {
        const response = await fetch(`/api/spots`);
        if (!response.ok) {
          throw new Error("Failed to fetch spots");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        const userSpots = data.Spots.filter(spot => spot.ownerId === user.id);
        setSpots(userSpots);
      } catch (err) {
        console.error("Error fetching spots:", err);
      }

      setIsLoaded(true);
    };

    fetchSpots();
  }, [user]); 

  if (!isLoaded) {
    return <p>Loading...</p>;
  }
  const openUpdateModal = (spot) => {
    setSpotData(spot);  
    setIsModalOpen(true);  
    
  };
  if (!spots.length) {
    return <p>You have no listed spots.</p>;
  }

  const openDeleteModal = (spot) => {
    setModalContent(
      <DeleteModal
        title="Confirm Delete"
        message={`Are you sure you want to remove "${spot.name}"?`}
        onConfirm={() => handleDelete(spot)}
        onCancel={closeModal}
      />
    );
  };

  const handleDelete = async () => {
    if (selectedSpot) {
      await dispatch(deleteSpot(selectedSpot.id));
      setSpots(spots.filter(s => s.id !== selectedSpot.id)); 
      setSelectedSpot(null);
      closeModal()
    }
  };

  return (
    <div> 
      <h1>Manage Your Spots</h1>
      
      <div className="spots-grid">
        {spots.map((spot) => (
          <div key={spot.id} className="spot-tile">
            <div onClick={() => navigate(`/spots/${spot.id}`)} title={spot.name}>
              <img src={spot.previewImage} alt={spot.name} className="spot-thumbnail" />
              <div className="spot-info">
                <p>{spot.city}, {spot.state}</p>
                <p className="spot-rating">
                {spot.avgRating != null && !isNaN(spot.avgRating) ? `⭐ ${Math.round(spot.avgRating * 10) / 10}` : "New"}
                </p>
                <p className="spot-price">${spot.price} / night</p>
              </div>
            </div>

    
            <button onClick={(e) => { 
              e.stopPropagation(); 
              setSelectedSpot(spot);
            }}>
              Manage
            </button>
          </div>
        ))}
      </div>

  
       {selectedSpot && (
        <div className="spot-controls">
          <h3>Managing: {selectedSpot.name}</h3>
          <button onClick={() => openUpdateModal(selectedSpot)}>Update Spot</button>
          <button onClick={() => openDeleteModal(selectedSpot)}>Delete Spot</button>
        </div>
      )}
 {isModalOpen && spotData && (
        <UpdateSpotFormModal spotData={spotData} closeModal={() => setIsModalOpen(false)} />
      )}
    

    </div>
  );
};

export default ManageSpots;
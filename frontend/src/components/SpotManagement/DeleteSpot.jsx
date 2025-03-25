import { useState,useDispatch } from "react";
import { deleteSpotAction } from "../../store/spots.js"; 
import DeleteModal from "./DeleteModal.jsx";

const DeleteSpot = ({ spots, user }) => {
  const dispatch = useDispatch();
  const [selectedSpot, setSelectedSpot] = useState(null);

  const handleDelete = async () => {
    await dispatch(deleteSpotAction(selectedSpot.id));
    setSelectedSpot(null); 
    window.location.reload();  
  };

  return (
    <div>
      {spots.map((spot) => (
        <div key={spot.id} className="spot-card">
          <h3>{spot.name}</h3>
          {spot.ownerId === user.id && (
            <button onClick={() => setSelectedSpot(spot)}>Delete</button>
          )}
        </div>
      ))}

      {selectedSpot && (
        <DeleteModal
          title="Confirm Delete"
          message="Are you sure you want to remove this spot?"
          onConfirm={handleDelete}
          onCancel={() => setSelectedSpot(null)}
        />
      )}
    </div>
  );
};

export default DeleteSpot;
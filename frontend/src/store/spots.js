import { csrfFetch } from "./csrf";

const SET_SPOTS = "spots/SET_SPOTS";

const setSpots = (spots) => ({
  type: SET_SPOTS,
  payload: spots,  
});

export const fetchSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/");
  const data = await response.json();
  dispatch(setSpots(data.Spots));
  return response;
  };

  export const fetchUserSpots = (sessionUser) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/`);
    const data = await response.json();
    console.log("Fetched spots data:", data); 
  
   
    const userSpots = data.Spots.filter(spot => spot.ownerId === sessionUser.id);
    console.log("Filtered user spots:", userSpots);
   
    dispatch(setSpots(userSpots));
    
    return response;
  }

  const SET_SPOT_DETAILS = "spots/SET_SPOT_DETAILS";

const setSpotDetails = (spot) => ({
  type: SET_SPOT_DETAILS,
  payload: spot,
});

export const fetchSpot = (spotId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/spots/${spotId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch spot details");
    }

    const data = await response.json();
    dispatch(setSpotDetails(data)); 
  } catch (err) {
    console.error("Error fetching spot:", err);
  }
};

export { setSpotDetails };



const CREATE_SPOT = "spots/CREATE_SPOT";


const createSpot = (spotData) => ({
  type: CREATE_SPOT,
  payload: spotData,
});


export const createSpotThunk = (spotData) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spotData),
  });

  if (response.ok) {
    const spot = await response.json();
    dispatch(createSpot(spot));
    return spot; 
  } else {
    console.error("Error creating spot");
  }
};

export { createSpot };



const DELETE_SPOT = "spots/DELETE_SPOT";

const deleteSpotAction = (spotId) => ({
  type: DELETE_SPOT,
  spotId,
});

export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(deleteSpotAction(spotId));
  }
};



let initialState = {
  byId: {}, 
  allSpots: [], 
};


export const spotsReducer = (state = initialState, action) => {
  let newState;

 


  switch (action.type) {
  case SET_SPOTS: {
      newState = { ...state };

      let spots = action.payload;

      
      newState.allSpots = spots;

      
      const newById = { ...newState.byId };
      for (let spot of spots) {
        newById[spot.id] = spot;
      }
      return newState;  

    }

    case SET_SPOT_DETAILS: {
      const newState = { ...state, [action.payload.id]: action.payload };
      return newState;
    }

    case CREATE_SPOT: {
      const newState = { ...state, [action.payload.id]: action.payload };
      return newState;
    }

    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState[action.spotId];
      return newState;
    }

    

    

    default:
      return state;
  }
};
    




  

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

const SET_SPOT_DETAILS = "spots/SET_SPOT_DETAILS";

const setSpotDetails = (spot) => ({
  type: SET_SPOT_DETAILS,
  spot,
});

export const fetchSpotDetails = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/`);
  const data = await response.json();
  dispatch(setSpotDetails(data));
};

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
    case SET_SPOTS:
 
      newState = { ...state };

      let spots = action.payload;

      
      newState.allSpots = spots;

      
      const newById = { ...newState.byId };
      for (let spot of spots) {
        newById[spot.id] = spot;
      }

  
      return newState;


    default:
      return state;
  }
};
    




  

import { csrfFetch } from "./csrf";

const SET_SPOTS = "spots/SET_SPOTS";

const setSpots = (spots) => ({
  type: SET_SPOTS,
  payload: spots,  
});

export const fetchSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
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
  const response = await csrfFetch(`/api/spots/${spotId}`);
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
    const newSpot = await response.json();
    dispatch(createSpot(newSpot));
    return newSpot;
  } else {

    throw new Error("Failed to Create Spot");
  }
};

export { createSpot };


let initialState = {
  byId: {}, 
  allSpots: [], 
  spotDetails: null, 
};


export const spotsReducer = (state = initialState, action) => {
  let newState;

  console.log("here is state!");
  console.log(state);

  switch (action.type) {
    case SET_SPOTS:
      console.log("State before action:", state);
      console.log("Action payload:", action.payload);
      newState = { ...state };

      let spots = action.payload;

      
      newState.allSpots = spots;

      
      const newById = { ...newState.byId };
      for (let spot of spots) {
        newById[spot.id] = spot;
      }

      console.log("here is new state with all spots:", newState);
      return newState;

    case SET_SPOT_DETAILS:
      console.log("Setting Spot Details with data:", action.payload);
      return {
        ...state,
        spotDetails: action.payload, 
      };

    default:
      return state;
  }
};
    




  

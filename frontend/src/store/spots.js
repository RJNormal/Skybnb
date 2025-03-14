const SET_SPOTS = "spots/SET_SPOTS";

const setSpots = (spots) => ({
  type: SET_SPOTS,
  payload: spots,  
});

export const fetchSpots = () => async (dispatch) => {
  const response = await fetch("/api/spots");
  if (response.ok) {
    const data = await response.json();
    dispatch(setSpots(data.Spots));  
  }
};

const SET_SPOT_DETAILS = "spots/SET_SPOT_DETAILS";

const setSpotDetails = (spot) => ({
  type: SET_SPOT_DETAILS,
  spot,
});

export const fetchSpotDetails = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`);

  if (response.ok) {
    const data = await response.json();
    dispatch(setSpotDetails(data));
  }
};

const initialState = {
    allSpots: [],
    spotDetails: null, 
  };
  
  export const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_SPOT_DETAILS:
        return { ...state, spotDetails: action.spot };
      default:
        return state;
    }
  };
    




  

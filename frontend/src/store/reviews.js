import { csrfFetch } from "./csrf";

const GET_USER_REVIEWS = "reviews/GET_USER_REVIEWS";

const getUserReviews = (reviews) => ({
  type: GET_USER_REVIEWS,
  payload: reviews,
});

export const fetchUserReviews = () => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/reviews/current");

    if (response.ok) {
      const data = await response.json();
      dispatch(getUserReviews(data.Reviews)); 
    } else {
      console.error("Failed to fetch user reviews.");
    }
  } catch (error) {
    console.error("Error fetching user reviews:", error);
  }
};



const ADD_REVIEW = "reviews/ADD_REVIEW";


export const addReview = (spotId, reviewData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  });

  if (response.ok) {
    const newReview = await response.json();
    dispatch({ type: ADD_REVIEW, payload: newReview });
  } else {
    const errors = await response.json();
    return errors;
  }
};

  
const DELETE_REVIEW = "reviews/DELETE_REVIEW";


export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`,
   { method: "DELETE", 
   headers: {
    'Content-Type': 'application/json',
   }
   });

  if (response.ok) {
    dispatch({ type: DELETE_REVIEW, payload: reviewId });
  }
};
const UPDATE_REVIEW = "reviews/UPDATE_REVIEW";

export const updateReview = (reviewId, reviewData) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  });

  if (response.ok) {
    const updatedReview = await response.json();
    console.log('Updated Review:', updatedReview);
    dispatch({ type: UPDATE_REVIEW, payload: updatedReview }); 
  }
};

  const initialState = { userReviews: [] };

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_REVIEWS:
      return { ...state, userReviews: action.payload };

      case DELETE_REVIEW:
        return {
          ...state,
          userReviews: state.userReviews.filter(review => review.id !== action.payload),
        };

        case ADD_REVIEW:
      return {
        ...state,
        userReviews: [action.payload, ...state.userReviews], 
      };

      case UPDATE_REVIEW:
        return {
          ...state,
          userReviews: state.userReviews.map(review =>
            review.id === action.payload.id ? action.payload : review
          ),
        };

      

    default:
      return state;
  }
};

export default reviewsReducer;
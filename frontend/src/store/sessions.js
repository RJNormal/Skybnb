import { csrfFetch } from "../store/csrf";


const SET_SESSION_USER = "session/setSessionUser";
const REMOVE_SESSION_USER = "session/removeSessionUser";


const setSessionUser = (user) => ({
  type: SET_SESSION_USER,
  payload: user,
});

const removeSessionUser = () => ({
  type: REMOVE_SESSION_USER,
});


export const login = (credential, password) => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({ credential, password }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setSessionUser(data.user));
    return data.user;
  } else {
    throw new Error("Failed to log in");
  }
};

export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password
      })
    });
    const data = await response.json();
    dispatch(setSessionUser(data.user));
    return response;
  };
  

  export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
      method: 'DELETE'
    });
    dispatch(removeSessionUser());
    return response;
  };
  


  const initialState = { user: null };



export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SESSION_USER:
      return { ...state, user: action.payload};
    case REMOVE_SESSION_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}

export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setSessionUser(data.user));
    return response;
}

export { removeSessionUser };
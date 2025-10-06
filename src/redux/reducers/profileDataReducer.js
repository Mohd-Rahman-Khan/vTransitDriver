import types from "../types";

const initialState = {
  profileData: {},
};

const profileDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.PROFILE_DATA:
      const data = action.payload;
      return {
        ...state,
        profileData: data,
      };

    default:
      return state;
  }
};

export default profileDataReducer;

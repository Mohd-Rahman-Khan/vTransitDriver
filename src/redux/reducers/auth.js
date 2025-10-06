import types from "../types";

const initialState = {
  userData: {},
};

const userData = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN:
      let data = action?.payload;

      return {
        ...state?.userData,
        userData: data,
      };
    default:
      return state;
  }
};

export default userData;

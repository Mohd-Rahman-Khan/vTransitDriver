import types from "../types";

const initialState = {
  appWelcomeData: true,
};

const welcomeReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.WELCOME:
      const data = action.payload;
      return {
        ...state,
        appWelcomeData: data,
      };

    default:
      return state;
  }
};

export default welcomeReducer;

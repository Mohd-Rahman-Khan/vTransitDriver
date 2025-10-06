import types from "../types";

const initialState = {
  closeDrawer: {},
};

const closeDrawerReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CLOSE_DRAWER:
      let data = action?.payload;
      return {
        ...state?.closeDrawer,
        closeDrawer: data,
      };
    default:
      return state;
  }
};

export default closeDrawerReducer;

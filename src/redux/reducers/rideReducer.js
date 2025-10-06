import types from "../types";

const initialState = {
  socketData: {},
};

const rideReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SOCKET:
      let data = action?.payload;
      return {
        ...state?.socketData,
        socketData: data,
      };
    default:
      return state;
  }
};

export default rideReducer;

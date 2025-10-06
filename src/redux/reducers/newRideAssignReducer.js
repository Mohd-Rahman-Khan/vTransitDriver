import types from '../types';

const initialState = {
  newRideData: {},
};

const newRideAssignReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.NEW_RIDE_ASSIGN:
      let data = action?.payload;
      return {
        ...state?.newRideData,
        newRideData: data,
      };
    default:
      return state;
  }
};

export default newRideAssignReducer;

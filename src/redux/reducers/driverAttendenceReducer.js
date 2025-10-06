import types from "../types";

const initialState = {
  driverAttendence: {},
};

const driverAttendenceReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.DRIVER_ATTENDENCE:
      let data = action?.payload;
      return {
        ...state?.driverAttendence,
        driverAttendence: data,
      };
    default:
      return state;
  }
};

export default driverAttendenceReducer;

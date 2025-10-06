import welcomeReducer from "./welcome";
import userData from "./auth";
import profileDataReducer from "./profileDataReducer";

import { combineReducers } from "redux";
import rideReducer from "./rideReducer";
import getEmployeeBoardedData from "./getEmployeeBoardedData";
import newRideAssignReducer from "./newRideAssignReducer";
import driverAttendenceReducer from "./driverAttendenceReducer";
import modulePermission from "./modulePermission";
import autoFetchOtpReducer from "./autoFetchOtpReducer";
import closeDrawerReducer from "./closeDrawerReducer";

const rootReducers = combineReducers({
  userData,
  welcomeReducer,
  profileDataReducer,
  rideReducer,
  getEmployeeBoardedData,
  newRideAssignReducer,
  driverAttendenceReducer,
  modulePermission,
  autoFetchOtpReducer,
  closeDrawerReducer,
});

export default rootReducers;

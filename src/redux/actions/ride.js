import types from "../types";
import store from "../store";
import {
  DRIVER_COMPLETE_RIDE,
  UPDATE_ONBOOARD_STATUS,
  UPDATE_ARRIVED_STATUS,
  EMPLOYEE_RATING,
  GET_RIDE_BY_ID,
  GET_VEHICLE_DEETAIL,
  MARK_EMP_AS_ABSENT,
  SAVE_SNAPSHOT,
  SUBMIT_SNAPSHOT,
  ADD_DIRECTION,
  SOS_SETTING,
  SEND_SOS,
  CALLING_API,
  UPDATE_DYNAMIC_ETA,
  STOPPAGE_HISTORY,
  SAVE_TRIP_LAT_LONG,
  GET_CONSENT_LIST,
  DRIVER_ATTENDENCE,
  GET_DRIVER_ATTENDENCE,
  OVER_SPEEDING,
  ADD_POLYLINE_DATA,
  YOUR_RIDE_DETAIL_POLYLINE,
  NEAR_TO_STOP_POINT_API,
  UPDATE_ACTUAL_DISTANCE,
  ROUTING_RULE,
  TRAVEL_TIME_VOILATION,
} from "../../config/urls";
import {
  apiPost,
  setUserData,
  removeUserData,
  apiGet,
} from "../../utils/utils";
import { showError, showSuccess } from "../../utils/helperFunction";
const { dispatch } = store;

export const completeTrip = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(DRIVER_COMPLETE_RIDE, data, {
      "Content-Type": "application/json",
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const sendRatingToEmployee = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(EMPLOYEE_RATING, data, {
      "Content-Type": "application/json",
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getVehicleDetail = (data) => {
  return new Promise((resolve, reject) => {
    apiGet(`${GET_VEHICLE_DEETAIL}${data}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const submitEmpAttandanceTime = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(UPDATE_ONBOOARD_STATUS, data, {
      "Content-Type": "application/json",
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateArrivedStatus = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(UPDATE_ARRIVED_STATUS, data, {
      "Content-Type": "application/json",
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const callNearToStopPointApi = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(NEAR_TO_STOP_POINT_API, data, {
      "Content-Type": "application/json",
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getRideById = (id) => {
  return new Promise((resolve, reject) => {
    apiGet(`${GET_RIDE_BY_ID}/${id}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const markEmployeeAsAbsent = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(MARK_EMP_AS_ABSENT, data, {
      "Content-Type": "application/json",
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getDirection = async (url) => {
  // return new Promise((resolve, reject) => {
  //   apiGet(url)
  //     .then((res) => {
  //       resolve(res);
  //     })
  //     .catch((error) => {
  //       reject(error);
  //     });
  // });
  try {
    const response = await fetch(url, {
      method: "GET", // or 'PUT'
      //body: JSON.stringify(data),
    });

    const result = await response.json();
    return new Promise((resolve, reject) => {
      if (result) {
        resolve(result);
      } else {
        reject("Location not found");
      }
    });
  } catch (error) {
    return new Promise((resolve, reject) => {
      reject(error);
    });
  }
};

export const saveSnapShotFile = (data, header = {}, requestType) => {
  return new Promise((resolve, reject) => {
    apiPost(SAVE_SNAPSHOT, data, header, requestType)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const submitSnapshot = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(SUBMIT_SNAPSHOT, data, { "Content-Type": "application/json" })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getBoardEmpDetail = (data) => {
  dispatch({
    type: types.BOARD_EMP,
    payload: data,
  });
};

export const saveAutoFetchOTP = (data) => {
  dispatch({
    type: types.AUTO_FETCH_OTP,
    payload: data,
  });
};

export const newRideAssign = (data) => {
  dispatch({
    type: types.NEW_RIDE_ASSIGN,
    payload: data,
  });
};

export const addDirection = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(ADD_DIRECTION, data, {
      "Content-Type": "application/json",
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {});
  });
};

export const getSOSSetting = () => {
  return new Promise((resolve, reject) => {
    apiGet(SOS_SETTING)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const sendSOS = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(SEND_SOS, data, {
      "Content-Type": "application/json",
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const callToEmp = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(CALLING_API, data, {
      "Content-Type": "application/json",
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateDynamicETA = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(UPDATE_DYNAMIC_ETA, data, {
      "Content-Type": "application/json",
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const stoppageHistory = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(STOPPAGE_HISTORY, data, {
      "Content-Type": "application/json",
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const saveTripLatLong = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(SAVE_TRIP_LAT_LONG, data, {
      "Content-Type": "application/json",
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getConsentList = () => {
  return new Promise((resolve, reject) => {
    apiGet(GET_CONSENT_LIST)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const driverAttendence = (data, params) => {
  return new Promise((resolve, reject) => {
    apiPost(`${DRIVER_ATTENDENCE}/${params}`, data, {
      "Content-Type": "application/json",
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getDriverAttendence = (fromDate, toDate) => {
  return new Promise((resolve, reject) => {
    apiGet(`${GET_DRIVER_ATTENDENCE}/${fromDate}/${toDate}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// export const callSpeedLimitApi = (data) => {
//   let apiUrl = `${OVER_SPEEDING}/${data}`;
//   return new Promise((resolve, reject) => {
//     apiGet(`${apiUrl}`)
//       .then((res) => {
//         resolve(res);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

export const callSpeedLimitApi = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(OVER_SPEEDING, data, {
      "Content-Type": "application/json",
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const addPolyLineData = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(`${ADD_POLYLINE_DATA}${data}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {});
  });
};

export const addActualDistance = (data) => {
  return new Promise((resolve, reject) => {
    let url = `${UPDATE_ACTUAL_DISTANCE}${data}`;
    apiGet(`${UPDATE_ACTUAL_DISTANCE}${data}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getRoutingRule = (data) => {
  return new Promise((resolve, reject) => {
    let url = `${ROUTING_RULE}/${data}`;
    apiGet(`${url}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const callTravelTimeVoilation = (data) => {
  return new Promise((resolve, reject) => {
    let url = `${TRAVEL_TIME_VOILATION}/${data}`;
    apiGet(`${url}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

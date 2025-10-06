import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import actions from "../redux/actions";
import store from "../redux/store";
import types from "../redux/types";
//import { fetch } from "react-native-ssl-pinning";
import { API_BASE_URL } from "../config/urls";
import { Platform } from "react-native";

const { dispatch, getState } = store;

export async function getHeaders() {
  let loginUser = await AsyncStorage.getItem("userData");

  if (loginUser) {
    loginUser = JSON.parse(loginUser);
    return {
      VTT_USER_SIGNATURE: `${loginUser?.data?.authToken}`,
    };
  }
  return null;
}

export async function apiReq(
  endPoint,
  data,
  method,
  headers,
  requestOptions = {},
  apiCallType
) {
  return new Promise(async (res, rej) => {
    const getTokenHeader = await getHeaders();
    headers = {
      ...getTokenHeader,
      ...headers,
      //"Content-Type": "application/json",
    };

    if (method === "get" || method === "delete") {
      data = {
        ...requestOptions,
        ...data,
        headers,
      };
    }

    axios[method](endPoint, data, { headers })
      .then((result) => {
        const { data } = result;

        if (data.status === false) {
          return rej(data);
        }

        return res(data);
      })
      .catch((error) => {
        if (error && error.response && error.response.status === 401) {
        }
        if (
          error &&
          error.response &&
          error.response.status === 511 &&
          error.response.message?.toUpperCase().trim() === "INVALID TOKEN"
        ) {
          return actions.logout();
        }
        if (error && error.response && error.response.data) {
          if (!error.response.data.message) {
            return rej({
              ...error.response.data,
              msg: error.response.data.message || "Network Error",
            });
          }
          return rej(error.response.data);
        } else {
          return rej({ message: "Network Error", msg: "Network Error" });
        }
        return rej(error);
      });
  });
}

export async function formDataApiReq(
  endPoint,
  data,
  method,
  headers,
  requestOptions = {},
  apiCallType
) {
  return new Promise(async (res, rej) => {
    const getTokenHeader = await getHeaders();
    headers = {
      ...getTokenHeader,
      ...headers,
      //"Content-Type": "application/json",
    };

    axios[method](endPoint, data, { headers })
      .then((result) => {
        const { data } = result;

        if (data.status === false) {
          return rej(data);
        }

        return res(data);
      })
      .catch((error) => {
        if (error && error.response && error.response.status === 401) {
        }
        if (
          error &&
          error.response &&
          error.response.status === 511 &&
          error.response.message?.toUpperCase().trim() === "INVALID TOKEN"
        ) {
          return actions.logout();
        }
        if (error && error.response && error.response.data) {
          if (!error.response.data.message) {
            return rej({
              ...error.response.data,
              msg: error.response.data.message || "Network Error",
            });
          }
          return rej(error.response.data);
        } else {
          return rej({ message: "Network Error", msg: "Network Error" });
        }
        return rej(error);
      });
  });
}

export function apiPost(
  endPoint,
  data = { data: "" },
  headers = {},
  requestType,
  apiCallType
) {
  if (requestType == "formData") {
    return formDataApiReq(endPoint, data, "post", headers, {}, apiCallType);
  } else {
    return apiReq(endPoint, data, "post", headers, {}, apiCallType);
  }
}

export function apiDelete(endPoint, data, headers = {}) {
  return apiReq(endPoint, data, "delete", headers);
}

export function apiGet(endPoint, data, headers = {}, requestOptions) {
  return apiReq(endPoint, data, "get", headers, requestOptions);
}

export function apiPut(endPoint, data, headers = {}, requestType) {
  if (requestType == "formData") {
    return formDataApiReq(endPoint, data, "put", headers);
  } else {
    return apiReq(endPoint, data, "put", headers);
  }
}
export const setUserData = (key, data) => {
  data = JSON.stringify(data);
  return AsyncStorage.setItem(key, data);
};

export const setItem = (key, data) => {
  data = JSON.stringify(data);
  return AsyncStorage.setItem(key, data);
};

export function getItem(key) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key).then((data) => {
      resolve(JSON.parse(data));
    });
  });
}

// remove user details function
export const removeUserData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {}
};

// get user details function
export const getUserData = async (key) => {
  try {
    const userData = await AsyncStorage.getItem(key);
    return userData != null ? JSON.parse(userData) : null;
  } catch (e) {}
};

export function clearAsyncStorate(key) {
  return AsyncStorage.clear();
}

export function findPercentage(partialValue, totalValue) {
  return (100 * partialValue) / totalValue;
}
export function getDelayOrEarlyMinutes(expectedTime, arrivalTime) {
  let expected = expectedTime;
  let arrival = arrivalTime;
  let secDiff = Math.floor((arrival - expected) / 1000);
  let minutesDiff = Math.floor(secDiff / 60);
  return minutesDiff;
}

export function calculateFileSize(sizeInBytes) {
  let sizeInMB = sizeInBytes / 1000000;

  if (sizeInMB < 2) {
    return false;
  }
  // else if (sizeInMB > 10) {
  //   return false;
  // }
  else {
    return true;
  }
}

export function getFileName(url) {
  let filename = url?.substring(url?.lastIndexOf("/") + 1);
  return filename;
}

export function getFileExtension(url) {
  const extension = url.split(".").pop();
  return extension;
}
export function getDistanceOfTwoPoints(
  driverCurrentCoordinate,
  ongoingRideData
) {
  let driverPoint = {
    lat: driverCurrentCoordinate?.latitude,
    lng: driverCurrentCoordinate?.longitude,
  };
  let stopPoint = {
    lat: ongoingRideData?.location?.latitude,
    lng: ongoingRideData?.location?.longitude,
  };

  var ky = 40000 / 360;
  var kx = Math.cos((Math.PI * stopPoint.lat) / 180.0) * ky;
  var dx = Math.abs(stopPoint.lng - driverPoint.lng) * kx;
  var dy = Math.abs(stopPoint.lat - driverPoint.lat) * ky;

  let distanceInKM = Math.sqrt(dx * dx + dy * dy);
  let distanceInMeter = distanceInKM * 1000;
  return distanceInMeter;
}

export function getDynamicEta(waypointsDynamicETA, wayPointsIds) {
  let stopPointETA = [];
  let timeInSec = 0;

  for (let arrIndex = 0; arrIndex < waypointsDynamicETA?.length; arrIndex++) {
    timeInSec = timeInSec + waypointsDynamicETA[arrIndex]?.duration?.value;
    let detail = {
      id: wayPointsIds[arrIndex],
      timeTaken: timeInSec,
    };
    stopPointETA.push(detail);
  }

  return stopPointETA;
}

export function addActualArrivalTimeInCurrentTime(dynamicETAInSeconds) {
  const today = new Date();
  let newTime = today.setSeconds(today.getSeconds() + dynamicETAInSeconds);

  return newTime;
}

export function getGreetings() {
  var today = new Date();
  var hourNow = today.getHours();
  //var hourNow = 24;

  var greeting;

  if (hourNow >= 6 && hourNow < 12) {
    greeting = "Good Morning";
  } else if (hourNow >= 12 && hourNow < 16) {
    greeting = "Good afternoon!";
  } else if (hourNow >= 16 && hourNow < 20) {
    greeting = "Good evening!";
  } else if (hourNow >= 20 || hourNow < 6) {
    greeting = "Good night";
  } else {
    greeting = "Welcome";
  }
  return greeting;
}

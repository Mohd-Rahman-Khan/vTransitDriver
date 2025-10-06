import types from "../types";
import store from "../store";
import {
  LOGIN,
  OTP,
  DRIVER_SELF_CONSENT,
  UPDATE_DRIVER_TRIP_STATUS,
  VERIFY_EMAIL_ADDRESS,
  VERIFY_MOBILE_NUMBER,
  GET_NOTIFICATION,
  LOGOUT,
  CHECK_DEVICE,
  VERIFY_ACCOUNT,
  DELETE_DRIVER_ACCOUNT,
  SAVE_DEVICE_DETAIL,
} from "../../config/urls";
import {
  apiPost,
  setUserData,
  removeUserData,
  apiGet,
} from "../../utils/utils";
import { showError, showSuccess } from "../../utils/helperFunction";

const { dispatch } = store;

// Save User Data  Details in local storage ====>>
export const saveUserData = (data) => {
  setUserData("userData", data);
  dispatch({
    type: types.LOGIN,
    payload: data,
  });
};

// login
export const login = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(LOGIN, data)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const otp = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(OTP, data)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getRide = (url) => {
  return new Promise((resolve, reject) => {
    apiGet(url)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const driverSelfConsent = (
  data,
  header = {},
  requestType,
  apiCallType
) => {
  return new Promise((resolve, reject) => {
    apiPost(DRIVER_SELF_CONSENT, data, header, requestType, apiCallType)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const driverAcceptRejectRide = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(UPDATE_DRIVER_TRIP_STATUS, data, {
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

export const logout = () => {
  removeUserData("userData");
  removeUserData("profileData");
  removeUserData("loginUserType");
  showSuccess("Logout successfully");
  dispatch({
    type: types.LOGOUT,
  });
  dispatch({
    type: types.PROFILE_DATA,
  });
};

export const verifyEmailAddress = (id) => {
  return new Promise((resolve, reject) => {
    apiGet(`${VERIFY_EMAIL_ADDRESS}${id}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const verifyMobileNumber = (id) => {
  return new Promise((resolve, reject) => {
    apiGet(`${VERIFY_MOBILE_NUMBER}${id}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteDriverAccount = (empId) => {
  return new Promise((resolve, reject) => {
    apiPost(`${DELETE_DRIVER_ACCOUNT}${empId}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// notification

export const getAllNotification = (id) => {
  return new Promise((resolve, reject) => {
    apiGet(GET_NOTIFICATION + id)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const logoutAccount = (id) => {
  return new Promise((resolve, reject) => {
    apiPost(LOGOUT + id)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const getDevice = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(CHECK_DEVICE, data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const verifyAccount = (id, type) => {
  let reqType = type == "mobile" ? "mobileNo" : "emailId";
  return new Promise((resolve, reject) => {
    apiGet(`${VERIFY_ACCOUNT}/${reqType}/${id}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const saveDeviceDetail = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(SAVE_DEVICE_DETAIL, data, {
      "Content-Type": "application/json",
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const corporateList = (url) => {
  return new Promise((resolve, reject) => {
    apiGet(url)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const vendorList = (url) => {
  return new Promise((resolve, reject) => {
    apiGet(url)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

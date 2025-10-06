import types from "../types";
import store from "../store";
import {
  GET_ALL_COMPLIOANCE,
  CREATE_DRIVER_COMPLIANCE,
  UPLOAD_COMPLIANCE_FILE,
  CREATE_VEHICLE_COMPLIANCE,
} from "../../config/urls";
import {
  apiPost,
  setUserData,
  removeUserData,
  apiGet,
} from "../../utils/utils";
import { showError, showSuccess } from "../../utils/helperFunction";
const { dispatch } = store;

export const getAllCompliances = (url) => {
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

export const createCompliance = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(CREATE_DRIVER_COMPLIANCE, data, {
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

export const createVehicleCompliance = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(CREATE_VEHICLE_COMPLIANCE, data, {
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

export const uploadFile = (data, header = {}, requestType, apiCallType) => {
  return new Promise((resolve, reject) => {
    apiPost(UPLOAD_COMPLIANCE_FILE, data, header, requestType, apiCallType)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

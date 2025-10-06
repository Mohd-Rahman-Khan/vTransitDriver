import types from "../types";
import store from "../store";
import {
  ADD_TOLLTAX_AND_PARKING,
  GET_TOLLTAX_AND_PARKING,
  SAVE_TOLLTAX_PARKING_FILE,
} from "../../config/urls";
import {
  apiPost,
  setUserData,
  removeUserData,
  apiGet,
} from "../../utils/utils";
import { showError, showSuccess } from "../../utils/helperFunction";
const { dispatch } = store;

export const submitTollTaxAndParking = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(ADD_TOLLTAX_AND_PARKING, data, {
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

export const getTollTaxAnndParking = () => {
  return new Promise((resolve, reject) => {
    apiGet(GET_TOLLTAX_AND_PARKING)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const uploadTollTaxParkingFile = (data, header = {}, requestType) => {
  return new Promise((resolve, reject) => {
    apiPost(SAVE_TOLLTAX_PARKING_FILE, data, header, requestType)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

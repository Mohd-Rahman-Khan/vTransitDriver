import types from "../types";
import store from "../store";
import { Add_FUEL, GET_FUEL_LIST, SAVE_FUEL_FILE } from "../../config/urls";
import {
  apiPost,
  setUserData,
  removeUserData,
  apiGet,
} from "../../utils/utils";
import { showError, showSuccess } from "../../utils/helperFunction";
const { dispatch } = store;

export const addFuel = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(Add_FUEL, data, { "Content-Type": "application/json" })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getFuelTrackingList = (data) => {
  return new Promise((resolve, reject) => {
    apiGet(`${GET_FUEL_LIST}/${data}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const saveFuelFile = (data, header = {}, requestType) => {
  return new Promise((resolve, reject) => {
    apiPost(SAVE_FUEL_FILE, data, header, requestType)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

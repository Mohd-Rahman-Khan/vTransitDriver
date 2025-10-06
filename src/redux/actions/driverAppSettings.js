import types from "../types";
import store from "../store";
import { DRIVER_APP_SETTING } from "../../config/urls";
import {
  apiPost,
  setUserData,
  removeUserData,
  apiGet,
} from "../../utils/utils";
import { showError, showSuccess } from "../../utils/helperFunction";
const { dispatch } = store;

export const getDriverAppSetting = (data) => {
  return new Promise((resolve, reject) => {
    apiGet(`${DRIVER_APP_SETTING}/${data}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

import types from "../types";
import store from "../store";
import { DRIVER_APP_SETTING, MODULE_PERMISSION } from "../../config/urls";
import {
  apiPost,
  setUserData,
  removeUserData,
  apiGet,
} from "../../utils/utils";
import { showError, showSuccess } from "../../utils/helperFunction";
const { dispatch } = store;

export const saveModulePermissionData = (data) => {
  dispatch({
    type: types.MODULE_PERMISSION,
    payload: data,
  });
};

export const getModulePermissionData = (id) => {
  return new Promise((resolve, reject) => {
    apiGet(`${MODULE_PERMISSION}/${id}/DRIVER`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

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

export const closeDrawer = (data) => {
  dispatch({
    type: types.CLOSE_DRAWER,
    payload: data,
  });
};

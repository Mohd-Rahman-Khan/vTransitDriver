import types from "../types";
import store from "../store";
import { GET_RATING_OVERVIEW } from "../../config/urls";
import {
  apiPost,
  setUserData,
  removeUserData,
  apiGet,
} from "../../utils/utils";
import { showError, showSuccess } from "../../utils/helperFunction";
const { dispatch } = store;

export const getRatingOvervieStatus = () => {
  return new Promise((resolve, reject) => {
    apiGet(GET_RATING_OVERVIEW)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

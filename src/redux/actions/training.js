import types from "../types";
import store from "../store";
import { TRAINING_VIDEOS_DRIVER, USER_GUIDE_DRIVER } from "../../config/urls";
import {
  apiPost,
  setUserData,
  removeUserData,
  apiGet,
} from "../../utils/utils";
import { showError, showSuccess } from "../../utils/helperFunction";
const { dispatch } = store;

export const trainingVideos = () => {
  return new Promise((resolve, reject) => {
    apiGet(TRAINING_VIDEOS_DRIVER)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const userGuide = () => {
  return new Promise((resolve, reject) => {
    apiGet(USER_GUIDE_DRIVER)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

import types from "../types";
import store from "../store";
import { STATIC_DATA_API } from "../../config/urls";
import {
  apiPost,
  setUserData,
  removeUserData,
  apiGet,
} from "../../utils/utils";
import { showError, showSuccess } from "../../utils/helperFunction";
const { dispatch } = store;

export const getStaticsData = (fromDate, toDate, apiCallType) => {
  return new Promise((resolve, reject) => {
    apiPost(
      `${STATIC_DATA_API}/${fromDate}/${toDate}`,
      {},
      {},
      null,
      apiCallType
    )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

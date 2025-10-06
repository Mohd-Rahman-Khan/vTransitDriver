import types from "../types";
import store from "../store";
import { apiGet, apiPost, apiPut, setUserData } from "../../utils/utils";
import {
  GET_DRIVER_DATA_By_Id,
  UPDATE_DRIVER_DATA,
  VERIFY_DRIVER_DATA,
  DELETE_DRIVER_ACCOUNT,
  GET_CHANGE_REQUEST,
  THEME_COLOR,
  CHANGE_CORPORATE,
} from "../../config/urls";
import axios from "axios";

const { dispatch } = store;

export const saveProfileData = (data) => {
  setUserData("profileData", data);
  dispatch({
    type: types.PROFILE_DATA,
    payload: data,
  });
};

export const getDriverDataById = async (data) => {
  let res = await apiGet(GET_DRIVER_DATA_By_Id + data);
  return res;
};

export const getDriverChangeReq = async (data) => {
  let res = await apiGet(GET_CHANGE_REQUEST + data);
  return res;
};

export const updateProfile = (data, header = {}, requestType) => {
  let res = apiPut(UPDATE_DRIVER_DATA, data, header, requestType);
  return res;
};

export const verifyProfile = (data, header = {}, requestType) => {
  let res = apiPost(VERIFY_DRIVER_DATA, data, header, requestType);
  return res;
};

export const deleteDriverAccount = (id) => {
  return new Promise((resolve, reject) => {
    apiPost(`${DELETE_DRIVER_ACCOUNT}${id}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const getTanantById = (id) => {
  return new Promise((resolve, reject) => {
    apiGet(THEME_COLOR + id)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const changeCorporate = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(`${CHANGE_CORPORATE}/${data}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

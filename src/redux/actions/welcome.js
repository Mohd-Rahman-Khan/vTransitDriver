import types from "../types";
import store from "../store";
import { setItem } from "../../utils/utils";

const { dispatch } = store;

export const welcome = (data) => {
  setItem("appWelcomeData", data);
  dispatch({
    type: types.WELCOME,
    payload: data,
  });
};

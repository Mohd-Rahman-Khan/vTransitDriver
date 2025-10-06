import types from "../types";

const initialState = {
  autoFetchOTP: {},
};

const autoFetchOtpReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.AUTO_FETCH_OTP:
      let data = action?.payload;
      return {
        ...state?.autoFetchOTP,
        autoFetchOTP: data,
      };
    default:
      return state;
  }
};

export default autoFetchOtpReducer;

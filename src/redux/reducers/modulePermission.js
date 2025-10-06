import types from "../types";

const initialState = {
  modulePermissionData: {},
};

const modulePermission = (state = initialState, action) => {
  switch (action.type) {
    case types.MODULE_PERMISSION:
      let data = action?.payload;
      return {
        ...state?.modulePermissionData,
        modulePermissionData: data,
      };
    default:
      return state;
  }
};

export default modulePermission;

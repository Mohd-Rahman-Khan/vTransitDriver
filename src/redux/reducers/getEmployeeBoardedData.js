import types from "../types";

const initialState = {
  boardEmpData: {},
};

const getEmployeeBoardedData = (state = initialState, action) => {
  switch (action.type) {
    case types.BOARD_EMP:
      let data = action?.payload;

      return {
        ...state?.boardEmpData,
        boardEmpData: data,
      };
    default:
      return state;
  }
};

export default getEmployeeBoardedData;

import React from "react";
import { VerifyAndUpdateFirst } from "../Screens/index";
import navigationStrings from "./navigationStrings";

const UpdateProfileStack = (Stack) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={navigationStrings.VERIFY_AND_UPDATE_FIRST}
        component={VerifyAndUpdateFirst}
      />
    </Stack.Navigator>
  );
};

export default UpdateProfileStack;

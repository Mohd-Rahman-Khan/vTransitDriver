import React from "react";
import { Login, Otp, WebViewScreen } from "../Screens/index";
import navigationStrings from "./navigationStrings";

const AuthStack = (Stack) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={navigationStrings.LOGIN} component={Login} />
      <Stack.Screen name={navigationStrings.OTP} component={Otp} />
      <Stack.Screen
        name={navigationStrings.WEBVIEW}
        component={WebViewScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;

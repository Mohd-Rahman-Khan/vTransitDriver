import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useSelector } from "react-redux";
import AuthStack from "./AuthStack";
import MainStack from "./MainStack";
import WelcomeStack from "./WelcomeStack";
import UpdateProfileStack from "./UpdateProfileStack";
import NavigationServices from "./NavigationServices";

const Stack = createStackNavigator();

const Routes = () => {
  const appWelcomeData = useSelector(
    (state) => state?.welcomeReducer?.appWelcomeData
  );
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );

  const userData = useSelector((state) => state?.userData?.userData);

  return (
    <NavigationContainer
      ref={(ref) => NavigationServices.setTopLevelNavigator(ref)}
    >
      {!!appWelcomeData
        ? WelcomeStack(Stack)
        : !!(userData != null && userData?.data?.authToken && !!profileData?.id)
        ? !!(profileData?.profileStatus === "DEFAULT")
          ? UpdateProfileStack(Stack)
          : MainStack(Stack)
        : AuthStack(Stack)}
    </NavigationContainer>
  );
};

export default Routes;

import { View, Text } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import navigationStrings from "./navigationStrings";
import {
  Home,
  VerifyAndUpdateSecond,
  LiveTracking,
  Settings,
  States,
  About,
  TrainingVideos,
  Support,
  TripTollTaxAndParking,
  FuelTracking,
  DriverAttendence,
} from "../Screens/index";
import CustomDrawerContent from "../Components/CustomDrawer";
import colors from "../styles/colors";

const Drawer = createDrawerNavigator();

const DrawerNav = () => {
  return (
    <>
      <Drawer.Navigator
        initialRouteName={navigationStrings.HOME}
        screenOptions={{ headerShown: false }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name={navigationStrings.HOME} component={Home} />

        <Drawer.Screen name={navigationStrings.SETTINGS} component={Settings} />
        <Drawer.Screen
          name={navigationStrings.VERIFY_AND_UPDATE_SECOND}
          component={VerifyAndUpdateSecond}
        />
        <Drawer.Screen
          name={navigationStrings.LIVE_TRACKING}
          component={LiveTracking}
        />

        <Drawer.Screen name={navigationStrings.STATES} component={States} />
        <Drawer.Screen name={navigationStrings.ABOUT} component={About} />
        <Drawer.Screen
          name={navigationStrings.TRAINING_VIDEOS}
          component={TrainingVideos}
        />
        <Drawer.Screen name={navigationStrings.SUPPORT} component={Support} />
        <Drawer.Screen
          name={navigationStrings.TRIP_TOLL_TAX_AND_PARKING}
          component={TripTollTaxAndParking}
        />
        <Drawer.Screen
          name={navigationStrings.FUELTRACKING}
          component={FuelTracking}
        />
        <Drawer.Screen
          name={navigationStrings.DRIVER_ATTENDENCE}
          component={DriverAttendence}
        />
      </Drawer.Navigator>
    </>
  );
};

export default DrawerNav;

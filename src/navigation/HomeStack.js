import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import {
  TripDetail,
  DriverSelfConcent,
  YourRides,
  Notifications,
  Compliance,
  RatingAndFeedback,
  WebViewScreen,
  FilteredRide,
  ChooseAnIssue,
  TollTaxAndParking,
  WriteToUs,
  SelectedIssue,
  TellUsAboutIt,
  SelectedSupportIssues,
  NextedSupportIssue,
  LearnMore,
  TicketListing,
  SupportTicketsDetail,
  AddFuel,
} from "../Screens";
import navigationStrings from "./navigationStrings";
import DrawerNav from "./DrawerNav";

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={navigationStrings.DRAWER_NAV}
    >
      <Stack.Screen name={navigationStrings.DRAWER_NAV} component={DrawerNav} />
      <Stack.Screen
        name={navigationStrings.DRIVER_SELF_CONCENT}
        component={DriverSelfConcent}
      />
      <Stack.Screen
        name={navigationStrings.TRIP_DETAIL}
        component={TripDetail}
      />
      <Stack.Screen name={navigationStrings.YOUR_RIDES} component={YourRides} />
      <Stack.Screen
        name={navigationStrings.NOTIFICATIONS}
        component={Notifications}
      />

      <Stack.Screen
        name={navigationStrings.COMPLIANCE}
        component={Compliance}
      />
      <Stack.Screen
        name={navigationStrings.RATING_AND_FEEDBACK}
        component={RatingAndFeedback}
      />
      <Stack.Screen
        name={navigationStrings.WEBVIEW}
        component={WebViewScreen}
      />
      <Stack.Screen
        name={navigationStrings.FILTERED_RIDE}
        component={FilteredRide}
      />
      <Stack.Screen
        name={navigationStrings.CHOOSE_AN_ISSUE}
        component={ChooseAnIssue}
      />
      <Stack.Screen
        name={navigationStrings.TOLL_TAX_AND_PARKING}
        component={TollTaxAndParking}
      />
      <Stack.Screen
        name={navigationStrings.WRITE_TO_US}
        component={WriteToUs}
      />
      <Stack.Screen
        name={navigationStrings.SELECTED_ISSUE}
        component={SelectedIssue}
      />
      <Stack.Screen
        name={navigationStrings.TELL_US_ABBOUT_IT}
        component={TellUsAboutIt}
      />
      <Stack.Screen
        name={navigationStrings.SELECTED_SUPPORT_ISSUE}
        component={SelectedSupportIssues}
      />
      <Stack.Screen
        name={navigationStrings.NEXT_SUPPORT_ISSUE}
        component={NextedSupportIssue}
      />
      <Stack.Screen name={navigationStrings.LEARN_MORE} component={LearnMore} />
      <Stack.Screen
        name={navigationStrings.TICKET_LISTING}
        component={TicketListing}
      />
      <Stack.Screen
        name={navigationStrings.SUPPORT_TICKETS_DETAILS}
        component={SupportTicketsDetail}
      />

      <Stack.Screen name={navigationStrings.ADD_FUEL} component={AddFuel} />
    </Stack.Navigator>
  );
};

export default HomeStack;

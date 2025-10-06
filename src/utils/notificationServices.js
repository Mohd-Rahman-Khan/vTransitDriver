import messaging from "@react-native-firebase/messaging";
import { getItem, setItem } from "./utils";
import navigationStrings from "../navigation/navigationStrings";
import { createNavigationContainerRef } from "@react-navigation/native";
import NavigationServices from "../navigation/NavigationServices";
import actions from "../redux/actions";

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFcmToken();
  }
}

const getFcmToken = async () => {
  let fcmToken = await getItem("fcmToken");
  console.log("fcmToken", fcmToken);

  if (!fcmToken) {
    try {
      const newFCMToken = await messaging().getToken();

      if (newFCMToken) {
        setItem("fcmToken", newFCMToken);
      }
    } catch (error) {}
  }
};

const navigationNotifyFun = (item) => {
  if (
    item?.notification?.title?.toUpperCase().trim() === "NEW DEVICE" ||
    item?.notification?.title?.toUpperCase().trim() === "DEACTIVATE ACCOUNT"
  ) {
    actions.logout();
  } else if (
    item?.notification?.title?.toUpperCase().trim() === "TRIP DETAILS"
  ) {
    NavigationServices.navigate(navigationStrings.YOUR_RIDES);
  } else if (
    item?.notification?.title?.toUpperCase().trim() === "TRIP STARTED"
  ) {
    NavigationServices.navigate(navigationStrings.LIVE_TRACKING);
  } else if (
    item?.notification?.title?.toUpperCase().trim() === "VERIFY AND UPDATE"
  ) {
    NavigationServices.navigate(navigationStrings.VERIFY_AND_UPDATE_SECOND);
  } else if (item?.notification?.title?.toUpperCase().trim() === "DOCUMENT") {
    NavigationServices.navigate(navigationStrings.COMPLIANCE);
  } else if (item?.notification?.title === "Trip Assign") {
    actions.newRideAssign(item?.notification?.title);
  } else if (item?.notification?.title === "Trip Start") {
    actions.newRideAssign(item?.notification?.title);
  } else if (item?.notification?.title === "Trip Details") {
    actions.newRideAssign(item?.notification?.body);
  }
};

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    setTimeout(() => {
      navigationNotifyFun(remoteMessage);
    }, 1000);
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        setTimeout(() => {
          navigationNotifyFun(remoteMessage);
        }, 1000);
      }
    });
};

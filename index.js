/**
 * @format
 */

import { AppRegistry, Text, TextInput } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import messaging from "@react-native-firebase/messaging";
import actions from "./src/redux/actions";
import Tts from "react-native-tts";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  // navigationNotifyFun(remoteMessage)
  if (remoteMessage?.notification?.title === "Voice Notification") {
    Tts.speak("Employee removed from the trip.");
  }
  if (
    remoteMessage?.notification?.title?.toUpperCase().trim() === "NEW DEVICE" ||
    remoteMessage?.notification?.title?.toUpperCase().trim() ===
      "DEACTIVATE ACCOUNT"
  ) {
    actions.logout();
  }
});
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
AppRegistry.registerComponent(appName, () => App);

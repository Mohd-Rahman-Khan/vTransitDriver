import {
  View,
  Text,
  TouchableOpacity,
  LogBox,
  Platform,
  ImageBackground,
  StyleSheet,
  Alert,
  Linking,
  PermissionsAndroid,
  BackHandler,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import Routes from "./src/navigation/Routes";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import { getItem, getUserData, removeUserData } from "./src/utils/utils";
import actions from "./src/redux/actions";
import FlashMessage from "react-native-flash-message";
import SplashScreen from "react-native-splash-screen";
import socketServices from "./src/utils/socketServices";
import ForegroundHandler from "./src/utils/ForegroundHandler";
import { moderateScaleVertical, height } from "./src/styles/responsiveSize";
import {
  requestUserPermission,
  notificationListener,
} from "./src/utils/notificationServices";
// import {
//   hideFloatingBubble,
//   checkPermission,
// } from "react-native-floating-bubble";
import VersionCheck from "react-native-version-check";
import colors from "./src/styles/colors";
import DeviceInfo from "react-native-device-info";
import { version } from "./package.json";
import { BatteryOptEnabled } from "react-native-battery-optimization-check";
import JailMonkey from "jail-monkey";
import AlertForKillApp from "./src/Components/AlertForKillApp";
import NetInfo from "@react-native-community/netinfo";

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();
console.log = console.warn = console.error = () => {};

const App = () => {
  const [isDeviceRooted, setisDeviceRooted] = useState(false);
  let [netInfo, setNetInfo] = useState(true);
  useEffect(() => {
    socketServices.initializeSocket();
    setTimeout(() => {
      SplashScreen?.hide();
    }, 500);
    requestUserPermission();
    notificationListener();
    getItem("appWelcomeData").then((res) => {
      if (res != null) {
        actions.welcome(res);
      }
    });
    getUserData("userData").then((res) => {
      actions.saveUserData(res);
      if (res) {
        _getAppThemeFun(res?.data?.tanentId);
        sendDeviceDetail();
      }
    });
    getUserData("profileData").then((res) => {
      actions.saveProfileData(res);
    });
  }, []);

  // useEffect(() => {
  //   if (Platform.OS === "android") {
  //     return () => {
  //       hideFloatingBubble()
  //         .then(() => {})
  //         .catch(() => {});
  //     };
  //   }
  // }, []);

  useEffect(() => {
    if (JailMonkey.isJailBroken()) {
      // Alternative behaviour for jail-broken/rooted devices.
      setisDeviceRooted(true);
    } else {
      //console.log("jailMonkey", "else");
      setisDeviceRooted(false);
    }
  }, []);

  const sendDeviceDetail = async () => {
    if (Platform.OS == "android") {
      const backgroundgranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: "vTransit",
          message:
            "ETavelmate want to access your background location to get your current position.",
          buttonNeutral: "Ok",
        }
      );
      let data = {
        ipAddress: await DeviceInfo.getIpAddress().then((ip) => {
          return ip;
        }),
        deviceType: "mobile",
        deviceName: await DeviceInfo.getDeviceName().then((deviceName) => {
          return deviceName;
        }),
        oS: Platform?.OS,
        activeStatus: "YES",
        appVersion: version,
        osVersion:
          Platform?.OS == "android"
            ? Platform.constants["Release"]
            : Platform.constants["osVersion"],
        locationPermission:
          backgroundgranted == "granted" ? "granted" : "denied",
        // displayOverOtherApp: await checkPermission().then((value) => {
        //   return value;
        // }),
        displayOverOtherApp: false,
        batteryOptimisationStatus: await BatteryOptEnabled().then(
          (isEnabled) => {
            return isEnabled;
          }
        ),
      };

      actions
        .saveDeviceDetail(data)
        .then((res) => {})
        .catch((error) => {});
    } else {
      let data = {
        ipAddress: await DeviceInfo.getIpAddress().then((ip) => {
          return ip;
        }),
        deviceType: "mobile",
        deviceName: await DeviceInfo.getDeviceName().then((deviceName) => {
          return deviceName;
        }),
        oS: Platform?.OS,
        activeStatus: "YES",
        appVersion: version,
        osVersion:
          Platform?.OS == "android"
            ? Platform.constants["Release"]
            : Platform.constants["osVersion"],
        locationPermission: "granted",
        displayOverOtherApp: null,
        batteryOptimisationStatus: null,
      };

      actions
        .saveDeviceDetail(data)
        .then((res) => {})
        .catch((error) => {});
    }
  };

  useEffect(() => {
    checkUpdate();
  }, []);

  useEffect(() => {
    const netListner = NetInfo.addEventListener((netstate) =>
      setNetInfo(netstate.isConnected)
    );
  }, []);

  const _getAppThemeFun = (id) => {
    actions
      .getTanantById(id)
      .then((res) => {
        let { status } = res;

        if (status == 200) {
          if (res?.data?.theme) {
            colors.statusBarColor = res?.data?.theme?.bgColor;
            colors.themeColor = res?.data?.theme?.bgColor;
            colors.darkBlue = res?.data?.theme?.bgColor;
            colors.homeBg = res?.data?.theme?.bgColor;
          }
        } else {
        }
      })
      .catch((error) => {});
  };

  const checkUpdate = () => {
    if (Platform.OS === "android") {
      VersionCheck.needUpdate().then(async (res) => {
        if (res?.isNeeded) {
          Alert.alert("New update is available.Please update app.", "", [
            {
              text: "Later",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "Update",
              onPress: () => {
                Linking.openURL(res?.storeUrl);
              },
            },
          ]);
        } else {
        }
      });
    } else {
      VersionCheck.needUpdate().then(async (res) => {
        if (res?.currentVersion === res?.latestVersion) {
        } else {
          Alert.alert("New update is available.Please update app.", "", [
            {
              text: "Later",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "Update",
              onPress: () => {
                Linking.openURL(res?.storeUrl);
              },
            },
          ]);
        }
      });
    }
  };

  const closeModalCallBack = useCallback(() => {
    //setisDeviceRooted(false);
    BackHandler.exitApp();
  }, []);

  return (
    <SafeAreaProvider>
      {isDeviceRooted ? (
        <AlertForKillApp
          isVisible={isDeviceRooted}
          closeModal={closeModalCallBack}
        />
      ) : (
        <>
          {!netInfo ? (
            <SafeAreaView>
              <View
                style={{
                  height: 40,
                  backgroundColor: colors.redColor,
                  width: "100%",
                  justifyContent: "center",
                  paddingHorizontal: 10,
                }}
              >
                <Text style={{ color: colors.white, fontSize: 14 }}>
                  Network Issue Please connect with the network...
                </Text>
              </View>
            </SafeAreaView>
          ) : null}

          <FlashMessage position="top" />
          <ForegroundHandler />
          <Provider store={store}>
            <Routes />
          </Provider>
        </>
      )}
    </SafeAreaProvider>
  );
};

export default App;

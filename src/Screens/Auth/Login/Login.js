import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Text,
  PermissionsAndroid,
  Linking,
  Platform,
  Alert,
} from "react-native";
import WrapperContainer from "../../../Components/WrapperContainer";
import imagePath from "../../../constants/imagePath";
import navigationStrings from "../../../navigation/navigationStrings";
import actions from "../../../redux/actions";
import colors from "../../../styles/colors";
import {
  height,
  moderateScale,
  moderateScaleVertical,
} from "../../../styles/responsiveSize";
import { showError, showSuccess } from "../../../utils/helperFunction";
import LoginModal from "./LoginModal";
import { styles } from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import strings from "../../../constants/lang";
import Geolocation from "@react-native-community/geolocation";
import {
  requestUserPermission,
  notificationListener,
} from "../../../utils/notificationServices";
import BackgroundLocationPermModal from "../../../Components/BackgroundLocationPermModal";
import Permissions, {
  PERMISSIONS,
  RESULTS,
  check,
} from "react-native-permissions";
import {
  getHash,
  startOtpListener,
  useOtpVerify,
  removeListener,
} from "react-native-otp-verify";
import { useSelector } from "react-redux";

const Login = () => {
  const navigation = useNavigation();
  const [emailMobile, setEmailMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [countryFlag, setCountryFlag] = useState("IN");
  const [isNum, setIsNum] = useState(true);
  const [emailForApple, setEmailForApple] = useState("");
  const [loginType, setloginType] = useState("");
  const [showLocationPopup, setshowLocationPopup] = useState(false);
  const autoFetchOTP = useSelector(
    (state) => state?.autoFetchOtpReducer?.autoFetchOTP
  );

  // useEffect(() => {
  //   console.log("autoFetchOTP", autoFetchOTP);
  // }, [autoFetchOTP]);

  useEffect(() => {
    if (Platform.OS === "android") {
      requestUserPermission();
      notificationListener();
      checkBackgroundLocation();
    } else {
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === "ios") {
      getFineLocationPerm();
      getCorsLocation();
    }
  }, []);

  useEffect(() => {
    getHash()
      .then((hash) => {
        //alert(hash);
      })
      .catch(console.log);

    startOtpListener((message) => {
      // extract the otp using regex e.g. the below regex extracts 4 digit otp from message
      //const otp = /(\d{4})/g.exec(message)[1];
      //setOtp(otp);

      let match = message.match(/\b\d{6}\b/);
      let otp = match && match[0];
      //alert(otp);
      actions.saveAutoFetchOTP(otp);
    });
    return () => removeListener();
  }, []);

  const checkBackgroundLocation = async () => {
    let splitOSVersion = Platform.constants["Release"].split(".");
    if (splitOSVersion[0] < 10) {
      getFineLocationPerm();
      getCorsLocation();
    } else {
      const backgroundgranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: "vTransit",
          message:
            "The vTransit app collects location data to facilitate the identification of nearby locations even when the app is closed or not in use.",
          buttonNeutral: "Ok",
        }
      );

      if (backgroundgranted === PermissionsAndroid.RESULTS.GRANTED) {
        setshowLocationPopup(false);
      } else {
        setshowLocationPopup(true);
      }
    }
  };

  const checkIsPermissionAllow = async () => {
    if (!isAgree) {
      return showError(strings?.AGREE_TERMS_AND_PRIVACY_POLICY);
    }
    if (emailMobile === "") {
      showError("Please enter email or mobile number");
    } else {
      if (Platform.OS === "android") {
        let splitOSVersion = Platform.constants["Release"].split(".");
        if (splitOSVersion[0] < 10) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "vTransit",
              message:
                "This app want your current location latlong to get your exact location",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            _handleLoginBtn();
          } else {
            getFineLocationPerm();
            getCorsLocation();
          }
        } else {
          const backgroundgranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
              title: "vTransit",
              message:
                "The vTransit app collects location data to facilitate the identification of nearby locations even when the app is closed or not in use.",
              buttonNeutral: "Ok",
            }
          );

          if (backgroundgranted === PermissionsAndroid.RESULTS.GRANTED) {
            _handleLoginBtn();
          } else {
            setshowLocationPopup(true);
          }
        }
      } else {
        const permissionStatus = await Permissions.check(
          PERMISSIONS.IOS.LOCATION_ALWAYS
        );
        if (permissionStatus === "granted") {
          _handleLoginBtn();
        } else {
          setshowLocationPopup(true);
        }
      }
    }
  };

  const getFineLocationPerm = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "vTransit",
            message:
              "This app want your current location latlong to get your exact location",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        } else {
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      Geolocation.getCurrentPosition(
        (position) => {},
        (error) => {},
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  };

  const getCorsLocation = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          {
            title: "vTransit",
            message:
              "This app want your current location latlong to get your exact location",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        } else {
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const _handleLoginBtn = async () => {
    if (!isAgree) {
      return showError(strings?.AGREE_TERMS_AND_PRIVACY_POLICY);
    }
    if (emailMobile === "") {
      showError("Please enter email or mobile number");
    } else {
      let apiData = {
        loginId: emailMobile,
      };

      if (Platform.OS == "android") {
        let splitOSVersion = Platform.constants["Release"].split(".");
        if (splitOSVersion[0] > 12) {
          check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
            .then((result) => {
              if (result == "granted") {
                callLoginApi(apiData);
              } else {
                Alert.alert(
                  `Notification setting is disable.Please allow notification setting.`,
                  "",
                  [
                    {
                      text: "No",
                      onPress: () => {},
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => {
                        Linking.openSettings();
                      },
                    },
                  ]
                );
              }
            })
            .catch((error) => {
              callLoginApi(apiData);
            });
        } else {
          callLoginApi(apiData);
        }
      } else {
        callLoginApi(apiData);
      }
    }
  };

  const callLoginApi = (apiData) => {
    setLoading(true);
    actions
      .login(apiData)
      .then((res) => {
        let { status } = res;
        if (status === 200) {
          setLoading(false);

          if (res.data.userRole === "DRIVER") {
            var loginUserType;

            if (loginType === "email") {
              loginUserType = {
                type: loginType,
                loginId: emailMobile,
                email: emailMobile,
                mobbileNum: "",
              };
            } else {
              loginUserType = {
                type: loginType,
                loginId: emailMobile,
                email: "",
                mobbileNum: emailMobile,
              };
            }
            AsyncStorage.setItem(
              "loginUserType",
              JSON.stringify(loginUserType)
            );
            navigation.navigate(navigationStrings.OTP, {
              userId: res?.data?.id,
              profileId: res?.data?.profileId,
              emailMobile: emailMobile,
            });
          } else {
            showError("Driver account is not found");
          }
        } else {
          setLoading(false);
          showError(res?.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        showError(err?.message ? err?.message : "Network error");
        //showError("Enter correct credential");
      });
  };

  const isAgreeFun = () => {
    setIsAgree(!isAgree);
  };

  return (
    <WrapperContainer isLoading={loading} withModal={loading}>
      {showLocationPopup ? (
        <BackgroundLocationPermModal
          goToSettint={() => {
            Linking.openSettings();
            setshowLocationPopup(false);
          }}
          showModal={showLocationPopup}
          closeModal={() => {
            setshowLocationPopup(false);
          }}
        />
      ) : null}

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "android" ? "height" : "padding"}
          style={styles.keyboardAvoidViewContainer}
        >
          <View style={styles.loginCard}>
            <LoginModal
              navigation={navigation}
              googleLogin={() => {}}
              microsoftLogin={() => {}}
              appleLogin={() => {}}
              btnStyle={
                isAgree
                  ? {
                      paddingVertical: moderateScaleVertical(10),
                      borderRadius: moderateScale(4),
                      justifyContent: "center",
                      alignItems: "center",
                      //marginBottom: moderateScaleVertical(50),
                      backgroundColor: colors.darkBlue,
                    }
                  : styles.desaibleBtnStyle
              }
              btnTextStyle={styles.btnTextStyle}
              loginId={emailMobile}
              _handleLoginBtn={() => {
                if (Platform.OS === "android") {
                  // if (Platform.constants["Release"] < 10) {
                  //   showError("Android version 11 is required.");
                  // } else {
                  //   checkIsPermissionAllow();
                  // }
                  checkIsPermissionAllow();
                } else {
                  _handleLoginBtn();
                }
              }}
              _onChangeText={(text) => {
                if (!isNaN(text)) {
                  setloginType("mobileNumber");
                  setIsNum(true);
                } else {
                  setloginType("email");
                  setIsNum(false);
                }
                setEmailMobile(text);
              }}
              isAgree={isAgree}
              isAgreeFun={isAgreeFun}
              countryFlag={countryFlag}
              countryCode={countryCode}
              isNum={isNum}
              setCountryCode={setCountryCode}
              setCountryFlag={setCountryFlag}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </WrapperContainer>
  );
};

export default Login;

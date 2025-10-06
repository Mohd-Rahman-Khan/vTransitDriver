import { useNavigation, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
  PermissionsAndroid,
} from "react-native";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";
import ButtonComp from "../../../Components/ButtonComp";
import HeaderComp from "../../../Components/HeaderComp";
import WrapperContainer from "../../../Components/WrapperContainer";
import strings from "../../../constants/lang";
import actions from "../../../redux/actions";
import { saveUserData } from "../../../redux/actions/auth";
import { saveProfileData } from "../../../redux/actions/profileData";
import colors from "../../../styles/colors";
import { showError, showSuccess } from "../../../utils/helperFunction";
import { styles } from "./styles";
import socketServices from "../../../utils/socketServices";
import { ScrollView } from "react-native-gesture-handler";
import { getItem } from "../../../utils/utils";
import DeviceInfo from "react-native-device-info";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../../styles/responsiveSize";
import fontFamily from "../../../styles/fontFamily";
import { version } from "../../../../package.json";
//import { checkPermission } from "react-native-floating-bubble";
import { BatteryOptEnabled } from "react-native-battery-optimization-check";
import {
  getHash,
  startOtpListener,
  useOtpVerify,
  removeListener,
} from "react-native-otp-verify";
import { useSelector } from "react-redux";

const Otp = ({ route }) => {
  const navigation = useNavigation();
  const [code, setCode] = useState();
  const [count, setCount] = useState(30);
  const [isMounted, setIsMounted] = useState(false);
  const [resendBtn, setResendBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deviceToken, setDeviceToken] = useState("");
  const [deviceLogoutConf, setDeviceLogoutConf] = useState(false);
  const [isLoginData, setIsLoginData] = useState({});
  const userId = route?.params?.userId;
  const profileId = route?.params?.profileId;
  const isFocus = useIsFocused();
  const autoFetchOTP = useSelector(
    (state) => state?.autoFetchOtpReducer?.autoFetchOTP
  );

  useEffect(() => {
    if (autoFetchOTP?.length > 0) {
      setCode(autoFetchOTP);
      checkOTP(autoFetchOTP);
    }
  }, [autoFetchOTP]);
  useEffect(() => {
    setIsMounted(true);
    if ((isMounted, isFocus)) {
      //getCount();
      if (count > 0) {
        setResendBtn(true);
        var timer = setTimeout(() => {
          setCount(count - 1);
        }, 1000);
      } else {
        setResendBtn(false);
      }

      return () => {
        setIsMounted(false);
        clearInterval(timer);
      };
    }
  }, [count, isFocus]);

  useEffect(() => {
    _getDevice();
  }, []);

  // useEffect(() => {
  //   getHash()
  //     .then((hash) => {})
  //     .catch(console.log);

  //   startOtpListener((message) => {
  //     // extract the otp using regex e.g. the below regex extracts 4 digit otp from message
  //     //const otp = /(\d{4})/g.exec(message)[1];
  //     //setOtp(otp);

  //     let match = message.match(/\b\d{6}\b/);
  //     let otp = match && match[0];
  //     //alert(otp);
  //     setCode(otp);
  //   });
  //   return () => removeListener();
  // }, []);

  const _getDevice = async () => {
    let data = {
      mobileNo: route?.params?.emailMobile,
    };
    actions
      .getDevice(data)
      .then((res) => {
        let { status } = res;
        if (status == 200) {
          setIsLoginData(res?.data);
        } else {
        }
      })
      .catch((error) => {});
  };

  const getCount = () => {
    if (count > 0) {
      setResendBtn(true);
      setTimeout(() => {
        setCount(count - 1);
      }, 1000);
    } else {
      setResendBtn(false);
    }
  };

  const checkOTP = async (otpCode = "") => {
    setLoading(true);
    setDeviceLogoutConf(false);
    if (!code && !otpCode) {
      return showError("Please Enter OTP");
    }

    let apiData = {
      userId: userId,
      otp: otpCode === "" ? code : otpCode,
      deviceToken: "",
    };

    actions
      .otp(apiData)
      .then((res) => {
        setLoading(false);
        let { status } = res;
        if (status == 200) {
          if (isLoginData?.isLoggedIn?.toUpperCase().trim() == "TRUE") {
            setTimeout(() => {
              setDeviceLogoutConf(true);
            }, 1000);
          } else {
            _verifyOtp(otpCode);
          }
        } else {
          setLoading(false);
          showError("Please enter correct OTP");
        }
      })
      .catch((err) => {
        showError("Enter correct credential");
        setLoading(false);
      });
  };

  const _verifyOtp = async (otpCode = "") => {
    setDeviceLogoutConf(false);
    if (!code && !otpCode) {
      return showError("Please Enter OTP");
    }

    let fcmToken = await getItem("fcmToken");
    let apiData = {
      userId: userId,
      otp: otpCode === "" ? code : otpCode,
      deviceToken: fcmToken,
      ipAddress: await DeviceInfo.getIpAddress().then((ip) => {
        return ip;
      }),
      deviceType: "mobile",
    };

    actions
      .otp(apiData)
      .then((res) => {
        console.log("OPTData", res);
        let { status } = res;
        if (status == 200) {
          setLoading(false);
          saveUserData(res);

          actions
            .getDriverDataById(res?.data?.profileId)
            .then((response) => {
              let { status } = response;
              if (status == 200) {
                setLoading(false);
                socketServices.initializeSocket();

                saveProfileData(response?.data);
                socketServices.emit("add-user", res?.data?.profileId);

                showSuccess("Login Successfully");
                saveDeviceDetail();
                changeAppTheme(response?.data);
                sendDeviceDetail();
              } else {
                setLoading(false);
                showError("Something went wrong");
              }
            })
            .catch((error) => {
              setLoading(false);
              showError("Something went wrong");
            });
        } else {
          setLoading(false);
          showError("Please enter correct OTP");
        }
      })
      .catch((err) => {
        console.log("OPTData", err);
        showError("Enter correct credential");
        setLoading(false);
      });
  };

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

  const changeAppTheme = (data) => {
    actions
      .getTanantById(data?.tenantId)
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

  const saveDeviceDetail = async () => {
    let data;

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
      data = {
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
    } else {
      data = {
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
    }

    actions
      .saveDeviceDetail(data)
      .then((res) => {})
      .catch((error) => {});
  };

  return (
    <WrapperContainer isLoading={loading} withModal={loading}>
      <Modal visible={deviceLogoutConf} animationType="fade" transparent={true}>
        <TouchableWithoutFeedback
          onPress={() => {
            setDeviceLogoutConf(false);
            setCode("");
          }}
          style={styles.logoutPopupContainer}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalInsideContainer}
            >
              <View style={styles.logoutConfirmationContainer}>
                <Text style={styles.confirmationTextStyle}>
                  {strings.LOGOUT_CONFERMATION}
                </Text>
              </View>

              <View style={styles.logoutConfirmationButtonContainer}>
                <ButtonComp
                  btnText={strings.NO}
                  btnStyle={styles.desaibleCancleBtnStyle}
                  btnTextStyle={styles.desaibleCancleBtnTextStyle}
                  onPress={() => {
                    setDeviceLogoutConf(false);
                    setCode("");
                  }}
                />
                <ButtonComp
                  disabled={false}
                  btnText={strings.YES}
                  btnStyle={styles.submitBtnStyle}
                  btnTextStyle={styles.submitBtnTextStyle}
                  onPress={() => {
                    _verifyOtp(code);
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View style={styles.OtpMainContainer}>
        <HeaderComp
          title={strings.MOBILE_VERIFICATION}
          description={strings.ENTER_YOUR_OTP_CODE}
          icon={true}
          loginBgImgStyle={styles.loginBgImgStyle}
        />
        <ScrollView style={styles.formContainer}>
          <View style={styles.inputFieldContainer}>
            <SmoothPinCodeInput
              cellStyle={styles.cellStyle}
              textStyle={styles.textStyle}
              value={code}
              codeLength={6}
              cellStyleFocused={{
                borderColor: colors.darkBlue,
              }}
              autoFocus={true}
              onTextChange={(code) => {
                setCode(code);
                if (code.length === 6) {
                  checkOTP(code);
                } else {
                }
              }}
              keyboardType={"phone-pad"}
              onBackspace={() => {}}
            />
            <Text style={styles.resendOtpBtnText}>
              0:{count < 10 ? 0 : null}
              {count}
            </Text>
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "android" ? "height" : "padding"}
            contentContainerStyle={{}}
          >
            <View style={styles.bottomView}>
              <View style={styles.resendOtpBtnContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setCount(30)}
                  disabled={resendBtn}
                >
                  <Text
                    style={
                      resendBtn
                        ? styles.resendOtpBtnTextDisabled
                        : styles.resendOtpBtnText
                    }
                  >
                    {" "}
                    {strings.RESEND_OTP}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </WrapperContainer>
  );
};

export default Otp;

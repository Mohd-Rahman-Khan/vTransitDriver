import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  KeyboardEvent,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import DocInput from "../../../../Components/DocInput";
import { Dropdown } from "react-native-element-dropdown";
import ButtonComp from "../../../../Components/ButtonComp";
import TextInputComp from "../../../../Components/TextInputComp";
import imagePath from "../../../../constants/imagePath";
import strings from "../../../../constants/lang";
import navigationStrings from "../../../../navigation/navigationStrings";
import colors from "../../../../styles/colors";
import {
  moderateScaleVertical,
  width,
  moderateScale,
  textScale,
} from "../../../../styles/responsiveSize";
import { styles } from "../styles";
import validator from "../../../../utils/validations";
import fontFamily from "../../../../styles/fontFamily";
import { showError, showSuccess } from "../../../../utils/helperFunction";
import CountryCodePicker from "../../../../Components/CountryCodePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import actions from "../../../../redux/actions";
import VerifyOtpModal from "../../../../Components/VerifyOtpModal";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import DatePicker from "react-native-date-picker";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { saveProfileData } from "../../../../redux/actions/profileData";
import MobileVerifyOtp from "../../../../Components/MobileVerifyOtp";
import { useIsFocused } from "@react-navigation/native";

const moment = extendMoment(Moment);
const index = ({
  state = {},
  setState = {},
  setStep = {},
  setIcon,
  setloader = () => {},
  fullName,
  setFullName,
  areaStreet,
  setAreaStreet,
  todayDate,
  disableButton,
  changeButtonStatus = () => {},
  isBothSameAddress,
  driverAppSettingData,
  driverAppSettingDataPermission,
}) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [countryCode, setCountryCode] = useState("+91");
  const [countryFlag, setCountryFlag] = useState("IN");
  const [alternateCountryCode, setalternateCountryCode] = useState("+91");
  const [alternateCountryFlag, setalternateCountryFlag] = useState("IN");
  const [emergencyCountryCode, setemergencyCountryCode] = useState("+91");
  const [emergencyCountryFlag, setemergencyCountryFlag] = useState("IN");

  const [isEmailVerified, setisEmailVerified] = useState(false);
  const [isMobileVerified, setisMobileVerified] = useState(false);
  const [emailVerifyText, setemailVerifyText] = useState("");
  const [mobileVerifyText, setmobileVerifyText] = useState("");
  const [showVerifyOTPModal, setshowVerifyOTPModal] = useState(false);
  const [otpCode, setotpCode] = useState("");
  const [responseOtpCode, setresponseOtpCode] = useState("");
  const [vendorList, setvendorList] = useState([]);
  const [genderIcon, setgenderIcon] = useState();
  const [isGender, setisGender] = useState(state?.gender);
  const [isBloodGroup, setisBloodGroup] = useState(state?.bloodGroup);
  const [isDriverType, setisDriverType] = useState(state?.driverType);
  const [isVendor, setisVendor] = useState(state?.vendorName);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [dob, setdob] = useState(state?.dateofBirth);
  const [addressSame, setAddressSame] = useState(false);
  const [showSearchLoccation, setshowSearchLoccation] = useState(false);
  const [verifyType, setverifyType] = useState("");
  const [selectionType, setselectionType] = useState("");
  const [dateMaxPicker, setDateMaxPicker] = useState("");
  const [dateMinPicker, setDateMinPicker] = useState("");
  const [showDateAndTimePicker, setshowDateAndTimePicker] = useState(false);
  const [isButtonDisable, setisButtonDisable] = useState(false);
  const [loginUserTypeData, setloginUserTypeData] = useState("");
  const [isSameAddress, setisSameAddress] = useState(false);
  const [vendorDetail, setvendorDetail] = useState("");
  const [permanentAreaStreet, setPermanentAreaStreet] = useState(
    state?.shelterAddress?.addressName.split("++")[0]
  );
  const [showVerifyMobileOTPModal, setshowVerifyMobileOTPModal] =
    useState(false);
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );

  useEffect(() => {
    // setState(profileData);
    updateGenderIcon();
  }, [state]);

  useEffect(() => {
    if (isFocused) {
      setisSameAddress(isBothSameAddress);
      setAreaStreet(state?.address?.addressName.split("++")[0]);
    }
  }, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      updateGenderIcon();
      return () => {};
    }, [])
  );

  useEffect(() => {
    checkMendotryFields();
  }, [
    state?.dlNumber,
    state?.dateofBirth,
    state?.address?.state,
    state?.firstName,
    state?.mobileNo,
    state?.address?.pinCode,
    state?.address?.addressName,
    state?.address?.city,
    emailVerifyText,
    mobileVerifyText,
    state?.dlValidity,
  ]);

  useEffect(() => {
    getVendoerDetail();
  }, []);

  const checkMendotryFields = () => {
    if (
      state?.firstName &&
      state?.mobileNo &&
      state?.address?.pinCode?.length === 6 &&
      state?.address?.addressName &&
      state?.address?.city &&
      state?.address?.state &&
      state?.gender &&
      state?.dateofBirth &&
      state?.age &&
      //state?.vendorName &&
      state?.dlNumber &&
      state?.dlValidity &&
      emailVerifyText === "Verified" &&
      mobileVerifyText === "Verified"
    ) {
      changeButtonStatus(false);
    } else {
      changeButtonStatus(true);
    }
  };

  const getVendoerDetail = () => {
    actions
      .getVendorDetail(profileData?.vendorId)
      .then((response) => {
        if (response.status == 200) {
          setvendorDetail(response?.data);
        } else {
          //showError("Network error.");
        }
      })
      .catch((error) => {
        //showError("Network error.");
      });
  };

  const updateGenderIcon = () => {
    if (isGender == "Male") {
      setgenderIcon(imagePath.male);
    } else if (isGender == "Female") {
      setgenderIcon(imagePath.female);
    } else {
      setgenderIcon(imagePath.other);
    }
  };

  useEffect(() => {
    let name = fullName.split(" ");
    let remaingName = name.slice(1);
    let res = remaingName.join(" ");
    setState({
      ...state,
      firstName: name[0],
      lastName: res,
    });
    getLoginUserTypeData();
  }, [fullName]);

  const data = [
    {
      value: "Male",
      label: "Male",
      image: imagePath.male,
    },
    {
      value: "Female",
      label: "Female",
      image: imagePath.female,
    },
    {
      value: "Others",
      label: "Others",
      image: imagePath?.other,
    },
  ];

  const getLoginUserTypeData = async () => {
    let loginUserType = await AsyncStorage.getItem("loginUserType");
    let parseloginUserType = JSON.parse(loginUserType);
    setloginUserTypeData(parseloginUserType);
    if (parseloginUserType?.type === "email") {
      if (parseloginUserType?.email === state?.emailId) {
        setemailVerifyText("Verified");
        setisEmailVerified(false);
        changeButtonStatus(false);
      } else {
        // setemailVerifyText('Verify');
        // setisEmailVerified(true);
        // changeButtonStatus(true);
        setemailVerifyText("Verified");
        setisEmailVerified(false);
        changeButtonStatus(false);
      }

      if (parseloginUserType?.mobbileNum === state?.mobileNo) {
        // setemailVerifyText("Verified");
        setmobileVerifyText("Verified");
        setisMobileVerified(false);
        changeButtonStatus(false);
      } else {
        // setmobileVerifyText('Verify');
        // setisMobileVerified(true);
        // changeButtonStatus(true);
        setmobileVerifyText("Verified");
        setisMobileVerified(false);
        changeButtonStatus(false);
      }
    } else {
      if (parseloginUserType?.mobbileNum === state?.mobileNo) {
        // setemailVerifyText("Verified");
        setmobileVerifyText("Verified");
        setisMobileVerified(false);
        changeButtonStatus(false);
      } else {
        // setmobileVerifyText('Verify');
        // setisMobileVerified(true);
        // changeButtonStatus(true);
        setmobileVerifyText("Verified");
        setisMobileVerified(false);
        changeButtonStatus(false);
      }
      if (parseloginUserType?.email === state?.emailId) {
        // setemailVerifyText("Verified");
        setemailVerifyText("Verified");
        setisEmailVerified(false);
        changeButtonStatus(false);
      } else {
        // setemailVerifyText('Verify');
        // setisEmailVerified(true);
        // changeButtonStatus(true);
        setemailVerifyText("Verified");
        setisEmailVerified(false);
        changeButtonStatus(false);
      }
    }
  };

  const getLoginUserTypeDataOld = async () => {
    let loginUserType = await AsyncStorage.getItem("loginUserType");
    let parseloginUserType = JSON.parse(loginUserType);

    if (parseloginUserType?.type === "email") {
      if (parseloginUserType?.loginId === state?.emailId) {
        setemailVerifyText("Verified");
        setisEmailVerified(false);
      } else {
        setemailVerifyText("Verify");
        setisEmailVerified(true);
      }
    } else {
      let loginUserType2 = await AsyncStorage.getItem("loginUserType2");

      if (
        loginUserType2 === null ||
        loginUserType2 === undefined ||
        loginUserType2 === ""
      ) {
        setemailVerifyText("Verify");
        setisEmailVerified(true);
      } else {
        let parseloginUserType2 = JSON.parse(loginUserType2);
        if (parseloginUserType2?.loginId === state?.emailId) {
          // setemailVerifyText("Verified");
          setemailVerifyText("Verified");
          setisEmailVerified(false);
        } else {
          setemailVerifyText("Verify");
          setisEmailVerified(true);
        }
      }

      if (parseloginUserType?.loginId === state?.mobileNo) {
        // setemailVerifyText("Verified");
        setmobileVerifyText("Verified");
        setisMobileVerified(false);
      } else {
        setmobileVerifyText("Verify");
        setisMobileVerified(true);
      }
    }
  };

  const isValidData = () => {
    let email = state?.emailId;
    const error = validator({
      email,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  const isValidDataNext = () => {
    let mobileNo = state?.mobileNo;
    let alternateNo = state?.alternateNo;
    let emergencyContactNo = state?.emergencyContactNo;
    const error = validator({
      mobileNo,
      alternateNo,
      emergencyContactNo,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  function containsNumbers(str) {
    return /[0-9]/.test(str);
  }

  const _next = () => {
    let checkName = containsNumbers(fullName);
    if (checkName) {
      showError("Please enter correct name");
      return;
    }

    if (
      state?.emailId === "" ||
      state?.emailId === null ||
      state?.emailId === undefined
    ) {
    } else {
      if (emailVerifyText === "Verify") {
        showError("Please verify your email address.");
        return;
      }
    }

    if (mobileVerifyText === "Verify") {
      showError("Please verify your mobile number");
      return;
    }
    if (
      state?.dlNumber === "" ||
      state?.dlNumber === null ||
      state?.dlNumber === undefined
    ) {
      showError("Please enter driving license number.");
      return;
    } else {
      if (state?.dlNumber.length < 8 || state?.dlNumber.length > 20) {
        showError(
          "Driving license number length should be between 8-20 characters."
        );
        return;
      }
    }

    if (
      state?.dlValidity === "" ||
      state?.dlValidity === null ||
      state?.dlValidity === undefined
    ) {
      showError("Please enter driving license validity");
      return;
    }

    let driverAge = parseInt(state.age) - 18;

    if (state?.alternateNo === state?.mobileNo) {
      showError(
        "Alternate mobile number should be different from mobile number."
      );
      return;
    }

    if (
      state?.firstName &&
      state?.mobileNo &&
      state?.address?.pinCode?.length == 6 &&
      state?.address?.addressName &&
      state?.address?.city &&
      state?.address?.state &&
      state?.gender &&
      state?.dateofBirth &&
      state?.age
      // &&
      // state?.vendorName
    ) {
      setState({
        ...state,
        address: {
          ...state.address,
          addressName: areaStreet + "++" + state?.address?.addressName, // Replace '++' with ','
        },
      });
      setStep(2);
      setIcon(true);
    } else {
      showError("Please fill all inputs");
    }
  };

  function getYearDiffWithMonth(startDate, endDate) {
    const ms = endDate.getTime() - startDate.getTime();

    const date = new Date(ms);

    return Math.abs(date.getUTCFullYear() - 1970);
  }

  const checkInputBoxLength = (text) => {
    if (text.length > 0) {
      setisButtonDisable(false);
    } else {
      setisButtonDisable(true);
    }
  };

  const verifyEmailAddress = () => {
    let checkValid = isValidData();
    if (!checkValid) {
      return;
    }
    setloader(true);
    setverifyType("Email address");
    //alert("ok");

    setotpCode("");
    let stateData = state;

    actions
      .verifyEmailAddress(stateData?.emailId)
      .then((res) => {
        setloader(false);
        let resD = res?.data?.slice(0, 6);
        setshowVerifyOTPModal(true);
        setresponseOtpCode(resD);
        showSuccess("OTP has sent to your email address.");
      })
      .catch((err) => {
        setloader(false);
        showError(err);
      });
  };

  const verifyMobileNumber = () => {
    setverifyType("Mobile number");
    setloader(true);

    setotpCode("");
    let stateData = state;
    actions
      .verifyMobileNumber(stateData?.mobileNo)
      .then((res) => {
        setloader(false);
        let resD = res?.data?.slice(0, 6);
        setshowVerifyMobileOTPModal(true);
        setresponseOtpCode(resD);
        showSuccess("OTP has sent to your mobile number");
      })
      .catch((err) => {
        setloader(false);
        showError(err);
      });
  };

  const verifyOtp = async (otp) => {
    let loginUserType = await AsyncStorage.getItem("loginUserType");
    let parseloginUserType = JSON.parse(loginUserType);

    if (parseloginUserType?.type === "email") {
      if (responseOtpCode === otp) {
        let loginUserType = {
          type: parseloginUserType.type,
          loginId: parseloginUserType.loginId,
          email: state.emailId,
          mobbileNum: state.mobileNo,
        };

        AsyncStorage.setItem("loginUserType", JSON.stringify(loginUserType));
        getLoginUserTypeData();
        setshowVerifyMobileOTPModal(false);
        setshowVerifyOTPModal(false);
        checkMendotryFields();
        showSuccess(`${verifyType} verified successfully.`);
      } else {
        showError("Invalid Otp");
      }
    } else {
      if (responseOtpCode === otp) {
        let loginUserType = {
          type: parseloginUserType.type,
          loginId: state.emailId,
          email: state.emailId,
          mobbileNum: state.mobileNo,
        };

        AsyncStorage.setItem("loginUserType", JSON.stringify(loginUserType));
        getLoginUserTypeData();
        setshowVerifyOTPModal(false);
        setshowVerifyMobileOTPModal(false);
        checkMendotryFields();
        showSuccess(`${verifyType} verified successfully.`);
      } else {
        showError("Invalid Otp");
      }
    }
  };

  const changeMobieNumber = async (mobNumber) => {
    setState({ ...state, mobileNo: mobNumber });

    let loginUserType = await AsyncStorage.getItem("loginUserType");
    let parseloginUserType = JSON.parse(loginUserType);

    if (parseloginUserType?.mobbileNum === mobNumber) {
      // setemailVerifyText("Verified");
      setmobileVerifyText("Verified");
      setisMobileVerified(false);
      changeButtonStatus(false);
    } else {
      setmobileVerifyText("Verify");
      setisMobileVerified(true);
      changeButtonStatus(true);
    }
  };

  const setSelectedDate = (date) => {
    setshowDateAndTimePicker(!showDateAndTimePicker);
    let dateObj = new Date(date);
    let momentObj = moment(dateObj);
    let momentString = momentObj.format("YYYY-MM-DD");
    setDateMinPicker("");

    //setState({...state, drivingLicenseIssuanceAuthority: text});

    if (selectionType === "DL_ISSSUE_DATE") {
      setState({ ...state, drivinglicenseissuedate: momentString });
    } else if (selectionType === "DL_VALIITY") {
      setState({ ...state, dlValidity: momentString });
      checkMendotryFields();
    } else if (selectionType === "POLICCE_VERIFICATIO_DATE") {
      setState({ ...state, policeverificationdate: momentString });
    } else if (selectionType === "POLICCE_VERIFICATIO_EXPIRY_DATE") {
      setState({ ...state, policeverificationexpirydate: momentString });
    } else if (selectionType === "LAST_EXTERNAL_VERIFICATION") {
      setState({ ...state, lastExternalVerificationDate: momentString });
    } else if (selectionType === "EXTERNAL_VERIFICATION_EXP_DATE") {
      setState({ ...state, externalVerificationExpDate: momentString });
    } else if (selectionType === "BADGE_EXP_DATE") {
      setState({ ...state, badgeExpDate: momentString });
    } else if (selectionType === "MEDICAL_FITNESS_DATE") {
      setState({ ...state, medicalFitnessDate: momentString });
    } else if (selectionType === "MEDICAL_FITNESS_EXP_DATE") {
      setState({ ...state, medicalFitnessExpiryDate: momentString });
    } else if (selectionType === "LAST_TRAINING_DATE") {
      setState({ ...state, lastTrainingDate: momentString });
    }
  };

  const changeEmailAddress = async (emailId) => {
    setState({ ...state, emailId: emailId });

    let loginUserType = await AsyncStorage.getItem("loginUserType");
    let parseloginUserType = JSON.parse(loginUserType);

    if (parseloginUserType?.email === emailId) {
      // setemailVerifyText("Verified");
      setemailVerifyText("Verified");
      setisEmailVerified(false);
      changeButtonStatus(false);
    } else {
      setemailVerifyText("Verify");
      setisEmailVerified(true);
      changeButtonStatus(true);
    }
  };

  const verifyAccountDetail = (id, type, isAltername = "") => {
    setloader(true);

    actions
      .verifyAccount(id, type)
      .then((res) => {
        setloader(false);

        if (res?.message.toUpperCase() == "USER PRESENT") {
          if (type == "mobile") {
            showError(`Mobile number already exists.`);
          } else if (type == "email") {
            showError(`Email already exists.`);
          }
        } else {
          if (type == "mobile") {
            if (isAltername == "YES") {
              setState(() => {
                let newPerson = { ...state };
                newPerson.alternateNo = id;
                return newPerson;
              });
            } else {
              verifyMobileNumber();
            }
          } else if (type == "email") {
            verifyEmailAddress();
          } else {
          }
        }
      })
      .catch((err) => {
        setloader(false);
      });
  };

  const changeEmailAddressOLd = async (emailId) => {
    setState({ ...state, emailId: emailId });

    let loginUserType = await AsyncStorage.getItem("loginUserType");
    let parseloginUserType = JSON.parse(loginUserType);

    if (parseloginUserType?.type === "email") {
      if (parseloginUserType?.loginId === emailId) {
        // setemailVerifyText("Verified");
        setemailVerifyText("Verified");
        setisEmailVerified(false);
      } else {
        setemailVerifyText("Verify");
        setisEmailVerified(true);
      }
    } else {
      let loginUserType2 = await AsyncStorage.getItem("loginUserType2");

      if (
        loginUserType2 === null ||
        loginUserType2 === undefined ||
        loginUserType2 === ""
      ) {
        // setemailVerifyText('Verify');
        // setisEmailVerified(true);
        if (emailId === profileData.emailId) {
          setemailVerifyText("Verified");
          setisEmailVerified(false);
        } else {
          setemailVerifyText("Verify");
          setisEmailVerified(true);
        }
      } else {
        let parseloginUserType2 = JSON.parse(loginUserType2);
        if (parseloginUserType2?.loginId === emailId) {
          // setemailVerifyText("Verified");
          setemailVerifyText("Verified");
          setisEmailVerified(false);
        } else {
          setemailVerifyText("Verify");
          setisEmailVerified(true);
        }
      }
    }
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: colors.white,
      }}
    >
      <DatePicker
        modal
        mode="date"
        open={showDateAndTimePicker}
        date={date}
        maximumDate={dateMaxPicker}
        minimumDate={dateMinPicker}
        onCancel={() => {
          setshowDateAndTimePicker(false);
        }}
        onConfirm={(date) => {
          setSelectedDate(date);
          setDate(date);
        }}
      />
      <DatePicker
        modal
        mode="date"
        open={open}
        date={date}
        maximumDate={new Date()}
        onConfirm={(date) => {
          let dateObj = new Date(date);
          let momentObj = moment(dateObj);
          let momentString = momentObj.format("YYYY-MM-DD");
          let age = getYearDiffWithMonth(date, new Date());
          if (age < 18) {
            return showError("Age should not less than 18");
          }
          setState({
            ...state,
            dateofBirth: momentString,
            age: `${age}`,
          });
          setOpen(!open);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      {showVerifyOTPModal ? (
        <VerifyOtpModal
          isVisible={showVerifyOTPModal}
          verifyOtp={verifyOtp}
          closeModal={() => {
            setshowVerifyOTPModal(false);
          }}
          setCode={(otp) => {
            setotpCode(otp);
            if (otp.length === 6) {
              verifyOtp(otp);
            }
          }}
          code={otpCode}
          resendOtp={() => {
            verifyEmailAddress();
          }}
        />
      ) : null}
      {showVerifyMobileOTPModal ? (
        <MobileVerifyOtp
          isVisible={showVerifyMobileOTPModal}
          verifyOtp={verifyOtp}
          closeModal={() => {
            setshowVerifyMobileOTPModal(false);
          }}
          resendOtp={verifyMobileNumber}
          setCode={(otp) => {
            setotpCode(otp);
            if (otp.length === 6) {
              verifyOtp(otp);
            }
          }}
          code={otpCode}
        />
      ) : null}

      <TextInputComp
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={
          driverAppSettingData?.includes("driverFullName")
            ? styles.desaibleInputStyle
            : styles.editableInputStyle
        }
        placeholder={strings.FULL_NAME}
        value={fullName}
        editable={!driverAppSettingData?.includes("driverFullName")}
        lable={strings.FULL_NAME}
        onChangeText={(text) => {
          setFullName(text);
          //checkInputBoxLength(text);
          checkMendotryFields();
        }}
        icon={imagePath.name}
        isMendotery={true}
      />
      {/* <TextInputComp
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.editableInputStyle}
        placeholder={strings.FATHER_NAME}
        value={state?.driverFathersName}
        lable={strings.FATHER_NAME}
        onChangeText={text => {
          setState(() => {
            let newPerson = {...state};
            newPerson.driverFathersName = text;
            return newPerson;
          });
        }}
        icon={imagePath.fatherIcon}
      /> */}
      <View style={{ paddingHorizontal: 15 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "98%" }}>
            <Dropdown
              style={styles.dropdown}
              renderItem={(item) => (
                <View
                  style={{
                    marginVertical: moderateScaleVertical(5),
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image source={item.image} style={styles.iconStyle} />
                  <Text style={styles.itemStyle}>{item.label}</Text>
                </View>
              )}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={{
                fontSize: textScale(12),
                fontFamily: fontFamily.robotoRegular,
                color: driverAppSettingData?.includes("gender")
                  ? colors.mediumGray
                  : colors.black,
                //flex: 1,
                paddingHorizontal: moderateScale(0),
                //paddingVertical: moderateScaleVertical(10),
                marginLeft: moderateScale(15),
              }}
              inputSearchStyle={styles.inputSearchStyle}
              labelField="label"
              maxHeight={200}
              maxWidth={width}
              valueField="value"
              iconColor={colors.darkGray}
              data={data}
              value={
                state?.gender === "Male"
                  ? "Male"
                  : state?.gender === "Female"
                  ? "Female"
                  : "Others"
              }
              disable={driverAppSettingData?.includes("gender") ? true : false}
              placeholder={strings.SELECT_GENDER}
              onChange={(item) => {
                setState({
                  ...state,
                  gender: item.value,
                });
                setgenderIcon(item.image);
                checkMendotryFields();
              }}
              renderLeftIcon={() => (
                <Image
                  style={styles.iconStyle}
                  name="Safety"
                  source={genderIcon}
                  resizeMode="contain"
                />
              )}
            />
          </View>

          <View
            style={{
              width: "2%",
              alignItems: "flex-end",
              borderBottomColor: colors.lightGary,
              borderBottomWidth: moderateScale(0.5),
              marginBottom: moderateScaleVertical(25),
              //backgroundColor: 'black',
            }}
          >
            <Text
              style={{
                color: colors.darkRed,
                fontSize: 16,
                marginTop: 10,
                marginLeft: -20,
                //marginRight: -8,
              }}
            >
              *
            </Text>
          </View>
        </View>
      </View>
      <TextInputComp
        editable={!driverAppSettingData?.includes("dateofBirth")}
        disabled={driverAppSettingData?.includes("dateofBirth") ? true : false}
        multiline={true}
        rightIcon={imagePath.actualtime}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={
          driverAppSettingData?.includes("dateofBirth")
            ? styles.desaibleInputStyle
            : styles.editableInputStyle
        }
        placeholder={strings.DOB}
        // onChangeText={text =>
        //   setState(() => {
        //     let newPerson = {...state};
        //     newPerson.address.addressName = text;
        //     return newPerson;
        //   })
        // }
        value={
          state?.dateofBirth
            ? moment(state?.dateofBirth).format("DD-MM-YYYY")
            : ""
        }
        icon={imagePath.actualtime}
        //onFocus={_handleLocation}
        rightIconClick={() => {
          setOpen(!open);
        }}
        isMendotery={true}
      />
      <TextInputComp
        editable={false}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={
          driverAppSettingData?.includes("dateofBirth")
            ? styles.desaibleInputStyle
            : styles.editableInputStyle
        }
        placeholder={strings.AGE}
        value={state?.age}
        lable={strings.AGE}
        onChangeText={(text) =>
          setState(() => {
            let newPerson = { ...state };
            newPerson.age = text;
            return newPerson;
          })
        }
        icon={imagePath.age}
        isMendotery={true}
      />
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          marginBottom: moderateScaleVertical(17),
          marginHorizontal: moderateScale(20),
        }}
      >
        <CountryCodePicker
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          countryFlag={countryFlag}
          setCountryFlag={setCountryFlag}
        />
        <TextInputComp
          editable={!driverAppSettingData?.includes("mobileNo")}
          disabled={driverAppSettingData?.includes("mobileNo") ? true : false}
          // inputContainerStyle={}
          inputContainerStyle={{
            flex: 1,
            marginLeft: moderateScale(5),
          }}
          inputStyle={
            driverAppSettingData?.includes("mobileNo")
              ? styles.desaibleInputStyle
              : styles.editableInputStyle
          }
          value={state?.mobileNo}
          lable={strings.PHONE_NUMBER}
          placeholder={strings.PHONE_NUMBER}
          keyboardType={"phone-pad"}
          icon={imagePath.call}
          maxLength={10}
          onChangeText={(text) => {
            changeMobieNumber(text);
            //checkInputBoxLength(text);
            checkMendotryFields();
            // setState(() => {
            //   let newPerson = {...state};
            //   newPerson.mobileNo = text;
            //   return newPerson;
            // });
          }}
          showRightButton={true}
          rightButtunText={mobileVerifyText}
          rightButtonClick={() => {
            if (state?.mobileNo?.length === 10) {
              //verifyMobileNumber();
              verifyAccountDetail(state?.mobileNo, "mobile");
            } else {
              showError("Please enter correct mobile number.");
            }
          }}
        />
      </View>
      <TextInputComp
        // editable={false}
        editable={!driverAppSettingData?.includes("emailId")}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.editableInputStyle}
        placeholder={strings.EMAIL}
        // textAlign={'center'}
        autoCapitalize={"none"}
        lable={strings.EMAIL}
        icon={imagePath.email_address}
        value={state?.emailId}
        // onChangeText={(emailId) => setState({ ...state, emailId: emailId })}
        onChangeText={(emailId) => {
          changeEmailAddress(emailId);
        }}
        showRightButton={true}
        rightButtunText={emailVerifyText}
        rightButtonClick={() => {
          //verifyEmailAddress()
          verifyAccountDetail(state?.emailId, "email");
        }}
      />
      <TextInputComp
        editable={false}
        multiline={false}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.editableInputStyle}
        placeholder={strings.VENDOR}
        value={vendorDetail?.vendorName}
        icon={imagePath.vendor}
      />

      <View
        style={{
          flexDirection: "row",
          flex: 1,
          marginBottom: moderateScaleVertical(17),
          marginHorizontal: moderateScale(20),
        }}
      >
        <CountryCodePicker
          countryCode={alternateCountryCode}
          setCountryCode={setalternateCountryCode}
          countryFlag={alternateCountryFlag}
          setCountryFlag={setalternateCountryFlag}
        />
        <TextInputComp
          editable={!driverAppSettingData?.includes("alternateNo")}
          disabled={
            driverAppSettingData?.includes("alternateNo") ? true : false
          }
          inputContainerStyle={{
            flex: 1,
            marginLeft: moderateScale(5),
          }}
          inputStyle={styles.desaibleInputStyle}
          value={state?.alternateNo}
          lable={strings.ALTERNATE_NUMBBER}
          placeholder={strings.ALTERNATE_NUMBBER}
          keyboardType={"phone-pad"}
          icon={imagePath.alternateNumber}
          maxLength={10}
          onChangeText={(text) => {
            if (text.length > 9) {
              if (text == state?.mobileNo) {
                showError(
                  "Alternate number should be different from mobile number."
                );
              } else {
                verifyAccountDetail(text, "mobile", "YES");
                // setState(() => {
                //   let newPerson = { ...state };
                //   newPerson.alternateNo = text;
                //   return newPerson;
                // });
              }
            } else {
              setState(() => {
                let newPerson = { ...state };
                newPerson.alternateNo = text;
                return newPerson;
              });
            }
          }}
        />
      </View>
      <View style={{ paddingHorizontal: 20, marginBottom: 20, marginTop: -30 }}>
        <TextInputComp
          editable={!driverAppSettingData?.includes("dlNumber")}
          inputContainerStyle={styles.docContainer}
          inputStyle={
            driverAppSettingData?.includes("dlNumber")
              ? styles.desaibleInputStyle
              : styles.editableInputStyle
          }
          value={state?.dlNumber}
          onChangeText={(dlNumber) => {
            setState({ ...state, dlNumber: dlNumber });
            checkMendotryFields();
          }}
          placeholder={strings.DL_NUMBER}
          icon={imagePath.driving_icon}
          maxLength={20}
          isMendotery={true}
        />
        <TextInputComp
          editable={!driverAppSettingData?.includes("dlValidity")}
          disabled={driverAppSettingData?.includes("dlValidity") ? true : false}
          multiline={true}
          rightIcon={imagePath.actualtime}
          inputContainerStyle={styles.docContainer}
          inputStyle={
            driverAppSettingData?.includes("dlValidity")
              ? styles.desaibleInputStyle
              : styles.editableInputStyle
          }
          placeholder="Driving License Validity"
          // onChangeText={text =>
          //   setState(() => {
          //     let newPerson = {...state};
          //     newPerson.address.addressName = text;
          //     return newPerson;
          //   })
          // }
          value={
            state?.dlValidity
              ? moment(state?.dlValidity).format("DD-MM-YYYY")
              : ""
          }
          icon={imagePath.actualtime}
          //onFocus={_handleLocation}
          rightIconClick={() => {
            setselectionType("DL_VALIITY");
            setshowDateAndTimePicker(true);
            setDateMaxPicker();
            setDateMinPicker(new Date(todayDate));
          }}
          isMendotery={true}
        />
      </View>

      <TextInputComp
        editable={!driverAppSettingData?.includes("address")}
        multiline={true}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={
          driverAppSettingData?.includes("address")
            ? styles.desaibleInputStyle
            : styles.editableInputStyle
        }
        placeholder={strings.PRESENT_ADDRESS}
        onChangeText={(text) =>
          setState(() => {
            let newPerson = { ...state };
            if (newPerson?.address?.addressName) {
              newPerson.address.addressName = text;
              checkMendotryFields();
            } else {
              newPerson.address.addressName = text;
              checkMendotryFields();
            }
            return newPerson;
          })
        }
        value={state?.address?.addressName}
        icon={imagePath.home_address}
        isMendotery={true}
      />

      <TextInputComp
        editable={!driverAppSettingData?.includes("address")}
        multiline={true}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={
          driverAppSettingData?.includes("address")
            ? styles.desaibleInputStyle
            : styles.editableInputStyle
        }
        placeholder={strings.AREA_STREET}
        onChangeText={(text) => {
          setAreaStreet(text);
        }}
        value={areaStreet}
        icon={imagePath.home_address}
        isMendotery={true}
      />

      <TextInputComp
        // editable={false}
        editable={!driverAppSettingData?.includes("address")}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={
          driverAppSettingData?.includes("address")
            ? styles.desaibleInputStyle
            : styles.editableInputStyle
        }
        placeholder={` ${strings.PRESENT_ADDRESS} - ${strings.CITY}`}
        // textAlign={'center'}
        onChangeText={(text) =>
          setState(() => {
            let newPerson = { ...state };
            if (newPerson?.address?.city) {
              newPerson.address.city = text;
              checkMendotryFields();
            } else {
              newPerson.address.city = text;
              checkMendotryFields();
            }
            return newPerson;
          })
        }
        lable={strings.CITY}
        icon={imagePath.city}
        value={state?.address?.city}
      />
      <TextInputComp
        editable={!driverAppSettingData?.includes("address")}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={
          driverAppSettingData?.includes("address")
            ? styles.desaibleInputStyle
            : styles.editableInputStyle
        }
        placeholder={` ${strings.PRESENT_ADDRESS} - ${strings.PIN_CODE}`}
        value={state?.address?.pinCode}
        onChangeText={(text) =>
          setState(() => {
            let newPerson = { ...state };
            if (newPerson?.address?.pinCode) {
              newPerson.address.pinCode = text;
              checkMendotryFields();
            } else {
              newPerson.address.pinCode = text;
              checkMendotryFields();
            }
            return newPerson;
          })
        }
        maxLength={6}
        keyboardType={"number-pad"}
        icon={imagePath.pin_code}
      />
      <TextInputComp
        editable={!driverAppSettingData?.includes("address")}
        inputStyle={
          driverAppSettingData?.includes("address")
            ? styles.desaibleInputStyle
            : styles.editableInputStyle
        }
        inputContainerStyle={styles.inputContainerStyle}
        placeholder={` ${strings.PRESENT_ADDRESS} - ${strings.STATE}`}
        value={state?.address?.state}
        onChangeText={(text) =>
          setState(() => {
            let newPerson = { ...state };
            if (newPerson?.address?.state) {
              newPerson.address.state = text;
              checkMendotryFields();
            } else {
              newPerson.address.state = text;
              checkMendotryFields();
            }
            return newPerson;
          })
        }
        icon={imagePath.state}
      />
      <View
        style={{
          marginHorizontal: moderateScale(20),
          marginBottom: moderateScaleVertical(20),
          marginTop: moderateScaleVertical(-20),
        }}
      >
        <DocInput
          disabled={
            driverAppSettingData?.includes("isPresentSameAsPermanent")
              ? true
              : false
          }
          docIcon={imagePath.driving_icon}
          docName={strings.SAME_ADDRESS}
          value={isSameAddress ? "Yes" : "No"}
          //value={state?.isAddressSameSecond ? "Yes" : "No"}

          toggleButton={() => {
            setAddressSame(!addressSame);
            setisSameAddress(!isSameAddress);
            setState(() => {
              let newPerson = { ...state };

              if (newPerson?.shelterAddress?.addressName) {
                newPerson.shelterAddress.addressName =
                  state?.address?.addressName;
                newPerson.shelterAddress.city = state?.address?.city;
                newPerson.shelterAddress.pinCode = state?.address?.pinCode;
                newPerson.shelterAddress.state = state?.address?.state;
                newPerson.isAddressSameSecond = !addressSame;
              } else {
                let newShelterAddres = {
                  addressName: state?.address?.addressName,
                  city: state?.address?.city,
                  pinCode: state?.address?.pinCode,
                  state: state?.address?.state,
                };
                newPerson.shelterAddress = newShelterAddres;
                newPerson.isAddressSameSecond = !addressSame;
              }

              return newPerson;
            });
          }}
          yesButtonPress={() => {
            setAddressSame(!addressSame);
            setState(() => {
              let newPerson = { ...state };

              if (newPerson?.shelterAddress?.addressName) {
                newPerson.shelterAddress.addressName =
                  state?.address?.addressName;
                newPerson.shelterAddress.city = state?.address?.city;
                newPerson.shelterAddress.pinCode = state?.address?.pinCode;
                newPerson.shelterAddress.state = state?.address?.state;
                newPerson.isAddressSameSecond = !addressSame;
              } else {
                let newShelterAddres = {
                  addressName: state?.address?.addressName,
                  city: state?.address?.city,
                  pinCode: state?.address?.pinCode,
                  state: state?.address?.state,
                };
                newPerson.shelterAddress = newShelterAddres;
                newPerson.isAddressSameSecond = !addressSame;
              }

              return newPerson;
            });
          }}
          noButtonPress={() => {
            setAddressSame(!addressSame);
            setState(() => {
              let newPerson = { ...state };

              if (newPerson?.shelterAddress?.addressName) {
                newPerson.shelterAddress.addressName =
                  state?.address?.addressName;
                newPerson.shelterAddress.city = state?.address?.city;
                newPerson.shelterAddress.pinCode = state?.address?.pinCode;
                newPerson.shelterAddress.state = state?.address?.state;
                newPerson.isAddressSameSecond = !addressSame;
              } else {
                let newShelterAddres = {
                  addressName: state?.address?.addressName,
                  city: state?.address?.city,
                  pinCode: state?.address?.pinCode,
                  state: state?.address?.state,
                };
                newPerson.shelterAddress = newShelterAddres;
                newPerson.isAddressSameSecond = !addressSame;
              }

              return newPerson;
            });
          }}
          multiCheckbox={true}
        />
      </View>

      {state?.isAddressSameSecond ? (
        <>
          <TextInputComp
            editable={!driverAppSettingData?.includes("shelterAddress")}
            inputStyle={
              driverAppSettingData?.includes("shelterAddress")
                ? styles.desaibleInputStyle
                : styles.editableInputStyle
            }
            multiline={true}
            inputContainerStyle={styles.inputContainerStyle}
            placeholder={`${strings.PERMANEENT_ADDRESS}`}
            onChangeText={(text) =>
              setState(() => {
                let newPerson = { ...state };
                if (newPerson?.shelterAddress?.addressName) {
                  newPerson.shelterAddress.addressName = text;
                } else {
                  newPerson.shelterAddress.addressName = text;
                }
                return newPerson;
              })
            }
            value={state?.shelterAddress?.addressName}
            icon={imagePath.home_address}
          />
          <TextInputComp
            editable={!driverAppSettingData?.includes("shelterAddress")}
            inputStyle={
              driverAppSettingData?.includes("shelterAddress")
                ? styles.desaibleInputStyle
                : styles.editableInputStyle
            }
            multiline={true}
            inputContainerStyle={styles.inputContainerStyle}
            placeholder={`${strings.AREA_STREET}`}
            onChangeText={(text) => setPermanentAreaStreet(text)}
            value={permanentAreaStreet}
            icon={imagePath.home_address}
          />
          <TextInputComp
            // editable={false}
            inputContainerStyle={styles.inputContainerStyle}
            editable={!driverAppSettingData?.includes("shelterAddress")}
            inputStyle={
              driverAppSettingData?.includes("shelterAddress")
                ? styles.desaibleInputStyle
                : styles.editableInputStyle
            }
            placeholder={`${strings.PERMANEENT_ADDRESS} - ${strings.CITY}`}
            // textAlign={'center'}
            onChangeText={(text) =>
              setState(() => {
                let newPerson = { ...state };
                if (newPerson?.shelterAddress?.city) {
                  newPerson.shelterAddress.city = text;
                } else {
                  newPerson.shelterAddress.city = text;
                }
                return newPerson;
              })
            }
            lable={strings.CITY}
            icon={imagePath.city}
            value={state?.shelterAddress?.city}
          />
          <TextInputComp
            inputContainerStyle={styles.inputContainerStyle}
            // editable={false}
            editable={!driverAppSettingData?.includes("shelterAddress")}
            inputStyle={
              driverAppSettingData?.includes("shelterAddress")
                ? styles.desaibleInputStyle
                : styles.editableInputStyle
            }
            placeholder={`${strings.PERMANEENT_ADDRESS} - ${strings.PIN_CODE}`}
            // textAlign={'center'}
            value={state?.shelterAddress?.pinCode}
            // lable={strings.PIN_CODE}
            onChangeText={(text) =>
              setState(() => {
                let newPerson = { ...state };
                if (newPerson?.shelterAddress?.pinCode) {
                  newPerson.shelterAddress.pinCode = text;
                } else {
                  newPerson.shelterAddress.pinCode = text;
                }
                return newPerson;
              })
            }
            maxLength={6}
            keyboardType={"number-pad"}
            icon={imagePath.pin_code}
          />
          <TextInputComp
            multiline={true}
            inputContainerStyle={styles.inputContainerStyle}
            editable={!driverAppSettingData?.includes("shelterAddress")}
            inputStyle={
              driverAppSettingData?.includes("shelterAddress")
                ? styles.desaibleInputStyle
                : styles.editableInputStyle
            }
            placeholder={`${strings.PERMANEENT_ADDRESS} - ${strings.STATE}`}
            value={state?.shelterAddress?.state}
            onChangeText={(text) =>
              setState(() => {
                let newPerson = { ...state };
                if (newPerson?.shelterAddress?.state) {
                  newPerson.shelterAddress.state = text;
                } else {
                  newPerson.shelterAddress.state = text;
                }
                return newPerson;
              })
            }
            icon={imagePath.state}
          />
        </>
      ) : null}

      <View style={styles.bottomView}>
        <ButtonComp
          disabled={disableButton}
          btnText={strings.NEXT}
          btnStyle={disableButton ? styles.disableBtn : styles.submitBtnStyle}
          btnTextStyle={styles.submitBtnTextStyle}
          //onPress={_next}
          onPress={() => {
            _next();
          }}
        />
      </View>
    </ScrollView>
  );
};

export default index;

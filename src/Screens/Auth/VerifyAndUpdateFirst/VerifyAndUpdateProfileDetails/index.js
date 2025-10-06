import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Image, ScrollView, Text, View, StyleSheet } from "react-native";
import DocInput from "../../../../Components/DocInput";
import { Dropdown } from "react-native-element-dropdown";
import ButtonComp from "../../../../Components/ButtonComp";
import TextInputComp from "../../../../Components/TextInputComp";
import imagePath from "../../../../constants/imagePath";
import strings from "../../../../constants/lang";
import colors from "../../../../styles/colors";
import fontFamily from "../../../../styles/fontFamily";
import {
  moderateScaleVertical,
  width,
  moderateScale,
  textScale,
} from "../../../../styles/responsiveSize";
import { showError, showSuccess } from "../../../../utils/helperFunction";
import validator from "../../../../utils/validations";
import { styles } from "../styles";
import CountryCodePicker from "../../../../Components/CountryCodePicker";
import { useSelector } from "react-redux";
import VerifyOtpModal from "../../../../Components/VerifyOtpModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import actions from "../../../../redux/actions";
import DatePicker from "react-native-date-picker";
import Moment from "moment";
import { extendMoment } from "moment-range";
import MobileVerifyOtp from "../../../../Components/MobileVerifyOtp";
const moment = extendMoment(Moment);
const index = ({
  state = {},
  setState = {},
  setStep = {},
  setIcon,
  setloader = () => {},
  todayDate,
  disableButton,
  changeButtonStatus = () => {},
}) => {
  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [countryFlag, setCountryFlag] = useState("IN");
  const [alternateCountryCode, setalternateCountryCode] = useState("+91");
  const [alternateCountryFlag, setalternateCountryFlag] = useState("IN");
  const [emergencyCountryCode, setemergencyCountryCode] = useState("+91");
  const [emergencyCountryFlag, setemergencyCountryFlag] = useState("IN");
  const navigation = useNavigation();
  const [emailVerifyText, setemailVerifyText] = useState("");
  const [mobileVerifyText, setmobileVerifyText] = useState("");
  const [showVerifyOTPModal, setshowVerifyOTPModal] = useState(false);
  const [showVerifyMobileOTPModal, setshowVerifyMobileOTPModal] =
    useState(false);
  const [otpCode, setotpCode] = useState("");
  const [responseOtpCode, setresponseOtpCode] = useState("");
  const [isEmailVerified, setisEmailVerified] = useState(false);
  const [isMobileVerified, setisMobileVerified] = useState(false);
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
  const [isButtonDisable, setisButtonDisable] = useState(false);
  const [selectionType, setselectionType] = useState("");
  const [showDateAndTimePicker, setshowDateAndTimePicker] = useState(false);
  const [dateMaxPicker, setDateMaxPicker] = useState();
  const [dateMinPicker, setDateMinPicker] = useState();
  const [loginUserTypeData, setloginUserTypeData] = useState("");
  const [verifyType, setverifyType] = useState("");
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );

  useEffect(() => {
    setFullName(state.firstName + " " + state.lastName);
    getLoginUserTypeData();
    updateGenderIcon();
  }, []);

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
  ]);

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
      state?.vendorName &&
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

  useEffect(() => {
    let name = fullName.split(" ");
    let remaingName = name.slice(1);
    let res = remaingName.join(" ");
    setState({
      ...state,
      firstName: name[0],
      lastName: res,
    });
  }, [fullName]);

  const updateGenderIcon = () => {
    if (isGender == "Male") {
      setgenderIcon(imagePath.male);
    } else if (isGender == "Female") {
      setgenderIcon(imagePath.female);
    } else {
      setgenderIcon(imagePath.other);
    }
  };

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
        setemailVerifyText("Verify");
        setisEmailVerified(true);
        changeButtonStatus(true);
      }

      if (parseloginUserType?.mobbileNum === state?.mobileNo) {
        setmobileVerifyText("Verified");
        setisMobileVerified(false);
        changeButtonStatus(false);
      } else {
        setmobileVerifyText("Verify");
        setisMobileVerified(true);
        changeButtonStatus(true);
      }
    } else {
      if (parseloginUserType?.mobbileNum === state?.mobileNo) {
        setmobileVerifyText("Verified");
        setisMobileVerified(false);
        changeButtonStatus(false);
      } else {
        setmobileVerifyText("Verify");
        setisMobileVerified(true);
        changeButtonStatus(true);
      }
      if (parseloginUserType?.email === state?.emailId) {
        setemailVerifyText("Verified");
        setisEmailVerified(false);
        changeButtonStatus(false);
      } else {
        setemailVerifyText("Verify");
        setisEmailVerified(true);
        changeButtonStatus(true);
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
      state?.age &&
      state?.vendorName
    ) {
      setStep(2);
      setIcon(true);
    } else {
      showError("Please fill all inputs");
    }
  };

  const changeMobieNumber = async (mobNumber) => {
    setState({ ...state, mobileNo: mobNumber });

    let loginUserType = await AsyncStorage.getItem("loginUserType");
    let parseloginUserType = JSON.parse(loginUserType);
    if (parseloginUserType?.mobbileNum === mobNumber) {
      setmobileVerifyText("Verified");
      setisMobileVerified(false);
      changeButtonStatus(false);
    } else {
      setmobileVerifyText("Verify");
      setisMobileVerified(true);
      changeButtonStatus(true);
    }
  };

  const changeEmailAddress = async (emailId) => {
    setState({ ...state, emailId: emailId });

    let loginUserType = await AsyncStorage.getItem("loginUserType");
    let parseloginUserType = JSON.parse(loginUserType);

    if (parseloginUserType?.email === emailId) {
      setemailVerifyText("Verified");
      setisEmailVerified(false);

      changeButtonStatus(false);
    } else {
      setemailVerifyText("Verify");
      setisEmailVerified(true);

      changeButtonStatus(true);
    }
  };

  function getYearDiffWithMonth(startDate, endDate) {
    const ms = endDate.getTime() - startDate.getTime();

    const date = new Date(ms);

    return Math.abs(date.getUTCFullYear() - 1970);
  }

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

  const verifyMobileNumber = () => {
    setloader(true);

    setotpCode("");
    setverifyType("Mobile number");
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
  const setSelectedDate = (date) => {
    setshowDateAndTimePicker(!showDateAndTimePicker);
    let dateObj = new Date(date);
    let momentObj = moment(dateObj);
    let momentString = momentObj.format("YYYY-MM-DD");
    setDateMinPicker("");

    if (selectionType === "DL_ISSSUE_DATE") {
      setState({ ...state, drivinglicenseissuedate: momentString });
    } else if (selectionType === "DL_VALIITY") {
      setState({ ...state, dlValidity: momentString });
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
            //verifyMobileNumber();
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
          }
        }
      })
      .catch((err) => {
        setloader(false);
      });
  };

  const verifyEmailAddress = () => {
    let checkValid = isValidData();
    if (!checkValid) {
      return;
    }
    setloader(true);
    setverifyType("Email address");

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
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.updateProfileDetailMainContainer}
    >
      {showVerifyOTPModal ? (
        <VerifyOtpModal
          isVisible={showVerifyOTPModal}
          verifyOtp={verifyOtp}
          closeModal={() => {
            setshowVerifyOTPModal(false);
          }}
          resendOtp={verifyEmailAddress}
          setCode={(otp) => {
            setotpCode(otp);
            if (otp.length === 6) {
              verifyOtp(otp);
            }
          }}
          code={otpCode}
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
      <DatePicker
        modal
        mode="date"
        open={open}
        date={date}
        maximumDate={new Date()}
        onConfirm={(date) => {
          setOpen(!open);
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

          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <DatePicker
        modal
        mode="date"
        open={showDateAndTimePicker}
        date={date}
        // maximumDate={new Date()}
        //minimumDate={dateMinPicker}
        onCancel={() => {
          setshowDateAndTimePicker(false);
        }}
        onConfirm={(date) => {
          setSelectedDate(date);
          setDate(date);
        }}
      />
      <TextInputComp
        keyboardType="email-address"
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.editableInputStyle}
        placeholder={strings.FULL_NAME}
        value={fullName}
        lable={strings.FULL_NAME}
        onChangeText={(text) => {
          setFullName(text);
          checkMendotryFields();
        }}
        icon={imagePath.name}
        isMendotery={true}
      />

      <View style={{}}>
        <View style={styles.selectGenderRowContainer}>
          <View style={styles.leftContainer}>
            <Dropdown
              style={styles.dropdown}
              renderItem={(item) => (
                <View style={styles.dropdownRenderItem}>
                  <Image source={item.image} style={styles.iconStyle} />
                  <Text style={styles.itemStyle}>{item.label}</Text>
                </View>
              )}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={{
                fontSize: 12,
                color: colors.black,
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
              placeholder={strings.SELECT_GENDER}
              iconColor={colors.darkGray}
              data={data}
              value={
                state?.gender === "Male"
                  ? "Male"
                  : state?.gender === "Female"
                  ? "Female"
                  : "Others"
              }
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
          <View style={styles.rightContainer}>
            <Text style={styles.mendetoryIconStyle}>*</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: moderateScaleVertical(10) }}>
        <TextInputComp
          editable={false}
          multiline={true}
          rightIcon={imagePath.actualtime}
          inputContainerStyle={styles.inputContainerStyle}
          inputStyle={styles.editableInputStyle}
          placeholder={strings.DOB}
          value={
            state?.dateofBirth
              ? moment(state?.dateofBirth).format("DD-MM-YYYY")
              : ""
          }
          icon={imagePath.actualtime}
          rightIconClick={() => {
            setOpen(!open);
          }}
          isMendotery={true}
        />
      </View>
      <TextInputComp
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.editableInputStyle}
        placeholder={strings.AGE}
        value={state?.age}
        editable={false}
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
      <View style={styles.mobileNoContainerStyle}>
        <CountryCodePicker
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          countryFlag={countryFlag}
          setCountryFlag={setCountryFlag}
        />
        <TextInputComp
          inputContainerStyle={styles.phoneInputContainer}
          inputStyle={styles.desaibleInputStyle}
          value={state?.mobileNo}
          lable={strings.PHONE_NUMBER}
          placeholder={strings.PHONE_NUMBER}
          keyboardType="phone-pad"
          editable={true}
          icon={imagePath.call}
          maxLength={10}
          showRightButton={true}
          rightButtunText={mobileVerifyText}
          rightButtonClick={() => {
            if (state?.mobileNo.length === 10) {
              //verifyMobileNumber();
              verifyAccountDetail(state?.mobileNo, "mobile");
            } else {
              showError("Please enter correct mobile number.");
            }
          }}
          onChangeText={(text) => {
            changeMobieNumber(text);

            checkMendotryFields();
          }}
        />
      </View>
      <TextInputComp
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.editableInputStyle}
        placeholder={strings.EMAIL}
        autoCapitalize={"none"}
        lable={strings.EMAIL}
        icon={imagePath.email_address}
        value={state?.emailId}
        onChangeText={(emailId) => {
          changeEmailAddress(emailId);
          checkMendotryFields();
        }}
        showRightButton={true}
        rightButtunText={emailVerifyText}
        //rightButtonClick={verifyEmailAddress}
        rightButtonClick={() => {
          //verifyEmailAddress()
          verifyAccountDetail(state?.emailId, "email");
        }}
      />
      <TextInputComp
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.editableInputStyle}
        placeholder={strings.VENDOR}
        editable={false}
        icon={imagePath.vendor}
        value={state?.vendorName}
      />

      {/* <View style={{}}>
        <View style={styles.venderNameRowContainer}>
          <View style={styles.leftContainer}>
            <Dropdown
              style={styles.dropdown}
              renderItem={(item) => (
                <View style={styles.dropdownRenderItem}>
                  {item?.vendorCode ? (
                    <Text style={styles.itemStyle}>
                      {item?.vendorName} (venor code-{item?.vendorCode})
                    </Text>
                  ) : (
                    <Text style={styles.itemStyle}>{item?.vendorName}</Text>
                  )}
                </View>
              )}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.editableInputStyle}
              inputSearchStyle={styles.inputSearchStyle}
              labelField="vendorName"
              maxHeight={200}
              maxWidth={width}
              valueField="vendorName"
              placeholder={strings.VENDOR}
              iconColor={colors.darkGray}
              data={vendorList}
              value={state?.vendorName}
              onChange={(item) => {
                setState({
                  ...state,
                  vendorName: item.vendorName,
                  vendorId: item?.id,
                });
              }}
              renderLeftIcon={() => (
                <Image
                  style={styles.iconStyle}
                  name="Safety"
                  source={imagePath.vendor}
                  resizeMode="contain"
                />
              )}
            />
          </View>

          <View style={styles.rightContainer}>
            <Text style={styles.mendetoryIconStyle}>*</Text>
          </View>
        </View>
      </View> */}

      <View style={styles.mobileNoContainerStyle}>
        <CountryCodePicker
          countryCode={alternateCountryCode}
          setCountryCode={setalternateCountryCode}
          countryFlag={alternateCountryFlag}
          setCountryFlag={setalternateCountryFlag}
        />
        <TextInputComp
          inputContainerStyle={styles.phoneInputContainer}
          inputStyle={styles.desaibleInputStyle}
          value={state?.alternateNo}
          lable={strings.ALTERNATE_NUMBBER}
          placeholder={strings.ALTERNATE_NUMBBER}
          keyboardType="phone-pad"
          editable={true}
          maxLength={10}
          icon={imagePath.alternateNumber}
          onChangeText={(text) => {
            // setState(() => {
            //   let newPerson = { ...state };
            //   newPerson.alternateNo = text;
            //   return newPerson;
            // });
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

      <View style={styles.dlNumberContainer}>
        <TextInputComp
          inputContainerStyle={styles.docContainer}
          inputStyle={styles.editableInputStyle}
          value={state?.dlNumber}
          onChangeText={(dlNumber) => {
            setState({ ...state, dlNumber: dlNumber });

            checkMendotryFields();
          }}
          placeholder={strings.DL_NUMBER}
          editable={true}
          icon={imagePath.driving_icon}
          maxLength={20}
          isMendotery={true}
        />
        <TextInputComp
          editable={false}
          multiline={true}
          rightIcon={imagePath.actualtime}
          inputContainerStyle={styles.docContainer}
          inputStyle={styles.editableInputStyle}
          placeholder="Driving License Validity"
          value={
            state?.dlValidity
              ? moment(state?.dlValidity).format("DD-MM-YYYY")
              : ""
          }
          icon={imagePath.actualtime}
          rightIconClick={() => {
            setselectionType("DL_VALIITY");
            setshowDateAndTimePicker(true);
            setDateMinPicker(new Date(todayDate));
            setDateMaxPicker();
          }}
          isMendotery={true}
        />
      </View>

      <TextInputComp
        multiline={true}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.editableInputStyle}
        placeholder={strings.PRESENT_ADDRESS}
        onChangeText={(text) => {
          checkMendotryFields();

          setState(() => {
            let newPerson = { ...state };

            if (newPerson?.address?.addressName) {
              newPerson.address.addressName = text;
            } else {
              let address = {
                addressName: text,
                city: newPerson?.address?.city,
                state: newPerson?.address?.state,
                pinCode: newPerson?.address?.pinCode,
              };
              newPerson.address = address;
            }

            return newPerson;
          });
        }}
        value={state?.address?.addressName}
        icon={imagePath.home_address}
        isMendotery={true}
        maxLength={100}
      />
      <TextInputComp
        multiline={false}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.editableInputStyle}
        placeholder={strings.AREA_STREET}
        onChangeText={(text) => {
          checkMendotryFields();

          setState(() => {
            let newPerson = { ...state };

            if (newPerson?.address?.addressName) {
              newPerson.address.addressName = text;
            } else {
              let address = {
                addressName: newPerson?.address?.addressName + "++" + text,
                city: newPerson?.address?.city,
                state: newPerson?.address?.state,
                pinCode: newPerson?.address?.pinCode,
              };
              newPerson.address = address;
            }

            return newPerson;
          });
        }}
        value={state?.address?.addressName}
        icon={imagePath.home_address}
        isMendotery={true}
        maxLength={100}
      />
      <TextInputComp
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.editableInputStyle}
        placeholder={` ${strings.PRESENT_ADDRESS} - ${strings.CITY}`}
        onChangeText={(text) => {
          checkMendotryFields();
          setState(() => {
            let newPerson = { ...state };
            if (newPerson?.address?.city) {
              newPerson.address.city = text;
            } else {
              //let address = { city: text };

              let address = {
                addressName: newPerson?.address?.addressName,
                city: text,
                state: newPerson?.address?.state,
                pinCode: newPerson?.address?.pinCode,
              };
              newPerson.address = address;
            }

            return newPerson;
          });
        }}
        lable={strings.CITY}
        icon={imagePath.city}
        value={state?.address?.city}
      />
      <TextInputComp
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.editableInputStyle}
        placeholder={` ${strings.PRESENT_ADDRESS} - ${strings.PIN_CODE}`}
        value={state?.address?.pinCode}
        onChangeText={(text) => {
          checkMendotryFields();
          setState(() => {
            let newPerson = { ...state };
            if (newPerson?.address?.pinCode) {
              newPerson.address.pinCode = text;
            } else {
              //let address = { pinCode: text };

              let address = {
                addressName: newPerson?.address?.addressName,
                city: newPerson?.address?.city,
                state: newPerson?.address?.state,
                pinCode: text,
              };
              newPerson.address = address;
            }

            return newPerson;
          });
        }}
        maxLength={6}
        keyboardType={"number-pad"}
        icon={imagePath.pin_code}
      />
      <TextInputComp
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.editableInputStyle}
        placeholder={` ${strings.PRESENT_ADDRESS} - ${strings.STATE}`}
        value={state?.address?.state}
        onChangeText={(text) => {
          checkMendotryFields();
          setState(() => {
            let newPerson = { ...state };
            if (newPerson?.address?.state) {
              newPerson.address.state = text;
            } else {
              //let address = { state: text };

              let address = {
                addressName: newPerson?.address?.addressName,
                city: newPerson?.address?.city,
                state: text,
                pinCode: newPerson?.address?.pinCode,
              };
              newPerson.address = address;
            }

            return newPerson;
          });
        }}
        icon={imagePath.state}
      />

      <View style={styles.sameAsAddressContainer}>
        <DocInput
          docIcon={imagePath.driving_icon}
          docName={strings.SAME_ADDRESS}
          value={state?.isAddressSameSecond ? "Yes" : "No"}
          // value={
          //   JSON.stringify(state?.address) ===
          //   JSON.stringify(state?.shelterAddress)
          //     ? "Yes"
          //     : "No"
          // }
          toggleButton={() => {
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
          onPress={() => {
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
        />
      </View>
      {!state?.isAddressSameSecond ? (
        <>
          <TextInputComp
            multiline={true}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.editableInputStyle}
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
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.editableInputStyle}
            placeholder={`${strings.PERMANEENT_ADDRESS} - ${strings.CITY}`}
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
            inputStyle={styles.editableInputStyle}
            placeholder={`${strings.PERMANEENT_ADDRESS} - ${strings.PIN_CODE}`}
            value={state?.shelterAddress?.pinCode}
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
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.editableInputStyle}
            placeholder={`${strings.PERMANEENT_ADDRESS} - ${strings.STATE}`}
            value={state?.shelterAddress?.state}
            onChangeText={(text) =>
              setState(() => {
                let newPerson = { ...state };
                if (newPerson?.shelterAddress?.state) {
                  newPerson.shelterAddress.state = text;
                } else {
                  newPerson.shelterAddress.state = text;
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
          onPress={_next}
        />
      </View>
    </ScrollView>
  );
};

export default index;

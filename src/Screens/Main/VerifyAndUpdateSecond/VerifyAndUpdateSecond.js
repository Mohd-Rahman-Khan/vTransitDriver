import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { useSelector } from "react-redux";
import HeaderComp from "../../../Components/HeaderComp";
import StepperHeader from "../../../Components/StepperHeader";
import WrapperContainer from "../../../Components/WrapperContainer";
import imagePath from "../../../constants/imagePath";
import strings from "../../../constants/lang";
import { styles } from "./styles";
import VerifyAndUpdateOfficialDetails from "./VerifyAndUpdateOfficialDetails";
import VerifyAndUpdateProfileDetails from "./VerifyAndUpdateProfileDetails";
import Moment from "moment";
import { extendMoment } from "moment-range";
import InfoSheet from "../../../Components/InfoSheet";
import actions from "../../../redux/actions";
const stepOneList = [
  {
    icon: imagePath.name,
    name: "Full Name",
  },
  {
    icon: imagePath.actualtime,
    name: "Date of birth",
  },
  {
    icon: imagePath.age,
    name: "Age",
  },
  {
    icon: imagePath.call,
    name: "Mobile number",
  },
  {
    icon: imagePath.email_address,
    name: "Email Address",
  },
  {
    icon: imagePath.vendor,
    name: "Vendor",
  },
  {
    icon: imagePath.alternateNumber,
    name: "Alternate number",
  },
  {
    icon: imagePath.driving_icon,
    name: "Driving License",
  },
  {
    icon: imagePath.actualtime,
    name: "Driving License Validity",
  },
  {
    icon: imagePath.home_address,
    name: "Present Address",
  },
  {
    icon: imagePath.city,
    name: "City",
  },
  {
    icon: imagePath.pin_code,
    name: "Pin code",
  },
  {
    icon: imagePath.state,
    name: "State",
  },
  {
    icon: imagePath.editGray,
    name: "Edit",
  },
  {
    icon: imagePath.male,
    name: "Male",
  },
  {
    icon: imagePath.female,
    name: "Female",
  },
  {
    icon: imagePath.other,
    name: "Other",
  },
  {
    icon: imagePath.pending,
    name: "Pending request",
  },
  {
    icon: imagePath.check_mark_circle,
    name: "Approve request",
  },
];

const stepTwoList = [
  { icon: imagePath.driving_icon, name: "Driving License" },
  { icon: imagePath.driving_icon, name: "ID Card" },
  { icon: imagePath.driving_icon, name: "Government Id Proof" },
  { icon: imagePath.identity_proof, name: "Identity Proof Document" },
  { icon: imagePath.DriverInduction, name: "Driver Induction" },
  {
    icon: imagePath.policeVarificationExoiryDate,
    name: "Driver induction date",
  },
  { icon: imagePath.policeVarification, name: "Police verification document" },
  { icon: imagePath.PoliceVerificationCode, name: "Police verification code" },
  {
    icon: imagePath.policeVarification,
    name: "Police Verification document",
  },
  {
    icon: imagePath.policeVarificationExoiryDate,
    name: "Police verification expiry date",
  },
  {
    icon: imagePath.fully_vaccinated,
    name: "Fully Vaccinated",
  },
  {
    icon: imagePath.partially_vaccinated,
    name: "Partially Vaccinated",
  },
  {
    icon: imagePath.not_vaccinated,
    name: "Not Vaccinated",
  },
  {
    icon: imagePath.badge,
    name: "Badge",
  },
  {
    icon: imagePath.badgeNumber,
    name: "Badge Number",
  },
  {
    icon: imagePath.actualtime,
    name: "Badge expiry date",
  },
  {
    icon: imagePath.MedicalFitness,
    name: "Medical fitness",
  },
  {
    icon: imagePath.MedicalFitnessExpiryDate,
    name: "Medical fitness expiry date",
  },
  {
    icon: imagePath.MedicalFitness,
    name: "Medical fitness document",
  },
  {
    icon: imagePath.trainingStatus,
    name: "Driver Training",
  },
  {
    icon: imagePath.trainingDate,
    name: "Last Training date",
  },
];
const moment = extendMoment(Moment);

// const driverAppSettingData = [
//   'driverFullName',
//   'gender',
//   'dateofBirth',
//   'mobileNo',
//   'emailId',
//   'photo',
//   'alternateNo',
//   'dlNumber',
//   'dlValidity',
//   'shelterAddress',
//   'address',
//   'isPresentSameAsPermanent',
//   'dlcenseDoc',
//   'iDCardIssued',
//   'govtIdProofDoc',
//   'govtidproof',
//   'driverInduction',
//   'driverInductionDate',
//   'policeVerificationCode',
//   'policeVerDoc',
//   'policeVerStatus',
//   'policeverificationexpirydate',
//   'isVaccinated',
//   'badge',
//   'badgeExpDate',
//   'badgeNo',
//   'medicalFitness',
//   'medicalFitnessDate',
//   'medicalFitnessExpiryDate',
//   'trainingStatus',
//   'lastTrainingDate',
//   'medicalCertificateDoc'

// ]

const VerifyAndUpdateSecond = ({ route }) => {
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );
  const isFocus = useIsFocused();
  const [state, setState] = useState(profileData);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState();

  const [icon, setIcon] = useState(true);
  const [photo, setPhoto] = useState();
  const [showclickePic, setshowclickePic] = useState(false);
  const [fullName, setFullName] = useState("");
  const [count, setcount] = useState(0);
  const [addressSame, setaddressSame] = useState(true);
  const driverChangeData = route?.params?.profileStatus;
  const [driverProfileStatus, setDriverProfileStatus] = useState(true);
  const [todayDate, settodayDate] = useState("");
  const [isButtonDisable, setisButtonDisable] = useState(false);
  const [showInnfoScreen, setshowInnfoScreen] = useState();
  const [driverAppSettingData, setdriverAppSettingData] = useState("");
  const [areaStreet, setAreaStreet] = useState("");
  const [driverAppSettingDataPermission, setdriverAppSettingDataPermission] =
    useState([]);
  const infoSheet = useRef();
  useEffect(() => {
    setStep(1);
  }, [profileData, isButtonDisable, driverAppSettingData]);

  // useEffect(() => {
  //   isAddressSame();
  // }, [count]);

  useEffect(() => {
    getTodayDate();
  }, []);
  useEffect(() => {
    checkMendotryFields();
  }, [isButtonDisable, areaStreet]);

  useEffect(() => {
    getDriverAppSetting();
  }, [profileData]);

  const getDriverAppSetting = () => {
    actions
      .getDriverAppSetting(profileData?.corporateId)
      .then((response) => {
        if (response?.status == 200) {
          setdriverAppSettingData(
            response?.data?.nonEditableFieldsInVerifyAndUpdate
          );
          setdriverAppSettingDataPermission(response?.data);
        }
      })
      .catch((error) => {});
  };

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
      areaStreet != "" &&
      //state?.vendorName &&
      state?.dlNumber &&
      state?.dlValidity
    ) {
      setisButtonDisable(false);
    } else {
      setisButtonDisable(true);
    }
  };

  const getTodayDate = () => {
    var currentDate = moment(new Date()).format("YYYY-MM-DD");

    settodayDate(currentDate);
  };

  const isAddressSame = () => {
    // if (count < 1) {
    //   setcount(count + 3);
    //   var newPerson = { ...state };

    //   if (
    //     state?.shelterAddress?.addressName === state?.address?.addressName &&
    //     state?.shelterAddress?.city === state?.address?.city &&
    //     state?.shelterAddress?.pinCode === state?.address?.pinCode &&
    //     state?.shelterAddress?.state === state?.address?.state
    //   ) {
    //     newPerson.isAddressSameSecond = true;
    //   } else {
    //     newPerson.isAddressSameSecond = false;
    //   }

    //   setState(newPerson);
    // }
    var newPerson = { ...state };
    if (
      JSON.stringify(state?.address) === JSON.stringify(state?.shelterAddress)
    ) {
      newPerson.isAddressSameSecond = true;
    } else {
      newPerson.isAddressSameSecond = false;
    }

    setState(newPerson);
  };

  useEffect(() => {
    if (isFocus) {
      setState(profileData);
      setFullName(profileData?.firstName + " " + profileData?.lastName);
    }
  }, [isFocus]);

  useEffect(() => {
    if (driverProfileStatus) {
      setState(profileData);
      setPhoto(profileData?.photo);
      setFullName(profileData?.firstName + " " + profileData?.lastName);
    } else {
      setState(driverChangeData);
      setFullName(
        driverChangeData?.firstName + " " + driverChangeData?.lastName
      );
      setPhoto(driverChangeData?.photo);
    }
  }, [driverProfileStatus]);

  return (
    <WrapperContainer isLoading={loading} withModal={loading}>
      {showInnfoScreen ? (
        <InfoSheet
          onClose={() => {
            setshowInnfoScreen(false);
          }}
          infoList={step == "1" ? stepOneList : stepTwoList}
          infoSheet={infoSheet}
        />
      ) : null}
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <HeaderComp
            title={strings.VERIFY_AND_UPDATE}
            setStep={setStep}
            icon={icon}
            step={step}
            setIcon={setIcon}
            rightIconClick={() => {
              setDriverProfileStatus(!driverProfileStatus);
            }}
            rightIcon={
              driverChangeData?.profileStatus?.toUpperCase().trim() ===
                "PENDING" && step == 1
                ? driverProfileStatus
                  ? imagePath?.check_mark_circle
                  : imagePath?.pending
                : null
            }
            centerIcon={true}
            innfoIconClick={() => {
              setshowInnfoScreen(true);
              setTimeout(() => {
                infoSheet.current.open();
              }, 1000);
            }}
          />
        </View>

        <View style={styles.formContainer}>
          <StepperHeader
            setClickPicStatus={(val) => {
              setshowclickePic(val);
            }}
            showclickePic={showclickePic}
            state={state}
            step={step}
            setState={setState}
            nextScreen={`${strings.NEXT} ${strings.DOCUMENT_DETAILS}`}
            title={
              step == 1 ? strings.PERSONAL_DETAILS : strings.DOCUMENT_DETAILS
            }
            photo={photo}
            setPhoto={setPhoto}
            driverAppSettingData={driverAppSettingData}
            driverAppSettingDataPermission={driverAppSettingDataPermission}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "android" ? "height" : "padding"}
            // style={styles.cardView}
          >
            {step === 1 ? (
              <VerifyAndUpdateProfileDetails
                state={state}
                setState={setState}
                step={step}
                setStep={setStep}
                setIcon={setIcon}
                photo={photo}
                setloader={(val) => {
                  setLoading(val);
                }}
                areaStreet={areaStreet}
                setAreaStreet={setAreaStreet}
                fullName={fullName}
                setFullName={setFullName}
                todayDate={todayDate}
                disableButton={isButtonDisable}
                changeButtonStatus={(val) => {
                  setisButtonDisable(val);
                }}
                isBothSameAddress={route?.params?.isAddressSame}
                driverAppSettingData={driverAppSettingData}
                driverAppSettingDataPermission={driverAppSettingDataPermission}
              />
            ) : (
              // null
              <VerifyAndUpdateOfficialDetails
                setClickPicStatus={(val) => {
                  setshowclickePic(val);
                }}
                step={step}
                setStep={setStep}
                state={state}
                setState={setState}
                setLoading={setLoading}
                photo={photo}
                setPhoto={setPhoto}
                todayDate={todayDate}
                driverAppSettingData={driverAppSettingData}
                driverAppSettingDataPermission={driverAppSettingDataPermission}
              />
            )}
          </KeyboardAvoidingView>
        </View>
      </View>
    </WrapperContainer>
  );
};

export default VerifyAndUpdateSecond;

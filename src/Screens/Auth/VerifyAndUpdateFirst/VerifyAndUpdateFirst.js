import React, { useEffect, useState, useRef } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { useSelector } from "react-redux";
import HeaderComp from "../../../Components/HeaderComp";
import StepperHeader from "../../../Components/StepperHeader";
import WrapperContainer from "../../../Components/WrapperContainer";
import strings from "../../../constants/lang";
import { styles } from "./styles";
import VerifyAndUpdateOfficialDetails from "./VerifyAndUpdateOfficialDetails";
import VerifyAndUpdatePersonalDetails from "./VerifyAndUpdateProfileDetails";
import Moment from "moment";
import { extendMoment } from "moment-range";
import InfoSheet from "../../../Components/InfoSheet";
import imagePath from "../../../constants/imagePath";

const stepOneList = [
  {
    icon: imagePath.name,
    name: " Full Name",
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

const VerifyAndUpdateFirst = () => {
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );
  const [state, setState] = useState(profileData);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState();

  const [icon, setIcon] = useState(false);
  const [photo, setPhoto] = useState("");
  const [showclickePic, setshowclickePic] = useState(false);
  const [todayDate, settodayDate] = useState("");
  const [isButtonDisable, setisButtonDisable] = useState(false);
  const [showInnfoScreen, setshowInnfoScreen] = useState();
  const infoSheet = useRef();
  useEffect(() => {
    setStep(1);
  }, [profileData, isButtonDisable]);

  useEffect(() => {
    isAddressSame();
  }, []);

  useEffect(() => {
    getTodayDate();
  }, []);

  useEffect(() => {
    checkMendotryFields();
  }, [isButtonDisable]);

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
    let newPerson = { ...state };

    if (
      JSON.stringify(state?.address) === JSON.stringify(state?.shelterAddress)
    ) {
      newPerson.isAddressSameSecond = true;
    } else {
      newPerson.isAddressSameSecond = false;
    }

    // if (
    //   state?.shelterAddress?.addressName === state?.address?.addressName &&
    //   state?.shelterAddress?.city === state?.address?.city &&
    //   state?.shelterAddress?.pinCode === state?.address?.pinCode &&
    //   state?.shelterAddress?.state === state?.address?.state
    // ) {
    //   newPerson.isAddressSameSecond = true;
    // } else {
    //   newPerson.isAddressSameSecond = false;
    // }

    setState(newPerson);
  };

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
            icon={step === 1 ? null : icon}
            step={step}
            state={state}
            setIcon={setIcon}
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
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "android" ? "height" : "padding"}
          >
            {step === 1 ? (
              <VerifyAndUpdatePersonalDetails
                state={state}
                setState={setState}
                step={step}
                setStep={setStep}
                setIcon={setIcon}
                photo={photo}
                setloader={(val) => {
                  setLoading(val);
                }}
                todayDate={todayDate}
                disableButton={isButtonDisable}
                changeButtonStatus={(val) => {
                  setisButtonDisable(val);
                }}
              />
            ) : (
              <VerifyAndUpdateOfficialDetails
                state={state}
                setState={setState}
                setLoading={setLoading}
                photo={photo}
                todayDate={todayDate}
              />
            )}
          </KeyboardAvoidingView>
        </View>
      </View>
    </WrapperContainer>
  );
};

export default VerifyAndUpdateFirst;

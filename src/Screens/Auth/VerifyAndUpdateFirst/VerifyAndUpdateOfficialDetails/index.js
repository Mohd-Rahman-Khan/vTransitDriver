import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { styles } from "../styles";
import strings from "../../../../constants/lang";
import imagePath from "../../../../constants/imagePath";
import { Dropdown } from "react-native-element-dropdown";
import colors from "../../../../styles/colors";
import ButtonComp from "../../../../Components/ButtonComp";
import { uploadDoc } from "../../../../utils/docPickerFun";
import RBSheet from "react-native-raw-bottom-sheet";
import { openCamera } from "../../../../utils/imagePickerFun";
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from "../../../../styles/responsiveSize";
import DocInput from "../../../../Components/DocInput";
import actions from "../../../../redux/actions";
import { showSuccess, showError } from "../../../../utils/helperFunction";
import { saveProfileData } from "../../../../redux/actions/profileData";
import TextInputComp from "../../../../Components/TextInputComp";
import Moment from "moment";
import DatePicker from "react-native-date-picker";
import { extendMoment } from "moment-range";
import { calculateFileSize, getFileExtension } from "../../../../utils/utils";
const moment = extendMoment(Moment);

const data = [
  {
    value: "Vaccinated Fully",
    label: "Fully Vaccinated",
    image: imagePath.fully_vaccinated,
  },
  {
    value: "Partially Vaccinated",
    label: "Partially Vaccinated",
    image: imagePath.partially_vaccinated,
  },
  {
    value: "Not Vaccinated",
    label: "Not Vaccinated",
    image: imagePath.not_vaccinated,
  },
];

const data2 = [
  {
    value: "Fully Vaccinated",
    label: "Fully Vaccinated",
    image: imagePath.fully_vaccinated,
  },
  {
    value: "Partially Vaccinated",
    label: "Partially Vaccinated",
    image: imagePath.partially_vaccinated,
  },
  {
    value: "Not Vaccinated",
    label: "Not Vaccinated",
    image: imagePath.not_vaccinated,
  },
];

const index = ({ state = {}, setState = {}, photo, setLoading, todayDate }) => {
  const refRBSheet = useRef();
  const [govtIdProofDoc, setgovtIdProofDoc] = useState();
  const [addressdoc, setAddressdoc] = useState();
  const [policedoc, setPolicedoc] = useState();
  const [dldoc, setDldoc] = useState();
  const [vaccinationIcon, setVaccinationIcon] = useState();
  const [vaccineCertificateDoc, setVaccineCertificateDoc] = useState();
  const [isVaccinated, setIsVaccinated] = useState(state?.isVaccinated);
  const [bottomSheetValue, setBottomSheetValue] = useState();
  const [showDateAndTimePicker, setshowDateAndTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectionType, setselectionType] = useState("");
  const [medicalCertificateDoc, setmedicalCertificateDoc] = useState();
  const [dateMaxPicker, setDateMaxPicker] = useState();
  const [dateMinPicker, setDateMinPicker] = useState();
  const [enableButton, setenableButton] = useState(false);

  useEffect(() => {
    updateVaccinationIcon();
  }, []);

  useEffect(() => {
    checkMendotyFieldsOfficeDetail();
  }, [
    state?.iDCardIssued,
    state?.govtidproof,
    govtIdProofDoc?.name,
    state?.govtIdProofDoc,
    state?.policeVerStatus,
    policedoc?.name,
    state?.policeVerificationCode,
    dldoc?.name,
    state?.dlcenseDoc,
    state?.badge,
    state?.badgeNo,
    state?.badgeExpDate,
    state?.medicalFitness,
    state?.medicalFitnessExpiryDate,
    medicalCertificateDoc?.name,
    state?.medicalCertificateDoc,
    state?.trainingStatus,
    state?.lastTrainingDate,
    state?.policeverificationexpirydate,
    state?.isVaccinated,
  ]);

  const checkIdCard = () => {
    if (state?.govtidproof && state?.govtIdProofDoc) {
      return true;
    } else {
      if (state?.govtidproof && govtIdProofDoc?.name) {
        return true;
      } else {
        return false;
      }
    }
  };

  const checkPoliceVerification = () => {
    if (
      state?.policeVerificationCode &&
      state?.policeVerDoc &&
      state?.policeverificationexpirydate
    ) {
      return true;
    } else {
      if (
        state?.policeVerificationCode &&
        policedoc?.name &&
        state?.policeverificationexpirydate
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  const checkBadge = () => {
    if (state?.badgeNo && state?.badgeExpDate) {
      return true;
    } else {
      return false;
    }
  };

  const checkMedicalFitness = () => {
    if (state?.medicalFitnessExpiryDate && state?.medicalCertificateDoc) {
      return true;
    } else {
      if (medicalCertificateDoc?.name && state?.medicalFitnessExpiryDate) {
        return true;
      } else {
        return false;
      }
    }
  };

  const checkTrainingStatus = () => {
    if (state?.lastTrainingDate) {
      return true;
    } else {
      return false;
    }
  };

  const checkDrivingLicense = () => {
    if (state?.dlcenseDoc) {
      return true;
    } else {
      if (dldoc?.name) {
        return true;
      } else {
        return false;
      }
    }
  };
  const checkVaccination = () => {
    if (state?.isVaccinated) {
      return true;
    } else {
      return false;
    }
  };

  function checkMendotyFieldsOfficeDetail() {
    if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkPoliceVerification();
      let thirdStatus = checkBadge();
      let forthStatus = checkMedicalFitness();
      let fifthStatus = checkTrainingStatus();
      let sixthStatus = checkDrivingLicense();
      let sevennthState = checkVaccination();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus &&
        sixthStatus &&
        sevennthState
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.dlcenseDoc
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkPoliceVerification();
      let thirdStatus = checkBadge();
      let forthStatus = checkMedicalFitness();
      let fifthStatus = checkTrainingStatus();
      let sixthStatus = checkDrivingLicense();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus &&
        sixthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.isVaccinated &&
      state?.dlcenseDoc
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkPoliceVerification();
      let thirdStatus = checkBadge();
      let forthStatus = checkMedicalFitness();
      let fifthStatus = checkVaccination();
      let sixthStatus = checkDrivingLicense();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus &&
        sixthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkPoliceVerification();
      let thirdStatus = checkBadge();
      let forthStatus = checkMedicalFitness();
      let fifthStatus = checkTrainingStatus();
      let sixthStatus = checkVaccination();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus &&
        sixthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkIdCard();
      let thirdStatus = checkBadge();
      let forthStatus = checkMedicalFitness();
      let fifthStatus = checkTrainingStatus();
      let sixthStatus = checkVaccination();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus &&
        sixthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkIdCard();
      let thirdStatus = checkPoliceVerification();
      let forthStatus = checkMedicalFitness();
      let fifthStatus = checkTrainingStatus();
      let sixthStatus = checkVaccination();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus &&
        sixthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkIdCard();
      let thirdStatus = checkPoliceVerification();
      let forthStatus = checkBadge();
      let fifthStatus = checkTrainingStatus();
      let sixthStatus = checkVaccination();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus &&
        sixthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.isVaccinated &&
      state?.trainingStatus === "Yes"
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkPoliceVerification();
      let thirdStatus = checkBadge();
      let forthStatus = checkMedicalFitness();
      let fifthStatus = checkVaccination();
      let sixthStatus = checkTrainingStatus();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus &&
        sixthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes"
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkIdCard();
      let thirdStatus = checkPoliceVerification();
      let forthStatus = checkBadge();
      let fifthStatus = checkMedicalFitness();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.trainingStatus === "Yes"
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkIdCard();
      let thirdStatus = checkPoliceVerification();
      let forthStatus = checkBadge();
      let fifthStatus = checkTrainingStatus();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkIdCard();
      let thirdStatus = checkPoliceVerification();
      let forthStatus = checkBadge();
      let fifthStatus = checkVaccination();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.trainingStatus === "Yes"
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkPoliceVerification();
      let thirdStatus = checkBadge();
      let forthStatus = checkMedicalFitness();
      let fifthStatus = checkTrainingStatus();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.policeVerStatus === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkPoliceVerification();
      let thirdStatus = checkMedicalFitness();
      let forthStatus = checkTrainingStatus();
      let fifthStatus = checkVaccination();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkBadge();
      let thirdStatus = checkMedicalFitness();
      let forthStatus = checkTrainingStatus();
      let fifthStatus = checkVaccination();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkPoliceVerification();
      let thirdStatus = checkMedicalFitness();
      let forthStatus = checkTrainingStatus();
      let fifthStatus = checkVaccination();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkPoliceVerification();
      let thirdStatus = checkBadge();
      let forthStatus = checkTrainingStatus();
      let fifthStatus = checkVaccination();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkPoliceVerification();
      let thirdStatus = checkBadge();
      let forthStatus = checkMedicalFitness();
      let fifthStatus = checkVaccination();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkBadge();
      let thirdStatus = checkMedicalFitness();
      let forthStatus = checkTrainingStatus();
      let fifthStatus = checkVaccination();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkPoliceVerification();
      let thirdStatus = checkBadge();
      let forthStatus = checkMedicalFitness();
      let fifthStatus = checkVaccination();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued &&
      state?.medicalFitness === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkIdCard();
      let thirdStatus = checkMedicalFitness();
      let forthStatus = checkTrainingStatus();
      let fifthStatus = checkVaccination();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.badge === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkIdCard();
      let thirdStatus = checkBadge();
      let forthStatus = checkTrainingStatus();
      let fifthStatus = checkVaccination();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued &&
      state?.policeVerStatus &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkIdCard();
      let thirdStatus = checkPoliceVerification();
      let forthStatus = checkTrainingStatus();
      let fifthStatus = checkVaccination();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued &&
      state?.policeVerStatus &&
      state?.medicalFitness === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkIdCard();
      let thirdStatus = checkPoliceVerification();
      let forthStatus = checkMedicalFitness();
      let fifthStatus = checkVaccination();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkPoliceVerification();
      let thirdStatus = checkBadge();
      let forthStatus = checkMedicalFitness();
      let fifthStatus = checkVaccination();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.trainingStatus === "Yes"
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkPoliceVerification();
      let thirdStatus = checkBadge();
      let forthStatus = checkMedicalFitness();
      let fifthStatus = checkTrainingStatus();

      if (
        firstStatus &&
        secondStatus &&
        thirdStatus &&
        forthStatus &&
        fifthStatus
      ) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes"
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkIdCard();
      let thirdStatus = checkPoliceVerification();
      let forthStatus = checkBadge();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkIdCard();
      let thirdStatus = checkPoliceVerification();
      let forthStatus = checkVaccination();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.medicalFitness === "Yes"
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkIdCard();
      let thirdStatus = checkPoliceVerification();
      let forthStatus = checkMedicalFitness();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.trainingStatus === "Yes"
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkIdCard();
      let thirdStatus = checkPoliceVerification();
      let forthStatus = checkTrainingStatus();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.badge === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.medicalFitness === "Yes"
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkBadge();
      let thirdStatus = checkPoliceVerification();
      let forthStatus = checkMedicalFitness();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.badge === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkBadge();
      let thirdStatus = checkPoliceVerification();
      let forthStatus = checkVaccination();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.badge === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.trainingStatus === "Yes"
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkBadge();
      let thirdStatus = checkPoliceVerification();
      let forthStatus = checkTrainingStatus();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.trainingStatus === "Yes"
    ) {
      let firstStatus = checkPoliceVerification();
      let secondStatus = checkBadge();
      let thirdStatus = checkMedicalFitness();
      let forthStatus = checkTrainingStatus();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.badge === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkIdCard();
      let thirdStatus = checkBadge();
      let forthStatus = checkVaccination();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkBadge();
      let secondStatus = checkMedicalFitness();
      let thirdStatus = checkTrainingStatus();
      let forthStatus = checkVaccination();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkPoliceVerification();
      let secondStatus = checkBadge();
      let thirdStatus = checkTrainingStatus();
      let forthStatus = checkVaccination();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.badge === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkBadge();
      let thirdStatus = checkTrainingStatus();
      let forthStatus = checkVaccination();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkBadge();
      let thirdStatus = medicalFitness();
      let forthStatus = checkVaccination();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.badge === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkBadge();
      let thirdStatus = checkTrainingStatus();
      let forthStatus = checkVaccination();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkBadge();
      let thirdStatus = checkMedicalFitness();
      let forthStatus = checkVaccination();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.policeVerStatus === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkPoliceVerification();
      let thirdStatus = checkTrainingStatus();
      let forthStatus = checkVaccination();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.policeVerStatus === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkPoliceVerification();
      let thirdStatus = checkMedicalFitness();
      let forthStatus = checkVaccination();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkPoliceVerification();
      let thirdStatus = checkBadge();
      let forthStatus = checkVaccination();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkIdCard();
      let thirdStatus = checkTrainingStatus();
      let forthStatus = checkVaccination();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkIdCard();
      let thirdStatus = checkMedicalFitness();
      let forthStatus = checkVaccination();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkPoliceVerification();
      let secondStatus = checkBadge();
      let thirdStatus = checkMedicalFitness();
      let forthStatus = checkVaccination();

      if (firstStatus && secondStatus && thirdStatus && forthStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes"
    ) {
      let dlStatus = checkDrivingLicense();
      let checkIdStatus = checkIdCard();
      let checkPoliceVerificationStatus = checkPoliceVerification();

      if (dlStatus && checkIdStatus && checkPoliceVerificationStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.isVaccinated
    ) {
      let dlStatus = checkDrivingLicense();
      let checkIdStatus = checkIdCard();
      let checkVaccie = checkVaccination();

      if (dlStatus && checkIdStatus && checkVaccie) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.badge === "Yes"
    ) {
      let dlStatus = checkDrivingLicense();
      let checkIdStatus = checkIdCard();
      let checkBadgeStatus = checkBadge();

      if (dlStatus && checkIdStatus && checkBadgeStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.medicalFitness === "Yes"
    ) {
      let dlStatus = checkDrivingLicense();
      let checkIdStatus = checkIdCard();
      let checkMedicalFitnessStatus = checkMedicalFitness();

      if (dlStatus && checkIdStatus && checkMedicalFitnessStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.iDCardIssued === "Yes" &&
      state?.trainingStatus === "Yes"
    ) {
      let dlStatus = checkDrivingLicense();
      let checkIdStatus = checkIdCard();
      let checkTraining = checkTrainingStatus();

      if (dlStatus && checkIdStatus && checkTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes"
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkPoliceVerification();
      let thirdTraining = checkBadge();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.policeVerStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkPoliceVerification();
      let thirdTraining = checkVaccination();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.policeVerStatus === "Yes" &&
      state?.medicalFitness === "Yes"
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkPoliceVerification();
      let thirdTraining = checkMedicalFitness();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.policeVerStatus === "Yes" &&
      state?.trainingStatus === "Yes"
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkPoliceVerification();
      let thirdTraining = checkTrainingStatus();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes"
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkBadge();
      let thirdTraining = checkMedicalFitness();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.badge === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkBadge();
      let thirdTraining = checkVaccination();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.badge === "Yes" &&
      state?.trainingStatus === "Yes"
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkBadge();
      let thirdTraining = checkTrainingStatus();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkBadge();
      let secondStatus = checkMedicalFitness();
      let thirdTraining = checkVaccination();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.medicalFitness === "Yes" &&
      state?.trainingStatus === "Yes"
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkMedicalFitness();
      let thirdTraining = checkTrainingStatus();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.medicalFitness === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkMedicalFitness();
      let thirdTraining = checkVaccination();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes"
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkPoliceVerification();
      let thirdTraining = checkBadge();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkPoliceVerification();
      let thirdTraining = checkVaccination();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.medicalFitness === "Yes"
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkPoliceVerification();
      let thirdTraining = checkMedicalFitness();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes" &&
      state?.trainingStatus === "Yes"
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkPoliceVerification();
      let thirdTraining = checkTrainingStatus();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.medicalFitness === "Yes"
    ) {
      let firstStatus = checkPoliceVerification();
      let secondStatus = checkBadge();
      let thirdTraining = checkMedicalFitness();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkPoliceVerification();
      let secondStatus = checkBadge();
      let thirdTraining = checkVaccination();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.policeVerStatus === "Yes" &&
      state?.badge === "Yes" &&
      state?.trainingStatus === "Yes"
    ) {
      let firstStatus = checkPoliceVerification();
      let secondStatus = checkBadge();
      let thirdTraining = checkTrainingStatus();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkTrainingStatus();
      let thirdTraining = checkVaccination();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.badge === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkBadge();
      let secondStatus = checkTrainingStatus();
      let thirdTraining = checkVaccination();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.policeVerStatus === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkPoliceVerification();
      let secondStatus = checkTrainingStatus();
      let thirdTraining = checkVaccination();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.policeVerStatus === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkPoliceVerification();
      let secondStatus = checkMedicalFitness();
      let thirdTraining = checkVaccination();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.trainingStatus === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkTrainingStatus();
      let thirdTraining = checkVaccination();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.medicalFitness === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkMedicalFitness();
      let thirdTraining = checkVaccination();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.badge === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkIdCard();
      let secondStatus = checkBadge();
      let thirdTraining = checkVaccination();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.dlcenseDoc &&
      state?.badge === "Yes" &&
      state?.isVaccinated
    ) {
      let firstStatus = checkDrivingLicense();
      let secondStatus = checkBadge();
      let thirdTraining = checkVaccination();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.medicalFitness === "Yes" &&
      state?.badge === "Yes" &&
      state?.trainingStatus === "Yes"
    ) {
      let firstStatus = checkMedicalFitness();
      let secondStatus = checkBadge();
      let thirdTraining = checkTrainingStatus();

      if (firstStatus && secondStatus && thirdTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (state?.dlcenseDoc && state?.iDCardIssued === "Yes") {
      let dlStatus = checkDrivingLicense();
      let checkIdStatus = checkIdCard();

      if (dlStatus && checkIdStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (state?.dlcenseDoc && state?.policeVerStatus === "Yes") {
      let dlStatus = checkDrivingLicense();
      let checkPoliceVerificationStatus = checkPoliceVerification();

      if (dlStatus && checkPoliceVerificationStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (state?.dlcenseDoc && state?.badge === "Yes") {
      let dlStatus = checkDrivingLicense();
      let checkBadgeStatus = checkBadge();

      if (dlStatus && checkBadgeStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (state?.dlcenseDoc && state?.medicalFitness === "Yes") {
      let dlStatus = checkDrivingLicense();
      let checkMedicalFitnessStatus = checkMedicalFitness();

      if (dlStatus && checkMedicalFitnessStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (state?.dlcenseDoc && state?.trainingStatus === "Yes") {
      let dlStatus = checkDrivingLicense();
      let checkTraining = checkTrainingStatus();

      if (dlStatus && checkTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (state?.dlcenseDoc && state?.isVaccinated) {
      let dlStatus = checkDrivingLicense();
      let checkVaccine = checkVaccination();

      if (dlStatus && checkVaccine) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.policeVerStatus === "Yes"
    ) {
      let checkIdCardStatus = checkIdCard();
      let checkPoliceVerificationStatus = checkPoliceVerification();

      if (checkIdCardStatus && checkPoliceVerificationStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (state?.iDCardIssued === "Yes" && state?.isVaccinated) {
      let checkIdCardStatus = checkIdCard();
      let checkVaccie = checkVaccination();

      if (checkIdCardStatus && checkVaccie) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (state?.iDCardIssued === "Yes" && state?.badge === "Yes") {
      let checkIdCardStatus = checkIdCard();
      let checkBadgeStatus = checkBadge();

      if (checkIdCardStatus && checkBadgeStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.medicalFitness === "Yes"
    ) {
      let checkIdCardStatus = checkIdCard();
      let medicalCertificateDocStatus = checkMedicalFitness();

      if (checkIdCardStatus && medicalCertificateDocStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (state?.medicalFitness === "Yes" && state?.isVaccinated) {
      let checkVaccie = checkVaccination();
      let medicalCertificateDocStatus = checkMedicalFitness();

      if (checkVaccie && medicalCertificateDocStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (state?.badge === "Yes" && state?.isVaccinated) {
      let checkVaccie = checkVaccination();
      let checkBadgeStatus = checkBadge();

      if (checkVaccie && checkBadgeStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (state?.trainingStatus === "Yes" && state?.isVaccinated) {
      let checkVaccie = checkVaccination();
      let checkTraining = checkTrainingStatus();

      if (checkVaccie && checkTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.iDCardIssued === "Yes" &&
      state?.trainingStatus === "Yes"
    ) {
      let checkIdCardStatus = checkIdCard();
      let checkTraining = checkTrainingStatus();

      if (checkIdCardStatus && checkTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (state?.policeVerStatus === "Yes" && state?.badge === "Yes") {
      let checkPoliceVerificationStatus = checkPoliceVerification();
      let checkBadgeStatus = checkBadge();

      if (checkPoliceVerificationStatus && checkBadgeStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (state?.policeVerStatus === "Yes" && state?.isVaccinated) {
      let checkPoliceVerificationStatus = checkPoliceVerification();
      let checkVaccie = checkVaccination();

      if (checkPoliceVerificationStatus && checkVaccie) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.policeVerStatus === "Yes" &&
      state?.medicalFitness === "Yes"
    ) {
      let checkPoliceVerificationStatus = checkPoliceVerification();
      let checkMedicalFitnessStatus = checkMedicalFitness();

      if (checkPoliceVerificationStatus && checkMedicalFitnessStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.policeVerStatus === "Yes" &&
      state?.trainingStatus === "Yes"
    ) {
      let checkPoliceVerificationStatus = checkPoliceVerification();
      let checkTraining = checkTrainingStatus();

      if (checkPoliceVerificationStatus && checkTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (state?.badge === "Yes" && state?.medicalFitness === "Yes") {
      let checkBadgeStatus = checkBadge();
      let checkMedicalFitnessStatus = checkMedicalFitness();

      if (checkBadgeStatus && checkMedicalFitnessStatus) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (state?.badge === "Yes" && state?.isVaccinated) {
      let checkBadgeStatus = checkBadge();
      let checkVaccie = checkVaccination();

      if (checkBadgeStatus && checkVaccie) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (state?.badge === "Yes" && state?.trainingStatus === "Yes") {
      let checkBadgeStatus = checkBadge();
      let checkTraining = checkTrainingStatus();

      if (checkBadgeStatus && checkTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (
      state?.medicalFitness === "Yes" &&
      state?.trainingStatus === "Yes"
    ) {
      let checkMedicalFitnessStatus = checkMedicalFitness();
      let checkTraining = checkTrainingStatus();

      if (checkMedicalFitnessStatus && checkTraining) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    } else if (state?.dlcenseDoc) {
      let dlStatus = checkDrivingLicense();

      if (dlStatus) {
        if (state?.isVaccinated) {
          setenableButton(true);
        } else {
          setenableButton(false);
        }
      } else {
        setenableButton(false);
      }
    } else if (state?.iDCardIssued === "Yes") {
      if (state?.dlcenseDoc) {
        let checkIdCardStatus = checkIdCard();

        if (checkIdCardStatus) {
          setenableButton(true);
        } else {
          setenableButton(false);
        }
      } else {
        let dlStatus = checkDrivingLicense();

        if (dlStatus) {
          if (state?.isVaccinated) {
            setenableButton(true);
          } else {
            setenableButton(false);
          }
        } else {
          setenableButton(false);
        }
      }
    } else if (state?.policeVerStatus === "Yes") {
      if (state?.dlcenseDoc) {
        let checkPoliceVerificationStatus = checkPoliceVerification();

        if (checkPoliceVerificationStatus) {
          setenableButton(true);
        } else {
          setenableButton(false);
        }
      } else {
        let dlStatus = checkDrivingLicense();

        if (dlStatus) {
          if (state?.isVaccinated) {
            setenableButton(true);
          } else {
            setenableButton(false);
          }
        } else {
          setenableButton(false);
        }
      }
    } else if (state?.badge === "Yes") {
      if (state?.dlcenseDoc) {
        let checkBadgeStatus = checkBadge();

        if (checkBadgeStatus) {
          setenableButton(true);
        } else {
          setenableButton(false);
        }
      } else {
        let dlStatus = checkDrivingLicense();

        if (dlStatus) {
          if (state?.isVaccinated) {
            setenableButton(true);
          } else {
            setenableButton(false);
          }
        } else {
          setenableButton(false);
        }
      }
    } else if (state?.medicalFitness === "Yes") {
      if (state?.dlcenseDoc) {
        let checkMedicalFitnessStatus = checkMedicalFitness();

        if (checkMedicalFitnessStatus) {
          setenableButton(true);
        } else {
          setenableButton(false);
        }
      } else {
        let dlStatus = checkDrivingLicense();

        if (dlStatus) {
          if (state?.isVaccinated) {
            setenableButton(true);
          } else {
            setenableButton(false);
          }
        } else {
          setenableButton(false);
        }
      }
    } else if (state?.trainingStatus === "Yes") {
      if (state?.dlcenseDoc) {
        let checkTraining = checkTrainingStatus();
        if (checkTraining) {
          setenableButton(true);
        } else {
          setenableButton(false);
        }
      } else {
        let dlStatus = checkDrivingLicense();

        if (dlStatus) {
          if (state?.isVaccinated) {
            setenableButton(true);
          } else {
            setenableButton(false);
          }
        } else {
          setenableButton(false);
        }
      }
    } else if (state?.isVaccinated) {
      if (state?.dlcenseDoc) {
        let checkVaccie = checkVaccination();
        if (checkVaccie) {
          setenableButton(true);
        } else {
          setenableButton(false);
        }
      } else {
        let dlStatus = checkDrivingLicense();

        if (dlStatus) {
          if (state?.isVaccinated) {
            setenableButton(true);
          } else {
            setenableButton(false);
          }
        } else {
          setenableButton(false);
        }
      }
    } else if (dldoc?.name) {
      if (state?.isVaccinated) {
        setenableButton(true);
      } else {
        setenableButton(false);
      }
    }
  }

  const updateVaccinationIcon = () => {
    if (
      isVaccinated === "Vaccinated Fully" ||
      isVaccinated === "Fully Vaccinated"
    ) {
      setVaccinationIcon(imagePath.fully_vaccinated);
    } else if (isVaccinated === "Partially Vaccinated") {
      setVaccinationIcon(imagePath.partially_vaccinated);
    } else if (isVaccinated === "Not Vaccinated") {
      setVaccinationIcon(imagePath.not_vaccinated);
    } else {
      setVaccinationIcon(imagePath.not_vaccinated);
    }
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
    } else if (selectionType === "DRIVER_INDUCTION") {
      setState({ ...state, driverInductionDate: momentString });
    }
  };

  const idCardList = [
    {
      value: "Aadhar Card",
      label: "Aadhar Card",
    },
    {
      value: "PAN Card",
      label: "PAN Card",
    },
    {
      value: "Passport",
      label: "Passport",
    },
    {
      value: "Driving License",
      label: "Driving License",
    },
    {
      value: "Voter Id Card",
      label: "Voter Id Card",
    },
    {
      value: "Other",
      label: "Other",
    },
  ];

  const _openGallery = async (setState, item) => {
    try {
      const res = await uploadDoc();

      let getSize = calculateFileSize(res?.size);

      if (getSize) {
        let getFIleType = getFileExtension(res?.name);
        if (
          getFIleType == "mp3" ||
          getFIleType == "mp4" ||
          getFIleType == "MP4" ||
          getFIleType == "MP3"
        ) {
          showError("Audio and video not allowed.");
        } else {
          setState(res);
          refRBSheet.current.close();
        }
      } else {
        showError(
          "The file you are trying to upload is less than 2MB. Please upload a file greater than 2MB or Capture using your device camera"
        );
      }
    } catch (error) {}
  };

  const _openCamera = async (setState, item) => {
    try {
      const res = await openCamera();

      if (res?.height < 720) {
        showError(
          "The file you are trying to upload is less than 2MB. Please upload a file greater than 720 or Capture using your device camera"
        );
      } else {
        setState({
          ...item,
          uri: res?.path,
          name: `${(Math.random() + 1).toString(36).substring(7)}.jpg`,
          type: res?.mime,
        });
        refRBSheet.current.close();
      }
    } catch (error) {}
  };
  const openBottomSheet = (setState, item) => {
    refRBSheet.current.open();
    setBottomSheetValue({
      ...bottomSheetValue,
      setState: setState,
      item: item,
    });
  };

  const _updateProfile = () => {
    setLoading(true);
    let tempUserDetails = state;
    tempUserDetails.status = "ACTIVE";
    tempUserDetails.profileStatus = "ACTIVE";
    let data = new FormData();
    var prefix = "";
    if (Platform.OS == "android") {
      prefix = "file://";
    }
    delete tempUserDetails?.shelterAddress?.latLong;
    delete tempUserDetails?.isAddressSameSecond;
    if (govtIdProofDoc?.uri) {
      data.append("govtIdProofDoc", {
        uri: govtIdProofDoc?.uri,
        name: govtIdProofDoc?.name,
        type: govtIdProofDoc.type,
      });
    } else {
      tempUserDetails.govtIdProofDoc = state?.govtIdProofDoc;
    }

    if (policedoc?.uri) {
      data.append("policedoc", {
        uri: policedoc?.uri,
        name: policedoc?.name,
        type: policedoc?.type,
      });
    } else {
      tempUserDetails.policeVerDoc = state?.policeVerDoc;
    }
    if (photo?.type) {
      data.append("photo", {
        uri: photo?.uri,
        name: photo?.name,
        type: photo?.type,
      });
    } else {
      if (state?.photo) {
        tempUserDetails.photo = state?.photo;
      } else {
        setLoading(false);
        showError("Please upload profile photo.");
        return;
      }
    }
    if (dldoc?.uri) {
      data.append("dldoc", {
        uri: dldoc.uri,
        name: dldoc?.name,
        type: dldoc?.type,
      });
    } else {
      tempUserDetails.dlcenseDoc = state?.dlcenseDoc;
    }

    if (medicalCertificateDoc?.uri) {
      data.append("medicalCertificateDoc", {
        uri: medicalCertificateDoc?.uri,
        name: medicalCertificateDoc?.name,
        type: medicalCertificateDoc?.type,
      });
    } else {
      tempUserDetails.medicalCertificateDoc = state?.medicalCertificateDoc;
    }

    data.append("data", JSON.stringify(tempUserDetails));

    actions
      .updateProfile(
        data,
        { "Content-Type": "multipart/form-data" },
        "formData"
      )
      .then((response) => {
        let { status } = response;
        if (status == 200) {
          setLoading(false);
          saveProfileData(response?.data);
          showSuccess("Your profile has been updated successfully.");
        } else {
          setLoading(false);
          showError(response?.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        showError(err?.message);
      });
  };
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollViewMainContainer}
      >
        <DocInput
          docIcon={imagePath.driving_icon}
          docName={
            !dldoc?.name
              ? state?.dlcenseDoc != null
                ? state?.dlcenseDoc
                : strings?.DRIVING_LICENCE
              : dldoc?.name
          }
          onPress={() => openBottomSheet(setDldoc, dldoc)}
          rightIcon={imagePath.editGray}
          isMendotery={true}
        />
        <View style={{}}>
          <DocInput
            docIcon={imagePath.driving_icon}
            docName="ID card"
            value={state?.iDCardIssued}
            toggleButton={() => {
              setState({
                ...state,
                iDCardIssued: state?.iDCardIssued === "Yes" ? "No" : "Yes",
              });
            }}
            multiCheckbox={true}
          />
        </View>

        {state?.iDCardIssued === "Yes" || state?.iDCardIssued === "YES" ? (
          <>
            <View style={styles.dropDownMainContainer}>
              <View style={styles.dropdownContainerRow}>
                <View style={styles.dropDownRowWidth}>
                  <Dropdown
                    style={styles.dropdownDocStyle}
                    renderItem={(item) => (
                      <View style={styles.dropdownRenderItem}>
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
                    valueField="value"
                    placeholder="Government Id proof"
                    iconColor={colors.darkGray}
                    data={idCardList}
                    value={state?.govtidproof}
                    onChange={(item) => {
                      setState({
                        ...state,
                        govtidproof: item.value,
                      });
                    }}
                    renderLeftIcon={() => (
                      <Image
                        style={styles.iconStyle}
                        name="Safety"
                        source={imagePath.driving_icon}
                        resizeMode="contain"
                      />
                    )}
                  />
                </View>
              </View>
            </View>
            <DocInput
              docIcon={imagePath.identity_proof}
              docName={
                !govtIdProofDoc?.name
                  ? state?.govtIdProofDoc != null
                    ? state?.govtIdProofDoc
                    : "Upload Government Id Proof Document"
                  : govtIdProofDoc?.name
              }
              rightIcon={imagePath.editGray}
              onPress={() => openBottomSheet(setgovtIdProofDoc, govtIdProofDoc)}
              isMendotery={true}
            />
          </>
        ) : null}

        <DocInput
          docIcon={imagePath.DriverInduction}
          docName="Driver Induction"
          value={state?.driverInduction}
          toggleButton={() => {
            setState({
              ...state,
              driverInduction: state?.driverInduction === "Yes" ? "No" : "Yes",
            });
          }}
          multiCheckbox={true}
        />
        {state?.driverInduction === "Yes" ? (
          <TextInputComp
            editable={false}
            multiline={true}
            rightIcon={imagePath.actualtime}
            inputContainerStyle={styles.docContainer}
            inputStyle={styles.editableInputStyle}
            placeholder="Driver Innduction Date"
            value={
              state?.driverInductionDate
                ? moment(state?.driverInductionDate).format("DD-MM-YYYY")
                : ""
            }
            icon={imagePath.policeVarificationExoiryDate}
            rightIconClick={() => {
              setselectionType("DRIVER_INDUCTION");
              setshowDateAndTimePicker(true);
              setDateMinPicker(new Date(todayDate));
              setDateMaxPicker();
            }}
            isMendotery={false}
          />
        ) : null}

        <DocInput
          docIcon={imagePath.policeVarification}
          docName="Police verification document"
          value={state?.policeVerStatus}
          toggleButton={() => {
            setState({
              ...state,
              policeVerStatus: state?.policeVerStatus === "Yes" ? "No" : "Yes",
            });
          }}
          multiCheckbox={true}
        />

        {state?.policeVerStatus === "Yes" ||
        state?.policeVerStatus === "YES" ? (
          <>
            <TextInputComp
              inputContainerStyle={styles.docContainer}
              inputStyle={styles.editableInputStyle}
              value={state?.policeVerificationCode}
              onChangeText={(text) =>
                setState({ ...state, policeVerificationCode: text })
              }
              placeholder="Police Verification Code"
              editable={true}
              icon={imagePath.PoliceVerificationCode}
              isMendotery={true}
            />
            <DocInput
              docIcon={imagePath.policeVarification}
              docName={
                !policedoc?.name
                  ? state?.policeVerDoc != null
                    ? state?.policeVerDoc
                    : strings?.POLICE_VERIFICATION
                  : policedoc?.name
              }
              onPress={() => openBottomSheet(setPolicedoc, policedoc)}
              rightIcon={imagePath.editGray}
              isMendotery={true}
            />

            <TextInputComp
              editable={false}
              multiline={true}
              rightIcon={imagePath.actualtime}
              inputContainerStyle={styles.docContainer}
              inputStyle={styles.editableInputStyle}
              placeholder="Police Verification Expiry Date"
              value={
                state?.policeverificationexpirydate
                  ? moment(state?.policeverificationexpirydate).format(
                      "DD-MM-YYYY"
                    )
                  : ""
              }
              icon={imagePath.policeVarificationExoiryDate}
              rightIconClick={() => {
                setselectionType("POLICCE_VERIFICATIO_EXPIRY_DATE");
                setshowDateAndTimePicker(true);
                setDateMinPicker(new Date(todayDate));
                setDateMaxPicker();
              }}
              isMendotery={true}
            />
          </>
        ) : null}

        <View
          style={[styles.vaccinatedMainContainer, { flexDirection: "row" }]}
        >
          <Dropdown
            style={styles.dropdownDocStyle}
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
            placeholder={strings.VACCINATION_STATUS}
            iconColor={colors.darkGray}
            data={state?.isVaccinated === "Fully Vaccinated" ? data2 : data}
            value={state?.isVaccinated}
            onChange={(item) => {
              setState({
                ...state,
                isVaccinated: item.value,
              });
              setVaccinationIcon(item.image);
            }}
            renderLeftIcon={() => (
              <Image
                style={styles.iconStyle}
                name="Safety"
                source={vaccinationIcon}
                resizeMode="contain"
              />
            )}
          />
          <Text
            style={{
              color: colors.darkRed,
              fontSize: 16,
              marginLeft: 2,
              marginTop: 8,
            }}
          >
            *
          </Text>
        </View>

        <DocInput
          docIcon={imagePath.badge}
          docName="Badge"
          value={state?.badge}
          toggleButton={() => {
            setState({
              ...state,
              badge: state?.badge === "Yes" ? "No" : "Yes",
            });
          }}
          multiCheckbox={true}
        />

        {state.badge === "Yes" || state.badge === "YES" ? (
          <>
            <TextInputComp
              inputContainerStyle={styles.docContainer}
              inputStyle={styles.editableInputStyle}
              value={state?.badgeNo}
              onChangeText={(text) => setState({ ...state, badgeNo: text })}
              placeholder="Badge Number"
              editable={true}
              icon={imagePath.badgeNumber}
              isMendotery={true}
            />
            <TextInputComp
              editable={false}
              multiline={true}
              rightIcon={imagePath.actualtime}
              inputContainerStyle={styles.docContainer}
              inputStyle={styles.editableInputStyle}
              placeholder="Badge Expiry Date"
              value={
                state?.badgeExpDate
                  ? moment(state?.badgeExpDate).format("DD-MM-YYYY")
                  : ""
              }
              icon={imagePath.actualtime}
              rightIconClick={() => {
                setselectionType("BADGE_EXP_DATE");
                setshowDateAndTimePicker(true);
                setDateMinPicker(new Date(todayDate));
                setDateMaxPicker();
              }}
              isMendotery={true}
            />
          </>
        ) : null}

        <DocInput
          docIcon={imagePath.MedicalFitness}
          docName="Medical Fitness"
          value={state?.medicalFitness}
          toggleButton={() => {
            setState({
              ...state,
              medicalFitness: state?.medicalFitness === "Yes" ? "No" : "Yes",
            });
          }}
          multiCheckbox={true}
        />

        {state?.medicalFitness === "Yes" || state?.medicalFitness === "YES" ? (
          <>
            <TextInputComp
              editable={false}
              multiline={true}
              rightIcon={imagePath.actualtime}
              inputContainerStyle={styles.docContainer}
              inputStyle={styles.editableInputStyle}
              placeholder="Medical Fitness Expiry Date"
              value={
                state?.medicalFitnessExpiryDate
                  ? moment(state?.medicalFitnessExpiryDate).format("DD-MM-YYYY")
                  : ""
              }
              icon={imagePath.MedicalFitnessExpiryDate}
              rightIconClick={() => {
                setselectionType("MEDICAL_FITNESS_EXP_DATE");
                setshowDateAndTimePicker(true);
                setDateMinPicker(new Date(todayDate));
                setDateMaxPicker();
              }}
              isMendotery={true}
            />
            <DocInput
              docIcon={imagePath.MedicalFitness}
              docName={
                !medicalCertificateDoc?.name
                  ? state?.medicalCertificateDoc != null
                    ? state?.medicalCertificateDoc
                    : "Upload Medical Certificate"
                  : medicalCertificateDoc?.name
              }
              rightIcon={imagePath.editGray}
              onPress={() =>
                openBottomSheet(setmedicalCertificateDoc, medicalCertificateDoc)
              }
              isMendotery={true}
            />
          </>
        ) : null}

        <DocInput
          docIcon={imagePath.trainingStatus}
          docName="Driver Training"
          value={state?.trainingStatus}
          toggleButton={() => {
            setState({
              ...state,
              trainingStatus: state?.trainingStatus === "Yes" ? "No" : "Yes",
            });
          }}
          multiCheckbox={true}
        />

        {state?.trainingStatus === "Yes" || state?.trainingStatus === "YES" ? (
          <TextInputComp
            editable={false}
            multiline={true}
            rightIcon={imagePath.actualtime}
            inputContainerStyle={styles.docContainer}
            inputStyle={styles.editableInputStyle}
            placeholder="Last Training Date"
            value={
              state?.lastTrainingDate
                ? moment(state?.lastTrainingDate).format("DD-MM-YYYY")
                : ""
            }
            icon={imagePath.trainingDate}
            rightIconClick={() => {
              setselectionType("LAST_TRAINING_DATE");
              setshowDateAndTimePicker(true);
              setDateMinPicker();
              setDateMaxPicker(new Date(todayDate));
            }}
            isMendotery={true}
          />
        ) : null}

        <View style={styles.bottomView}>
          <ButtonComp
            disabled={!enableButton}
            btnText={strings.SUBMIT}
            btnStyle={enableButton ? styles.submitBtnStyle : styles.disableBtn}
            //btnStyle={styles.submitBtnStyle}
            btnTextStyle={styles.submitBtnTextStyle}
            onPress={_updateProfile}
          />
        </View>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={styles.bottomSheetStyle}
        >
          <View style={styles.selectMediaContainer}>
            <Text style={styles.selectItemText}>{strings.SELECT_ITEM}</Text>
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() =>
                _openCamera(bottomSheetValue.setState, bottomSheetValue.item)
              }
            >
              <Image source={imagePath.cameraIcon} />
              <Text style={styles.itemTextStyle}>{strings.OPEN_CAMERA}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.openGalleryContainer}
              onPress={() =>
                _openGallery(bottomSheetValue.setState, bottomSheetValue.item)
              }
            >
              <Image source={imagePath.folderIcon} />
              <Text style={styles.itemTextStyle}>{strings.OPEN_GALLERY}</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </ScrollView>
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
    </>
  );
};

export default index;

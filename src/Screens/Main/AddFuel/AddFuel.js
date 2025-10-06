import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Linking,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef } from "react";
import WrapperContainer from "../../../Components/WrapperContainer";
import { styles } from "./style";
import strings from "../../../constants/lang";
import imagePath from "../../../constants/imagePath";
import { height, moderateScale, width } from "../../../styles/responsiveSize";
import { useEffect } from "react";
import actions from "../../../redux/actions";
import { useSelector } from "react-redux";
import { showError, showSuccess } from "../../../utils/helperFunction";
import Moment from "moment";
import { extendMoment } from "moment-range";
import colors from "../../../styles/colors";
import ScreensHeader from "../../../Components/ScreensHeader";
import { useIsFocused } from "@react-navigation/native";
import { DOC_URL, GET_DRIVER_VEHICLE_NUMBER } from "../../../config/urls";
import UploadDocInput from "../../../Components/UploadDocInput";
import ButtonComp from "../../../Components/ButtonComp";
import CalenderComp from "../../../Components/CalenderComp";
import { ScrollView } from "react-native-gesture-handler";
import { apiGet } from "../../../utils/utils";
import { openCamera } from "../../../utils/imagePickerFun";
import { imageCompress } from "../../../utils/imageCompressor";

const moment = extendMoment(Moment);

export default function AddFuel({ route, navigation }) {
  const [isLoading, setisLoading] = useState(false);
  const [invoiceName, setinvoiceName] = useState("");
  const [invoiceUri, setinvoiceUri] = useState("");
  const [odoMeterDocName, setodoMeterDocName] = useState("");
  const [odoMeterDocUri, setodoMeterDocUri] = useState("");
  const [indentDocUri, setindentDocUri] = useState("");
  const [indentDocName, setindentDocName] = useState("");
  const [loadingButton, setloadingButton] = useState(false);
  const [showCalender, setshowCalender] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [vehicleNumber, setvehicleNumber] = useState("");
  const [fuelPrice, setfuelPrice] = useState("");
  const [fuelVolume, setfuelVolume] = useState("");
  const [odoMeterReading, setodoMeterReading] = useState("");
  const [fuelStation, setfuelStation] = useState("");
  const [indentNetworkUri, setindentNetworkUri] = useState("");
  const [odoMeterNNetworkUri, setodoMeterNNetworkUri] = useState("");
  const [invoiceNetworkUri, setinvoiceNetworkUri] = useState("");
  const [showsubmitButton, setshowsubmitButton] = useState(true);
  const [todayDate, settodayDate] = useState("");
  const [milege, setmilege] = useState("");
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );

  useEffect(() => {
    setinvoiceName("");
    setodoMeterDocName("");
    setinvoiceUri("");
    setodoMeterDocUri("");
    setindentDocUri("");
    setindentDocName("");
    setSelectedDate("");
    //setvehicleNumber("");
    setfuelPrice("");
    setfuelVolume();
    setodoMeterReading("");
    setfuelStation("");
    getVehicleDetail();
    setminDate();
  }, []);

  const setminDate = () => {
    var currentDate = moment(new Date()).format("YYYY-MM-DD");
    settodayDate(currentDate);
  };

  const getVehicleDetail = async () => {
    if (profileData?.id) {
      apiGet(`${GET_DRIVER_VEHICLE_NUMBER}/${profileData?.id}/driver`)
        .then((res) => {
          if (res?.status === 200) {
            setvehicleNumber(res?.data?.vehicleNumber);
          } else {
            setshowsubmitButton(false);
            setvehicleNumber("");
            showError("Vehicle not assign.");
          }
        })

        .catch((error) => {
          setvehicleNumber("");
        });
    } else {
    }
  };

  const submitFuel = () => {
    if (
      selectedDate === "" ||
      vehicleNumber === "" ||
      fuelPrice === "" ||
      fuelVolume === "" ||
      odoMeterReading === "" ||
      fuelStation === "" ||
      invoiceUri === "" ||
      odoMeterDocUri === "" ||
      indentDocUri === ""
    ) {
      showError("All fields are required.");
    } else {
      setisLoading(true);
      let sendingData = {
        date: selectedDate,
        vehicleNo: vehicleNumber,
        fuelPrice: fuelPrice,
        fuelVolume: fuelVolume,
        odoMeterReadin: odoMeterReading,
        fuelStation: fuelStation,
        invoiceDoc: invoiceNetworkUri,
        odoMeterDoc: odoMeterNNetworkUri,
        indentDoc: indentNetworkUri,
        driverId: profileData?.id,
        mileage: milege,
      };

      actions
        .addFuel(sendingData)
        .then((res) => {
          setisLoading(false);

          if (res?.status === 200) {
            showSuccess("Fuel price submitted successfully.");
            navigation.goBack();
          } else {
            showError("Network error.");
          }
        })
        .catch((err) => {
          showError("Network error.");
          setisLoading(false);
        });
    }
  };

  const submitFile = async (res, type, selectionType) => {
    setloadingButton(true);

    let formData = new FormData();

    if (selectionType == "camera") {
      let getCompImg = await imageCompress(res?.path);

      if (getCompImg) {
        if (res?.type) {
          formData.append("photo", {
            uri: getCompImg,
            name: res?.name,
            type: res?.type,
          });
        } else {
          formData.append("photo", {
            uri: getCompImg,
            name: "photo",
            type: res?.mime,
          });
        }
      } else {
        if (res?.type) {
          formData.append("photo", {
            uri: res?.uri,
            name: res?.name,
            type: res?.type,
          });
        } else {
          formData.append("photo", {
            uri: res?.path,
            name: "photo",
            type: res?.mime,
          });
        }
      }
    } else {
      if (res?.type) {
        formData.append("photo", {
          uri: res?.uri,
          name: res?.name,
          type: res?.type,
        });
      } else {
        formData.append("photo", {
          uri: res?.path,
          name: "photo",
          type: res?.mime,
        });
      }
    }

    actions
      .saveFuelFile(
        formData,
        {
          "Content-Type": "multipart/form-data",
        },
        "formData"
      )
      .then((res) => {
        setloadingButton(false);

        if (res?.status === 200) {
          if (type === "INVOICE") {
            setinvoiceNetworkUri(res?.data?.documentName);
          } else if (type === "ODOMETER") {
            setodoMeterNNetworkUri(res?.data?.documentName);
          } else if (type === "INDENT") {
            setindentNetworkUri(res?.data?.documentName);
          } else {
          }
        } else {
          showError("Error in file upload.");
          if (type === "INVOICE") {
            setinvoiceName("");
            setinvoiceUri("");
          } else if (type === "ODOMETER") {
            setodoMeterDocName("");
            setodoMeterDocUri("");
          } else if (type === "INDENT") {
            setindentDocName("");
            setindentDocUri("");
          } else {
          }
        }
      })
      .catch((err) => {
        setloadingButton(false);
        showError("Error in file upload.");
        if (type === "INVOICE") {
          setinvoiceName("");
          setinvoiceUri("");
        } else if (type === "ODOMETER") {
          setodoMeterDocName("");
          setodoMeterDocUri("");
        } else if (type === "INDENT") {
          setindentDocName("");
          setindentDocUri("");
        } else {
        }
      });
  };

  return (
    <WrapperContainer isLoading={isLoading} withModal={true}>
      {showCalender ? (
        <CalenderComp
          closeModal={() => {
            setshowCalender(!showCalender);
          }}
          minDate={todayDate}
          setselectedDate={(date) => {
            setSelectedDate(moment(date).format("DD-MM-YYYY"));
            setshowCalender(!showCalender);
          }}
        />
      ) : null}
      <ScreensHeader title={strings.ADD_FUEL} navigation={navigation} />
      <View style={styles.bottomContainer}>
        <View style={styles.contentSectionContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.rowContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ width: "90%" }}>
                  <TextInput
                    style={styles.docContainer}
                    placeholderTextColor={colors.mediumGray}
                    onChangeText={(text) => {}}
                    value={selectedDate}
                    placeholder={"Date"}
                    editable={false}
                    //keyboardType="numeric"
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setshowCalender(!showCalender);
                  }}
                  style={{ width: "10%" }}
                >
                  <Image
                    source={imagePath.actualtime}
                    style={{ height: 15, width: 15 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.rowContainer}>
              <TextInput
                editable={false}
                style={styles.docContainer}
                placeholderTextColor={colors.mediumGray}
                onChangeText={(text) => {
                  setvehicleNumber(text);
                }}
                value={vehicleNumber}
                placeholder={"Vehicle Number"}
                //keyboardType="numeric"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ width: "48%" }}>
                <View style={styles.rowContainer}>
                  <TextInput
                    style={styles.docContainer}
                    placeholderTextColor={colors.mediumGray}
                    onChangeText={(text) => {
                      if (text === "") {
                        setfuelPrice(text);
                      } else {
                        if (text == 0 || text < 0) {
                          showError("Fuel price should gretater than 0.");
                        } else {
                          setfuelPrice(text);
                        }
                      }
                    }}
                    value={fuelPrice}
                    placeholder={"Fuel Price"}
                    keyboardType="numeric"
                    maxLength={6}
                  />
                </View>
              </View>
              <View style={{ width: "48%" }}>
                <View style={styles.rowContainer}>
                  <TextInput
                    style={styles.docContainer}
                    placeholderTextColor={colors.mediumGray}
                    onChangeText={(text) => {
                      if (text === "") {
                        setfuelVolume(text);
                      } else {
                        if (text == 0 || text < 0) {
                          showError("Fuel volume should gretater than 0.");
                        } else {
                          setfuelVolume(text);
                        }
                      }
                    }}
                    value={fuelVolume}
                    placeholder={"Fuel Volume"}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>
              </View>
            </View>
            <View style={styles.rowContainer}>
              <TextInput
                style={styles.docContainer}
                placeholderTextColor={colors.mediumGray}
                onChangeText={(text) => {
                  if (text === "") {
                    setodoMeterReading(text);
                  } else {
                    if (text == 0 || text < 0) {
                      showError("ODO meter reading should gretater than 0.");
                    } else {
                      setodoMeterReading(text);
                    }
                  }
                }}
                value={odoMeterReading}
                placeholder={"ODO Meter Reading"}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
            {route?.params?.fuelTrackingList ? (
              route?.params?.fuelTrackingList?.length == 0 ? (
                <View style={styles.rowContainer}>
                  <TextInput
                    style={styles.docContainer}
                    placeholderTextColor={colors.mediumGray}
                    onChangeText={(text) => {
                      setmilege(text);
                    }}
                    value={milege}
                    placeholder={"Milege/average Kms"}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              ) : null
            ) : null}
            <View style={styles.rowContainer}>
              <TextInput
                style={styles.docContainer}
                placeholderTextColor={colors.mediumGray}
                onChangeText={(text) => {
                  setfuelStation(text);
                }}
                value={fuelStation}
                placeholder={"Fuel Station"}
                //keyboardType="numeric"
              />
            </View>
            <UploadDocInput
              placeholder={"Upload Invoice"}
              setselectedDoc={(uri, selectionType) => {
                submitFile(uri, "INVOICE", selectionType);
                setinvoiceUri(uri);
              }}
              setselectedDocName={(docName) => {
                setinvoiceName(docName);
              }}
              documentName={invoiceName}
              documentUri={invoiceUri}
              cleanSelection={() => {
                setinvoiceName("");
                setinvoiceUri("");
              }}
              loadingButton={loadingButton}
            />
            <UploadDocInput
              placeholder={"Upload ODO Meter Reading"}
              setselectedDoc={(uri, selectionType) => {
                submitFile(uri, "ODOMETER", selectionType);
                setodoMeterDocUri(uri);
              }}
              setselectedDocName={(docName) => {
                setodoMeterDocName(docName);
              }}
              documentName={odoMeterDocName}
              documentUri={odoMeterDocUri}
              cleanSelection={() => {
                setodoMeterDocName("");
                setodoMeterDocUri("");
              }}
              loadingButton={loadingButton}
            />
            <UploadDocInput
              placeholder={"Upload Indent"}
              setselectedDoc={(uri, selectionType) => {
                submitFile(uri, "INDENT", selectionType);
                setindentDocUri(uri);
              }}
              setselectedDocName={(docName) => {
                setindentDocName(docName);
              }}
              documentName={indentDocName}
              documentUri={indentDocUri}
              cleanSelection={() => {
                setindentDocName("");
                setindentDocUri("");
              }}
              loadingButton={loadingButton}
            />
            <View style={styles.rowContainer}>
              {showsubmitButton ? (
                <View style={styles.submitButtonContainer}>
                  {loadingButton ? (
                    <View style={styles.submitBtnStyle}>
                      <ActivityIndicator size={15} color={colors.white} />
                    </View>
                  ) : (
                    <ButtonComp
                      btnText={strings.SUBMIT}
                      btnStyle={styles.submitBtnStyle}
                      btnTextStyle={styles.submitBtnTextStyle}
                      onPress={() => {
                        submitFuel();
                      }}
                    />
                  )}
                </View>
              ) : (
                <View style={styles.submitButtonContainer}>
                  <ButtonComp
                    disabled={true}
                    btnText={strings.SUBMIT}
                    btnStyle={styles.disableBtn}
                    btnTextStyle={styles.submitBtnTextStyle}
                    // onPress={() => {
                    //   submitFuel();
                    // }}
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </WrapperContainer>
  );
}

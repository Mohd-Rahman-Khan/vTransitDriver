import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TextInput,
  Linking,
} from "react-native";
import React, { useState, useRef } from "react";
import WrapperContainer from "../../../Components/WrapperContainer";
import { styles } from "./style";
import strings from "../../../constants/lang";
import imagePath from "../../../constants/imagePath";
import DetailBox from "./Component/DetailBox";
import { moderateScale, width } from "../../../styles/responsiveSize";
import { useEffect } from "react";
import actions from "../../../redux/actions";
import { useSelector } from "react-redux";
import { openCamera, openGallery } from "../../../utils/imagePickerFun";
import { showError, showSuccess } from "../../../utils/helperFunction";
import RBSheet from "react-native-raw-bottom-sheet";
import Moment from "moment";
import DatePicker from "react-native-date-picker";
import { Calendar } from "react-native-calendars";
import { extendMoment } from "moment-range";
import CalenderComp from "../../../Components/CalenderComp";
import { imageCompress } from "../../../utils/imageCompressor";
import colors from "../../../styles/colors";
import ButtonComp from "../../../Components/ButtonComp";
import {
  GET_ALL_COMPLIOANCE,
  GET_VEHICLE_COMPLIOANCE,
  GET_DRIVER_VEHICLE_NUMBER,
  DOC_URL,
} from "../../../config/urls";
import {
  apiGet,
  calculateFileSize,
  getFileExtension,
} from "../../../utils/utils";
import { uploadDoc } from "../../../utils/docPickerFun";
import navigationStrings from "../../../navigation/navigationStrings";
import ScreensHeader from "../../../Components/ScreensHeader";
import InfoSheet from "../../../Components/InfoSheet";

const moment = extendMoment(Moment);

const infoList = [
  {
    icon: imagePath.cameraIcon,
    name: "Open camera",
  },
  {
    icon: imagePath.folderIcon,
    name: "Open gallery",
  },
  {
    icon: imagePath.driverNotAssigned,
    name: "Driver not assign",
  },
  {
    icon: imagePath.expireIcon_Blue,
    name: "Pending",
  },
  {
    icon: imagePath.waiting,
    name: "Pending",
  },
  {
    icon: imagePath.warningIcon,
    name: "Rejected",
  },
  {
    icon: imagePath.check_mark_circle,
    name: "Approved",
  },
  {
    icon: imagePath.editcalendar,
    name: "Edit date",
  },
  {
    icon: imagePath.editIcon,
    name: "Edit",
  },
  {
    icon: imagePath.uploadIcon,
    name: "Upload",
  },
  {
    icon: imagePath.expireIcon_orange,
    name: "About to expire",
  },

  {
    icon: imagePath.expireIconred,
    name: "Expired",
  },

  {
    icon: imagePath.expireIcon_green,
    name: "Valid",
  },
];

export default function Compliance({ route, navigation }) {
  const [showDateAndTimePicker, setshowDateAndTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateMaxPicker, setDateMaxPicker] = useState("");
  const [dateMinPicker, setDateMinPicker] = useState("");
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );
  const [loading, setloading] = useState(false);
  const [selectDriver, setselectDriver] = useState(true);
  const [selectVehicle, setselectVehicle] = useState(false);
  const [compliancesList, setcompliancesList] = useState([]);
  const [vehicleCompliancesList, setvehicleCompliancesList] = useState([]);
  const [driverProfileData, setdriverProfileData] = useState("");
  const [todayDate, settodayDate] = useState("");
  const [selectedData, setselectedData] = useState("");
  const [showCalender, setshowCalender] = useState(false);
  const [subCategoryId, setsubCategoryId] = useState("");
  const [expiredBadgeCount, setexpiredBadgeCount] = useState(0);
  const [aboutToExpireBadgeCount, setaboutToExpireBadgeCount] = useState(0);
  const [vehicleexpiredBadgeCount, setvehicleexpiredBadgeCount] = useState(0);
  const [vehicleaboutToExpireBadgeCount, setvehicleaboutToExpireBadgeCount] =
    useState(0);

  const [vehicleDetail, setvehicleDetail] = useState("");

  const [documentType, setdocumentType] = useState("");
  const [query, setquery] = useState("");
  const [driverVehicleNotMapped, setdriverVehicleNotMapped] = useState(false);
  const [showInnfoScreen, setshowInnfoScreen] = useState();
  const [canEdit, setcanEdit] = useState(false);
  const infoSheet = useRef();
  const getModulePermissionData = useSelector(
    (state) => state?.modulePermission?.modulePermissionData
  );

  const refRBSheet = useRef();

  useEffect(() => {
    getVehicleDetail();
    getComplianceEditPermision();
    getDriverCompliance("");
    getVehicleComplianceList("");
    setminDate();
  }, []);

  useEffect(() => {
    if (route.params?.data) {
      if (route.params?.data?.driverCompliance) {
        setselectDriver(true);
        setselectVehicle(false);
      } else {
        setselectVehicle(true);
        setselectDriver(false);
      }
    } else {
    }
  }, []);

  const getComplianceEditPermision = () => {
    if (getModulePermissionData?.permissions) {
      let checkCompliance = getModulePermissionData?.permissions?.find(
        (item) => item?.moduleName == "Compliance"
      );

      if (checkCompliance) {
        if (checkCompliance?.actions) {
          let findEditPerm = checkCompliance?.actions?.find(
            (itemData) => itemData == "Edit"
          );
          if (findEditPerm) {
            setcanEdit(true);
          } else {
            setcanEdit(false);
          }
        } else {
          setcanEdit(false);
        }
      } else {
        setcanEdit(false);
      }
    }
  };

  const getDriverCompliance = (type) => {
    actions
      .getAllCompliances(GET_ALL_COMPLIOANCE)
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data) {
            if (res?.data.length > 0) {
              let metList = [];
              let notmetList = [];
              let activeList = [];
              let aboutToExpList = [];
              let expiredList = [];
              let rejectedList = [];
              let pendingCompListData = [];
              for (let i = 0; i < res?.data.length; i++) {
                if (res?.data[i]?.status === "MET") {
                  if (res?.data[i].complianceSubTopicList.length > 0) {
                    let checkStatus = res?.data[i].complianceSubTopicList.find(
                      (itemData) => itemData.status === "PENDING"
                    );

                    if (checkStatus) {
                      pendingCompListData.push(res?.data[i]);
                    } else {
                      let checkDate = res?.data[i].complianceSubTopicList.find(
                        (itemData) => itemData.inputType === "date"
                      );

                      if (checkDate) {
                        if (checkDate?.fileName) {
                          var startDate = new Date();
                          var endDate = new Date(checkDate?.fileName);
                          var ndays;
                          var tv1 = startDate.valueOf();
                          var tv2 = endDate.valueOf();

                          ndays = (tv2 - tv1) / 1000 / 86400;
                          ndays = Math.round(ndays - 0.5);

                          if (ndays < 16) {
                            if (ndays == -1) {
                              aboutToExpList.push(res?.data[i]);
                            } else if (ndays < 0) {
                              expiredList.push(res?.data[i]);
                            } else {
                              aboutToExpList.push(res?.data[i]);
                            }
                          } else {
                            metList.push(res?.data[i]);
                          }
                        } else {
                          metList.push(res?.data[i]);
                        }
                      } else {
                        metList.push(res?.data[i]);
                      }
                    }
                  } else {
                    metList.push(res?.data[i]);
                  }
                } else if (res?.data[i]?.status === "NOTMET") {
                  if (res?.data[i].complianceSubTopicList.length > 0) {
                    let checkStatus = res?.data[i].complianceSubTopicList.find(
                      (itemData) => itemData.status === "PENDING"
                    );

                    if (checkStatus) {
                      pendingCompListData.push(res?.data[i]);
                    } else {
                      notmetList.push(res?.data[i]);
                    }
                  }
                } else if (res?.data[i]?.status === "WAIVEOFF") {
                  activeList.push(res?.data[i]);
                } else if (res?.data[i]?.status === "REJECTED") {
                  rejectedList.push(res?.data[i]);
                } else {
                  activeList.push(res?.data[i]);
                }
              }
              setaboutToExpireBadgeCount(aboutToExpList.length);
              setexpiredBadgeCount(
                activeList.length +
                  notmetList.length +
                  expiredList.length +
                  rejectedList.length
              );

              if (type === "") {
                setcompliancesList([
                  ...rejectedList,
                  ...activeList,
                  ...notmetList,
                  ...expiredList,
                  ...pendingCompListData,
                  ...aboutToExpList,
                  ...metList,
                ]);
              } else {
                let mergeArr = [];
                mergeArr = [
                  ...rejectedList,
                  ...activeList,
                  ...notmetList,
                  ...expiredList,
                  ...pendingCompListData,
                  ...aboutToExpList,
                  ...metList,
                ];

                let newArr = mergeArr.map((item) => {
                  if (item.id === selectedData.id) {
                    let checkStatus = item.complianceSubTopicList.find(
                      (itemData) => itemData.fileName === null
                    );
                    if (checkStatus) {
                      item.isSelected = true;
                    }
                  }
                  return { ...item };
                });

                setcompliancesList(newArr);
              }
            } else {
            }
          } else {
          }
        } else {
          showError("Server error");
        }
      })
      .catch((err) => {});
  };

  const getVehicleComplianceList = (type) => {
    actions
      .getAllCompliances(GET_VEHICLE_COMPLIOANCE)
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data) {
            if (res?.data.length > 0) {
              let metList = [];
              let notmetList = [];
              let activeList = [];
              let aboutToExpList = [];
              let expiredList = [];

              let rejectedList = [];

              let pendingCompListData = [];
              for (let i = 0; i < res?.data.length; i++) {
                if (res?.data[i]?.status === "MET") {
                  if (res?.data[i].complianceSubTopicList.length > 0) {
                    let checkStatus = res?.data[i].complianceSubTopicList.find(
                      (itemData) => itemData.status === "PENDING"
                    );

                    if (checkStatus) {
                      pendingCompListData.push(res?.data[i]);
                    } else {
                      let checkDate = res?.data[i].complianceSubTopicList.find(
                        (itemData) => itemData.inputType === "date"
                      );

                      if (checkDate) {
                        if (checkDate?.fileName) {
                          var startDate = new Date();
                          var endDate = new Date(checkDate?.fileName);
                          var ndays;
                          var tv1 = startDate.valueOf();
                          var tv2 = endDate.valueOf();

                          ndays = (tv2 - tv1) / 1000 / 86400;
                          ndays = Math.round(ndays - 0.5);

                          if (ndays < 16) {
                            if (ndays == -1) {
                              aboutToExpList.push(res?.data[i]);
                            } else if (ndays < 0) {
                              expiredList.push(res?.data[i]);
                            } else {
                              aboutToExpList.push(res?.data[i]);
                            }
                          } else {
                            metList.push(res?.data[i]);
                          }
                        } else {
                          metList.push(res?.data[i]);
                        }
                      } else {
                        metList.push(res?.data[i]);
                      }
                    }
                  } else {
                    metList.push(res?.data[i]);
                  }
                } else if (res?.data[i]?.status === "NOTMET") {
                  if (res?.data[i].complianceSubTopicList.length) {
                    let checkStatus = res?.data[i].complianceSubTopicList.find(
                      (itemData) => itemData.status === "PENDING"
                    );

                    if (checkStatus) {
                      pendingCompListData.push(res?.data[i]);
                    } else {
                      notmetList.push(res?.data[i]);
                    }
                  }
                } else if (res?.data[i]?.status === "WAIVEOFF") {
                  activeList.push(res?.data[i]);
                } else if (res?.data[i]?.status === "REJECTED") {
                  rejectedList.push(res?.data[i]);
                } else {
                  activeList.push(res?.data[i]);
                }
              }
              setvehicleaboutToExpireBadgeCount(aboutToExpList.length);
              setvehicleexpiredBadgeCount(
                activeList.length +
                  notmetList.length +
                  expiredList.length +
                  rejectedList.length
              );

              if (type === "") {
                setvehicleCompliancesList([
                  ...rejectedList,
                  ...activeList,
                  ...notmetList,
                  ...expiredList,
                  ...pendingCompListData,
                  ...aboutToExpList,
                  ...metList,
                ]);
              } else {
                let mergeArr = [];
                mergeArr = [
                  ...activeList,
                  ...notmetList,
                  ...expiredList,
                  ...pendingCompListData,
                  ...aboutToExpList,
                  ...metList,
                ];

                let newArr = mergeArr.map((item) => {
                  if (item.id === selectedData.id) {
                    let checkStatus = item.complianceSubTopicList.find(
                      (itemData) => itemData.fileName === null
                    );
                    if (checkStatus) {
                      item.isSelected = true;
                    }
                  }
                  return { ...item };
                });

                setvehicleCompliancesList(newArr);
              }
            } else {
            }
          } else {
          }
        } else {
          showError("Server error");
        }
      })
      .catch((err) => {});
  };

  const setminDate = () => {
    var currentDate = moment(new Date()).format("YYYY-MM-DD");
    settodayDate(currentDate);
    setDateMinPicker(new Date(currentDate));
  };

  const getVehicleDetail = async () => {
    if (profileData?.id) {
      apiGet(`${GET_DRIVER_VEHICLE_NUMBER}/${profileData?.id}/driver`)
        .then((res) => {
          if (res?.status === 200) {
            setvehicleDetail(res?.data);
          } else {
            setdriverVehicleNotMapped(true);
          }
        })
        .catch((error) => {});
    } else {
    }
  };

  const submitCameraFile = (uri) => {
    let data = new FormData();
    let selectedImage = uri.split(".").pop();

    data.append("photo", {
      uri: uri,
      name: `${(Math.random() + 1).toString(36).substring(7)}.${selectedImage}`,
      type: `image/${selectedImage}`,
    });

    actions
      .uploadFile(
        data,
        { "Content-Type": "multipart/form-data" },
        "formData",
        "Axios"
      )
      .then((res) => {
        if (res?.status === 200) {
          createDriverCompliance(res?.data?.documentName);
        } else {
          showError("Error in file upload.");
        }
      })
      .catch((err) => {
        showError(err?.message);
      });
  };

  const submitFile = (res) => {
    let data = new FormData();

    data.append("photo", {
      uri: res?.uri,
      type: res?.type,
      name: res?.name,
    });

    actions
      .uploadFile(
        data,
        { "Content-Type": "multipart/form-data" },
        "formData",
        "Axios"
      )
      .then((res) => {
        if (res?.status === 200) {
          createDriverCompliance(res?.data?.documentName);
        } else {
          showError("Error in file upload.");
        }
      })
      .catch((err) => {
        showError("Error in file upload.");
      });
  };

  const setSelectedDate = (date) => {
    createDriverCompliance(date);
  };

  const createDriverCompliance = (dataFromInput) => {
    let getSelectedData = selectedData;

    for (let i = 0; i < getSelectedData?.complianceSubTopicList.length; i++) {
      if (getSelectedData?.complianceSubTopicList[i].id === subCategoryId) {
        getSelectedData.complianceSubTopicList[i].fileName = dataFromInput;
        getSelectedData.complianceSubTopicList[i].status = "PENDING";
      } else {
      }
    }

    if (selectVehicle) {
      let sendingDataToApi = {
        vehicleId: vehicleDetail?.vehicleId,
        driverId: profileData?.id,
        complianceGroupId: getSelectedData?.complianceGroupId,
        topicNameKey: getSelectedData?.topicNameKey,
        topicName: getSelectedData?.topicName,
        complianceSubTopicList: getSelectedData?.complianceSubTopicList,
        complianceType: getSelectedData?.complianceType,
        accessTo: getSelectedData?.accessTo,
        status: "PENDING",
        applicableCorporate: getSelectedData?.applicableCorporate,
        isActive: "true",
        defaultPenalty: getSelectedData?.defaultPenalty,
        waveOffAmount: getSelectedData?.waveOffAmount,
        finalPenalty: getSelectedData?.finalPenalty,
        topicId: getSelectedData.id,
      };

      actions
        .createVehicleCompliance(sendingDataToApi)
        .then((res) => {
          if (res.status === 200) {
            showSuccess("Compliance request submit successfully.");
            setshowCalender(false);
            refRBSheet.current.close();

            getVehicleComplianceList("checkExpandList");
          } else {
          }
        })
        .catch((err) => {});
    } else {
      let sendingDataToApi = {
        driverId: profileData?.id,
        complianceGroupId: getSelectedData?.complianceGroupId,
        topicNameKey: getSelectedData?.topicNameKey,
        topicName: getSelectedData?.topicName,
        complianceSubTopicList: getSelectedData?.complianceSubTopicList,
        complianceType: getSelectedData?.complianceType,
        accessTo: getSelectedData?.accessTo,
        status: "PENDING",
        applicableCorporate: getSelectedData?.applicableCorporate,
        isActive: "true",
        defaultPenalty: getSelectedData?.defaultPenalty,
        waveOffAmount: getSelectedData?.waveOffAmount,
        finalPenalty: getSelectedData?.finalPenalty,
        topicId: getSelectedData.id,
      };

      actions
        .createCompliance(sendingDataToApi)
        .then((res) => {
          if (res.status === 200) {
            showSuccess("Compliance request submit successfully.");
            setshowCalender(false);
            refRBSheet.current.close();

            getDriverCompliance("checkExpandList");
          } else {
            showError(res?.message);
          }
        })
        .catch((err) => {});
    }
  };

  const selectedItem = (selectedItem) => {
    if (selectDriver) {
      let newArr = compliancesList.map((item, index) => {
        if (item?.id === selectedItem?.id) {
          item.isSelected = item.isSelected === true ? false : true;
        } else {
          item.isSelected = false;
        }
        return { ...item };
      });

      setcompliancesList(newArr);
    } else {
      let newArr = vehicleCompliancesList.map((item, index) => {
        if (item?.id === selectedItem?.id) {
          item.isSelected = item.isSelected === true ? false : true;
        } else {
          item.isSelected = false;
        }
        return { ...item };
      });

      setvehicleCompliancesList(newArr);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <DetailBox
        canEdit={canEdit}
        index={index}
        item={item}
        onPress={() => {
          setselectedData(item);
          selectedItem(item);
        }}
        onSubcategoryClick={(type, id) => {
          setdocumentType(type);
          setsubCategoryId(id);
          if (type === "date") {
            setshowCalender(!showCalender);
          } else {
            refRBSheet.current.open();
          }
        }}
        openDocument={(fileUri) => {
          Linking.openURL(DOC_URL + fileUri);
        }}
      />
    );
  };

  const _openCamera = async (setState, item) => {
    var selectedFile;
    try {
      const res = await openCamera();

      if (res?.height < 720) {
        showError(
          "The file you are trying to upload is less than 2MB. Please upload a file greater than 720px or Capture using your device camera"
        );
      } else {
        selectedFile = res;
        let getCompImg = await imageCompress(res?.path);

        if (getCompImg) {
          submitCameraFile(getCompImg);
        } else {
          submitCameraFile(res?.path);
        }

        refRBSheet.current.close();
      }
    } catch (error) {}
  };

  const _openGallery = async () => {
    try {
      const res = await uploadDoc();

      let getFIleType = getFileExtension(res?.name);
      if (
        getFIleType == "mp3" ||
        getFIleType == "mp4" ||
        getFIleType == "MP4" ||
        getFIleType == "MP3"
      ) {
        showError("Audio and video not allowed.");
      } else {
        let getSize = calculateFileSize(res?.size);

        if (getSize) {
          submitFile(res);
          refRBSheet.current.close();
        } else {
          showError(
            "The file you are trying to upload is less than 2MB. Please upload a file greater than 2MB or Capture using your device camera"
          );
        }
      }
    } catch (error) {}
  };

  return (
    <WrapperContainer isLoading={loading}>
      {showInnfoScreen ? (
        <InfoSheet
          onClose={() => {
            setshowInnfoScreen(false);
          }}
          infoList={infoList}
          infoSheet={infoSheet}
        />
      ) : null}
      {showCalender ? (
        <CalenderComp
          closeModal={() => {
            setshowCalender(!showCalender);
          }}
          minDate={todayDate}
          setselectedDate={(date) => {
            setSelectedDate(date);
            setshowCalender(!showCalender);
          }}
        />
      ) : null}

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={styles.bottomSheetStyle}
      >
        {documentType === "text" ? (
          <View style={styles.bottomSheetMainContainer}>
            <View style={styles.textInputBox}>
              <TextInput
                style={styles.inputStyle}
                placeholderTextColor={colors.steel}
                placeholder="Please enter"
                underlineColorAndroid={"transparent"}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setquery(text);
                }}
              />
            </View>
            <View style={styles.queryButtonContainer}>
              <ButtonComp
                btnText="Submit"
                btnStyle={styles.btnStyle}
                btnTextStyle={styles.btnTextStyle}
                onPress={() => {
                  if (query === "") {
                    showError("Please write sumething");
                  } else {
                    createDriverCompliance(query);
                  }
                }}
              />
            </View>
          </View>
        ) : (
          <View style={styles.bottomSheetMainContainer}>
            <Text style={styles.selectItemText}>Select Item</Text>
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => _openCamera()}
            >
              <Image source={imagePath.cameraIcon} />
              <Text style={styles.itemTextStyle}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.openGalleryRowContainer}
              onPress={() => _openGallery()}
            >
              <Image source={imagePath.folderIcon} />
              <Text style={styles.itemTextStyle}>Open gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </RBSheet>
      <ScreensHeader
        title={strings.COMPLIANCE}
        navigation={navigation}
        showRightIcon={true}
        infoIconClick={() => {
          setshowInnfoScreen(true);
          setTimeout(() => {
            infoSheet.current.open();
          }, 1000);
        }}
      />

      <View style={styles.bottomContainer}>
        <View style={styles.contentSectionContainer}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => {
                setselectDriver(true);
                setselectVehicle(false);
                getDriverCompliance("");
              }}
              style={
                selectDriver
                  ? styles.activeButtonStyle
                  : styles.deactiveButtonStyle
              }
            >
              <Text
                style={
                  selectDriver
                    ? styles.activeTextStyle
                    : styles.deactiveTextStyle
                }
              >
                Driver
              </Text>
              <View style={styles.expiredBadgeContainer}>
                <Text style={styles.expiredBadgeCount}>
                  {expiredBadgeCount}
                </Text>
              </View>
              <View style={styles.aboutToExpireContainer}>
                <Text style={styles.aboutToExpireBadgeCount}>
                  {aboutToExpireBadgeCount}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setselectDriver(false);
                setselectVehicle(true);
                getVehicleDetail();
                getVehicleComplianceList("");
              }}
              style={
                selectVehicle
                  ? styles.activeButtonStyle
                  : styles.deactiveButtonStyle
              }
            >
              <Text
                style={
                  selectVehicle
                    ? styles.activeTextStyle
                    : styles.deactiveTextStyle
                }
              >
                Vehicle
              </Text>
              {driverVehicleNotMapped ? null : (
                <>
                  <View style={styles.expiredBadgeContainer}>
                    <Text style={styles.expiredBadgeCount}>
                      {vehicleexpiredBadgeCount}
                    </Text>
                  </View>
                  <View style={styles.aboutToExpireContainer}>
                    <Text style={styles.aboutToExpireBadgeCount}>
                      {vehicleaboutToExpireBadgeCount}
                    </Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
          </View>

          {selectDriver ? (
            compliancesList.length === 0 ? (
              <View style={styles.complianceNotFoundContainer}>
                <Text style={styles.notFoundText}>
                  Compliance list is empty.
                </Text>
              </View>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={compliancesList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
              />
            )
          ) : driverVehicleNotMapped ? (
            <View style={styles.vehicleNotMappedContainer}>
              <Image
                style={styles.vehicleNotAssignImageStyle}
                source={imagePath.driverNotAssigned}
              />
            </View>
          ) : vehicleCompliancesList.length === 0 ? (
            <View style={styles.complianceNotFoundContainer}>
              <Text style={styles.notFoundText}>
                Vehicle compliance list is empty.
              </Text>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={vehicleCompliancesList}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          )}
        </View>
      </View>
    </WrapperContainer>
  );
}

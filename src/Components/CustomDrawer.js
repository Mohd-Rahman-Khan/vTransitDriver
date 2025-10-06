import { DrawerContentScrollView } from "@react-navigation/drawer";
import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import imagePath from "../constants/imagePath";
import strings from "../constants/lang";
import navigationStrings from "../navigation/navigationStrings";
import colors from "../styles/colors";
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../styles/responsiveSize";
import WrapperContainer from "./WrapperContainer";
import actions from "../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import fontFamily from "../styles/fontFamily";
import { Rating } from "react-native-ratings";
import {
  DOC_URL,
  GET_ALL_COMPLIOANCE,
  GET_VEHICLE_COMPLIOANCE,
  GET_DRIVER_VEHICLE_NUMBER,
  ASSOCIATE_CORPORATE_AND_VENDOR,
  DRIVER_ONGOING_RIDE,
} from "../config/urls";
import { version } from "../../package.json";
import { ScrollView } from "react-native-gesture-handler";
import { apiGet } from "../utils/utils";
import { Dropdown } from "react-native-element-dropdown";
import { showSuccess } from "../utils/helperFunction";

function CustomDrawerContent(props) {
  const [profileStatus, setProfileStatus] = useState();
  const [expiredBadgeCount, setexpiredBadgeCount] = useState(0);
  const [aboutToExpireBadgeCount, setaboutToExpireBadgeCount] = useState(0);
  const [vehicleexpiredBadgeCount, setvehicleexpiredBadgeCount] = useState(0);
  const [profileDataRes, setprofileDataRes] = useState("");
  const [showCompliance, setshowCompliance] = useState(true);
  const [showFeedback, setshowFeedback] = useState(true);
  const [showFuelTracking, setshowFuelTracking] = useState(true);
  const [showdriverAttendence, setshowdriverAttendence] = useState(true);
  const [showSupport, setshowSupport] = useState(true);
  const [showTollTaxAndParking, setshowTollTaxAndParking] = useState(true);
  const [showYourRides, setshowYourRides] = useState(true);
  const [states, setstates] = useState(true);
  const [vehicleaboutToExpireBadgeCount, setvehicleaboutToExpireBadgeCount] =
    useState(0);
  const [corporateList, setcorporateList] = useState([]);
  const [isDropDownDisable, setisDropDownDisable] = useState(false);
  const [pendingCompliance, setpendingCompliance] = useState(0);
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );

  const getModulePermissionData = useSelector(
    (state) => state?.modulePermission?.modulePermissionData
  );

  const { navigation } = props;

  useEffect(() => {
    if (
      props?.state?.history[props?.state?.history?.length - 1]?.status ===
      "open"
    ) {
      _getDriverDataById();
      _getEmpChangeReqStatus();
      getDriverCompliance();
      getVehicleDetail();
    } else {
      setpendingCompliance(0);
    }
  }, [props]);
  useEffect(() => {
    getCorporateList();
  }, []);

  const getCorporateList = () => {
    actions
      .corporateList(
        `${ASSOCIATE_CORPORATE_AND_VENDOR}?driverId=${profileData?.id}`
      )
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data?.associatedCorporateList?.length > 0) {
            if (res?.data?.associatedCorporateList?.length == 1) {
              setisDropDownDisable(true);
            } else {
              setisDropDownDisable(false);
            }
            //setisDropDownDisable(false);
            setcorporateList(res?.data?.associatedCorporateList);
          } else {
            setisDropDownDisable(true);
            setcorporateList([]);
          }
        } else {
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (getModulePermissionData?.permissions) {
      //===Compliance

      let checkCompliance = getModulePermissionData?.permissions?.find(
        (item) => item?.moduleName == "Compliance"
      );

      if (checkCompliance) {
        if (checkCompliance?.actions) {
          let findViewPerm = checkCompliance?.actions?.find(
            (itemData) => itemData == "View"
          );
          if (findViewPerm) {
            setshowCompliance(true);
          } else {
            setshowCompliance(false);
          }
        } else {
          setshowCompliance(false);
        }
      } else {
        setshowCompliance(false);
      }

      // --- Feedback

      let checkFeedback = getModulePermissionData?.permissions?.find(
        (item) => item?.moduleName == "Feedback"
      );

      if (checkFeedback) {
        if (checkFeedback?.actions) {
          let findViewPerm = checkFeedback?.actions?.find(
            (itemData) => itemData == "View"
          );
          if (findViewPerm) {
            setshowFeedback(true);
          } else {
            setshowFeedback(false);
          }
        } else {
          setshowFeedback(false);
        }
      } else {
        setshowFeedback(false);
      }

      //  Fuel Tracking

      let checkFuelTracking = getModulePermissionData?.permissions?.find(
        (item) => item?.moduleName == "Fuel Tracking"
      );

      if (checkFuelTracking) {
        if (checkFuelTracking?.actions) {
          let findViewPerm = checkFuelTracking?.actions?.find(
            (itemData) => itemData == "View"
          );
          if (findViewPerm) {
            setshowFuelTracking(true);
          } else {
            setshowFuelTracking(false);
          }
        } else {
          setshowFuelTracking(false);
        }
      } else {
        setshowFuelTracking(false);
      }

      // Driver Attenndence
      let checkDriverAttenndence = getModulePermissionData?.permissions?.find(
        (item) => item?.moduleName == "Driver Attendance"
      );

      if (checkDriverAttenndence) {
        if (checkDriverAttenndence?.actions) {
          let findViewPerm = checkDriverAttenndence?.actions?.find(
            (itemData) => itemData == "View"
          );
          if (findViewPerm) {
            setshowdriverAttendence(true);
          } else {
            setshowdriverAttendence(false);
          }
        } else {
          setshowdriverAttendence(false);
        }
      } else {
        setshowdriverAttendence(false);
      }

      // Support
      let checkSupport = getModulePermissionData?.permissions?.find(
        (item) => item?.moduleName == "Support"
      );

      if (checkSupport) {
        if (checkSupport?.actions) {
          let findViewPerm = checkSupport?.actions?.find(
            (itemData) => itemData == "View"
          );
          if (findViewPerm) {
            setshowSupport(true);
          } else {
            setshowSupport(false);
          }
        } else {
          setshowSupport(false);
        }
      } else {
        setshowSupport(false);
      }

      // TollTax And Parking
      let checkTollTaxAndParking = getModulePermissionData?.permissions?.find(
        (item) => item?.moduleName == "Toll And Parking"
      );

      if (checkTollTaxAndParking) {
        if (checkTollTaxAndParking?.actions) {
          let findViewPerm = checkTollTaxAndParking?.actions?.find(
            (itemData) => itemData == "View"
          );
          if (findViewPerm) {
            setshowTollTaxAndParking(true);
          } else {
            setshowTollTaxAndParking(false);
          }
        } else {
          setshowTollTaxAndParking(false);
        }
      } else {
        setshowTollTaxAndParking(false);
      }

      // Your Rides
      let checkYourRide = getModulePermissionData?.permissions?.find(
        (item) => item?.moduleName == "Your Rides"
      );

      if (checkYourRide) {
        if (checkYourRide?.actions) {
          let findViewPerm = checkYourRide?.actions?.find(
            (itemData) => itemData == "View"
          );
          if (findViewPerm) {
            setshowYourRides(true);
          } else {
            setshowYourRides(false);
          }
        } else {
          setshowYourRides(false);
        }
      } else {
        setshowYourRides(false);
      }

      // States

      let checkStates = getModulePermissionData?.permissions?.find(
        (item) => item?.moduleName == "Stats"
      );

      if (checkStates) {
        if (checkStates?.actions) {
          let findViewPerm = checkStates?.actions?.find(
            (itemData) => itemData == "View"
          );
          if (findViewPerm) {
            setstates(true);
          } else {
            setstates(false);
          }
        } else {
          setstates(false);
        }
      } else {
        setstates(false);
      }
    } else {
      setshowCompliance(false);
      setshowFeedback(false);
      setshowFuelTracking(false);
      setshowdriverAttendence(false);
      setshowSupport(false);
      setshowTollTaxAndParking(false);
      setshowYourRides(false);
      setstates(false);
    }
  }, [getModulePermissionData]);

  const getDriverCompliance = () => {
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
              setpendingCompliance(
                pendingCompliance + pendingCompListData.length
              );
            } else {
            }
          } else {
          }
        } else {
        }
      })
      .catch((err) => {});
  };
  const getVehicleDetail = async () => {
    if (profileData?.id) {
      apiGet(`${GET_DRIVER_VEHICLE_NUMBER}/${profileData?.id}/driver`)
        .then((res) => {
          if (res?.status === 200) {
            getVehicleComplianceList();
          } else {
          }
        })
        .catch((error) => {});
    } else {
    }
  };
  const getVehicleComplianceList = () => {
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
              let pendingCompListData = [];
              let rejectedList = [];

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
            } else {
            }
          } else {
          }
        } else {
        }
      })
      .catch((err) => {});
  };
  function _getEmpChangeReqStatus() {
    actions
      .getDriverChangeReq(profileData?.id)
      .then((response) => {
        let { status } = response;

        if (status == 200) {
          setProfileStatus(response?.data);
        } else {
        }
      })
      .catch((error) => {});
  }

  const _getDriverDataById = () => {
    actions
      .getDriverDataById(profileData?.id)
      .then((response) => {
        let { status } = response;
        if (status == 200) {
          setprofileDataRes(response?.data);
          actions.saveProfileData(response?.data);
        }
      })
      .catch((error) => {});
  };

  const checkOngoingData = async () => {
    // let checkOngoingRide = await AsyncStorage.getItem("ongoingRideData");

    // if (
    //   checkOngoingRide === "" ||
    //   checkOngoingRide === null ||
    //   checkOngoingRide === undefined
    // ) {
    //   navigation.navigate(navigationStrings.HOME);
    // } else {
    //   let parseOnGoingRideData = JSON.parse(checkOngoingRide);
    //   if (parseOnGoingRideData.isOngoing) {
    //     navigation.navigate(navigationStrings.LIVE_TRACKING);
    //   } else {
    //     navigation.navigate(navigationStrings.HOME);
    //   }
    // }

    actions
      .getRide(DRIVER_ONGOING_RIDE)
      .then((res) => {
        if (res.status === 200) {
          if (res?.data) {
            if (res?.data.length > 0) {
              if (profileData?.id) {
                actions
                  .getDriverDataById(profileData?.id)
                  .then((re) => {
                    let { status } = re;
                    if (status == 200) {
                      re?.data?.corporateId;
                      if (re?.data?.corporateId == res?.data[0]?.corporateId) {
                        navigation.navigate(navigationStrings.LIVE_TRACKING);
                      } else {
                        navigation.navigate(navigationStrings.HOME);
                      }
                    } else {
                      navigation.navigate(navigationStrings.HOME);
                    }
                  })
                  .catch((er) => {});
              }
            } else {
              navigation.navigate(navigationStrings.HOME);
            }
          } else {
            navigation.navigate(navigationStrings.HOME);
          }
        } else {
          navigation.navigate(navigationStrings.HOME);
        }
      })
      .catch((err) => {
        getPastRide();
      });
  };
  const changeCorporate = async (selectedItem) => {
    await actions
      .changeCorporate(`${profileData?.id}/${selectedItem?.id}`)
      .then((response) => {
        let { status } = response;
        if (status == 200) {
          _getDriverDataById();
          getModulePerm(selectedItem?.id);
          navigation.navigate(navigationStrings.HOME);
          let closeDrawerData = { isDrawerrClose: true };
          actions.closeDrawer(closeDrawerData);
          showSuccess("Corporate changed successfully.");
        } else {
        }
      })
      .catch((error) => {});
  };

  const getModulePerm = (corporateId) => {
    actions
      .getModulePermissionData(corporateId)
      .then((response) => {
        if (response?.status == 200) {
          actions.saveModulePermissionData(response?.data);
        }
      })
      .catch((error) => {});
  };
  return (
    <WrapperContainer>
      <View {...props} style={styles.drawerContentContainer}>
        <View style={{ backgroundColor: colors.darkBlue, height: 120 }}>
          <View style={styles.welocmeContainer}>
            <View style={{ marginTop: -12 }}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "30%" }}>
                  {profileData?.photo === null ? (
                    <Image
                      source={
                        profileData?.gender == "Male" ||
                        profileData?.gender == "M"
                          ? imagePath.maleAvatar
                          : profileData?.gender == "Female" ||
                            profileData?.gender == "F"
                          ? imagePath.femaleAvatar
                          : imagePath.userIcon
                      }
                      resizeMode={"contain"}
                      style={styles.userImg}
                    />
                  ) : (
                    <Image
                      source={{ uri: DOC_URL + profileData?.photo }}
                      resizeMode={"contain"}
                      style={styles.userImg}
                    />
                  )}
                </View>
                <View style={{ width: "68%" }}>
                  {profileData?.lastName ? (
                    <Text numberOfLines={1} style={[styles.welocmeText]}>
                      {profileData?.firstName}{" "}
                      {profileData?.lastName === "null"
                        ? ""
                        : profileData?.lastName}
                    </Text>
                  ) : (
                    <Text numberOfLines={1} style={[styles.welocmeText]}>
                      {profileData?.firstName}
                    </Text>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      if (showFeedback) {
                        navigation.navigate(
                          navigationStrings.RATING_AND_FEEDBACK
                        );
                      }
                    }}
                    style={styles.ratingContainner}
                    activeOpacity={1}
                  >
                    <Rating
                      type="custom"
                      ratingCount={5}
                      startingValue={profileData?.averageRating}
                      tintColor={colors.themeColor}
                      ratingColor={colors.rating_3}
                      ratingBackgroundColor={colors.white}
                      imageSize={15}
                      readonly
                      style={styles.starRatingStyle}
                    />

                    <Text style={styles.avarageRatingText}>
                      ({profileData?.averageRating})
                    </Text>
                    {showFeedback ? (
                      <Image
                        style={styles.forwordIconStyle}
                        source={imagePath.forwardIcon}
                      />
                    ) : null}
                  </TouchableOpacity>

                  <Dropdown
                    disable={isDropDownDisable}
                    style={{
                      //flex: 1,
                      //borderBottomColor: colors.lightGary,
                      //borderBottomWidth: moderateScale(1.5),
                      // marginHorizontal:moderateScale(20),
                      //marginBottom: moderateScaleVertical(0),
                      height: 30,
                      backgroundColor: colors.white,
                      borderRadius: 5,
                      marginTop: -10,
                      width: 130,
                      paddingHorizontal: 5,
                    }}
                    renderItem={(item) => (
                      <View
                        style={{
                          marginVertical: moderateScaleVertical(5),
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          style={{
                            flex: 1,
                            fontSize: textScale(12),
                            fontFamily: fontFamily.robotoRegular,
                            color: colors.black,
                            // marginLeft: moderateScale(8),
                            marginVertical: moderateScaleVertical(5),
                            marginLeft: moderateScale(10),
                          }}
                        >
                          {item?.companyName}
                        </Text>
                      </View>
                    )}
                    placeholderStyle={{
                      fontSize: textScale(12),
                      fontFamily: fontFamily.robotoRegular,
                      color: colors.mediumGray,
                      marginLeft: moderateScale(5),
                      fontWeight: "300",
                    }}
                    selectedTextStyle={{
                      fontSize: textScale(12),
                      color: colors.black,
                      fontFamily: fontFamily.robotoRegular,
                      //marginLeft: moderateScale(15),
                    }}
                    inputSearchStyle={styles.inputSearchStyle}
                    labelField="companyName"
                    maxHeight={200}
                    valueField="id"
                    iconColor={colors.darkGray}
                    data={corporateList}
                    value={profileData?.corporateId}
                    placeholder={"Select"}
                    onChange={(item) => {
                      //console.log("SelectedItem", item);
                      changeCorporate(item);
                    }}
                    // renderLeftIcon={() => (
                    //   <View style={{ marginRight: 5 }}>
                    //     <Image
                    //       style={{
                    //         height: 20,
                    //         width: 20,
                    //         tintColor: colors.gray,
                    //       }}
                    //       source={imagePath.vendor}
                    //       resizeMode="contain"
                    //     />
                    //   </View>
                    // )}
                  />
                </View>
              </View>
            </View>
            {/* <TouchableOpacity style={{ marginTop: -12 }} activeOpacity={0.8}>
              {profileData?.photo === null ? (
                <Image
                  source={
                    profileData?.gender == "Male" || profileData?.gender == "M"
                      ? imagePath.maleAvatar
                      : profileData?.gender == "Female" ||
                        profileData?.gender == "F"
                      ? imagePath.femaleAvatar
                      : imagePath.userIcon
                  }
                  resizeMode={"contain"}
                  style={styles.userImg}
                />
              ) : (
                <Image
                  source={{ uri: DOC_URL + profileData?.photo }}
                  resizeMode={"contain"}
                  style={styles.userImg}
                />
              )}
            </TouchableOpacity>
            {profileData?.lastName ? (
              <Text style={styles.welocmeText}>
                {profileData?.firstName}{" "}
                {profileData?.lastName === "null" ? "" : profileData?.lastName}
              </Text>
            ) : (
              <Text style={styles.welocmeText}>{profileData?.firstName}</Text>
            )}

            <TouchableOpacity
              onPress={() => {
                if (showFeedback) {
                  navigation.navigate(navigationStrings.RATING_AND_FEEDBACK);
                }
              }}
              style={styles.ratingContainner}
              activeOpacity={1}
            >
              <Rating
                type="custom"
                ratingCount={5}
                startingValue={profileData?.averageRating}
                tintColor={colors.themeColor}
                ratingColor={colors.rating_3}
                ratingBackgroundColor={colors.white}
                imageSize={15}
                readonly
                style={styles.starRatingStyle}
              />

              <Text style={styles.avarageRatingText}>
                ({profileData?.averageRating})
              </Text>
              {showFeedback ? (
                <Image
                  style={styles.forwordIconStyle}
                  source={imagePath.forwardIcon}
                />
              ) : null}
            </TouchableOpacity> */}
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.menuContainer}
        >
          <TouchableOpacity
            onPress={() => {
              checkOngoingData();
            }}
            style={styles.menuItemsStyle}
          >
            <Image source={imagePath.homeIcon} />
            <Text style={styles.menuItemsText}>{strings.HOME}</Text>
          </TouchableOpacity>

          {showYourRides ? (
            <TouchableOpacity
              onPress={() => navigation.navigate(navigationStrings.YOUR_RIDES)}
              style={styles.menuItemsStyle}
            >
              <Image source={imagePath.tripHistoryIcon} />
              <View style={styles.yourRideContainer}>
                <Text style={styles.menuItemsText}>{strings.YOUR_RIDE}</Text>
              </View>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={() => navigation.navigate(navigationStrings.NOTIFICATIONS)}
            style={styles.menuItemsStyle}
          >
            <Image source={imagePath.bell} />
            <Text style={styles.menuItemsText}>{strings.NOTIFICATIONS}</Text>
          </TouchableOpacity>

          {showTollTaxAndParking ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(navigationStrings.TRIP_TOLL_TAX_AND_PARKING)
              }
              style={styles.menuItemsStyle}
            >
              <Image
                style={styles.drawerMenuIconStyle}
                source={imagePath.tollParkingBlack}
              />
              <Text style={styles.menuItemsText}>
                {strings.TOLL_TAX_AND_PARKING}
              </Text>
            </TouchableOpacity>
          ) : null}

          {states ? (
            <TouchableOpacity
              onPress={() => navigation.navigate(navigationStrings.STATES)}
              style={styles.menuItemsStyle}
            >
              <Image
                style={styles.drawerMenuIconStyle}
                source={imagePath.staticsIcon}
              />
              <Text style={styles.menuItemsText}>{strings.STATS}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate(navigationStrings.STATES)}
              style={styles.menuItemsStyle}
            >
              <Image
                style={styles.drawerMenuIconStyle}
                source={imagePath.staticsIcon}
              />
              <Text style={styles.menuItemsText}>{strings.STATS}</Text>
            </TouchableOpacity>
          )}

          {showdriverAttendence ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(navigationStrings.DRIVER_ATTENDENCE)
              }
              style={styles.menuItemsStyle}
            >
              <Image
                style={styles.drawerMenuIconStyle}
                source={imagePath.punchInOut}
              />
              <Text style={styles.menuItemsText}>
                {strings.DRIVER_ATTENDENCE}
              </Text>
            </TouchableOpacity>
          ) : null}

          {showCompliance ? (
            <TouchableOpacity
              onPress={() => navigation.navigate(navigationStrings.COMPLIANCE)}
              style={styles.menuItemsStyle}
            >
              <Image
                source={imagePath.compliance}
                style={styles.drawerMenuIconStyle}
              />
              <View style={styles.complianceContainer}>
                <View style={styles.complianceTextContainer}>
                  <View style={styles.complianceRowContainer}>
                    <Text style={styles.menuItemsText}>
                      {strings.COMPLIANCE}
                    </Text>
                    <View style={styles.expiredBadgeContainer}>
                      <Text style={styles.expiredBadgeCount}>
                        {expiredBadgeCount + vehicleexpiredBadgeCount}
                      </Text>
                    </View>
                    <View style={styles.aboutToExpireContainer}>
                      <Text style={styles.aboutToExpireBadgeCount}>
                        {aboutToExpireBadgeCount +
                          vehicleaboutToExpireBadgeCount}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.complianceIconContainer}>
                  {pendingCompliance > 0 ? (
                    <Image
                      style={styles.pendingIconStyle}
                      source={imagePath.pending}
                    />
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={() =>
              navigation.navigate(navigationStrings.VERIFY_AND_UPDATE_SECOND, {
                profileStatus: profileStatus,
                isAddressSame:
                  JSON.stringify(profileDataRes?.address) ===
                  JSON.stringify(profileDataRes?.shelterAddress)
                    ? true
                    : false,
              })
            }
            style={styles.menuItemsStyle}
          >
            <View style={styles.verifyAndUpdateContainer}>
              <Image source={imagePath.avtarIcon} />
              <Text style={styles.menuItemsText}>
                {strings.VERIFY_AND_UPDATE}
              </Text>
            </View>
            <View style={styles.pendingIconContainer}>
              {profileStatus?.profileStatus?.toUpperCase().trim() ===
              "PENDING" ? (
                <Image
                  style={styles.pendingIconStyle}
                  source={imagePath.pending}
                />
              ) : profileStatus?.profileStatus === "APPROVE" ? (
                <Image
                  style={styles.pendingIconStyle}
                  source={imagePath.check_mark_circle}
                />
              ) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(navigationStrings.SETTINGS)}
            style={styles.menuItemsStyle}
          >
            <Image source={imagePath.settingIcon} />
            <Text style={styles.menuItemsText}>{strings.SETTINGS}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate(navigationStrings.ABOUT)}
            style={styles.menuItemsStyle}
          >
            <Image
              source={imagePath.aboutIcon}
              style={styles.drawerMenuIconStyle}
            />
            <View style={styles.yourRideContainer}>
              <Text style={styles.menuItemsText}>{strings.ABOUT}</Text>
            </View>
          </TouchableOpacity>
          {showSupport ? (
            <TouchableOpacity
              onPress={() => navigation.navigate(navigationStrings.SUPPORT)}
              style={styles.menuItemsStyle}
            >
              <Image source={imagePath.support} />
              <Text style={styles.menuItemsText}>{strings.SUPPORT}</Text>
            </TouchableOpacity>
          ) : null}

          {showFuelTracking ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(navigationStrings.FUELTRACKING)
              }
              style={styles.menuItemsStyle}
            >
              <Image
                style={styles.drawerMenuIconStyle}
                source={imagePath.fuelTrackingIcon}
              />
              <Text style={styles.menuItemsText}>{strings.FUEL_TRACKING}</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={() =>
              navigation.navigate(navigationStrings.TRAINING_VIDEOS)
            }
            style={styles.menuItemsStyle}
          >
            <Image
              source={imagePath.trainingVideo}
              style={styles.drawerMenuIconStyle}
            />
            <View style={styles.yourRideContainer}>
              <Text style={styles.menuItemsText}>
                {strings.TRAINING_VIDEOS}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>V-{version}</Text>
        </View>
      </View>
    </WrapperContainer>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: colors.darkBlue,
  },

  closeDrawerBtn: {
    alignSelf: "flex-end",
    margin: moderateScale(10),
  },
  welocmeContainer: {
    alignItems: "center",
    marginTop: moderateScaleVertical(20),
  },
  logoContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: moderateScale(10),
    borderRadius: moderateScale(4),
  },
  menuContainer: {
    margin: moderateScale(24),
  },
  menuItemsStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(30),
  },
  menuItemsText: {
    fontSize: textScale(14),
    fontWeight: "300",
    color: colors.black,
    marginLeft: moderateScale(25),
  },
  yourRideContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  badgeContainer: {
    height: 20,
    width: 40,
    backgroundColor: colors.greenColor,
    marginHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 30,
  },
  badgeText: {
    fontSize: 10,
    color: colors.white,
  },
  welocmeText: {
    color: colors.white,
    fontSize: textScale(16),
    fontFamily: fontFamily.robotoRegular,
    //marginVertical: moderateScaleVertical(10),
    //marginTop: 5,
  },
  menuContainer: {
    margin: moderateScale(24),
  },
  menuItemsStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(30),
  },
  menuItemsText: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    marginLeft: moderateScale(25),
    color: colors.black,
  },
  onlineOfflineDot: {
    height: 15,
    width: 15,
    borderRadius: 55,
    marginRight: -35,
    zIndex: 100,
  },
  iconStyle: {
    width: moderateScale(width / 20),
    height: moderateScaleVertical(width / 20),
  },
  userImg: {
    width: 70,
    height: 70,
    borderRadius: moderateScale(50),
    borderWidth: moderateScale(0.3),
    borderColor: colors.white,
  },
  editIconStyle: {
    width: moderateScale(width / 40),
    height: moderateScaleVertical(width / 40),
  },
  iconContainer: {
    width: width / 30,
    height: width / 30,
    backgroundColor: colors.white,
    padding: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(50),
    position: "absolute",
    bottom: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  bottomSheetStyle: {
    wrapper: {
      backgroundColor: "transparent",
    },

    draggableIcon: {
      backgroundColor: "#000",
    },
    container: {
      height: moderateScale(height / 4.5),
      backgroundColor: colors.whiteSmoke,
      borderTopEndRadius: moderateScale(24),
      borderTopLeftRadius: moderateScale(24),
    },
  },
  bottomSheetContainer: {
    marginHorizontal: moderateScale(24),
    borderTopLeftRadius: moderateScale(20),
    borderTopEndRadius: moderateScale(20),
  },
  selectItemText: {
    textAlign: "center",
    fontSize: textScale(16),
    color: colors.themeColor,
  },
  menuItemsStyleSecond: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(30),
  },
  itemContainer: {
    marginVertical: moderateScaleVertical(24),
    flexDirection: "row",
  },
  itemTextStyle: {
    fontSize: textScale(16),
    color: colors.themeColor,
    marginLeft: moderateScale(20),
  },
  empDetails: {
    color: colors.lightBlue,
    marginHorizontal: moderateScale(10),
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
  },
  versionContainer: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  complianceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  complianceTextContainer: { width: "80%" },
  complianceIconContainer: {
    width: "10%",
  },
  expiredBadgeContainer: {
    height: 18,
    width: 18,
    backgroundColor: colors.darkRed,
    borderRadius: 50,
    marginHorizontal: 2,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  expiredBadgeCount: {
    fontSize: 8,
    color: colors.white,
    fontWeight: "bold",
  },
  aboutToExpireContainer: {
    height: 18,
    width: 18,
    backgroundColor: colors.orangeColor,
    borderRadius: 50,
    marginHorizontal: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  aboutToExpireBadgeCount: {
    fontSize: 8,
    color: colors.white,
    fontWeight: "bold",
  },
  drawerContentContainer: {
    paddingTop: 0,
    backgroundColor: colors.white,
    height: "100%",
  },
  ratingContainner: {
    marginTop: -5,
    flexDirection: "row",
    alignItems: "center",
  },
  starRatingStyle: {
    marginTop: moderateScaleVertical(10),
    marginBottom: moderateScaleVertical(20),
  },
  avarageRatingText: { color: colors.white, marginTop: -10, marginLeft: 5 },
  forwordIconStyle: {
    marginTop: -8,
    marginLeft: 5,
    height: 16,
    width: 16,
    tintColor: colors.white,
  },
  drawerMenuIconStyle: { height: 24, width: 24 },
  complianceRowContainer: { flexDirection: "row" },
  pendingIconStyle: { height: 15, width: 15 },
  verifyAndUpdateContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
  },
  pendingIconContainer: { width: "10%" },
  versionText: { color: colors.black },
});

export default CustomDrawerContent;

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useState, useRef } from "react";
import WrapperContainer from "../../../Components/WrapperContainer";
import colors from "../../../styles/colors";
import { styles } from "./style";
import ContentComp from "./ContentComp";
import ButtonComp from "../../../Components/ButtonComp";
import strings from "../../../constants/lang";
import navigationStrings from "../../../navigation/navigationStrings";
import imagePath from "../../../constants/imagePath";
import { showError, showSuccess } from "../../../utils/helperFunction";
import OpenCameraBottomSheet from "./OpenCameraBottomSheet";
import actions from "../../../redux/actions";
import { useSelector } from "react-redux";
import socketServices from "../../../utils/socketServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   requestPermission,
//   initialize,
//   checkPermission,
// } from "react-native-floating-bubble";
import { useEffect } from "react";
import { saveProfileData } from "../../../redux/actions/profileData";

export default function DriverSelfConcent({ route, navigation }) {
  const [withMaskImage, setwithMaskImage] = useState("");
  const [withoutMaskImage, setwithoutMaskImage] = useState("");
  const [wearmask, setwearmask] = useState(false);
  const [covid19Symptoms, setcovid19Symptoms] = useState(false);
  const [dailySenitizeVehicle, setdailySenitizeVehicle] = useState(false);
  const [haveCovid19, sethaveCovid19] = useState(false);
  const [expandWearMask, setexpandWearMask] = useState(false);
  const [expandCovid19Symptoms, setexpandCovid19Symptoms] = useState(false);
  const [consentList, setconsentList] = useState([]);
  const [expandDailySenizeVehicle, setexpandDailySenizeVehicle] =
    useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [expandHaveCovid19, setexpandHaveCovid19] = useState(false);

  const showCameraBottomSheetRef = useRef();

  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );

  useEffect(() => {
    getDriverConsentList();
  }, []);

  const getDriverConsentList = () => {
    setisLoading(true);
    actions
      .getConsentList()
      .then((res) => {
        setisLoading(false);
        let { status } = res;
        if (status === 200) {
          if (res?.data) {
            if (res?.data?.length > 0) {
              let newArr = res?.data?.map((item, index) => {
                item.isExpand = false;
                item.value = false;
                //item.isImageRequiired = index == 0 ? true : false;
                return { ...item };
              });

              setconsentList(newArr);
            } else {
              setconsentList([]);
            }
          } else {
            setconsentList([]);
          }
        } else {
          //setisLoading(false);

          showError(res?.message);
        }
      })
      .catch((err) => {
        setisLoading(false);

        showError(err?.message);
      });
  };

  const _getDriverDataById = async () => {
    if (profileData?.id) {
      actions
        .getDriverDataById(profileData?.id)
        .then((re) => {
          let { status } = re;
          if (status == 200) {
            actions.saveProfileData(re?.data);
            saveProfileData(re?.data);
          } else {
          }
        })
        .catch((er) => {});
    }
  };

  const IAgreeButtonHandler = () => {
    let checkConsent = consentList.find((item) => item?.value == false);
    if (checkConsent || wearmask == false) {
      showError("Please select all options");
    } else {
      setisLoading(true);
      let data = new FormData();

      let withMaskPhotoFileType = withMaskImage.split(".").pop();
      let withoutMaskImageFileType = withoutMaskImage.split(".").pop();
      data.append("withMask", {
        uri: withMaskImage,
        name: `${(Math.random() + 1)
          .toString(36)
          .substring(7)}.${withMaskPhotoFileType}`,
        type: `image/${withMaskPhotoFileType}`,
      });
      data.append("withoutMask", {
        uri: withoutMaskImage,
        name: `${(Math.random() + 1)
          .toString(36)
          .substring(7)}.${withoutMaskImageFileType}`,
        type: `image/${withoutMaskImageFileType}`,
      });

      // let otherdetail = {
      //   tripId: route.params.tripId,
      //   wearingFaceMask: wearmask ? "Yes" : "No",
      //   relatedSystoms: covid19Symptoms ? "Yes" : "No",
      //   sanitizedVehicle: dailySenitizeVehicle ? "Yes" : "No",
      //   haveCovid: haveCovid19 ? "Yes" : "No",
      // };

      let copyOfConsentList = consentList;

      let newArr = copyOfConsentList.map((item) => {
        delete item.isExpand;
        //delete item.isSelected;

        return { ...item };
      });

      let otherdetail = {
        tripId: route.params.tripId,
        selfConsentList: newArr,
        // wearingFaceMask: wearmask ? "Yes" : "No",
        // relatedSystoms: covid19Symptoms ? "Yes" : "No",
        // sanitizedVehicle: dailySenitizeVehicle ? "Yes" : "No",
        // haveCovid: haveCovid19 ? "Yes" : "No",
      };

      data.append("data", JSON.stringify(otherdetail));

      actions
        .driverSelfConsent(
          data,
          { "Content-Type": "multipart/form-data" },
          "formData"
        )
        .then((res) => {
          let { status } = res;
          if (status === 200) {
            showSuccess("Your Ride Started Successfully.");
            getDriverModulePermissions();
            setisLoading(false);
            let ongoingRideData = {
              isOngoing: true,
            };
            AsyncStorage.setItem(
              "ongoingRideData",
              JSON.stringify(ongoingRideData)
            );
            socketServices.emit("add-user", profileData.id);
            socketServices.emit("join", route.params.tripId);
            checkQuickAccessButtonPermission();
          } else {
            setisLoading(false);
            showError(res?.message);
          }
        })
        .catch((err) => {
          setisLoading(false);
          showError(err?.message);
        });
    }
  };

  const getDriverModulePermissions = () => {
    // actions
    //   .getModulePermissionData(profileData?.corporateId)
    //   .then((response) => {
    //     if (response?.status == 200) {
    //       actions.saveModulePermissionData(response?.data);
    //     }
    //   })
    //   .catch((error) => {});

    if (profileData?.id) {
      actions
        .getDriverDataById(profileData?.id)
        .then((re) => {
          let { status } = re;
          if (status == 200) {
            actions
              .getModulePermissionData(re?.data?.corporateId)
              .then((response) => {
                if (response?.status == 200) {
                  actions.saveModulePermissionData(response?.data);
                }
              })
              .catch((error) => {});
          } else {
          }
        })
        .catch((er) => {});
    }
  };

  const checkQuickAccessButtonPermission = () => {
    navigation.navigate(navigationStrings.LIVE_TRACKING);
    // if (Platform.OS === "android") {
    //   checkPermission()
    //     .then((value) => {
    //       if (value) {
    //         initialize()
    //           .then(() => {
    //             navigation.navigate(navigationStrings.LIVE_TRACKING);
    //           })
    //           .catch(() => {
    //             showError("Failed initialize quick access button.");
    //             navigation.navigate(navigationStrings.LIVE_TRACKING);
    //           });
    //       } else {
    //         requestPermission()
    //           .then(() => {
    //             initialize()
    //               .then(() => {
    //                 navigation.navigate(navigationStrings.LIVE_TRACKING);
    //               })
    //               .catch(() => {
    //                 showError("Failed initialize quick access button.");
    //                 navigation.navigate(navigationStrings.LIVE_TRACKING);
    //               });
    //           })
    //           .catch(() =>
    //             showError(
    //               "Please allow draw over other apps permission for quick access."
    //             )
    //           );
    //       }
    //     })
    //     .catch(() => {
    //       showError("Failed to check quick access button permission.");
    //       navigation.navigate(navigationStrings.LIVE_TRACKING);
    //     });
    // } else {
    //   navigation.navigate(navigationStrings.LIVE_TRACKING);
    // }
  };

  const expandIconClick = (selectedItem, selectedIndex) => {
    let newArr = consentList.map((item, index) => {
      if (item?.id == selectedItem?.id) {
        item.isExpand = item.isExpand === true ? false : true;
      } else {
        item.isExpand = false;
      }
      return { ...item };
    });
    setconsentList(newArr);

    // if (selectedIndex == 0) {
    //   setexpandWearMask(!expandWearMask);
    // }
  };

  const checkBoxClick = (selectedItem) => {
    let newArr = consentList.map((item, index) => {
      if (item?.id == selectedItem?.id) {
        item.value = item.value === true ? false : true;
      } else {
      }
      return { ...item };
    });
    setconsentList(newArr);
  };

  const renderItem = ({ item, index }) => {
    if (item?.isImageRequiired) {
      return (
        <ContentComp
          content="I'm Wearing a face covering or mask"
          showchild={false}
          checkBoxClick={() => {
            //setwearmask(!wearmask);
            showCameraBottomSheetRef.current.open();
          }}
          check={item?.value}
          expandIconClick={() => {
            expandIconClick(item, index);
          }}
          isExpand={item?.isExpand}
          showImages={true}
          withMaskImage={withMaskImage}
          withoutMaskImage={withoutMaskImage}
          item={item}
        />
      );
    } else {
      return (
        <ContentComp
          check={item?.value}
          checkBoxClick={() => checkBoxClick(item)}
          content={item?.name}
          expandIconClick={() => {
            expandIconClick(item, index);
          }}
          isExpand={item?.isExpand}
          item={item}
        />
      );
    }
  };

  return (
    <WrapperContainer
      bgColor={colors.homeBg}
      isLoading={isLoading}
      withModal={true}
    >
      <OpenCameraBottomSheet
        cancelClick={() => {
          showCameraBottomSheetRef.current.close();
        }}
        showbottomSheet={showCameraBottomSheetRef}
        data={(withmask, withoutmask) => {
          setwithMaskImage(withmask);
          setwithoutMaskImage(withoutmask);
          setwearmask(true);
        }}
      />
      <View style={styles.topContainer}>
        <View style={styles.bgImageStyle}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={imagePath.backArrowIcon}
                style={styles.backArrowIcon}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitleText}>
              {strings.DRIVER_SELF_CONCENT}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.contentSectionContainer}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <ContentComp
              content="I'm Wearing a face covering or mask"
              showchild={false}
              checkBoxClick={() => {
                //setwearmask(!wearmask);
                showCameraBottomSheetRef.current.open();
              }}
              check={wearmask}
              expandIconClick={() => {
                setexpandWearMask(!expandWearMask);
              }}
              isExpand={expandWearMask}
              showImages={true}
              withMaskImage={withMaskImage}
              withoutMaskImage={withoutMaskImage}
            />
            <FlatList
              data={consentList}
              showsVerticalScrollIndicator={false}
              renderItem={(element, index) => renderItem(element, index)}
              keyExtractor={(item, index) => index.toString()}
              onEndReachedThreshold={0.1}
              onScrollToTop={false}
            />
            {/* <ContentComp
              content="I'm Wearing a face covering or mask"
              showchild={true}
              checkBoxClick={() => {
                //setwearmask(!wearmask);
                showCameraBottomSheetRef.current.open();
              }}
              check={wearmask}
              expandIconClick={() => {
                setexpandWearMask(!expandWearMask);
              }}
              isExpand={expandWearMask}
              showImages={true}
              withMaskImage={withMaskImage}
              withoutMaskImage={withoutMaskImage}
            />
            <ContentComp
              check={covid19Symptoms}
              checkBoxClick={() => setcovid19Symptoms(!covid19Symptoms)}
              content="I won't drive if i may have COVID-19 or related Symtoms"
              expandIconClick={() => {
                setexpandCovid19Symptoms(!expandCovid19Symptoms);
              }}
              isExpand={expandCovid19Symptoms}
            />
            <ContentComp
              content="I sanitized my vehicle today"
              check={dailySenitizeVehicle}
              checkBoxClick={() =>
                setdailySenitizeVehicle(!dailySenitizeVehicle)
              }
              expandIconClick={() => {
                setexpandDailySenizeVehicle(!expandDailySenizeVehicle);
              }}
              isExpand={expandDailySenizeVehicle}
            />
            <ContentComp
              content="I won't drive if i may have COVID-19"
              check={haveCovid19}
              checkBoxClick={() => sethaveCovid19(!haveCovid19)}
              expandIconClick={() => {
                setexpandHaveCovid19(!expandHaveCovid19);
              }}
              isExpand={expandHaveCovid19}
            />
            */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View></View>
            </View>
            <View style={styles.newRowContainer}>
              <Text style={styles.covidRuleText}>
                Please review any application goverment orders about COVID-19
                requirements to ensure you the following all rules and
                regulation
              </Text>
            </View>
            <View style={styles.newRowContainer}>
              <View style={styles.learnMoreRow}>
                <Text style={styles.learnMoreText}>Learn more on the</Text>
                <Text style={styles.covidSiteText}>WHO COVID-19 Site</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <View style={styles.agreeButton}>
                  <ActivityIndicator size="small" color={colors.white} />
                </View>
              ) : (
                <ButtonComp
                  btnText={strings.I_AGREEE}
                  btnStyle={styles.agreeButton}
                  btnTextStyle={styles.agreeButtonText}
                  onPress={() => {
                    IAgreeButtonHandler();
                  }}
                />
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </WrapperContainer>
  );
}

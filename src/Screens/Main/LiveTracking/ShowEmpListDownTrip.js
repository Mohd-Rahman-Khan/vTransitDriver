import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
  PanResponder,
  StyleSheet,
  Platform,
  ImageBackground,
  InteractionManager,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import React, { useMemo, useCallback, useEffect, useState, memo } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
//import { styles } from "./styles";
import imagePath from "../../../constants/imagePath";
import colors from "../../../styles/colors";
import { AirbnbRating } from "react-native-ratings";
import EmpDetailComp from "./Components/EmpDetailComp";
import { BarIndicator } from "react-native-indicators";
import {
  moderateScale,
  moderateScaleVertical,
  height,
  width,
  textScale,
  scale,
} from "../../../styles/responsiveSize";
import fontFamily from "../../../styles/fontFamily";
import BottomSheet from "react-native-gesture-bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { DOC_URL } from "../../../config/urls";
import { showError } from "../../../utils/helperFunction";
const moment = extendMoment(Moment);

function ShowEmpListDownTrip(props) {
  const [isEscort, setIsEscort] = useState(false);
  const [empListData, setempListData] = useState();

  useEffect(() => {
    let isEscortData = props?.empList.filter((ele, ind) => {
      return (
        ele?.passType?.toUpperCase()?.trim() === "ESCORT" &&
        ele?.status?.toUpperCase()?.trim() === "SCHEDULE"
      );
    });

    if (isEscortData?.length > 0) {
      setempListData(isEscortData);
    } else {
      setempListData(props?.empList);
    }

    if (isEscortData?.[0]?.passType?.toUpperCase()?.trim() === "ESCORT") {
      setIsEscort(true);
    } else {
      setIsEscort(false);
    }
  }, [props?.empList]);

  const renderDeBoardPassengersList = ({ item, index }) => {
    var time;
    var boardingTime;
    var deboardingTime;

    if (props.tripType === "DOWNTRIP") {
      if (props?.passengersListType === "deBoardPassengers") {
        deboardingTime =
          item.actualDropDateTime === 0
            ? 0
            : moment.utc(item.actualDropDateTime).local().format("HH:mm");
        boardingTime =
          item.actualPickUpDateTime === 0
            ? 0
            : moment.utc(item.actualPickUpDateTime).local().format("HH:mm");
      } else {
        time =
          item.actualPickUpDateTime === 0
            ? 0
            : moment.utc(item.actualPickUpDateTime).local().format("HH:mm");
      }
    } else {
      time =
        item.actualPickUpDateTime === 0
          ? 0
          : moment.utc(item.actualPickUpDateTime).local().format("HH:mm");
    }

    if (
      (item.status === "BOARDED" ||
        item.status === "SCHEDULE" ||
        item.status === "COMPLETED") &&
      item?.passType !== "ESCORT"
    ) {
      return (
        <View style={styles.renderListContainer}>
          <View style={styles.renderListLeftContainer}>
            {index === 0 ? null : (
              <View>
                <View style={styles.renderListDotIndicator}></View>
                <View style={styles.renderListDotIndicator}></View>
                <View style={styles.renderListDotIndicator}></View>
              </View>
            )}

            <View style={styles.listItemUserThumbnailContainer}>
              {props?.driverAppSettingData?.canDriverViewEmployeesPhoto ==
              "YES" ? (
                item?.photo ? (
                  <Image
                    source={{ uri: DOC_URL + item?.photo }}
                    style={styles.listItemUserImageStyle}
                  />
                ) : (
                  <Image
                    source={imagePath.userIcon}
                    style={styles.listItemUserImageStyle}
                  />
                )
              ) : (
                <Image
                  source={imagePath.userIcon}
                  style={styles.listItemUserImageStyle}
                />
              )}
            </View>

            <View style={styles.listItemDotIndicatorContainer}>
              <View style={styles.renderListDotIndicator}></View>
              <View style={styles.renderListDotIndicator}></View>
              <View style={styles.renderListDotIndicator}></View>
            </View>
          </View>
          <View style={styles.listItemMiddleContainer}>
            <View style={styles.listItemMiddleContainerRow}>
              <View style={styles.listItemMiddleContainerLeftBox}>
                <Text
                  style={[
                    styles.listItemEmployeeNameText,
                    { marginTop: index === 0 ? -8 : 6 },
                  ]}
                  numberOfLines={2}
                >
                  {item.name} ({item?.empCode})
                </Text>
                <View style={styles.listItemRatingAndVaccineContainer}>
                  <View>
                    <AirbnbRating
                      showRating={false}
                      count={5}
                      defaultRating={item?.passRating}
                      size={15}
                      isDisabled={true}
                    />
                  </View>
                  <View style={styles.verticalDivider}></View>
                  <View style={styles.genderAndVaccineIconContainer}>
                    <View style={styles.vaccineIconContainer}>
                      {item?.vaccineStatus === "Fully Vaccinated" ||
                      item?.vaccineStatus === "Vaccinated Fully" ? (
                        <Image
                          style={styles.vaccineIconStyle}
                          source={imagePath.Vaccinated_green}
                        />
                      ) : item.vaccineStatus === "Partially Vaccinated" ? (
                        <Image
                          style={styles.vaccineIconStyle}
                          source={imagePath.partially_vaccinated_blue}
                        />
                      ) : (
                        <Image
                          style={styles.vaccineIconStyle}
                          source={imagePath.not_vaccinated_orange}
                        />
                      )}
                    </View>

                    <View style={styles.genderIconContainer}>
                      {item.gender === "Male" ? (
                        <Image
                          style={styles.genderIconStyle}
                          source={imagePath.male}
                        />
                      ) : item?.gender === "Female" ? (
                        <Image
                          style={styles.genderIconStyle}
                          source={imagePath.female}
                        />
                      ) : (
                        <Image
                          style={styles.genderIconStyle}
                          source={imagePath.other}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.listItemMiddleContainerRightBox}>
                {item.status === "SCHEDULE" ? (
                  props?.showAbsentButton ? (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View style={styles.listItemAlignNoShowConntent}>
                        {props?.escotrTrip ? (
                          props?.driverAppSettingData
                            ?.allowDriverStartTripWithoutEscortAttd == "YES" ? (
                            <TouchableOpacity
                              onPress={() => {
                                if (props?.showAttendenceLoading) {
                                  showError("Request already in pending");
                                } else {
                                  props.noShowClick(item);
                                }
                              }}
                              style={styles.noShowOutsideContainer}
                            >
                              <Image
                                source={imagePath.crossIcon}
                                style={{
                                  height: 30,
                                  width: 30,
                                  tintColor: props?.showAttendenceLoading
                                    ? colors.greyBackgroundColor
                                    : colors.SOSSwipeBottonColor1,
                                }}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          ) : null
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              if (props?.showAttendenceLoading) {
                                showError("Request already in pending");
                              } else {
                                props.noShowClick(item);
                              }
                            }}
                            style={styles.noShowOutsideContainer}
                          >
                            <Image
                              source={imagePath.crossIcon}
                              style={{
                                height: 30,
                                width: 30,
                                tintColor: props?.showAttendenceLoading
                                  ? colors.greyBackgroundColor
                                  : colors.SOSSwipeBottonColor1,
                              }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      {props?.driverAppSettingData
                        ?.displayEmpAttendenceCaptureWithoutOTPQR == "YES" ? (
                        <View style={[styles.listItemAlignNoShowConntent]}>
                          <TouchableOpacity
                            onPress={() => {
                              if (props?.showAttendenceLoading) {
                                showError("Request already in pending");
                              } else {
                                props.boardEmployee(item);
                              }
                            }}
                            style={styles.noShowOutsideContainer}
                          >
                            <Image
                              source={imagePath.boardEmp}
                              style={{
                                height: 30,
                                width: 30,
                                tintColor: props?.showAttendenceLoading
                                  ? colors.greyBackgroundColor
                                  : colors.greenColor,
                              }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={styles.listItemAlignNoShowConntent}>
                        {props?.escotrTrip ? (
                          props?.driverAppSettingData
                            ?.allowDriverStartTripWithoutEscortAttd == "YES" ? (
                            <TouchableOpacity
                              onPress={() => {
                                if (props?.showAttendenceLoading) {
                                  showError("Request already in pending");
                                } else {
                                  props.noShowClick(item);
                                }
                              }}
                              style={styles.noShowOutsideContainer}
                            >
                              <Image
                                source={imagePath.crossIcon}
                                style={{
                                  height: 30,
                                  width: 30,
                                  tintColor: props?.showAttendenceLoading
                                    ? colors.greyBackgroundColor
                                    : colors.SOSSwipeBottonColor1,
                                }}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          ) : null
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              if (props?.showAttendenceLoading) {
                                showError("Request already in pending");
                              } else {
                                props.noShowClick(item);
                              }
                            }}
                            style={styles.noShowOutsideContainer}
                          >
                            <Image
                              source={imagePath.crossIcon}
                              style={{
                                height: 30,
                                width: 30,
                                tintColor: props?.showAttendenceLoading
                                  ? colors.greyBackgroundColor
                                  : colors.SOSSwipeBottonColor1,
                              }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      {props?.driverAppSettingData
                        ?.displayEmpAttendenceCaptureWithoutOTPQR == "YES" ? (
                        <View style={[styles.listItemAlignNoShowConntent]}>
                          <TouchableOpacity
                            onPress={() => {
                              if (props?.showAttendenceLoading) {
                                showError("Request already in pending");
                              } else {
                                props.boardEmployee(item);
                              }
                            }}
                            style={styles.noShowOutsideContainer}
                          >
                            <Image
                              source={imagePath.boardEmp}
                              style={{
                                height: 30,
                                width: 30,
                                tintColor: props?.showAttendenceLoading
                                  ? colors.greyBackgroundColor
                                  : colors.greenColor,
                              }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </View>
                  )
                ) : item.status === "BOARDED" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ alignItems: "center" }}>
                      {props?.passengersListType === "deBoardPassengers" ? (
                        <>
                          <Text
                            style={styles.listItemEmpBoardingDeboardingTime}
                          >
                            {boardingTime}
                          </Text>
                          <Text
                            style={styles.listItemEmpBoardingDeboardingTime}
                          >
                            {deboardingTime === 0 ? "--" : deboardingTime}
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.listItemEmpTimeText}>{time}</Text>
                      )}
                    </View>

                    {props?.driverAppSettingData
                      ?.displayEmpAttendenceCaptureWithoutOTPQR == "YES" ? (
                      props?.tripType == "DOWNTRIP" ? (
                        props?.passengersListType ==
                        "onBoardPassengers" ? null : (
                          <View style={[styles.listItemAlignNoShowConntent]}>
                            <TouchableOpacity
                              onPress={() => {
                                if (props?.showAttendenceLoading) {
                                  showError("Request already in pending");
                                } else {
                                  props.boardEmployee(item);
                                }
                              }}
                              style={styles.noShowOutsideContainer}
                            >
                              <Image
                                source={imagePath.boardEmp}
                                style={{
                                  height: 25,
                                  width: 25,
                                  tintColor: props?.showAttendenceLoading
                                    ? colors.greyBackgroundColor
                                    : colors.greenColor,
                                }}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          </View>
                        )
                      ) : // <View style={[styles.listItemAlignNoShowConntent]}>
                      //   <TouchableOpacity
                      //     onPress={() => {
                      //       //props.noShowClick(item);
                      //       props.boardEmployee(item);
                      //     }}
                      //     style={styles.noShowOutsideContainer}
                      //   >
                      //     <Image
                      //       source={imagePath.boardEmp}
                      //       style={{ height: 25, width: 25 }}
                      //       resizeMode="contain"
                      //     />
                      //   </TouchableOpacity>
                      // </View>
                      null
                    ) : null}
                  </View>
                ) : item.status === "COMPLETED" ? (
                  <>
                    <Text style={styles.listItemEmpBoardingDeboardingTime}>
                      {boardingTime}
                    </Text>
                    <Text style={styles.listItemEmpBoardingDeboardingTime}>
                      {deboardingTime === 0 ? "--" : deboardingTime}
                    </Text>
                  </>
                ) : item.status === "ABSENT" ? (
                  <View style={styles.listItemAbsentStatusContainer}>
                    <Image
                      source={imagePath.absent}
                      style={styles.listItemAbsentIconnStyle}
                      resizeMode="contain"
                    />
                    <Text style={styles.listItemAbsentEmpText}>
                      {item.absentDateTime === 0
                        ? null
                        : moment
                            .utc(item.absentDateTime)
                            .local()
                            .format("HH:mm")}
                    </Text>
                  </View>
                ) : time === 0 ? null : (
                  <Text style={styles.listItemEmpTimeTextCenter}>{time}</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      );
    } else if (item?.passType === "ESCORT") {
      return (
        <View style={styles.renderListContainer}>
          <View style={styles.renderListLeftContainer}>
            {index === 0 ? null : (
              <View>
                <View style={styles.renderListDotIndicator}></View>
                <View style={styles.renderListDotIndicator}></View>
                <View style={styles.renderListDotIndicator}></View>
              </View>
            )}

            <View style={styles.listItemUserThumbnailContainer}>
              {props?.driverAppSettingData?.canDriverViewEmployeesPhoto ==
              "YES" ? (
                item?.photo ? (
                  <Image
                    source={{ uri: DOC_URL + item?.photo }}
                    style={styles.listItemUserImageStyle}
                  />
                ) : (
                  <Image
                    source={imagePath.userIcon}
                    style={styles.listItemUserImageStyle}
                  />
                )
              ) : (
                <Image
                  source={imagePath.userIcon}
                  style={styles.listItemUserImageStyle}
                />
              )}
            </View>

            <View style={styles.listItemDotIndicatorContainer}>
              <View style={styles.renderListDotIndicator}></View>
              <View style={styles.renderListDotIndicator}></View>
              <View style={styles.renderListDotIndicator}></View>
            </View>
          </View>
          <View style={styles.listItemMiddleContainer}>
            <View style={styles.listItemMiddleContainerRow}>
              <View style={styles.listItemMiddleContainerLeftBox}>
                <Text
                  style={[
                    styles.listItemEmployeeNameText,
                    { marginTop: index === 0 ? -8 : 6 },
                  ]}
                  numberOfLines={2}
                >
                  {item.name} ({item?.empCode})
                </Text>
                <View style={styles.listItemRatingAndVaccineContainer}>
                  <View style={{}}>
                    <AirbnbRating
                      showRating={false}
                      count={5}
                      defaultRating={item?.passRating}
                      size={15}
                      isDisabled={true}
                    />
                  </View>
                  <View style={styles.verticalDivider}></View>
                  <View style={styles.genderAndVaccineIconContainer}>
                    <View style={styles.vaccineIconContainer}>
                      {item?.vaccineStatus === "Fully Vaccinated" ||
                      item?.vaccineStatus === "Vaccinated Fully" ? (
                        <Image
                          style={styles.vaccineIconStyle}
                          source={imagePath.Vaccinated_green}
                        />
                      ) : item.vaccineStatus === "Partially Vaccinated" ? (
                        <Image
                          style={styles.vaccineIconStyle}
                          source={imagePath.partially_vaccinated_blue}
                        />
                      ) : (
                        <Image
                          style={styles.vaccineIconStyle}
                          source={imagePath.not_vaccinated_orange}
                        />
                      )}
                    </View>

                    <View style={styles.genderIconContainer}>
                      {item.gender === "Male" ? (
                        <Image
                          style={styles.genderIconStyle}
                          source={imagePath.male}
                        />
                      ) : item?.gender === "Female" ? (
                        <Image
                          style={styles.genderIconStyle}
                          source={imagePath.female}
                        />
                      ) : (
                        <Image
                          style={styles.genderIconStyle}
                          source={imagePath.other}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.listItemMiddleContainerRightBox}>
                {item.status === "SCHEDULE" ? (
                  props?.showAbsentButton ? (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={styles.listItemAlignNoShowConntent}>
                        {props?.escotrTrip ? (
                          props?.driverAppSettingData
                            ?.allowDriverStartTripWithoutEscortAttd ===
                          "YES" ? (
                            <TouchableOpacity
                              onPress={() => {
                                if (props?.showAttendenceLoading) {
                                  showError("Request already in pending");
                                } else {
                                  props.noShowClick(item);
                                }
                              }}
                              style={styles.noShowOutsideContainer}
                            >
                              <Image
                                source={imagePath.crossIcon}
                                style={{
                                  height: 30,
                                  width: 30,
                                  tintColor: props?.showAttendenceLoading
                                    ? colors.greyBackgroundColor
                                    : colors.SOSSwipeBottonColor1,
                                }}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          ) : null
                        ) : item?.passType === "EMPLOYEE" ? (
                          <TouchableOpacity
                            onPress={() => {
                              if (props?.showAttendenceLoading) {
                                showError("Request already in pending");
                              } else {
                                props.noShowClick(item);
                              }
                            }}
                            style={styles.noShowOutsideContainer}
                          >
                            <Image
                              source={imagePath.crossIcon}
                              style={{
                                height: 30,
                                width: 30,
                                tintColor: props?.showAttendenceLoading
                                  ? colors.greyBackgroundColor
                                  : colors.SOSSwipeBottonColor1,
                              }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        ) : props?.driverAppSettingData
                            ?.allowDriverStartTripWithoutEscortAttd ===
                          "YES" ? (
                          <TouchableOpacity
                            onPress={() => {
                              if (props?.showAttendenceLoading) {
                                showError("Request already in pending");
                              } else {
                                props.noShowClick(item);
                              }
                            }}
                            style={styles.noShowOutsideContainer}
                          >
                            <Image
                              source={imagePath.crossIcon}
                              style={{
                                height: 30,
                                width: 30,
                                tintColor: props?.showAttendenceLoading
                                  ? colors.greyBackgroundColor
                                  : colors.SOSSwipeBottonColor1,
                              }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        ) : null}
                      </View>

                      {props?.driverAppSettingData
                        ?.displayEmpAttendenceCaptureWithoutOTPQR === "YES" ? (
                        <View style={[styles.listItemAlignNoShowConntent]}>
                          <TouchableOpacity
                            onPress={() => {
                              if (props?.showAttendenceLoading) {
                                showError("Request already in pending");
                              } else {
                                props.boardEmployee(item);
                              }
                            }}
                            style={styles.noShowOutsideContainer}
                          >
                            <Image
                              source={imagePath.boardEmp}
                              style={{
                                height: 30,
                                width: 30,
                                tintColor: props?.showAttendenceLoading
                                  ? colors.greyBackgroundColor
                                  : colors.greenColor,
                              }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={styles.listItemAlignNoShowConntent}>
                        {props?.escotrTrip ? (
                          props?.driverAppSettingData
                            ?.allowDriverStartTripWithoutEscortAttd == "YES" ? (
                            <TouchableOpacity
                              onPress={() => {
                                if (props?.showAttendenceLoading) {
                                  showError("Request already in pending");
                                } else {
                                  props.noShowClick(item);
                                }
                              }}
                              style={styles.noShowOutsideContainer}
                            >
                              <Image
                                source={imagePath.crossIcon}
                                style={{
                                  height: 30,
                                  width: 30,
                                  tintColor: props?.showAttendenceLoading
                                    ? colors.greyBackgroundColor
                                    : colors.SOSSwipeBottonColor1,
                                }}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          ) : null
                        ) : item?.passType == "EMPLOYEE" ? (
                          <TouchableOpacity
                            onPress={() => {
                              if (props?.showAttendenceLoading) {
                                showError("Request already in pending");
                              } else {
                                props.noShowClick(item);
                              }
                            }}
                            style={styles.noShowOutsideContainer}
                          >
                            <Image
                              source={imagePath.crossIcon}
                              style={{
                                height: 30,
                                width: 30,
                                tintColor: props?.showAttendenceLoading
                                  ? colors.greyBackgroundColor
                                  : colors.SOSSwipeBottonColor1,
                              }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        ) : props?.driverAppSettingData
                            ?.allowDriverStartTripWithoutEscortAttd == "YES" ? (
                          <TouchableOpacity
                            onPress={() => {
                              if (props?.showAttendenceLoading) {
                                showError("Request already in pending");
                              } else {
                                props.noShowClick(item);
                              }
                            }}
                            style={styles.noShowOutsideContainer}
                          >
                            <Image
                              source={imagePath.crossIcon}
                              style={{
                                height: 30,
                                width: 30,
                                tintColor: props?.showAttendenceLoading
                                  ? colors.greyBackgroundColor
                                  : colors.SOSSwipeBottonColor1,
                              }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        ) : null}
                      </View>

                      {props?.driverAppSettingData
                        ?.displayEmpAttendenceCaptureWithoutOTPQR === "YES" ? (
                        <View style={[styles.listItemAlignNoShowConntent]}>
                          <TouchableOpacity
                            onPress={() => {
                              if (props?.showAttendenceLoading) {
                                showError("Request already in pending");
                              } else {
                                props.boardEmployee(item);
                              }
                            }}
                            style={styles.noShowOutsideContainer}
                          >
                            <Image
                              source={imagePath.boardEmp}
                              style={{
                                height: 30,
                                width: 30,
                                tintColor: props?.showAttendenceLoading
                                  ? colors.greyBackgroundColor
                                  : colors.greenColor,
                              }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </View>
                  )
                ) : item.status === "BOARDED" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ alignItems: "center" }}>
                      {props?.passengersListType === "deBoardPassengers" ? (
                        <>
                          <Text
                            style={styles.listItemEmpBoardingDeboardingTime}
                          >
                            {boardingTime}
                          </Text>
                          <Text
                            style={styles.listItemEmpBoardingDeboardingTime}
                          >
                            {deboardingTime === 0 ? "--" : deboardingTime}
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.listItemEmpTimeText}>{time}</Text>
                      )}
                    </View>
                    {props?.driverAppSettingData
                      ?.displayEmpAttendenceCaptureWithoutOTPQR == "YES" ? (
                      props?.tripType == "DOWNTRIP" ? (
                        props?.passengersListType ==
                        "onBoardPassengers" ? null : (
                          <View style={[styles.listItemAlignNoShowConntent]}>
                            <TouchableOpacity
                              onPress={() => {
                                if (props?.showAttendenceLoading) {
                                  showError("Request already in pending");
                                } else {
                                  props.boardEmployee(item);
                                }
                              }}
                              style={styles.noShowOutsideContainer}
                            >
                              <Image
                                source={imagePath.boardEmp}
                                style={{
                                  height: 25,
                                  width: 25,
                                  tintColor: props?.showAttendenceLoading
                                    ? colors.greyBackgroundColor
                                    : colors.greenColor,
                                }}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          </View>
                        )
                      ) : // <View style={[styles.listItemAlignNoShowConntent]}>
                      //   <TouchableOpacity
                      //     onPress={() => {
                      //       //props.noShowClick(item);
                      //       props.boardEmployee(item);
                      //     }}
                      //     style={styles.noShowOutsideContainer}
                      //   >
                      //     <Image
                      //       source={imagePath.boardEmp}
                      //       style={{ height: 25, width: 25 }}
                      //       resizeMode="contain"
                      //     />
                      //   </TouchableOpacity>
                      // </View>
                      null
                    ) : null}
                  </View>
                ) : item.status === "COMPLETED" ? (
                  <>
                    <Text style={styles.listItemEmpBoardingDeboardingTime}>
                      {boardingTime}
                    </Text>
                    <Text style={styles.listItemEmpBoardingDeboardingTime}>
                      {deboardingTime === 0 ? "--" : deboardingTime}
                    </Text>
                  </>
                ) : item.status === "ABSENT" ? (
                  <View style={styles.listItemAbsentStatusContainer}>
                    <Image
                      source={imagePath.absent}
                      style={styles.listItemAbsentIconnStyle}
                      resizeMode="contain"
                    />
                    <Text style={styles.listItemAbsentEmpText}>
                      {item.absentDateTime === 0
                        ? null
                        : moment
                            .utc(item.absentDateTime)
                            .local()
                            .format("HH:mm")}
                    </Text>
                  </View>
                ) : item.status === "SKIPPED" ? (
                  <View style={styles.listItemAbsentStatusContainer}>
                    <Image
                      source={imagePath.skippedIcon}
                      style={styles.listItemSkipIconStyle}
                      resizeMode="contain"
                    />
                    {item.escortSkippedTime ? (
                      <Text style={styles.listItemAbsentEmpText}>
                        {item.escortSkippedTime === 0
                          ? null
                          : moment
                              .utc(item.escortSkippedTime)
                              .local()
                              .format("HH:mm")}
                      </Text>
                    ) : null}
                  </View>
                ) : time === 0 ? null : (
                  <Text style={styles.listItemEmpTimeTextCenter}>{time}</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      );
    } else if (
      (item?.status == "CANCLED" || item?.status == "ABSENT") &&
      item?.passType !== "ESCORT"
    ) {
      return (
        <View activeOpacity={1} style={styles.renderListContainer}>
          <View style={styles.renderListLeftContainer}>
            {index === 0 ? null : (
              <View>
                <View style={styles.renderListDotIndicator}></View>
                <View style={styles.renderListDotIndicator}></View>
                <View style={styles.renderListDotIndicator}></View>
              </View>
            )}

            <View style={styles.listItemUserThumbnailContainer}>
              {props?.driverAppSettingData?.canDriverViewEmployeesPhoto ==
              "YES" ? (
                item?.photo ? (
                  <Image
                    source={{ uri: DOC_URL + item?.photo }}
                    style={styles.listItemUserImageStyle}
                  />
                ) : (
                  <Image
                    source={imagePath.userIcon}
                    style={styles.listItemUserImageStyle}
                  />
                )
              ) : (
                <Image
                  source={imagePath.userIcon}
                  style={styles.listItemUserImageStyle}
                />
              )}
            </View>

            <View style={styles.listItemDotIndicatorContainer}>
              <View style={styles.renderListDotIndicator}></View>
              <View style={styles.renderListDotIndicator}></View>
              <View style={styles.renderListDotIndicator}></View>
            </View>
          </View>
          <View style={styles.listItemMiddleContainer}>
            <View style={styles.listItemMiddleContainerRow}>
              <View style={styles.listItemMiddleContainerLeftBox}>
                <Text
                  style={[
                    styles.listItemEmployeeNameText,
                    { marginTop: index === 0 ? -8 : 6 },
                  ]}
                  numberOfLines={2}
                >
                  {item.name} ({item?.empCode})
                </Text>
                <View style={styles.listItemRatingAndVaccineContainer}>
                  <View style={{}}>
                    <AirbnbRating
                      showRating={false}
                      count={5}
                      defaultRating={item?.passRating}
                      size={15}
                      isDisabled={true}
                    />
                  </View>
                  <View style={styles.verticalDivider}></View>
                  <View style={styles.genderAndVaccineIconContainer}>
                    <View style={styles.vaccineIconContainer}>
                      {item?.vaccineStatus === "Fully Vaccinated" ||
                      item?.vaccineStatus === "Vaccinated Fully" ? (
                        <Image
                          style={styles.vaccineIconStyle}
                          source={imagePath.Vaccinated_green}
                        />
                      ) : item.vaccineStatus === "Partially Vaccinated" ? (
                        <Image
                          style={styles.vaccineIconStyle}
                          source={imagePath.partially_vaccinated_blue}
                        />
                      ) : (
                        <Image
                          style={styles.vaccineIconStyle}
                          source={imagePath.not_vaccinated_orange}
                        />
                      )}
                    </View>

                    <View style={styles.genderIconContainer}>
                      {item.gender === "Male" ? (
                        <Image
                          style={styles.genderIconStyle}
                          source={imagePath.male}
                        />
                      ) : item?.gender === "Female" ? (
                        <Image
                          style={styles.genderIconStyle}
                          source={imagePath.female}
                        />
                      ) : (
                        <Image
                          style={styles.genderIconStyle}
                          source={imagePath.other}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </View>

              {item?.status === "ABSENT" ? (
                <View style={styles.listItemMiddleContainerRightBox}>
                  <Image
                    source={imagePath.absent}
                    style={styles.listItemAbsentIconnStyle}
                    resizeMode="contain"
                  />
                  <Text style={styles.listItemAbsentEmpText}>
                    {item.absentDateTime === 0
                      ? null
                      : moment.utc(item.absentDateTime).local().format("HH:mm")}
                  </Text>
                </View>
              ) : item?.status === "CANCLED" ? (
                <View style={styles.listItemMiddleContainerRightBox}>
                  <Image
                    source={imagePath.crossIcon}
                    style={styles.crossIconStyle}
                  />
                  {item?.cancelDateTime === 0 ? null : (
                    <Text style={styles.listItemAbsentEmpText}>
                      {moment.utc(item.cancelDateTime).local().format("HH:mm")}
                    </Text>
                  )}
                </View>
              ) : (
                <View style={styles.listItemMiddleContainerRightBox}>
                  <View style={styles.listItemEmpStatusContainer}>
                    <Text style={styles.listItemEmpStatusText}>
                      {item?.status}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      );
    } else {
      if (isEscort === false) {
        return (
          <EmpDetailComp
            index={index}
            item={item}
            time={time}
            boardingTime={boardingTime}
            deboardingTime={deboardingTime}
            showAbsentButton={props.showAbsentButton}
            escotrTrip={props.escotrTrip}
            showAttendenceLoading={props?.showAttendenceLoading}
            noShowClick={() => {
              if (props?.showAttendenceLoading) {
                showError("Request already in pending");
              } else {
                props.noShowClick(item);
              }
            }}
            passengersListType={props.passengersListType}
            moment={moment}
            driverAppSettingData={props?.driverAppSettingData}
            boardEmployee={() => {
              if (props?.showAttendenceLoading) {
                showError("Request already in pending");
              } else {
                //props.noShowClick(item);
                props.boardEmployee(item);
              }
            }}
          />
        );
      }
    }
  };

  return (
    // <Modal
    //   animationType="fade"
    //   transparent={true}
    //   visible={props.showEmpDetailModal}
    // >
    //   <TouchableWithoutFeedback
    //     onPress={props.closeModal}
    //     style={styles.container}
    //   >
    //     <View style={styles.modalContainer}>
    //       <View
    //         style={[
    //           styles.modalInsideContainer,
    //           {
    //             height: isEscort
    //               ? 150
    //               : empListData?.length < 2
    //               ? 140
    //               : empListData?.length < 3
    //               ? 220
    //               : empListData?.length < 4
    //               ? 340
    //               : empListData?.length < 5
    //               ? 430
    //               : 500,
    //           },
    //         ]}
    //       >
    //         <View style={styles.container}>
    //           <Text style={styles.shiftText}>
    //             Shift time({props.empList[0]?.shiftTime})
    //           </Text>

    //           <FlatList
    //             data={empListData}
    //             renderItem={renderDeBoardPassengersList}
    //             keyExtractor={(item, index) => index.toString()}
    //           />
    //         </View>
    //       </View>
    //     </View>
    //   </TouchableWithoutFeedback>
    // </Modal>
    <RBSheet
      ref={props?.openEmpListModal}
      height={
        isEscort
          ? 150
          : empListData?.length < 2
          ? 140
          : empListData?.length < 3
          ? 220
          : empListData?.length < 4
          ? 340
          : empListData?.length < 5
          ? 430
          : 500
      }
      customStyles={styles.bottomSheetStyle}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalInsideContainer]}>
          <View style={styles.container}>
            {props?.showAttendenceLoading ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <BarIndicator size={20} color={colors.darkBlue} />
              </View>
            ) : null}
            <Text style={styles.shiftText}>
              Shift time({props.empList[0]?.shiftTime})
            </Text>

            <FlatList
              data={empListData}
              renderItem={renderDeBoardPassengersList}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </View>
    </RBSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.modalColor,
  },
  modalInsideContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },
  genderAndVaccineIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  vaccineIconContainer: {
    height: 25,
    width: 25,
    borderWidth: 2,
    borderColor: colors.lightGary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
  },
  vaccineIconStyle: { height: 15, width: 15 },
  genderIconContainer: {
    height: 25,
    width: 25,
    borderWidth: 2,
    borderColor: colors.lightGary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  genderIconStyle: { height: 15, width: 15 },
  noShowOutsideContainer: {
    height: 50,
    width: 50,
    borderRadius: 50,
    //borderWidth: 3,
    //borderColor: colors.darkYellow,
    justifyContent: "center",
    alignItems: "center",
  },
  noShowInsieContainer: {
    height: 40,
    width: 40,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.darkOrange,
    justifyContent: "center",
    alignItems: "center",
  },
  noTextStyle: {
    color: colors.black,
    fontSize: 8,
    fontWeight: "500",
  },
  crossIconStyle: {
    height: 20,
    width: 20,
    tintColor: colors.SOSSwipeBottonColor1,
  },
  shiftText: {
    textAlign: "center",
    color: colors.black,
    paddingBottom: 10,
    fontSize: 14,
  },
  renderListContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  renderListDotIndicator: {
    height: 4,
    width: 4,
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    marginVertical: 1,
  },
  renderListLeftContainer: { width: "10%", alignItems: "center" },
  listItemUserThumbnailContainer: {
    height: 50,
    width: 50,
    borderWidth: 1,
    borderColor: colors.lightGary,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  listItemUserImageStyle: { height: 45, width: 45, borderRadius: 30 },
  listItemDotIndicatorContainer: {
    alignItems: "center",
    marginTop: 2,
    marginBottom: 2,
  },
  listItemMiddleContainer: {
    width: "90%",
    borderBottomColor: colors.dividerColor,
    borderBottomWidth: 1,
    paddingLeft: 20,
    justifyContent: "center",
  },
  listItemMiddleContainerRow: { flexDirection: "row" },
  listItemMiddleContainerLeftBox: {
    width: "70%",
  },
  listItemMiddleContainerRightBox: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  listItemEmployeeNameText: {
    fontSize: 18,
    color: colors.black,
  },
  listItemRatingAndVaccineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  verticalDivider: {
    height: 20,
    width: 1,
    backgroundColor: colors.lightGary,
    marginHorizontal: 10,
  },
  listItemAlignNoShowConntent: {
    alignItems: "center",
    justifyContent: "center",
  },
  listItemEmpBoardingDeboardingTime: { color: colors.black },
  listItemEmpTimeText: {
    color: colors.black,
    fontSize: 10,
    textAlign: "right",
  },
  listItemAbsentStatusContainer: {
    alignItems: "center",
    justifyContent: "center",
    //flexDirection: "row",
  },
  listItemAbsentIconnStyle: { height: 45, width: 45 },
  listItemAbsentEmpText: { color: colors.black, fontSize: 10 },
  listItemEmpTimeTextCenter: {
    color: "black",
    fontSize: 10,
    textAlign: "center",
  },
  listItemSkipIconStyle: { height: 25, width: 25 },
  listItemEmpStatusContainer: {
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.SOSSwipeBottonColor1,
  },
  listItemEmpStatusText: {
    color: colors.white,
    fontSize: 12,
    textTransform: "capitalize",
  },
});

export default memo(ShowEmpListDownTrip);

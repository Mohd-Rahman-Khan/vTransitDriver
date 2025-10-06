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
import imagePath from "../../../constants/imagePath";
import colors from "../../../styles/colors";
import { AirbnbRating } from "react-native-ratings";
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
import { ScrollView } from "react-native-gesture-handler";
const moment = extendMoment(Moment);

function ShowStopPointEmpList(props) {
  var minutes = 0;
  var ontime = "";
  if (
    props?.stopPoint?.expectedArivalTime > 0 &&
    props?.stopPoint?.actualArivalTime > 0
  ) {
    let expected = props?.stopPoint?.expectedArivalTime;
    let arrival = props?.stopPoint?.actualArivalTime;

    let secDiff = Math.floor((arrival - expected) / 1000);
    let minutesDiff = Math.floor(secDiff / 60);

    if (minutesDiff === 0) {
      ontime = "yes";
    } else {
      minutes = minutesDiff;
      ontime = "";
    }
  }

  const renderList = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.stopPointEmpRenderListContainer}
      >
        <View style={styles.stopPointEmpRenderListLeftBox}>
          {index === 0 ? null : (
            <View>
              <View style={styles.stopPointEmpRenderListDotIndicator}></View>
              <View style={styles.stopPointEmpRenderListDotIndicator}></View>
              <View style={styles.stopPointEmpRenderListDotIndicator}></View>
            </View>
          )}

          <View style={styles.stopPointEmpRenderListUserImageContainner}>
            {props?.driverAppSettingData?.canDriverViewEmployeesPhoto ==
            "YES" ? (
              item?.photo ? (
                <Image
                  source={{ uri: DOC_URL + item?.photo }}
                  style={styles.stopPointEmpImageStyle}
                />
              ) : (
                <Image
                  source={imagePath.userIcon}
                  style={styles.stopPointEmpImageStyle}
                />
              )
            ) : (
              <Image
                source={imagePath.userIcon}
                style={styles.stopPointEmpImageStyle}
              />
            )}
          </View>

          <View style={styles.stopPointDotIndicatorContainer}>
            <View style={styles.stopPointEmpRenderListDotIndicator}></View>
            <View style={styles.stopPointEmpRenderListDotIndicator}></View>
            <View style={styles.stopPointEmpRenderListDotIndicator}></View>
          </View>
        </View>
        <View
          style={[
            styles.stopPointEmpRenderListRightBox,
            { marginTop: index === 0 ? 20 : 25 },
          ]}
        >
          <View style={styles.stopPointRightBoxRowContainer}>
            <View style={styles.leftBoxContainer}>
              <Text style={styles.textStyle} numberOfLines={2}>
                {item.name} ({item?.empCode})
              </Text>
              <View style={styles.ratingAndVaccineContainer}>
                <View style={{}}>
                  <AirbnbRating
                    showRating={false}
                    count={5}
                    defaultRating={item?.passRating}
                    size={15}
                    isDisabled={true}
                  />
                </View>
                <View style={styles.verticalDevider}></View>
                <View style={styles.genderAndVaccineIconContainer}>
                  {item?.vaccineStatus ? (
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
                      ) : item.vaccineStatus === "Not Vaccinated" ? (
                        <Image
                          style={styles.vaccineIconStyle}
                          source={imagePath.not_vaccinated_orange}
                        />
                      ) : null}
                    </View>
                  ) : null}

                  <View style={styles.genderIconContainer}>
                    {item.gender === "Male" ? (
                      <Image style={styles.imageIcon} source={imagePath.male} />
                    ) : item?.gender === "Female" ? (
                      <Image
                        style={styles.imageIcon}
                        source={imagePath.female}
                      />
                    ) : (
                      <Image
                        style={styles.imageIcon}
                        source={imagePath.other}
                      />
                    )}
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.rightBoxContainer]}>
              {item?.status === "ABSENT" ? (
                <>
                  <Image
                    source={imagePath.absent}
                    style={styles.absentIconStyle}
                    resizeMode="contain"
                  />
                  {/* {props.isThisOffice ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={imagePath.actualtime}
                        style={{ height: 10, width: 10, marginRight: 3 }}
                        resizeMode="contain"
                      />
                      <Text style={styles.dateAndTimeText}>
                        {moment
                          .utc(
                            item?.expectedArivalTime === 0
                              ? props?.tripStartTime
                              : item?.expectedArivalTime
                          )
                          .local()
                          .format("HH:mm")}
                      </Text>
                    </View>
                  ) : null} */}

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={imagePath.ETA}
                      style={{ height: 10, width: 10 }}
                      resizeMode="contain"
                    />
                    <Text style={styles.dateAndTimeText}>
                      {item.absentDateTime === 0
                        ? null
                        : moment
                            .utc(item.absentDateTime)
                            .local()
                            .format("HH:mm")}
                    </Text>
                  </View>
                </>
              ) : item?.status === "BOARDED" ? (
                <>
                  {props?.isThisOffice ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={imagePath.actualtime}
                        style={{ height: 10, width: 10, marginRight: 3 }}
                        resizeMode="contain"
                      />
                      <Text style={styles.dateAndTimeText}>
                        {moment
                          .utc(
                            item?.expectedArivalTime === 0
                              ? props?.tripStartTime
                              : item?.expectedArivalTime
                          )
                          .local()
                          .format("HH:mm")}
                      </Text>
                    </View>
                  ) : null}

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={imagePath.ETA}
                      style={{ height: 10, width: 10 }}
                      resizeMode="contain"
                    />
                    <Text style={styles.dateAndTimeText}>
                      {item?.actualPickUpDateTime === 0
                        ? null
                        : moment(item?.actualPickUpDateTime).format("HH:mm")}
                    </Text>
                  </View>
                </>
              ) : item?.status === "COMPLETED" ? (
                <>
                  <Text style={styles.dateAndTimeText}>
                    {item?.actualPickUpDateTime === 0
                      ? null
                      : moment(item?.actualPickUpDateTime).format("HH:mm")}
                  </Text>
                  {item?.actualDropDateTime === 0 ? null : (
                    <Text style={styles.dateAndTimeText}>
                      {item?.actualPickUpDateTime === 0
                        ? null
                        : moment(item?.actualDropDateTime).format("HH:mm")}
                    </Text>
                  )}
                </>
              ) : item?.status === "CANCLED" ? (
                <>
                  {/* <Image
                    source={imagePath.crossIcon}
                    style={styles.crossIconStyle}
                  />
                  {props?.isThisOffice ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={imagePath.actualtime}
                        style={{ height: 10, width: 10, marginRight: 3 }}
                        resizeMode="contain"
                      />
                      <Text style={styles.dateAndTimeText}>
                        {moment
                          .utc(
                            item?.expectedArivalTime === 0
                              ? props?.tripStartTime
                              : item?.expectedArivalTime
                          )
                          .local()
                          .format("HH:mm")}
                      </Text>
                    </View>
                  ) : null} */}

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={imagePath.ETA}
                      style={{ height: 10, width: 10 }}
                      resizeMode="contain"
                    />
                    {item?.cancelDateTime === 0 ? null : (
                      <Text style={styles.dateAndTimeText}>
                        {moment(item?.cancelDateTime).format("HH:mm")}
                      </Text>
                    )}
                  </View>
                </>
              ) : item?.status === "NOSHOW" ? (
                <>
                  {/* <Image
                    source={imagePath.noShowIcon}
                    style={styles.noShowAndSkipIcon}
                    resizeMode="contain"
                  />
                  {props?.isThisOffice ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={imagePath.actualtime}
                        style={{ height: 10, width: 10, marginRight: 3 }}
                        resizeMode="contain"
                      />
                      <Text style={styles.dateAndTimeText}>
                        {moment
                          .utc(
                            item?.expectedArivalTime === 0
                              ? props?.tripStartTime
                              : item?.expectedArivalTime
                          )
                          .local()
                          .format("HH:mm")}
                      </Text>
                    </View>
                  ) : null} */}

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={imagePath.ETA}
                      style={{ height: 10, width: 10 }}
                      resizeMode="contain"
                    />
                    {item?.noShowMarkTime === 0 ? null : (
                      <Text style={styles.dateAndTimeText}>
                        {moment(item?.noShowMarkTime).format("HH:mm")}
                      </Text>
                    )}
                  </View>
                </>
              ) : item?.status === "SKIPPED" ? (
                <>
                  {/* <Image
                    source={imagePath.skippedIcon}
                    style={styles.noShowAndSkipIcon}
                    resizeMode="contain"
                  />
                  {props?.isThisOffice ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={imagePath.actualtime}
                        style={{ height: 10, width: 10, marginRight: 3 }}
                        resizeMode="contain"
                      />
                      <Text style={styles.dateAndTimeText}>
                        {moment
                          .utc(
                            item?.expectedArivalTime === 0
                              ? props?.tripStartTime
                              : item?.expectedArivalTime
                          )
                          .local()
                          .format("HH:mm")}
                      </Text>
                    </View>
                  ) : null} */}

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={imagePath.ETA}
                      style={{ height: 10, width: 10 }}
                      resizeMode="contain"
                    />
                    {item?.escortSkippedTime ? (
                      item?.escortSkippedTime === 0 ? null : (
                        <Text style={styles.dateAndTimeText}>
                          {moment(item?.escortSkippedTime).format("HH:mm")}
                        </Text>
                      )
                    ) : null}
                  </View>
                </>
              ) : item?.status === "SCHEDULE" ? (
                props?.isThisOffice ? (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={imagePath.actualtime}
                      style={{ height: 10, width: 10, marginRight: 3 }}
                      resizeMode="contain"
                    />
                    <Text style={styles.dateAndTimeText}>
                      {moment
                        .utc(
                          item?.expectedArivalTime === 0
                            ? props?.tripStartTime
                            : item?.expectedArivalTime
                        )
                        .local()
                        .format("HH:mm")}
                    </Text>
                  </View>
                ) : null
              ) : null}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.showstopPointDetail}
    >
      <TouchableWithoutFeedback onPress={props.closeModal} style={{ flex: 1 }}>
        <View style={styles.modalContainer}>
          <View activeOpacity={1} style={styles.modalInsideContainer}>
            <View style={styles.stopPointContainer}>
              <View style={styles.stopPointLeftContainer}>
                {props.isThisOffice ? (
                  <Image
                    source={imagePath.officeMarker}
                    style={styles.stopPointIconStyle}
                  />
                ) : props.stopPoint?.stopType ? (
                  props.stopPoint?.stopType === "HOME" ? (
                    <Image
                      source={imagePath.homeMapIcon}
                      style={styles.stopPointIconStyle}
                    />
                  ) : (
                    <Image
                      source={imagePath.nodleIcon}
                      style={styles.stopPointIconStyle}
                    />
                  )
                ) : props.stopPoint?.onBoardPassengers?.length === 1 ||
                  props.stopPoint?.deBoardPassengers?.length === 1 ? (
                  <Image
                    source={imagePath.homeMapIcon}
                    style={styles.stopPointIconStyle}
                  />
                ) : (
                  <Image
                    source={imagePath.nodleIcon}
                    style={styles.stopPointIconStyle}
                  />
                )}
              </View>
              <View style={styles.stopPointRightContainer}>
                {props.isThisOffice ? (
                  <Text style={styles.textStyle}>
                    {props?.stopPoint?.onBoardPassengers
                      ? props?.stopPoint?.onBoardPassengers[0]?.officeName +
                        " - " +
                        props?.stopPoint?.onBoardPassengers[0]?.officeLocation
                          ?.locName
                      : props?.stopPoint?.deBoardPassengers[0]?.officeName +
                        " - " +
                        props?.stopPoint?.deBoardPassengers[0]?.officeLocation
                          ?.locName}
                  </Text>
                ) : (
                  <Text style={styles.textStyle}>
                    {props?.stopPoint?.location?.locName}
                  </Text>
                )}
              </View>
            </View>

            <View>
              <View style={styles.stopPointTimeContainer}>
                <View style={styles.stopPointTimeContainerBox}>
                  <View style={styles.stopPointTimeContainerRow}>
                    <Image
                      source={imagePath.actualtime}
                      style={styles.stopPointTimeIcon}
                    />
                    <Text style={styles.stopPointTimeText}>
                      {moment
                        .utc(
                          props?.stopPoint?.expectedArivalTime === 0
                            ? props?.tripStartTime
                            : props?.stopPoint?.expectedArivalTime
                        )
                        .local()
                        .format("HH:mm")}
                    </Text>
                  </View>
                </View>
                <View style={styles.stopPointTimeContainerBox}>
                  <View style={styles.stopPointTimeContainerRow}>
                    <Image
                      source={imagePath.ETA}
                      style={styles.stopPointTimeIcon}
                    />
                    <Text style={styles.stopPointTimeText}>
                      {props?.stopPoint?.actualArivalTime === 0
                        ? "--"
                        : moment
                            .utc(props?.stopPoint?.actualArivalTime)
                            .local()
                            .format("HH:mm")}
                    </Text>
                  </View>
                </View>
                <View>
                  {minutes > 0 ? (
                    <View style={styles.stopPointDelayEarlyTimeContainer}>
                      <Image
                        style={styles.imageIcon}
                        source={imagePath.delayIcon}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          color:
                            minutes > 0
                              ? colors.redColor
                              : colors.lightBlueColor,
                          marginLeft: 5,
                          fontSize: 12,
                        }}
                      >
                        +{minutes} min
                      </Text>
                    </View>
                  ) : minutes < 0 ? (
                    <View style={styles.stopPointDelayEarlyTimeContainer}>
                      <Image
                        style={styles.imageIcon}
                        source={imagePath.earlyIcon}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          color:
                            minutes > 0
                              ? colors.redColor
                              : colors.lightBlueColor,
                          marginLeft: 5,
                          fontSize: 12,
                        }}
                      >
                        {minutes} min
                      </Text>
                    </View>
                  ) : ontime === "yes" ? (
                    <Image
                      style={styles.imageIcon}
                      source={imagePath.onTime}
                      resizeMode="contain"
                    />
                  ) : null}
                </View>
              </View>
            </View>

            <FlatList
              data={
                props.stopPoint?.onBoardPassengers
                  ? props.stopPoint?.onBoardPassengers
                  : props.stopPoint?.deBoardPassengers
              }
              renderItem={renderList}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.modalColor,
  },
  modalInsideContainer: {
    maxHeight: height / 1.5,
    width: "85%",
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.blueBorderColor,
    borderRadius: 20,
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    backgroundColor: colors.lightGary,
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
  imageIcon: { height: 15, width: 15 },
  genderIconContainer: {
    height: 25,
    width: 25,
    borderWidth: 2,
    borderColor: colors.lightGary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  crossIconStyle: {
    height: 20,
    width: 20,
    tintColor: colors.SOSSwipeBottonColor1,
  },
  stopPointEmpRenderListContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  stopPointEmpRenderListLeftBox: { width: "10%", alignItems: "center" },
  stopPointEmpRenderListRightBox: {
    width: "88%",
    borderBottomColor: colors.lightGary,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  stopPointEmpRenderListDotIndicator: {
    height: 4,
    width: 4,
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    marginVertical: 1,
  },
  stopPointEmpRenderListUserImageContainner: {
    height: 30,
    width: 30,
    borderWidth: 1,
    borderColor: colors.lightGary,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  stopPointEmpImageStyle: { height: 25, width: 25, borderRadius: 20 },
  stopPointDotIndicatorContainer: { alignItems: "center" },
  stopPointRightBoxRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftBoxContainer: {
    width: "75%",
  },
  textStyle: { fontSize: 16, color: colors.black },
  ratingAndVaccineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  verticalDevider: {
    height: 20,
    width: 1,
    backgroundColor: colors.lightGary,
    marginHorizontal: 10,
  },
  rightBoxContainer: {
    width: "23%",
    justifyContent: "center",
    alignItems: "center",
  },
  absentIconStyle: { height: 45, width: 45 },
  dateAndTimeText: { color: colors.black, fontSize: 10 },
  noShowAndSkipIcon: { height: 25, width: 25 },
  stopPointIconStyle: {
    width: moderateScale(30),
    height: moderateScale(30),
    resizeMode: "contain",
  },
  stopPointContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  stopPointTimeContainer: {
    flexDirection: "row",
    marginTop: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  stopPointTimeContainerBox: {
    borderWidth: 1,
    borderColor: colors.lightGary,
    paddingHorizontal: 5,
    paddingVertical: 5,
    width: 70,
  },
  stopPointTimeContainerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stopPointTimeIcon: { height: 14, width: 14 },
  stopPointTimeText: {
    marginLeft: 5,
    fontSize: 12,
    color: colors.black,
  },
  stopPointDelayEarlyTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
  },
  stopPointLeftContainer: { width: "10%" },
  stopPointRightContainer: { width: "90%" },
  vaccineIconStyle: { height: 15, width: 15 },
});

export default memo(ShowStopPointEmpList);

import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState, memo } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import imagePath from "../constants/imagePath";
import ButtonComp from "./ButtonComp";
import colors from "../styles/colors";
import fontFamily from "../styles/fontFamily";
import {
  moderateScale,
  moderateScaleVertical,
  width,
  textScale,
} from "../styles/responsiveSize";
import strings from "../constants/lang";
import { Rating, AirbnbRating } from "react-native-ratings";
import AirbnbRatingComp from "./AirbnbRatingComp";
import { DOC_URL } from "../config/urls";
import TextInputComp from "./TextInputComp";
import { showError } from "../utils/helperFunction";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

function RatingComp(props) {
  const renderItem = ({ item, index }) => {
    if (item?.passType == "EMPLOYEE") {
      let empStatus =
        item?.status.charAt(0).toUpperCase() +
        item?.status.slice(1).toLowerCase();

      if (
        item?.status === "ABSENT" ||
        item?.status === "CANCLED" ||
        item?.status === "NOSHOW" ||
        item?.status === "SKIPPED"
        //  ||
        // props?.driverAppSettingData?.allowDriverToRateEmp != "YES"
      ) {
        return (
          <TouchableOpacity
            onPress={() => {
              if (item?.status === "CANCLED") {
                showError(`Employee was cancelled in the trip.`);
              } else if (item?.status === "SKIPPED") {
                showError(`Escort was ${empStatus} in the trip.`);
              }
              // else if (
              //   props?.driverAppSettingData?.allowDriverToRateEmp != "YES"
              // ) {
              // }
              else {
                showError(`Employee was ${empStatus} in the trip.`);
              }
            }}
            style={styles.empDetailContainer}
          >
            <View style={styles.empImageBox}>
              {props?.driverAppSettingData?.canDriverViewEmployeesPhoto ==
              "YES" ? (
                item?.photo ? (
                  <Image
                    source={{ uri: DOC_URL + item?.photo }}
                    style={styles.empImageStyle}
                  />
                ) : (
                  <Image
                    source={imagePath.userIcon}
                    style={styles.empImageStyle}
                  />
                )
              ) : (
                <Image
                  source={imagePath.userIcon}
                  style={styles.empImageStyle}
                />
              )}

              <View style={styles.devider}></View>
            </View>
            <View style={styles.empDetailBox}>
              <View style={styles.empDetailBoxContainer}>
                <View style={styles.empDetailBoxRow}>
                  <View style={styles.empDetailLeftBox}>
                    <Text style={styles.empNameText}>
                      {item.name} ({item.empCode})
                    </Text>
                  </View>
                  <View style={styles.epmDetailRightBox}>
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
                        {item?.gender === "male" || item?.gender === "Male" ? (
                          <Image
                            style={styles.genderIconStyle}
                            source={imagePath.male}
                          />
                        ) : item?.gender === "Female" ||
                          item?.gender === "female" ? (
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
              </View>
              <View style={styles.ratingBox}>
                <AirbnbRatingComp
                  rating={item?.passRating}
                  empStatus={item?.status}
                  color={item.ratingColor}
                />
              </View>
            </View>
            <View style={styles.empDetailBoxRight}>
              <View style={styles.timeAndIconContainer}>
                {item?.status === "ABSENT" ? (
                  <>
                    <Image
                      source={imagePath.absent}
                      style={styles.absentIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.timeText}>
                      {item.absentDateTime === 0
                        ? null
                        : moment
                            .utc(item.absentDateTime)
                            .local()
                            .format("HH:mm")}
                    </Text>
                  </>
                ) : item?.status === "BOARDED" ? (
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Text style={styles.timeText}>
                      {item?.actualPickUpDateTime === 0
                        ? null
                        : moment(item?.actualPickUpDateTime).format("HH:mm")}
                    </Text>
                  </View>
                ) : item?.status === "CANCLED" ? (
                  <>
                    <Image
                      source={imagePath.crossIcon}
                      style={styles.crossIconStyle}
                    />
                    <Text style={styles.timeText}>
                      {item.cancelDateTime === 0
                        ? null
                        : moment
                            .utc(item.cancelDateTime)
                            .local()
                            .format("HH:mm")}
                    </Text>
                  </>
                ) : item?.status === "NOSHOW" ? (
                  <>
                    <Image
                      source={imagePath.noShowIcon}
                      style={styles.noShowAndSkipIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.timeText}>
                      {item.noShowMarkTime === 0
                        ? null
                        : moment
                            .utc(item.noShowMarkTime)
                            .local()
                            .format("HH:mm")}
                    </Text>
                  </>
                ) : item?.status === "SKIPPED" ? (
                  <>
                    <Image
                      source={imagePath.skippedIcon}
                      style={styles.noShowAndSkipIcon}
                      resizeMode="contain"
                    />
                    {item?.escortSkippedTime ? (
                      <Text style={styles.timeText}>
                        {item.escortSkippedTime === 0
                          ? null
                          : moment
                              .utc(item.escortSkippedTime)
                              .local()
                              .format("HH:mm")}
                      </Text>
                    ) : null}
                  </>
                ) : (
                  <View style={styles.statusContainer}>
                    <View style={styles.statusContainerBox}>
                      <Text style={styles.statusText}>{item?.status}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      } else {
        return (
          <View style={styles.empDetailContainer}>
            <View style={styles.empImageBox}>
              {props?.driverAppSettingData?.canDriverViewEmployeesPhoto ==
              "YES" ? (
                item?.photo ? (
                  <Image
                    source={{ uri: DOC_URL + item?.photo }}
                    style={styles.empImageStyle}
                  />
                ) : (
                  <Image
                    source={imagePath.userIcon}
                    style={styles.empImageStyle}
                  />
                )
              ) : (
                <Image
                  source={imagePath.userIcon}
                  style={styles.empImageStyle}
                />
              )}

              <View style={styles.devider}></View>
            </View>
            <View style={styles.empDetailBox}>
              <View style={styles.empDetailBoxContainer}>
                <View style={styles.empDetailBoxRow}>
                  <View style={styles.empDetailLeftBox}>
                    <Text style={styles.empNameText}>
                      {item.name} ({item.empCode})
                    </Text>
                  </View>
                  <View style={styles.epmDetailRightBox}>
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
                        {item?.gender === "male" || item?.gender === "Male" ? (
                          <Image
                            style={styles.genderIconStyle}
                            source={imagePath.male}
                          />
                        ) : item?.gender === "Female" ||
                          item?.gender === "female" ? (
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
              </View>
              <View style={styles.ratingBox}>
                <AirbnbRatingComp
                  rating={item?.passRating}
                  empStatus={item?.status}
                  handleRating={(r) =>
                    props.handleRating(r, item.id, item?.status)
                  }
                  color={item.ratingColor}
                  driverAppSettingData={props?.driverAppSettingData}
                />
              </View>
            </View>
            <View style={styles.empDetailBoxRight}>
              <View style={styles.timeAndIconContainer}>
                {item?.status === "BOARDED" ? (
                  <Text style={styles.timeText}>
                    {item?.actualPickUpDateTime === 0
                      ? null
                      : moment(item?.actualPickUpDateTime).format("HH:mm")}
                  </Text>
                ) : item?.status === "COMPLETED" ? (
                  <>
                    <Text style={styles.timeText}>
                      {item?.actualPickUpDateTime === 0
                        ? null
                        : moment(item?.actualPickUpDateTime).format("HH:mm")}
                    </Text>
                    <Text style={styles.timeText}>
                      {item?.actualDropDateTime === 0
                        ? null
                        : moment(item?.actualDropDateTime).format("HH:mm")}
                    </Text>
                  </>
                ) : null}
              </View>
            </View>
          </View>
        );
      }
    }
  };

  return (
    <RBSheet
      onClose={props.onClose}
      closeOnDragDown={false}
      dragFromTopOnly={true}
      ref={props.showRating}
      height={
        props.ratingEmpList?.length < 2
          ? 320
          : props.ratingEmpList?.length < 3
          ? 380
          : props.ratingEmpList?.length < 4
          ? 430
          : 500
      }
      openDuration={250}
      customStyles={styles.bottomSheetCustomStyle}
    >
      <View style={styles.rateAndWriteContainer}>
        <Text style={styles.rateAndWriteText}>{strings.Rate_And_Write}</Text>
        <Text style={styles.feedbackText}>{strings.Feedback}</Text>
      </View>

      <View style={styles.ratingEmpListContainer}>
        <FlatList
          data={props.ratingEmpList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      <View style={styles.submitButtonContainer}>
        <View style={styles.submitButtonBox}>
          {props?.isLoading || props?.snapShotUri === "" ? (
            <View
              style={[
                styles.btnStyle,
                { backgroundColor: colors.greyBackgroundColor },
              ]}
            >
              <ActivityIndicator size="small" color={colors.white} />
            </View>
          ) : (
            <ButtonComp
              btnText="Submit"
              btnStyle={styles.btnStyle}
              btnTextStyle={styles.btnTextStyle}
              onPress={props.submitRatingFun}
            />
          )}
        </View>
      </View>
    </RBSheet>
  );
}

const styles = StyleSheet.create({
  rateAndWriteText: {
    color: colors.darkSkyBlue,
    fontSize: textScale(16),
    marginTop: 10,
    fontFamily: fontFamily.robotoRegular,
  },
  feedbackText: {
    color: colors.darkSkyBlue,
    fontSize: textScale(22),
    fontFamily: fontFamily.robotoMedium,
  },
  btnStyle: {
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.darkBlue,
    paddingVertical: moderateScaleVertical(8),
  },
  btnTextStyle: {
    color: colors.white,
    fontSize: textScale(15),
    fontFamily: fontFamily.robotoBold,
    textTransform: "uppercase",
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
  crossIconStyle: {
    height: 20,
    width: 20,
    tintColor: colors.SOSSwipeBottonColor1,
  },
  empDetailContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  empImageBox: {
    width: "10%",
    alignItems: "center",
  },
  empImageStyle: { height: 35, width: 35, borderRadius: 20 },
  devider: {
    height: 55,
    width: 2,
    backgroundColor: colors.greenColor,
  },
  empDetailBox: { width: "77%" },
  empDetailBoxRight: {
    width: "10%",
  },
  empDetailBoxContainer: { paddingHorizontal: 20 },
  empDetailBoxRow: { flexDirection: "row", alignItems: "center" },
  empDetailLeftBox: { width: "70%" },
  empNameText: {
    fontSize: 18,
    fontWeight: "400",
    color: colors.black,
  },
  epmDetailRightBox: { width: "28%", alignItems: "flex-end" },
  ratingBox: { marginTop: 5 },
  timeAndIconContainer: {
    alignItems: "center",
  },
  absentIcon: { height: 45, width: 45 },
  timeText: { color: colors.black, fontSize: 10 },
  noShowAndSkipIcon: { height: 25, width: 25 },
  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  statusContainerBox: {
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.SOSSwipeBottonColor1,
    marginTop: 20,
  },
  statusText: {
    color: colors.white,
    fontSize: 6,
    textTransform: "capitalize",
  },
  rateAndWriteContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  ratingEmpListContainer: { flex: 1, marginBottom: 90 },
  submitButtonContainer: {
    width: "100%",
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  submitButtonBox: { width: "80%" },
  bottomSheetCustomStyle: {
    container: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
  },
});

export default memo(RatingComp);

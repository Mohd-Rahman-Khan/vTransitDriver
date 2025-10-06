import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
} from "react-native";
import React from "react";
import { AirbnbRating } from "react-native-ratings";
import colors from "../../../../styles/colors";
import imagePath from "../../../../constants/imagePath";
import { DOC_URL } from "../../../../config/urls";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../../../styles/responsiveSize";
import { showError } from "../../../../utils/helperFunction";

export default function EmpDetailComp({
  index,
  item,
  boardingTime,
  time,
  deboardingTime,
  showAbsentButton,
  noShowClick = () => {},
  escotrTrip,
  passengersListType,
  moment,
  callingEmp,
  permissionForCall = () => {},
  boardEmployee = () => {},
  driverAppSettingData,
  showAttendenceLoading,
}) {
  return (
    <View style={styles.empDetailContainer}>
      <View style={styles.empDetailLeftContainer}>
        {index === 0 ? null : (
          <View>
            <View style={styles.empDotIndicator}></View>
            <View style={styles.empDotIndicator}></View>
            <View style={styles.empDotIndicator}></View>
          </View>
        )}

        <View style={styles.empImageConntainer}>
          {driverAppSettingData?.canDriverViewEmployeesPhoto == "YES" ? (
            item?.passType === "EMPLOYEE" ? (
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
            ) : item?.photo ? (
              <Image
                source={{ uri: DOC_URL + item?.photo }}
                style={styles.empImageStyle}
              />
            ) : (
              <Image source={imagePath.userIcon} style={styles.empImageStyle} />
            )
          ) : (
            <Image source={imagePath.userIcon} style={styles.empImageStyle} />
          )}
        </View>

        <View style={styles.empDotIndicatorContainner}>
          <View style={styles.empDotIndicator}></View>
          <View style={styles.empDotIndicator}></View>
          <View style={styles.empDotIndicator}></View>
        </View>
      </View>
      <View style={styles.empMiddleContainer}>
        <View style={styles.empMiddleContainerRow}>
          <View style={styles.empMiddleLeftContainer}>
            <Text
              style={[
                styles.listItemEmployeeNameText,
                { marginTop: index === 0 ? -8 : 6 },
              ]}
              numberOfLines={2}
            >
              {item.name} ({item?.empCode})
            </Text>
            <View style={styles.empRatingAndVaccineContainer}>
              <View>
                <AirbnbRating
                  showRating={false}
                  count={5}
                  defaultRating={item?.passRating}
                  size={15}
                  isDisabled={true}
                />
              </View>
              <View style={styles.empVerticalDevider}></View>
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
          <View style={styles.empRideContainer}>
            {callingEmp ? (
              <View style={styles.empAbsentButtonContainer}>
                <TouchableOpacity
                  style={styles.empCallIcon}
                  onPress={permissionForCall}
                >
                  <Image
                    source={imagePath.call}
                    style={{ height: 23, width: 23 }}
                  />
                </TouchableOpacity>
              </View>
            ) : item.status === "SCHEDULE" ? (
              showAbsentButton ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={styles.empAbsentButtonContainer}>
                    {escotrTrip ? (
                      driverAppSettingData?.allowDriverStartTripWithoutEscortAttd ==
                      "YES" ? (
                        <TouchableOpacity
                          onPress={() => {
                            noShowClick(item);
                          }}
                          style={styles.noShowOutsideContainer}
                        >
                          <Image
                            source={imagePath.crossIcon}
                            style={{
                              height: 30,
                              width: 30,
                              tintColor: showAttendenceLoading
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
                          noShowClick(item);
                        }}
                        style={styles.noShowOutsideContainer}
                      >
                        <Image
                          source={imagePath.crossIcon}
                          style={{
                            height: 30,
                            width: 30,
                            tintColor: showAttendenceLoading
                              ? colors.greyBackgroundColor
                              : colors.SOSSwipeBottonColor1,
                          }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  {driverAppSettingData?.displayEmpAttendenceCaptureWithoutOTPQR ==
                  "YES" ? (
                    <View style={[styles.listItemAlignNoShowConntent]}>
                      <TouchableOpacity
                        onPress={() => {
                          //props.noShowClick(item);
                          boardEmployee();
                        }}
                        style={styles.noShowOutsideContainer}
                      >
                        <Image
                          source={imagePath.boardEmp}
                          style={{
                            height: 30,
                            width: 30,
                            tintColor: showAttendenceLoading
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
                    alignItems: "center",
                  }}
                >
                  <View style={styles.empAbsentButtonContainer}>
                    {escotrTrip ? (
                      driverAppSettingData?.allowDriverStartTripWithoutEscortAttd ==
                      "YES" ? (
                        <TouchableOpacity
                          onPress={() => {
                            props.noShowClick(item);
                          }}
                          style={styles.noShowOutsideContainer}
                        >
                          <Image
                            source={imagePath.crossIcon}
                            style={{
                              height: 30,
                              width: 30,
                              tintColor: showAttendenceLoading
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
                          props.noShowClick(item);
                        }}
                        style={styles.noShowOutsideContainer}
                      >
                        <Image
                          source={imagePath.crossIcon}
                          style={{
                            height: 30,
                            width: 30,
                            tintColor: showAttendenceLoading
                              ? colors.greyBackgroundColor
                              : colors.SOSSwipeBottonColor1,
                          }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  {driverAppSettingData?.displayEmpAttendenceCaptureWithoutOTPQR ==
                  "YES" ? (
                    <View style={[styles.listItemAlignNoShowConntent]}>
                      <TouchableOpacity
                        onPress={() => {
                          //props.noShowClick(item);
                          boardEmployee();
                        }}
                        style={styles.noShowOutsideContainer}
                      >
                        <Image
                          source={imagePath.boardEmp}
                          style={{
                            height: 30,
                            width: 30,
                            tintColor: showAttendenceLoading
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
              passengersListType === "deBoardPassengers" ? (
                <>
                  <Text style={styles.empTimeText}>{boardingTime}</Text>
                  <Text style={styles.empTimeText}>
                    {deboardingTime === 0 ? "--" : deboardingTime}
                  </Text>
                </>
              ) : (
                <Text style={styles.empBoardingTimeText}>{time}</Text>
              )
            ) : item.status === "COMPLETED" ? (
              <>
                <Text style={styles.empTimeText}>{boardingTime}</Text>
                <Text style={styles.empTimeText}>
                  {deboardingTime === 0 ? "--" : deboardingTime}
                </Text>
              </>
            ) : item.status === "ABSENT" ? (
              <View style={styles.empStatusIconContainer}>
                <Image
                  source={imagePath.absent}
                  style={styles.empStatusIcon}
                  resizeMode="contain"
                />
                <Text style={styles.empAbsentTimeText}>
                  {item.absentDateTime === 0
                    ? null
                    : moment.utc(item.absentDateTime).local().format("HH:mm")}
                </Text>
              </View>
            ) : item?.status === "CANCLED" ? (
              <View style={styles.empStatusIconContainer}>
                <Image
                  source={imagePath.crossIcon}
                  style={styles.crossIconStyle}
                />
                {item.cancelDateTime === 0 ? null : (
                  <Text style={styles.empAbsentTimeText}>
                    {moment.utc(item.cancelDateTime).local().format("HH:mm")}
                  </Text>
                )}
              </View>
            ) : item?.status === "NOSHOW" ? (
              <View style={styles.empStatusIconContainer}>
                <Image
                  source={imagePath.noShowIcon}
                  style={{ height: 25, width: 25 }}
                  resizeMode="contain"
                />
                {item.noShowMarkTime === 0 ? null : (
                  <Text style={styles.empAbsentTimeText}>
                    {moment.utc(item.noShowMarkTime).local().format("HH:mm")}
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.empStatusIconContainer}>
                <View style={styles.empStatusContainer}>
                  <Text style={styles.empStatusText}>{item?.status}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    // borderWidth: 3,
    // borderColor: colors.darkYellow,
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
  empDetailContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  empDetailLeftContainer: { width: "10%", alignItems: "center" },
  empDotIndicator: {
    height: 4,
    width: 4,
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    marginVertical: 1,
  },
  empImageConntainer: {
    height: 50,
    width: 50,
    borderWidth: 1,
    borderColor: colors.lightGary,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  empImageStyle: { height: 45, width: 45, borderRadius: 30 },
  empDotIndicatorContainner: {
    alignItems: "center",
    marginTop: 2,
    marginBottom: 2,
  },
  empMiddleContainer: {
    width: "90%",
    borderBottomColor: colors.dividerColor,
    borderBottomWidth: 1,
    paddingLeft: 20,
    justifyContent: "center",
  },
  empMiddleContainerRow: { flexDirection: "row" },
  empMiddleLeftContainer: {
    width: "75%",
  },
  empRatingAndVaccineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  empVerticalDevider: {
    height: 20,
    width: 1,
    backgroundColor: colors.lightGary,
    marginHorizontal: 10,
  },
  empRideContainer: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
  },
  empAbsentButtonContainer: { alignItems: "center", justifyContent: "center" },
  empTimeText: { color: colors.black },
  empBoardingTimeText: {
    color: colors.black,
    fontSize: 10,
    textAlign: "right",
  },
  empStatusIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    //flexDirection: "row",
  },
  empStatusIcon: { height: 45, width: 45 },
  empAbsentTimeText: { color: colors.black, fontSize: 10 },
  empStatusContainer: {
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.SOSSwipeBottonColor1,
  },
  empStatusText: {
    color: colors.white,
    fontSize: 12,
    textTransform: "capitalize",
  },
  listItemEmployeeNameText: {
    fontSize: 18,
    color: colors.black,
  },
  empCallIcon: {
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateScaleVertical(5),
    paddingHorizontal: moderateScale(5),
    borderRadius: moderateScale(4),
    // shadowColor: colors.black,
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
    // shadowOffset: {
    //   height: 1,
    //   width: 1,
    // },
    alignSelf: "flex-end",
  },
});

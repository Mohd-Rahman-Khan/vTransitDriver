import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import imagePath from "../../../constants/imagePath";
import colors from "../../../styles/colors";
import RBSheet from "react-native-raw-bottom-sheet";
import { Rating, AirbnbRating } from "react-native-ratings";
import { DOC_URL } from "../../../config/urls";
import Moment from "moment";
import { extendMoment } from "moment-range";
import ShowMoreComp from "./Components/ShowMoreComp";
import { getDelayOrEarlyMinutes } from "../../../utils/utils";
const moment = extendMoment(Moment);

export default function DownLiveTripTrack(props) {
  const renderItem = ({ item, index }) => {
    var isVehicleDelay = false;
    var textColor = "";
    var delayOrEarlyInMinutes = 0;

    if (item.status === "ARRIVED" || item.status === "SCHEDULE") {
      if (item?.actualArivalTime === 0) {
      } else {
        delayOrEarlyInMinutes = getDelayOrEarlyMinutes(
          item?.expectedArivalTime,
          item?.actualArivalTime
        );

        if (delayOrEarlyInMinutes < 0) {
          textColor = colors.lightBlueColor;
        } else if (delayOrEarlyInMinutes > 0) {
          textColor = colors.redColor;
        } else if (delayOrEarlyInMinutes === 0) {
          textColor = colors.greenColor;
        } else {
          textColor = "";
        }
      }
    } else if (item.status === "DEPARTURED") {
      if (item?.actualArivalTime === 0) {
      } else {
        delayOrEarlyInMinutes = getDelayOrEarlyMinutes(
          item?.expectedArivalTime,
          item?.actualArivalTime
        );

        if (delayOrEarlyInMinutes < 0) {
          textColor = colors.lightBlueColor;
        } else if (delayOrEarlyInMinutes > 0) {
          textColor = colors.redColor;
        } else if (delayOrEarlyInMinutes === 0) {
          textColor = colors.greenColor;
        } else {
          textColor = "";
        }
      }
    } else {
    }

    if (item?.onBoardPassengers) {
      if (item?.onBoardPassengers?.length === 1) {
        if (
          item?.expectedArivalTime > 0 &&
          item?.onBoardPassengers[0]?.actualPickUpDateTime > 0
        ) {
          let getVehicleDelayMinutes = getDelayOrEarlyMinutes(
            item?.expectedArivalTime,
            item?.onBoardPassengers[0]?.actualPickUpDateTime
          );
          if (getVehicleDelayMinutes > 0) {
            isVehicleDelay = true;
          } else {
            isVehicleDelay = false;
          }
        } else {
          isVehicleDelay = false;
        }
      }
    } else {
      if (item?.deBoardPassengers?.length === 1) {
        if (
          item?.expectedArivalTime > 0 &&
          item?.deBoardPassengers[0]?.actualPickUpDateTime > 0
        ) {
          let getVehicleDelayMinutes = getDelayOrEarlyMinutes(
            item?.expectedArivalTime,
            item?.deBoardPassengers[0]?.actualPickUpDateTime
          );
          if (getVehicleDelayMinutes > 0) {
            isVehicleDelay = true;
          } else {
            isVehicleDelay = false;
          }
        } else {
          isVehicleDelay = false;
        }
      }
    }

    return item?.onBoardPassengers ? (
      <View style={styles.empDetailContainer}>
        <View style={styles.empImageContainer}>
          <Image
            style={styles.empImageStyle}
            source={imagePath.state}
            resizeMode="contain"
          />
        </View>
        <View style={styles.stopPointDetailContainer}>
          <View style={styles.rowConntainer}>
            <View style={styles.leftBoxWidth}>
              <Text
                style={[
                  styles.listItemAddressTextStyle,
                  { marginTop: 5, color: colors.black },
                ]}
              >
                {item?.location?.locName}
              </Text>
            </View>
            <View style={styles.rightBoxWidth}>
              <View style={styles.stopPointETATimeContainer}>
                {props.tripStatus === "STARTED" ? (
                  <View>
                    {index === 0 ? (
                      <Text style={styles.timeTextStyle}>
                        {moment(item?.expectedArivalTimeStr).format("HH:mm")}
                      </Text>
                    ) : (
                      <Text style={styles.timeTextStyle}>
                        {moment(item?.expectedArivalTimeStr).format("HH:mm")}
                      </Text>
                    )}

                    {item?.actualArivalTime === 0 ? (
                      <Text
                        style={[
                          styles.timeTextStyle,
                          {
                            color: textColor === "" ? colors.black : textColor,
                          },
                        ]}
                      >
                        --
                      </Text>
                    ) : (
                      <Text
                        style={[
                          styles.timeTextStyle,
                          {
                            color: textColor === "" ? colors.black : textColor,
                          },
                        ]}
                      >
                        {moment(item?.actualArivalTime).format("HH:mm")}
                      </Text>
                    )}
                  </View>
                ) : null}
              </View>
              <View style={styles.stopPointArrivalTimeContainer}>
                {item?.actualArivalTime === 0 ? (
                  <Text style={{ color: colors.black }}>--</Text>
                ) : delayOrEarlyInMinutes === 0 ? (
                  <Image
                    source={imagePath.onTime}
                    style={styles.vehicleDelayAndOnTimeIcon}
                    resizeMode="contain"
                  />
                ) : delayOrEarlyInMinutes > 0 ? (
                  <>
                    <View style={styles.delayTimeContainer}>
                      <Image
                        style={styles.delayAndEarlyIconStyle}
                        source={imagePath.delayIcon}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          color: textColor === "" ? colors.black : textColor,
                          fontSize: 12,
                        }}
                      >
                        {"+" + delayOrEarlyInMinutes}
                      </Text>
                    </View>

                    <Text
                      style={{
                        color: textColor === "" ? colors.black : textColor,
                        fontSize: 12,
                      }}
                    >
                      Min
                    </Text>
                  </>
                ) : delayOrEarlyInMinutes < 0 ? (
                  <>
                    <View style={styles.delayTimeContainer}>
                      <Image
                        style={styles.delayAndEarlyIconStyle}
                        source={imagePath.earlyIcon}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          color: textColor === "" ? colors.black : textColor,
                          fontSize: 12,
                        }}
                      >
                        {delayOrEarlyInMinutes}
                      </Text>
                    </View>

                    <Text
                      style={{
                        color: textColor === "" ? colors.black : textColor,
                        fontSize: 12,
                      }}
                    >
                      Min
                    </Text>
                  </>
                ) : (
                  <Text
                    style={{
                      color: textColor === "" ? colors.black : textColor,
                      fontSize: 12,
                    }}
                  >
                    --
                  </Text>
                )}
              </View>
            </View>
          </View>
          <ShowMoreComp
            showMorePress={() => {
              props.showMorePress(item);
            }}
            item={item}
            delayMinutes={delayOrEarlyInMinutes}
            driverAppSettingData={props?.driverAppSettingData}
          />
        </View>
      </View>
    ) : item?.deBoardPassengers?.length === 1 ? (
      <View style={styles.empDetailContainer}>
        {item?.deBoardPassengers[0].status === "ABSENT" ? (
          <>
            <View style={styles.empImageContainer}>
              {props?.driverAppSettingData?.canDriverViewEmployeesPhoto ==
              "YES" ? (
                item?.deBoardPassengers[0]?.photo ? (
                  <Image
                    style={styles.empImageStyle}
                    source={{
                      uri: DOC_URL + item?.deBoardPassengers[0]?.photo,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    style={styles.empImageStyle}
                    //source={imagePath.userIcon}
                    source={
                      item?.deBoardPassengers[0]?.passType == "ESCORT"
                        ? imagePath.maleAvatar
                        : item?.deBoardPassengers[0]?.gender == "Male" ||
                          item?.deBoardPassengers[0]?.gender == "M"
                        ? imagePath.maleAvatar
                        : item?.deBoardPassengers[0]?.gender == "Female" ||
                          item?.deBoardPassengers[0]?.gender == "F"
                        ? imagePath.femaleAvatar
                        : imagePath.userIcon
                    }
                    resizeMode="cover"
                  />
                )
              ) : (
                <Image
                  style={styles.empImageStyle}
                  //source={imagePath.userIcon}
                  source={
                    item?.deBoardPassengers[0]?.gender == "Male" ||
                    item?.deBoardPassengers[0]?.gender == "M"
                      ? imagePath.maleAvatar
                      : item?.deBoardPassengers[0]?.gender == "Female" ||
                        item?.deBoardPassengers[0]?.gender == "F"
                      ? imagePath.femaleAvatar
                      : imagePath.userIcon
                  }
                  resizeMode="cover"
                />
              )}
            </View>
            <View style={styles.stopPointDetailContainer}>
              <View style={styles.rowConntainer}>
                <View style={styles.leftBoxWidth}>
                  <Text style={styles.empNameTextStyle}>
                    {item?.deBoardPassengers[0]?.name}
                  </Text>
                  <View style={styles.genderRatingVaccineRowStyle}>
                    <View style={styles.ratingContainer}>
                      <AirbnbRating
                        showRating={false}
                        count={5}
                        defaultRating={item?.deBoardPassengers[0]?.passRating}
                        size={10}
                        isDisabled={true}
                        selectedColor={colors.green}
                      />
                    </View>
                    <View style={styles.verticalDeviderContainer}>
                      <View style={styles.verticalDivier}></View>
                    </View>
                    <View style={styles.genderAndVaccineIconContainer}>
                      {item?.deBoardPassengers[0]?.vaccineStatus ? (
                        <View style={styles.vaccineIconContainer}>
                          {item?.deBoardPassengers[0]?.vaccineStatus ===
                            "Fully Vaccinated" ||
                          item?.deBoardPassengers[0]?.vaccineStatus ===
                            "Vaccinated Fully" ? (
                            <Image
                              style={styles.vaccineIconStyle}
                              source={imagePath.Vaccinated_green}
                            />
                          ) : item?.deBoardPassengers[0]?.vaccineStatus ===
                            "Partially Vaccinated" ? (
                            <Image
                              style={styles.vaccineIconStyle}
                              source={imagePath.partially_vaccinated_blue}
                            />
                          ) : item?.deBoardPassengers[0]?.vaccineStatus ===
                            "Not Vaccinated" ? (
                            <Image
                              style={styles.vaccineIconStyle}
                              source={imagePath.not_vaccinated_orange}
                            />
                          ) : null}
                        </View>
                      ) : null}

                      <View style={styles.genderIconContainer}>
                        {item.deBoardPassengers[0]?.gender === "Male" ? (
                          <Image
                            style={styles.genderIconStyle}
                            source={imagePath.male}
                          />
                        ) : item.deBoardPassengers[0]?.gender === "Female" ? (
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
                  <Text
                    style={[
                      styles.listItemAddressTextStyle,
                      { marginTop: 5, color: colors.black },
                    ]}
                  >
                    {item?.location?.locName}
                  </Text>
                </View>
                <View style={styles.rightBoxWidth}>
                  <View style={styles.stopPointETATimeContainer}>
                    <>
                      <Image
                        source={imagePath.absent}
                        style={styles.absentIconStyle}
                        resizeMode="contain"
                      />
                      <Text style={styles.absentTimeStyle}>
                        {item.deBoardPassengers[0]?.absentDateTime === 0
                          ? null
                          : moment
                              .utc(item.deBoardPassengers[0]?.absentDateTime)
                              .local()
                              .format("HH:mm")}
                      </Text>
                    </>
                  </View>
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.empImageContainer}>
              {props?.driverAppSettingData?.canDriverViewEmployeesPhoto ==
              "YES" ? (
                item?.deBoardPassengers[0]?.photo ? (
                  <Image
                    style={styles.empImageStyle}
                    source={{
                      uri: DOC_URL + item?.deBoardPassengers[0]?.photo,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    style={styles.empImageStyle}
                    //source={imagePath.userIcon}
                    source={
                      item?.deBoardPassengers[0]?.passType == "ESCORT"
                        ? imagePath.maleAvatar
                        : item?.deBoardPassengers[0]?.gender == "Male" ||
                          item?.deBoardPassengers[0]?.gender == "M"
                        ? imagePath.maleAvatar
                        : item?.deBoardPassengers[0]?.gender == "Female" ||
                          item?.deBoardPassengers[0]?.gender == "F"
                        ? imagePath.femaleAvatar
                        : imagePath.userIcon
                    }
                    resizeMode="cover"
                  />
                )
              ) : (
                <Image
                  style={styles.empImageStyle}
                  //source={imagePath.userIcon}
                  source={
                    item?.deBoardPassengers[0]?.passType == "ESCORT"
                      ? imagePath.maleAvatar
                      : item?.deBoardPassengers[0]?.gender == "Male" ||
                        item?.deBoardPassengers[0]?.gender == "M"
                      ? imagePath.maleAvatar
                      : item?.deBoardPassengers[0]?.gender == "Female" ||
                        item?.deBoardPassengers[0]?.gender == "F"
                      ? imagePath.femaleAvatar
                      : imagePath.userIcon
                  }
                  resizeMode="cover"
                />
              )}
            </View>
            <View style={styles.stopPointDetailContainer}>
              <View style={styles.rowConntainer}>
                <View style={styles.leftBoxWidth}>
                  <Text style={styles.empNameTextStyle}>
                    {item?.deBoardPassengers[0]?.name}
                  </Text>
                  <View style={styles.genderRatingVaccineRowStyle}>
                    <View style={styles.ratingContainer}>
                      <AirbnbRating
                        showRating={false}
                        count={5}
                        defaultRating={item?.deBoardPassengers[0]?.passRating}
                        size={10}
                        isDisabled={true}
                        selectedColor={colors.green}
                      />
                    </View>
                    <View style={styles.verticalDeviderContainer}>
                      <View style={styles.verticalDivier}></View>
                    </View>
                    <View style={styles.genderAndVaccineIconContainer}>
                      {item?.deBoardPassengers[0]?.vaccineStatus ? (
                        <View style={styles.vaccineIconContainer}>
                          {item?.deBoardPassengers[0]?.vaccineStatus ===
                            "Fully Vaccinated" ||
                          item?.deBoardPassengers[0]?.vaccineStatus ===
                            "Vaccinated Fully" ? (
                            <Image
                              style={styles.vaccineIconStyle}
                              source={imagePath.Vaccinated_green}
                            />
                          ) : item?.deBoardPassengers[0]?.vaccineStatus ===
                            "Partially Vaccinated" ? (
                            <Image
                              style={styles.vaccineIconStyle}
                              source={imagePath.partially_vaccinated_blue}
                            />
                          ) : item?.deBoardPassengers[0]?.vaccineStatus ===
                            "Not Vaccinated" ? (
                            <Image
                              style={styles.vaccineIconStyle}
                              source={imagePath.not_vaccinated_orange}
                            />
                          ) : null}
                        </View>
                      ) : null}

                      <View style={styles.genderIconContainer}>
                        {item.deBoardPassengers[0]?.gender === "Male" ? (
                          <Image
                            style={styles.genderIconStyle}
                            source={imagePath.male}
                          />
                        ) : item.deBoardPassengers[0]?.gender === "Female" ? (
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
                  <Text
                    style={[
                      styles.listItemAddressTextStyle,
                      { marginTop: 5, color: colors.black },
                    ]}
                  >
                    {item?.location?.locName}
                  </Text>
                </View>
                {item.deBoardPassengers[0]?.status === "CANCLED" ? (
                  <View style={styles.livetripTrackingSheetStatusContainer}>
                    <Image
                      source={imagePath.crossIcon}
                      style={styles.crossIconStyle}
                    />
                    {item.deBoardPassengers[0]?.cancelDateTime === 0 ? null : (
                      <Text style={{ color: colors.black, fontSize: 10 }}>
                        {moment
                          .utc(item.deBoardPassengers[0]?.cancelDateTime)
                          .local()
                          .format("HH:mm")}
                      </Text>
                    )}
                  </View>
                ) : item.deBoardPassengers[0]?.status === "SKIPPED" ? (
                  <View style={styles.livetripTrackingSheetStatusContainer}>
                    <Image
                      source={imagePath.skippedIcon}
                      style={styles.skipAndNoShowEmpIcon}
                      resizeMode="contain"
                    />
                    {item.deBoardPassengers[0]?.escortSkippedTime ? (
                      item.deBoardPassengers[0]?.escortSkippedTime ===
                      0 ? null : (
                        <Text style={{ color: colors.black, fontSize: 10 }}>
                          {moment
                            .utc(item.deBoardPassengers[0]?.escortSkippedTime)
                            .local()
                            .format("HH:mm")}
                        </Text>
                      )
                    ) : null}
                  </View>
                ) : item.deBoardPassengers[0]?.status === "NOSHOW" ? (
                  <View style={styles.livetripTrackingSheetStatusContainer}>
                    <Image
                      source={imagePath.noShowIcon}
                      style={styles.skipAndNoShowEmpIcon}
                      resizeMode="contain"
                    />
                    {item.deBoardPassengers[0]?.noShowMarkTime === 0 ? null : (
                      <Text style={{ color: colors.black, fontSize: 10 }}>
                        {moment
                          .utc(item.deBoardPassengers[0]?.noShowMarkTime)
                          .local()
                          .format("HH:mm")}
                      </Text>
                    )}
                  </View>
                ) : (
                  <View style={styles.rightBoxWidth}>
                    <View style={styles.stopPointETATimeContainer}>
                      {props.tripStatus === "STARTED" ? (
                        <View>
                          {index === 0 ? (
                            <Text style={styles.timeTextStyle}>
                              {moment(
                                props?.rideDetail?.actualTripStartTime
                              ).format("HH:mm")}
                            </Text>
                          ) : (
                            <Text style={styles.timeTextStyle}>
                              {moment(item?.expectedArivalTimeStr).format(
                                "HH:mm"
                              )}
                            </Text>
                          )}

                          {item?.actualArivalTime === 0 ? (
                            <Text
                              style={[
                                styles.timeTextStyle,
                                {
                                  color:
                                    textColor === "" ? colors.black : textColor,
                                },
                              ]}
                            >
                              --
                            </Text>
                          ) : (
                            <Text
                              style={[
                                styles.timeTextStyle,
                                {
                                  color:
                                    textColor === "" ? colors.black : textColor,
                                },
                              ]}
                            >
                              {moment(item?.actualArivalTime).format("HH:mm")}
                            </Text>
                          )}
                        </View>
                      ) : null}
                    </View>

                    {item?.actualArivalTime === 0 ? (
                      <Text style={{ color: colors.black }}>--</Text>
                    ) : delayOrEarlyInMinutes === 0 ? (
                      <Image
                        source={imagePath.onTime}
                        style={styles.vehicleDelayAndOnTimeIcon}
                        resizeMode="contain"
                      />
                    ) : delayOrEarlyInMinutes > 0 ? (
                      <>
                        <View style={styles.delayTimeContainer}>
                          <Image
                            style={styles.delayAndEarlyIconStyle}
                            source={imagePath.delayIcon}
                            resizeMode="contain"
                          />
                          <Text
                            style={{
                              color:
                                textColor === "" ? colors.black : textColor,
                              fontSize: 12,
                            }}
                          >
                            {"+" + delayOrEarlyInMinutes}
                          </Text>
                        </View>

                        <Text
                          style={{
                            color: textColor === "" ? colors.black : textColor,
                            fontSize: 12,
                          }}
                        >
                          Min
                        </Text>
                      </>
                    ) : delayOrEarlyInMinutes < 0 ? (
                      <>
                        <View style={styles.delayTimeContainer}>
                          <Image
                            style={styles.delayAndEarlyIconStyle}
                            source={imagePath.earlyIcon}
                            resizeMode="contain"
                          />
                          <Text
                            style={{
                              color:
                                textColor === "" ? colors.black : textColor,
                              fontSize: 12,
                            }}
                          >
                            {delayOrEarlyInMinutes}
                          </Text>
                        </View>

                        <Text
                          style={{
                            color: textColor === "" ? colors.black : textColor,
                            fontSize: 12,
                          }}
                        >
                          Min
                        </Text>
                      </>
                    ) : (
                      <Text
                        style={{
                          color: textColor === "" ? colors.black : textColor,
                          fontSize: 12,
                        }}
                      >
                        --
                      </Text>
                    )}
                  </View>
                )}
              </View>
              <View style={styles.rowConntainer}>
                <View style={styles.leftBoxWidth}></View>
                <View style={styles.rightBoxWidthForVehicleAndEmpDelay}>
                  <View style={styles.vehicleAndEmpDelayContainer}>
                    {delayOrEarlyInMinutes > 0 ? (
                      <Image
                        source={imagePath.vehicleDelay}
                        style={styles.vehicleDelayAndOnTimeIcon}
                        resizeMode="contain"
                      />
                    ) : null}
                    {isVehicleDelay ? (
                      <Image
                        source={imagePath.delayIcon}
                        style={styles.vehicleDelayIconStyle}
                        resizeMode="contain"
                      />
                    ) : null}
                  </View>
                  {item?.actualWaitingTimeInSec > 0 ? (
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Text
                        style={{ marginLeft: 15, fontSize: 12, color: "black" }}
                      >
                        {/* WT- {Math.floor(item?.actualWaitingTimeInSec / 60)} Min */}
                        WT- {(item?.actualWaitingTimeInSec / 60).toFixed(2)} Min
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    ) : (
      <View style={styles.empDetailContainer}>
        <View style={styles.empImageContainer}>
          <Image
            style={styles.noddleIconStyle}
            source={imagePath.locationGray}
            resizeMode="cover"
          />
        </View>
        <View style={styles.stopPointDetailContainer}>
          <View style={styles.rowConntainer}>
            <View style={styles.leftBoxWidth}>
              <Text style={[styles.empNameTextStyle, { marginTop: 25 }]}>
                {item?.location?.locName}
              </Text>
            </View>
            <View style={styles.rightBoxWidth}>
              <View style={styles.stopPointETATimeContainer}>
                {props.tripStatus === "STARTED" ? (
                  <View>
                    {index === 0 ? (
                      <Text style={styles.timeTextStyle}>
                        {moment(props?.rideDetail?.actualTripStartTime).format(
                          "HH:mm"
                        )}
                      </Text>
                    ) : (
                      <Text style={styles.timeTextStyle}>
                        {moment(item?.expectedArivalTimeStr).format("HH:mm")}
                      </Text>
                    )}

                    {item?.actualArivalTime === 0 ? (
                      <Text
                        style={[
                          styles.timeTextStyle,
                          {
                            color: textColor === "" ? colors.black : textColor,
                          },
                        ]}
                      >
                        --
                      </Text>
                    ) : (
                      <Text
                        style={[
                          styles.timeTextStyle,
                          {
                            color: textColor === "" ? colors.black : textColor,
                          },
                        ]}
                      >
                        {moment(item?.actualArivalTime).format("HH:mm")}
                      </Text>
                    )}
                  </View>
                ) : null}
              </View>
              <View style={styles.stopPointArrivalTimeContainer}>
                {item?.actualArivalTime === 0 ? (
                  <Text style={{ color: colors.black }}>--</Text>
                ) : delayOrEarlyInMinutes === 0 ? (
                  <Image
                    source={imagePath.onTime}
                    style={styles.vehicleDelayAndOnTimeIcon}
                    resizeMode="contain"
                  />
                ) : delayOrEarlyInMinutes > 0 ? (
                  <>
                    <View style={styles.delayTimeContainer}>
                      <Image
                        style={styles.delayAndEarlyIconStyle}
                        source={imagePath.delayIcon}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          color: textColor === "" ? colors.black : textColor,
                          fontSize: 12,
                        }}
                      >
                        {"+" + delayOrEarlyInMinutes}
                      </Text>
                    </View>

                    <Text
                      style={{
                        color: textColor === "" ? colors.black : textColor,
                        fontSize: 12,
                      }}
                    >
                      Min
                    </Text>
                  </>
                ) : delayOrEarlyInMinutes < 0 ? (
                  <>
                    <View style={styles.delayTimeContainer}>
                      <Image
                        style={styles.delayAndEarlyIconStyle}
                        source={imagePath.earlyIcon}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          color: textColor === "" ? colors.black : textColor,
                          fontSize: 12,
                        }}
                      >
                        {delayOrEarlyInMinutes}
                      </Text>
                    </View>

                    <Text
                      style={{
                        color: textColor === "" ? colors.black : textColor,
                        fontSize: 12,
                      }}
                    >
                      Min
                    </Text>
                  </>
                ) : (
                  <Text
                    style={{
                      color: textColor === "" ? colors.black : textColor,
                      fontSize: 12,
                    }}
                  >
                    --
                  </Text>
                )}
              </View>
            </View>
          </View>
          <ShowMoreComp
            showMorePress={() => {
              props.showMorePress(item);
            }}
            item={item}
            delayMinutes={delayOrEarlyInMinutes}
            driverAppSettingData={props?.driverAppSettingData}
          />
        </View>
      </View>
    );
  };
  return (
    <RBSheet
      closeOnDragDown={false}
      dragFromTopOnly={true}
      ref={props.showBottomSheet}
      height={500}
      openDuration={250}
      customStyles={styles.trackingBottomSheetCustomStyle}
    >
      <View style={styles.bottomSheetContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={props.empList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.trackingBottomSheetFlatListContainer}
        />
      </View>
    </RBSheet>
  );
}

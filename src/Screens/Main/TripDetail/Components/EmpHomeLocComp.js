import { View, Text, Image } from "react-native";
import React from "react";
import imagePath from "../../../../constants/imagePath";
import colors from "../../../../styles/colors";
import { styles } from "../style";
import RatingGenderRow from "../Components/RatingGenderRow";
import { DOC_URL } from "../../../../config/urls";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { getDelayOrEarlyMinutes } from "../../../../utils/utils";

const moment = extendMoment(Moment);

export default function EmpHomeLocComp({
  item,
  tripStatus,
  delayMinutes,
  color,
  driverAppSettingData,
}) {
  var isVehicleDelay = false;
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
  return item?.deBoardPassengers ? (
    <View style={styles.empDetailContainer}>
      <View style={styles.empImageContainer}>
        {driverAppSettingData?.canDriverViewEmployeesPhoto == "YES" ? (
          item?.deBoardPassengers[0]?.photo ? (
            <Image
              style={styles.empImageStyle}
              source={{ uri: DOC_URL + item?.deBoardPassengers[0]?.photo }}
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
            <RatingGenderRow item={item} />
            <Text style={[styles.listItemAddressTextStyle, styles.textColor]}>
              {item?.location?.locName}
            </Text>
          </View>
          <View style={styles.rightBoxWidth}>
            <View style={styles.stopPointETATimeContainer}>
              {tripStatus === "STARTED" ? (
                <View style={styles.stopPointETAAlignment}>
                  <Text style={styles.timeTextStyle}>
                    {moment(item?.expectedArivalTimeStr).format("HH:mm")}
                  </Text>
                  {tripStatus === "COMPLETED" ? (
                    <Text style={[styles.timeTextStyle, { color: color }]}>
                      {item?.actualArivalTime === 0
                        ? ""
                        : moment(item?.actualArivalTime).format("HH:mm")}
                    </Text>
                  ) : null}
                </View>
              ) : tripStatus === "COMPLETED" ? (
                <View style={styles.stopPointETAAlignment}>
                  <Text style={styles.timeTextStyle}>
                    {moment(item?.expectedArivalTimeStr).format("HH:mm")}
                  </Text>
                  {tripStatus === "COMPLETED" ? (
                    <Text style={[styles.timeTextStyle, { color: color }]}>
                      {item?.actualArivalTime === 0
                        ? "--"
                        : moment(item?.actualArivalTime).format("HH:mm")}
                    </Text>
                  ) : null}
                </View>
              ) : tripStatus === "SCHEDULE" ? (
                <View style={styles.stopPointETAAlignment}>
                  <Text style={styles.timeTextStyle}>
                    {moment(item?.expectedArivalTimeStr).format("HH:mm")}
                  </Text>
                  <Text style={[styles.timeTextStyle]}>
                    {item?.actualArivalTime === 0
                      ? "--"
                      : moment(item?.actualArivalTime).format("HH:mm")}
                  </Text>
                </View>
              ) : null}
            </View>
            <View style={styles.arrivalTimeETAContainer}>
              <View style={styles.containerAlignment}>
                {item?.deBoardPassengers[0]?.status === "ABSENT" ? (
                  <>
                    <Image
                      source={imagePath.absent}
                      style={styles.absentIconStyle}
                      resizeMode="contain"
                    />
                    <Text style={styles.absentTimeStyle}>
                      {item?.deBoardPassengers[0]?.absentDateTime === 0
                        ? null
                        : moment
                            .utc(item?.deBoardPassengers[0]?.absentDateTime)
                            .local()
                            .format("HH:mm")}
                    </Text>
                  </>
                ) : item?.deBoardPassengers[0]?.status === "CANCLED" ? (
                  <>
                    <Image
                      source={imagePath.crossIcon}
                      style={styles.crossIconStyle}
                    />
                    {item?.deBoardPassengers[0]?.cancelDateTime === 0 ? null : (
                      <Text style={styles.absentTimeStyle}>
                        {moment
                          .utc(item?.deBoardPassengers[0]?.cancelDateTime)
                          .local()
                          .format("HH:mm")}
                      </Text>
                    )}
                  </>
                ) : item?.deBoardPassengers[0]?.status === "SKIPPED" ? (
                  <>
                    <Image
                      source={imagePath.skippedIcon}
                      style={styles.skipAndNoShowEmpIcon}
                      resizeMode="contain"
                    />
                    {item?.deBoardPassengers[0]?.escortSkippedTime ? (
                      item?.deBoardPassengers[0]?.escortSkippedTime ===
                      0 ? null : (
                        <Text style={styles.absentTimeStyle}>
                          {moment
                            .utc(item?.deBoardPassengers[0]?.escortSkippedTime)
                            .local()
                            .format("HH:mm")}
                        </Text>
                      )
                    ) : null}
                  </>
                ) : item?.deBoardPassengers[0]?.status === "NOSHOW" ? (
                  <>
                    <Image
                      source={imagePath.noShowIcon}
                      style={styles.skipAndNoShowEmpIcon}
                      resizeMode="contain"
                    />
                    {item?.deBoardPassengers[0]?.noShowMarkTime === 0 ? null : (
                      <Text style={styles.absentTimeStyle}>
                        {moment
                          .utc(item?.deBoardPassengers[0]?.noShowMarkTime)
                          .local()
                          .format("HH:mm")}
                      </Text>
                    )}
                  </>
                ) : (
                  <View style={styles.stopPointETAAlignment}>
                    {delayMinutes === 0 ? (
                      <Image
                        source={imagePath.onTime}
                        style={styles.vehicleDelayAndOnTimeIcon}
                        resizeMode="contain"
                      />
                    ) : delayMinutes > 0 ? (
                      <>
                        <View style={styles.delayTimeContainer}>
                          <Image
                            style={styles.delayAndEarlyIconStyle}
                            source={imagePath.delayIcon}
                            resizeMode="contain"
                          />
                          <Text style={{ color: color, fontSize: 12 }}>
                            {"+" + delayMinutes}
                          </Text>
                        </View>

                        <Text style={{ color: color, fontSize: 12 }}>Min</Text>
                      </>
                    ) : delayMinutes < 0 ? (
                      <>
                        <View style={styles.delayTimeContainer}>
                          <Image
                            style={styles.delayAndEarlyIconStyle}
                            source={imagePath.earlyIcon}
                            resizeMode="contain"
                          />
                          <Text style={{ color: color, fontSize: 12 }}>
                            {delayMinutes}
                          </Text>
                        </View>

                        <Text style={{ color: color, fontSize: 12 }}>Min</Text>
                      </>
                    ) : (
                      <Text style={{ color: color, fontSize: 12 }}>--</Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
        <View style={styles.rowConntainer}>
          <View style={styles.leftBoxWidth}></View>
          <View style={styles.rightBoxWidthForVehicleAndEmpDelay}>
            <View style={styles.vehicleAndEmpDelayContainer}>
              {delayMinutes > 0 ? (
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
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ marginLeft: 15, fontSize: 12, color: "black" }}>
                  {/* WT- {Math.floor(item?.actualWaitingTimeInSec / 60)} Min */}
                  WT- {(item?.actualWaitingTimeInSec / 60).toFixed(2)} Min
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.empDetailContainer}>
      <View style={styles.empImageContainer}>
        {driverAppSettingData?.canDriverViewEmployeesPhoto == "YES" ? (
          item?.onBoardPassengers[0]?.photo ? (
            <Image
              style={styles.empImageStyle}
              source={{ uri: DOC_URL + item?.onBoardPassengers[0]?.photo }}
              resizeMode="cover"
            />
          ) : (
            <Image
              style={styles.empImageStyle}
              //source={imagePath.userIcon}
              source={
                item?.onBoardPassengers[0]?.passType == "ESCORT"
                  ? imagePath.maleAvatar
                  : item?.onBoardPassengers[0]?.gender == "Male" ||
                    item?.onBoardPassengers[0]?.gender == "M"
                  ? imagePath.maleAvatar
                  : item?.onBoardPassengers[0]?.gender == "Female" ||
                    item?.onBoardPassengers[0]?.gender == "F"
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
              item?.onBoardPassengers[0]?.passType == "ESCORT"
                ? imagePath.maleAvatar
                : item?.onBoardPassengers[0]?.gender == "Male" ||
                  item?.onBoardPassengers[0]?.gender == "M"
                ? imagePath.maleAvatar
                : item?.onBoardPassengers[0]?.gender == "Female" ||
                  item?.onBoardPassengers[0]?.gender == "F"
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
              {item?.onBoardPassengers[0]?.name}
            </Text>
            <RatingGenderRow item={item} />
            <Text style={[styles.listItemAddressTextStyle, styles.textColor]}>
              {item?.onBoardPassengers[0]?.location?.locName}
            </Text>
          </View>
          <View style={styles.rightBoxWidth}>
            <View style={styles.stopPointETATimeContainer}>
              {tripStatus === "STARTED" ? (
                <View style={styles.stopPointETAAlignment}>
                  <Text style={styles.timeTextStyle}>
                    {moment(item?.expectedArivalTimeStr).format("HH:mm")}
                  </Text>
                  {tripStatus === "COMPLETED" ? (
                    <Text style={[styles.timeTextStyle, { color: color }]}>
                      {item?.actualArivalTime === 0
                        ? ""
                        : moment(item?.actualArivalTime).format("HH:mm")}
                    </Text>
                  ) : null}
                </View>
              ) : tripStatus === "COMPLETED" ? (
                <View style={styles.stopPointETAAlignment}>
                  <Text style={styles.timeTextStyle}>
                    {moment(item?.expectedArivalTimeStr).format("HH:mm")}
                  </Text>
                  {tripStatus === "COMPLETED" ? (
                    <Text style={[styles.timeTextStyle, { color: color }]}>
                      {item?.actualArivalTime === 0
                        ? "--"
                        : moment(item?.actualArivalTime).format("HH:mm")}
                    </Text>
                  ) : null}
                </View>
              ) : tripStatus === "SCHEDULE" ? (
                <View style={styles.stopPointETAAlignment}>
                  <Text style={styles.timeTextStyle}>
                    {moment(item?.expectedArivalTimeStr).format("HH:mm")}
                  </Text>
                  <Text style={[styles.timeTextStyle]}>
                    {item?.actualArivalTime === 0
                      ? "--"
                      : moment(item?.actualArivalTime).format("HH:mm")}
                  </Text>
                </View>
              ) : null}
            </View>
            <View style={styles.stopPointArrivalTimeContainer}>
              {item?.deBoardPassengers ? (
                item?.deBoardPassengers[0]?.status === "ABSENT" ? (
                  <>
                    <Image
                      source={imagePath.absent}
                      style={styles.absentIconStyle}
                      resizeMode="contain"
                    />
                    <Text style={styles.absentTimeStyle}>
                      {item?.deBoardPassengers[0]?.absentDateTime === 0
                        ? null
                        : moment
                            .utc(item?.deBoardPassengers[0]?.absentDateTime)
                            .local()
                            .format("HH:mm")}
                    </Text>
                  </>
                ) : item?.deBoardPassengers[0]?.status === "CANCLED" ? (
                  <>
                    <Image
                      source={imagePath.crossIcon}
                      style={styles.crossIconStyle}
                    />
                    {item?.deBoardPassengers[0]?.cancelDateTime === 0 ? null : (
                      <Text style={styles.absentTimeStyle}>
                        {moment
                          .utc(item?.deBoardPassengers[0]?.cancelDateTime)
                          .local()
                          .format("HH:mm")}
                      </Text>
                    )}
                  </>
                ) : item?.deBoardPassengers[0]?.status === "SKIPPED" ? (
                  <>
                    <Image
                      source={imagePath.skippedIcon}
                      style={styles.skipAndNoShowEmpIcon}
                      resizeMode="contain"
                    />
                    {item?.deBoardPassengers[0]?.escortSkippedTime ? (
                      item?.deBoardPassengers[0]?.escortSkippedTime ===
                      0 ? null : (
                        <Text style={styles.absentTimeStyle}>
                          {moment
                            .utc(item?.deBoardPassengers[0]?.escortSkippedTime)
                            .local()
                            .format("HH:mm")}
                        </Text>
                      )
                    ) : null}
                  </>
                ) : item?.deBoardPassengers[0]?.status === "NOSHOW" ? (
                  <>
                    <Image
                      source={imagePath.noShowIcon}
                      style={styles.skipAndNoShowEmpIcon}
                      resizeMode="contain"
                    />
                    {item?.deBoardPassengers[0]?.noShowMarkTime === 0 ? null : (
                      <Text style={styles.absentTimeStyle}>
                        {moment
                          .utc(item?.deBoardPassengers[0]?.noShowMarkTime)
                          .local()
                          .format("HH:mm")}
                      </Text>
                    )}
                  </>
                ) : (
                  <>
                    {delayMinutes === 0 ? (
                      <Image
                        source={imagePath.onTime}
                        style={styles.vehicleDelayAndOnTimeIcon}
                        resizeMode="contain"
                      />
                    ) : delayMinutes > 0 ? (
                      <>
                        <View style={styles.delayTimeContainer}>
                          <Image
                            style={styles.delayAndEarlyIconStyle}
                            source={imagePath.delayIcon}
                            resizeMode="contain"
                          />
                          <Text style={{ color: color, fontSize: 12 }}>
                            {"+" + delayMinutes}
                          </Text>
                        </View>

                        <Text style={{ color: color, fontSize: 12 }}>Min</Text>
                      </>
                    ) : delayMinutes < 0 ? (
                      <>
                        <View style={styles.delayTimeContainer}>
                          <Image
                            style={styles.delayAndEarlyIconStyle}
                            source={imagePath.earlyIcon}
                            resizeMode="contain"
                          />
                          <Text style={{ color: color, fontSize: 12 }}>
                            {delayMinutes}
                          </Text>
                        </View>

                        <Text style={{ color: color, fontSize: 12 }}>Min</Text>
                      </>
                    ) : (
                      <Text style={{ color: color, fontSize: 12 }}>--</Text>
                    )}
                  </>
                )
              ) : item?.onBoardPassengers[0]?.status === "ABSENT" ? (
                <>
                  <Image
                    source={imagePath.absent}
                    style={styles.absentIconStyle}
                    resizeMode="contain"
                  />
                  <Text style={styles.absentTimeStyle}>
                    {item?.onBoardPassengers[0]?.absentDateTime === 0
                      ? null
                      : moment
                          .utc(item?.onBoardPassengers[0]?.absentDateTime)
                          .local()
                          .format("HH:mm")}
                  </Text>
                </>
              ) : item?.onBoardPassengers[0]?.status === "CANCLED" ? (
                <>
                  <Image
                    source={imagePath.crossIcon}
                    style={styles.crossIconStyle}
                  />
                  {item?.onBoardPassengers[0]?.cancelDateTime === 0 ? null : (
                    <Text style={styles.absentTimeStyle}>
                      {moment
                        .utc(item?.onBoardPassengers[0]?.cancelDateTime)
                        .local()
                        .format("HH:mm")}
                    </Text>
                  )}
                </>
              ) : item?.onBoardPassengers[0]?.status === "SKIPPED" ? (
                <>
                  <Image
                    source={imagePath.skippedIcon}
                    style={styles.skipAndNoShowEmpIcon}
                    resizeMode="contain"
                  />
                  {item?.onBoardPassengers[0]?.escortSkippedTime ? (
                    item?.onBoardPassengers[0]?.escortSkippedTime ===
                    0 ? null : (
                      <Text style={styles.absentTimeStyle}>
                        {moment
                          .utc(item?.onBoardPassengers[0]?.escortSkippedTime)
                          .local()
                          .format("HH:mm")}
                      </Text>
                    )
                  ) : null}
                </>
              ) : item?.onBoardPassengers[0]?.status === "NOSHOW" ? (
                <>
                  <Image
                    source={imagePath.noShowIcon}
                    style={styles.skipAndNoShowEmpIcon}
                    resizeMode="contain"
                  />
                  {item?.onBoardPassengers[0]?.noShowMarkTime === 0 ? null : (
                    <Text style={styles.absentTimeStyle}>
                      {moment
                        .utc(item?.onBoardPassengers[0]?.noShowMarkTime)
                        .local()
                        .format("HH:mm")}
                    </Text>
                  )}
                </>
              ) : (
                <>
                  {delayMinutes === 0 ? (
                    <Image
                      source={imagePath.onTime}
                      style={styles.vehicleDelayAndOnTimeIcon}
                      resizeMode="contain"
                    />
                  ) : delayMinutes > 0 ? (
                    <>
                      <View style={styles.delayTimeContainer}>
                        <Image
                          style={styles.delayAndEarlyIconStyle}
                          source={imagePath.delayIcon}
                          resizeMode="contain"
                        />
                        <Text style={{ color: color, fontSize: 12 }}>
                          {"+" + delayMinutes}
                        </Text>
                      </View>

                      <Text style={{ color: color, fontSize: 12 }}>Min</Text>
                    </>
                  ) : delayMinutes < 0 ? (
                    <>
                      <View style={styles.delayTimeContainer}>
                        <Image
                          style={styles.delayAndEarlyIconStyle}
                          source={imagePath.earlyIcon}
                          resizeMode="contain"
                        />
                        <Text style={{ color: color, fontSize: 12 }}>
                          {delayMinutes}
                        </Text>
                      </View>

                      <Text style={{ color: color, fontSize: 12 }}>Min</Text>
                    </>
                  ) : (
                    <Text style={{ color: color, fontSize: 12 }}>--</Text>
                  )}
                </>
              )}
            </View>
          </View>
        </View>
        <View style={styles.rowConntainer}>
          <View style={styles.leftBoxWidth}></View>
          <View style={styles.rightBoxWidthForVehicleAndEmpDelay}>
            <View style={styles.vehicleAndEmpDelayContainer}>
              {delayMinutes > 0 ? (
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
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ marginLeft: 15, fontSize: 12, color: "black" }}>
                  {/* WT- {Math.floor(item?.actualWaitingTimeInSec / 60)} Min */}
                  WT- {(item?.actualWaitingTimeInSec / 60).toFixed(2)} Min
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

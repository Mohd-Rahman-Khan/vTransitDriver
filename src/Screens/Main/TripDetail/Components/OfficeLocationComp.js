import { View, Text, Image } from "react-native";
import React from "react";
import colors from "../../../../styles/colors";
import { styles } from "../style";
import imagePath from "../../../../constants/imagePath";
import Moment from "moment";
import { extendMoment } from "moment-range";
import ShowMoreComp from "./ShowMoreComp";

const moment = extendMoment(Moment);

export default function OfficeLocationComp({
  item,
  tripStatus,
  showMoreShow,
  showMorePress,
  delayMinutes,
  tripType,
  index,
  rideDetail,
  color,
  driverAppSettingData,
}) {
  return (
    <View style={styles.empDetailContainer}>
      <View style={styles.empImageContainer}>
        <Image
          style={styles.officeIconStyle}
          source={imagePath.state}
          resizeMode="contain"
        />
      </View>
      <View style={styles.stopPointDetailContainer}>
        <View style={styles.rowConntainer}>
          <View style={styles.leftBoxWidth}>
            <Text style={styles.empNameTextStyle}>
              {item?.location?.locName}
            </Text>
          </View>
          <View style={styles.rightBoxWidth}>
            <View style={styles.stopPointETATimeContainer}>
              {tripStatus === "STARTED" ? (
                <View>
                  <Text style={styles.timeTextStyle}>
                    {moment(item?.expectedArivalTimeStr).format("HH:mm")}
                  </Text>
                  {tripStatus === "COMPLETED" ? (
                    <Text style={[styles.timeTextStyle]}>
                      {item?.actualArivalTime === 0
                        ? "--"
                        : moment(item?.actualArivalTime).format("HH:mm")}
                    </Text>
                  ) : null}
                </View>
              ) : tripStatus === "COMPLETED" ? (
                <View>
                  {tripType === "DOWNTRIP" ? (
                    index === 0 ? (
                      <Text style={styles.timeTextStyle}>
                        {moment(rideDetail.startTimeInMiliSecStr).format(
                          "HH:mm"
                        )}
                      </Text>
                    ) : (
                      <Text style={styles.timeTextStyle}>
                        {moment(item?.expectedArivalTimeStr).format("HH:mm")}
                      </Text>
                    )
                  ) : item?.onBoardPassengers ? (
                    <Text style={styles.timeTextStyle}>
                      {moment(item?.expectedArivalTimeStr).format("HH:mm")}
                    </Text>
                  ) : (
                    <Text style={styles.timeTextStyle}>
                      {moment(item?.deBoardPassengers[0]?.shiftInTime).format(
                        "HH:mm"
                      )}
                    </Text>
                  )}

                  {tripStatus === "COMPLETED" ? (
                    <Text style={[styles.timeTextStyle, { color: color }]}>
                      {item?.actualArivalTime === 0
                        ? "--"
                        : moment(item?.actualArivalTime).format("HH:mm")}
                    </Text>
                  ) : null}
                </View>
              ) : tripStatus === "SCHEDULE" ? (
                <View>
                  <Text style={styles.timeTextStyle}>
                    {rideDetail?.startTime}
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
          </View>
        </View>

        {showMoreShow ? (
          <ShowMoreComp
            showMorePress={() => {
              showMorePress();
            }}
            item={item}
            delayMinutes={delayMinutes}
            driverAppSettingData={driverAppSettingData}
          />
        ) : (
          <ShowMoreComp
            showMorePress={() => {
              showMorePress();
            }}
            item={item}
            delayMinutes={delayMinutes}
            driverAppSettingData={driverAppSettingData}
          />
        )}
      </View>
    </View>
  );
}

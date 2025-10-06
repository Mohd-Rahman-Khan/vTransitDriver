import { View, Text, Image } from "react-native";
import React from "react";
import imagePath from "../../../../constants/imagePath";
import ShowMoreComp from "./ShowMoreComp";
import { styles } from "../style";
import colors from "../../../../styles/colors";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

export default function NodlePointComp({
  item,
  showMorePress,
  tripStatus,
  delayMinutes,
  color,
  driverAppSettingData,
}) {
  return (
    <View style={styles.empDetailContainer}>
      <View style={styles.empImageContainer}>
        <Image
          style={styles.noddleIconStyle}
          source={imagePath.locationGray}
          resizeMode="contain"
        />
      </View>
      <View style={styles.noddlePointDetailContainer}>
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
                    <Text style={[styles.timeTextStyle, { color: color }]}>
                      {item?.actualArivalTime === 0
                        ? "--"
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

        <ShowMoreComp
          showMorePress={() => {
            showMorePress();
          }}
          item={item}
          delayMinutes={delayMinutes}
          driverAppSettingData={driverAppSettingData}
        />
      </View>
    </View>
  );
}

import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import colors from "../../../styles/colors";
import { moderateScale } from "../../../styles/responsiveSize";
import imagePath from "../../../constants/imagePath";

export default function DetailBox({ item, selectItem = () => {}, moment }) {
  let getPunchInTime = "";
  let getPunchOutTime = "";

  if (item?.punchInTime) {
    var date = new Date();
    date.setHours(item?.punchInTime.substring(0, 2));
    date.setMinutes(item?.punchInTime.substring(3, 5));
    date.setSeconds(item?.punchInTime.substring(6, 8));
    getPunchInTime = moment(date).format("hh:mm A");
  }

  if (item?.punchOutTime) {
    var date = new Date();
    date.setHours(item?.punchOutTime.substring(0, 2));
    date.setMinutes(item?.punchOutTime.substring(3, 5));
    date.setSeconds(item?.punchOutTime.substring(6, 8));
    getPunchOutTime = moment(date).format("hh:mm A");
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 15,
      }}
    >
      <View
        style={{
          width: "18%",
          //justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 14, color: colors.black }}>
          {moment(item?.date).format("ddd")}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "600", color: colors.black }}>
          {moment(item?.date).format("MMM D")}
        </Text>
      </View>
      <TouchableOpacity onPress={selectItem} style={{ width: "80%" }}>
        <View
          style={{
            borderRadius: 8,
            //borderBottomWidth: 3,
            borderBottomColor:
              item?.status == "WEEKOFF"
                ? colors.pendingComplianceBlueBorderColor
                : item?.status == "ABSENT"
                ? colors.darkRed
                : item?.status == "PRESENT"
                ? colors.greenColor2
                : item?.status == "HALFDAY"
                ? colors.orangeColor
                : colors.pendingComplianceBlueColor,
          }}
        >
          <View
            style={{
              height: 50,
              backgroundColor:
                item?.status == "WEEKOFF"
                  ? colors.pendingComplianceBlueColor
                  : item?.status == "ABSENT"
                  ? colors.expiredLightRedColor
                  : item?.status == "PRESENT"
                  ? colors.metStatusColor
                  : item?.status == "HALFDAY"
                  ? colors.aboutToExpireLightColor
                  : colors.pendingComplianceBlueColor,
              paddingHorizontal: 10,
              justifyContent: "center",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              borderBottomColor: colors.lightGary,
              borderBottomWidth: 1,
              borderColor: colors.lightGary,
              borderWidth: 1,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: "80%",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: colors.black }}>Shift:</Text>
                <Text style={{ color: colors.black, marginLeft: 5 }}>
                  {item?.shiftInTime + " - " + item?.shiftOutTime}
                </Text>
              </View>
              <View style={{ width: "20%", alignItems: "flex-end" }}>
                <View style={styles.actionIconContainer}>
                  <Image
                    source={imagePath.rightAngel}
                    style={[
                      styles.actionIconStyle,
                      {
                        transform: [
                          { rotate: item?.isSeleted ? "270deg" : "0deg" },
                        ],
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>

          {item?.isSeleted ? (
            <View
              style={{
                //height: 35,
                justifyContent: "center",
                borderLeftColor: colors.lightGary,
                borderRightColor: colors.lightGary,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderBottomWidth: 1,
                borderBottomColor: colors.lightGary,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  //paddingTop: 10,
                  //paddingHorizontal: 10,
                  height: 40,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "20%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.black,
                      fontWeight: "700",
                      paddingHorizontal: 10,
                    }}
                  >
                    S.No.
                  </Text>
                </View>
                <View
                  style={{
                    height: "100%",
                    backgroundColor: colors.lightGary,
                    width: 1,
                  }}
                ></View>
                <View
                  style={{
                    width: "32%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.black,
                      fontWeight: "700",
                      paddingHorizontal: 10,
                    }}
                  >
                    Punch In
                  </Text>
                </View>
                <View
                  style={{
                    height: "100%",
                    backgroundColor: colors.lightGary,
                    width: 1,
                  }}
                ></View>
                <View style={{ width: "32%", paddingHorizontal: 10 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.black,
                      fontWeight: "700",
                    }}
                  >
                    Punch Out
                  </Text>
                </View>
              </View>

              {item?.punchList.map((punchItem, index) => {
                let getPunchInTime = "";
                let getPunchOutTime = "";

                if (punchItem?.punchInTime) {
                  var date = new Date();
                  date.setHours(punchItem?.punchInTime.substring(0, 2));
                  date.setMinutes(punchItem?.punchInTime.substring(3, 5));
                  date.setSeconds(punchItem?.punchInTime.substring(6, 8));
                  getPunchInTime = moment(date).format("hh:mm A");
                }

                if (punchItem?.punchOutTime) {
                  var date = new Date();
                  date.setHours(punchItem?.punchOutTime.substring(0, 2));
                  date.setMinutes(punchItem?.punchOutTime.substring(3, 5));
                  date.setSeconds(punchItem?.punchOutTime.substring(6, 8));
                  getPunchOutTime = moment(date).format("hh:mm A");
                }
                return (
                  <View key={index}>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: colors.lightGary,
                        width: "100%",
                      }}
                    ></View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",

                        height: 30,
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          width: "20%",
                          paddingHorizontal: 10,
                        }}
                      >
                        <Text style={{ fontSize: 12, color: colors.black }}>
                          {index + 1}
                        </Text>
                      </View>
                      <View
                        style={{
                          height: "100%",
                          backgroundColor: colors.lightGary,
                          width: 1,
                        }}
                      ></View>
                      <View
                        style={{
                          width: "32%",
                          paddingHorizontal: 10,
                        }}
                      >
                        <Text style={{ fontSize: 12, color: colors.black }}>
                          {getPunchInTime}
                        </Text>
                        {/* <Text style={{ fontSize: 12, color: colors.black }}>
                          {punchItem?.punchInLocation?.locName}
                        </Text> */}
                      </View>
                      <View
                        style={{
                          height: "100%",
                          backgroundColor: colors.lightGary,
                          width: 1,
                        }}
                      ></View>
                      <View style={{ width: "32%", paddingHorizontal: 10 }}>
                        <Text style={{ fontSize: 12, color: colors.black }}>
                          {getPunchOutTime ? getPunchOutTime : "--"}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 8,
    borderBottomWidth: 3,
  },
  actionIconContainer: {
    height: 25,
    width: 25,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.lightBorderColor,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  actionIconStyle: { height: 15, width: 15 },
});

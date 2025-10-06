import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  Platform,
  Dimensions,
  Pressable,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
//import {styles} from '../style';
import imagePath from "../../../../constants/imagePath";
import colors from "../../../../styles/colors";
import { moderateScale, width } from "../../../../styles/responsiveSize";
import { TouchableOpacity } from "react-native-gesture-handler";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

export default function DetailBox(props) {
  let getData = props?.item;
  var aboutToExpire = false;
  var expired;
  var documentDate = "";
  var pendingStatus;

  if (getData.complianceSubTopicList.length > 0) {
    let checkStatus = getData.complianceSubTopicList.find(
      (itemData) => itemData.status === "PENDING"
    );

    if (checkStatus) {
      pendingStatus = true;
    } else {
      pendingStatus = false;
    }
  } else {
    pendingStatus = false;
  }

  if (getData.status === "MET") {
    if (getData.complianceSubTopicList.length > 0) {
      let checkDate = getData.complianceSubTopicList.find(
        (itemData) => itemData.inputType === "date"
      );

      if (checkDate) {
        if (checkDate?.fileName) {
          var startDate = new Date();
          var endDate = new Date(checkDate?.fileName);
          var ndays;
          var tv1 = startDate.valueOf();
          var tv2 = endDate.valueOf();

          ndays = (tv2 - tv1) / 1000 / 86400;
          ndays = Math.round(ndays - 0.5);

          if (ndays < 16) {
            if (ndays == -1) {
              aboutToExpire = true;
            } else if (ndays < 0) {
              expired = true;
            } else {
              aboutToExpire = true;
            }
          } else {
            aboutToExpire = false;
          }
        }
      }
    }
  }

  if (getData.status === "MET") {
    if (getData.complianceSubTopicList.length > 0) {
      let checkDate = getData.complianceSubTopicList.find(
        (itemData) => itemData.inputType === "date"
      );
      if (checkDate) {
        if (checkDate?.fileName) {
          let dateFormat = moment(checkDate?.fileName).format("DD-MM-YYYY");

          documentDate = dateFormat;
        }
      } else {
        documentDate = "";
      }
    }
  } else if (getData.status === "NOTMET") {
    if (getData.complianceSubTopicList.length > 0) {
      let checkDate = getData.complianceSubTopicList.find(
        (itemData) => itemData.inputType === "date"
      );
      if (checkDate) {
        if (checkDate?.fileName) {
          let dateFormat = moment(checkDate?.fileName).format("DD-MM-YYYY");

          documentDate = dateFormat;
        }
      } else {
        documentDate = "";
      }
    }
  } else {
    if (getData.complianceSubTopicList.length > 0) {
      let checkDate = getData.complianceSubTopicList.find(
        (itemData) => itemData.inputType === "date"
      );
      if (checkDate) {
        if (checkDate?.fileName) {
          let dateFormat = moment(checkDate?.fileName).format("DD-MM-YYYY");

          documentDate = dateFormat;
        }
      } else {
        documentDate = "";
      }
    }
  }

  return (
    <View
      style={[
        styles.cardContainer,
        {
          borderBottomColor: pendingStatus
            ? colors.pendingComplianceBlueBorderColor
            : aboutToExpire
            ? colors.orangeColor
            : expired
            ? colors.darkRed
            : getData.status === "MET"
            ? "green"
            : colors.darkRed,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={props.onPress}
        style={[
          styles.detailRowStyle,
          {
            backgroundColor: pendingStatus
              ? colors.pendingComplianceBlueColor
              : aboutToExpire
              ? colors.aboutToExpireLightColor
              : expired
              ? colors.expiredLightRedColor
              : getData.status === "MET"
              ? colors.metStatusColor
              : colors.expiredLightRedColor,
          },
        ]}
      >
        <View style={styles.topicNameCotainer}>
          <View style={styles.iconBox}>
            <Image source={imagePath.driving_icon} style={styles.iconStyle} />
          </View>
          <Text numberOfLines={1} style={styles.topicNameText}>
            {getData?.topicName}
          </Text>
        </View>
        <View style={styles.topicDateCotainer}>
          <Image
            opacity={0.1}
            resizeMode="contain"
            source={
              pendingStatus
                ? imagePath.pendingBg
                : aboutToExpire
                ? imagePath.aboutToExpire
                : expired
                ? imagePath.expireBGAndroid
                : getData.status === "MET"
                ? imagePath.ValidBGAndroid
                : imagePath.expireBGAndroid
            }
            style={{
              height: 30,
              width: "100%",
            }}
          />
        </View>
        <View style={styles.topicIconCotainer}>
          <View style={styles.iconRow}>
            <View style={{ width: "78%" }}>
              {documentDate === "" ? null : (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{ height: 20, width: 20 }}
                    source={
                      pendingStatus
                        ? imagePath.expireIcon_Blue
                        : aboutToExpire
                        ? imagePath.expireIcon_orange
                        : expired
                        ? imagePath.expireIconred
                        : getData.status === "MET"
                        ? imagePath.expireIcon_green
                        : imagePath.expireIconred
                    }
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: pendingStatus
                        ? colors.pendingComplianceBlueBorderColor
                        : aboutToExpire
                        ? colors.orangeColor
                        : expired
                        ? colors.darkRed
                        : getData.status === "MET"
                        ? "green"
                        : colors.darkRed,
                    }}
                  >
                    {documentDate}
                  </Text>
                </View>
              )}
            </View>
            <View style={{ width: "20%" }}>
              <View style={styles.actionIconContainer}>
                <Image
                  source={imagePath.rightAngel}
                  style={[
                    styles.actionIconStyle,
                    {
                      transform: [
                        { rotate: getData?.isSelected ? "270deg" : "0deg" },
                      ],
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {getData?.isSelected ? (
        <>
          <View
            style={{
              height: 1,
              backgroundColor: colors.lightGary,
              width: "100%",
              //marginTop: 5,
            }}
          ></View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: 10,
              paddingHorizontal: 10,
              height: 40,
            }}
          >
            <View
              style={{
                width: "60%",
              }}
            >
              <Text style={styles.tableListText}>Title</Text>
            </View>

            <View style={{ width: "40%" }}>
              <Text style={styles.tableListText}>Action</Text>
            </View>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: colors.lightGary,
              width: "100%",
            }}
          ></View>

          {getData?.complianceSubTopicList
            ? getData?.complianceSubTopicList.map((subCatList, index) => {
                let subTopicDate = "";

                if (subCatList?.inputType === "date") {
                  if (subCatList?.fileName) {
                    subTopicDate = moment(subCatList?.fileName).format(
                      "DD-MM-YYYY"
                    );
                  }
                }
                return (
                  <View
                    key={index + 1}
                    style={{
                      flexDirection: "row",
                      paddingHorizontal: 10,
                      alignItems: "center",
                      height: 40,
                      backgroundColor:
                        index % 2 == 0
                          ? "transparent"
                          : colors.lightBorderColor,
                    }}
                  >
                    <View
                      numberOfLines={1}
                      style={{
                        width: "60%",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.tableListText}>
                        {subCatList?.subTopicName
                          ? subCatList?.subTopicName
                          : "--"}
                      </Text>

                      {subCatList.status === "PENDING" ? (
                        <Image
                          style={[styles.warningIcon]}
                          source={imagePath.waiting}
                        />
                      ) : subCatList.status === "REJECTED" ? (
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Image
                            style={styles.warningIcon}
                            source={imagePath.warningIcon}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              color: colors.darkRed,
                            }}
                          >
                            Rejected
                          </Text>
                        </View>
                      ) : subCatList?.fileName ? (
                        <Image
                          style={styles.docVerifyIcon}
                          source={imagePath.check_mark_circle}
                        />
                      ) : (
                        <Image
                          style={styles.warningIcon}
                          source={imagePath.warningIcon}
                        />
                      )}
                    </View>
                    <View
                      style={{
                        width: "40%",
                      }}
                    >
                      <View style={{ justifyContent: "center" }}>
                        {subCatList.inputType === "date" ? (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            {props?.canEdit ? (
                              <View
                                style={{
                                  width: "30%",
                                }}
                              >
                                <TouchableOpacity
                                  style={{ width: "100%" }}
                                  onPress={() => {
                                    props.onSubcategoryClick(
                                      subCatList.inputType,
                                      subCatList?.id
                                    );
                                  }}
                                >
                                  <Image
                                    resizeMode="contain"
                                    style={{ height: 20, width: 20 }}
                                    source={imagePath.editcalendar}
                                  />
                                </TouchableOpacity>
                              </View>
                            ) : null}

                            <View
                              style={{
                                width: "68%",
                              }}
                            >
                              {subCatList.inputType === "date" ? (
                                <Text
                                  numberOfLines={1}
                                  style={[styles.tableListText]}
                                >
                                  {subCatList?.fileName ? subTopicDate : "--"}
                                </Text>
                              ) : (
                                <Text
                                  numberOfLines={1}
                                  style={[styles.tableListText]}
                                >
                                  {subCatList?.fileName
                                    ? subCatList?.fileName
                                    : "--"}
                                </Text>
                              )}
                            </View>
                          </View>
                        ) : subCatList.inputType === "text" ? (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            {props?.canEdit ? (
                              <View
                                style={{
                                  width: "30%",
                                }}
                              >
                                <TouchableOpacity
                                  style={{ width: "100%" }}
                                  onPress={() => {
                                    props.onSubcategoryClick(
                                      subCatList.inputType,
                                      subCatList?.id
                                    );
                                  }}
                                >
                                  <Image
                                    resizeMode="contain"
                                    style={{ height: 20, width: 20 }}
                                    source={imagePath.editIcon}
                                  />
                                </TouchableOpacity>
                              </View>
                            ) : null}

                            <View style={{ width: "68%" }}>
                              <Text
                                numberOfLines={1}
                                style={[styles.tableListText]}
                              >
                                {subCatList?.fileName
                                  ? subCatList?.fileName
                                  : "--"}
                              </Text>
                            </View>
                          </View>
                        ) : (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            {props?.canEdit ? (
                              <View
                                style={{
                                  width: "30%",
                                }}
                              >
                                <TouchableOpacity
                                  style={{ width: "100%" }}
                                  onPress={() => {
                                    props.onSubcategoryClick(
                                      subCatList.inputType,
                                      subCatList?.id
                                    );
                                  }}
                                >
                                  <Image
                                    resizeMode="contain"
                                    style={{ height: 20, width: 20 }}
                                    source={imagePath.uploadIcon}
                                  />
                                </TouchableOpacity>
                              </View>
                            ) : null}

                            <View style={{ width: "68%" }}>
                              {subCatList?.fileName ? (
                                <TouchableOpacity
                                  onPress={() => {
                                    props.openDocument(subCatList?.fileName);
                                  }}
                                  styles={{}}
                                >
                                  <Text
                                    numberOfLines={1}
                                    style={[
                                      styles.tableListText,
                                      {
                                        color: colors.lightBlueColor,
                                        textDecorationLine: "underline",
                                      },
                                    ]}
                                  >
                                    {subCatList?.fileName
                                      ? subCatList?.fileName
                                      : "--"}
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                <Text
                                  numberOfLines={1}
                                  style={[styles.tableListText]}
                                >
                                  {subCatList?.fileName
                                    ? subCatList?.fileName
                                    : "--"}
                                </Text>
                              )}
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })
            : null}
        </>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  cardContainer: {
    borderColor: colors.lightBorderColor,
    borderWidth: 2,
    borderRadius: 14,
    marginTop: 15,
    marginHorizontal: 10,
    //paddingVertical: 5,
    borderBottomWidth: 3,
  },
  detailRowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingVertical: 8,
  },
  topicNameCotainer: {
    width: "44%",
    flexDirection: "row",
    //justifyContent: 'center',
    alignItems: "center",
  },
  topicDateCotainer: {
    width: "10%",
  },
  topicIconCotainer: {
    width: "44%",
    //backgroundColor: 'red',
  },
  topicNameText: {
    color: colors.black,
    fontSize: 14,
    marginLeft: 5,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBox: {
    height: 45,
    width: 45,
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
  iconStyle: { height: 25, width: 25 },
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
  dateText: {
    fontSize: 12,
  },
  docVerifyIcon: {
    height: 15,
    width: 15,
    marginLeft: 5,
  },
  warningIcon: {
    height: 20,
    width: 20,
    marginLeft: 5,
  },
  tableListText: {
    color: colors.black,
  },
});

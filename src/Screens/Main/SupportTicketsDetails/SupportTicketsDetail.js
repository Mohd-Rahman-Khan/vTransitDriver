import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import WrapperContainer from "../../../Components/WrapperContainer";
import HeaderComp from "../../../Components/HeaderComp";
import colors from "../../../styles/colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
  height,
} from "../../../styles/responsiveSize";
import strings from "../../../constants/lang";
import fontFamily from "../../../styles/fontFamily";
import imagePath from "../../../constants/imagePath";
import { TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment/moment";
import { useNavigation } from "@react-navigation/native";
import navigationStrings from "../../../navigation/navigationStrings";
import { showSuccess } from "../../../utils/helperFunction";
import { useSelector } from "react-redux";
import { DOC_URL } from "../../../config/urls";

const SupportTicketsDetail = ({ route }) => {
  const navigation = useNavigation();
  const yourTicketsDeltails = route?.params?.yourTicketsDeltails;
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );
  const getModulePermissionData = useSelector(
    (state) => state?.modulePermission?.modulePermissionData
  );
  const [isCreatePermAllow, setisCreatePermAllow] = useState(false);
  useEffect(() => {
    getPermission();
  }, []);
  const getPermission = () => {
    let checkSupport = getModulePermissionData?.permissions?.find(
      (item) => item?.moduleName == "Support"
    );

    if (checkSupport) {
      if (checkSupport?.actions) {
        let findCreatePerms = checkSupport?.actions?.find(
          (itemData) => itemData == "Create"
        );
        if (findCreatePerms) {
          setisCreatePermAllow(true);
        } else {
          setisCreatePermAllow(false);
        }
      } else {
        setisCreatePermAllow(false);
      }
    } else {
      setisCreatePermAllow(false);
    }
  };

  const renderChatIssue = ({ item, index }) => {
    return (
      <View>
        {profileData?.id !== item?.userId ? (
          <View style={styles.initialIssueReply}>
            <View style={styles.initialIssueReplyRight}>
              <Text style={styles.initialIssueHeading}>
                {item?.userName}({item?.userRole})
              </Text>

              <View style={styles.initialIssueReplyMsgContainer}>
                <Text style={styles.initialIssueReplyMsg}>{item?.msg}</Text>
                {item?.fileImg ? (
                  <TouchableOpacity
                    // onPress={() =>
                    //   navigation.navigate(navigationStrings.WEB_VIEW_SCREEN, {
                    //     data: {
                    //       uri: DOC_URL + item?.fileImg,
                    //       title: yourTicketsDeltails?.subject,
                    //       img: true
                    //     },
                    //   })
                    // }
                    style={styles.docContainer}
                  >
                    <Image
                      source={{ uri: DOC_URL + item?.fileImg }}
                      style={styles.fileImgStyle}
                      resizeMode={"contain"}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
              <Text style={styles.timeTextStyle}>
                {moment(item.createdOn).format("DD MMM, HH:mm")}
              </Text>
            </View>
            <Image
              style={styles.userImg}
              source={{ uri: DOC_URL + item?.profileImg }}
            />
          </View>
        ) : (
          <View style={styles.initialIssueReply_emp}>
            {/* <Image style={styles.userImg} source={item?.profileImg} /> */}
            <View style={styles.initialIssueReplyLeft}>
              <Text style={styles.initialIssueHeading}>{strings.YOU}</Text>

              <View style={styles.initialIssueReplyMsgContainer}>
                <Text style={styles.initialIssueReplyMsg}>{item?.msg}</Text>
                {item?.fileImg ? (
                  <TouchableOpacity
                    style={styles.docContainer}
                    // onPress={() =>
                    //   navigation.navigate(navigationStrings.WEB_VIEW_SCREEN, {
                    //     data: {
                    //       uri: DOC_URL + item?.fileImg,
                    //       title: yourTicketsDeltails?.subject,
                    //       img:true
                    //     },
                    //   })
                    // }
                  >
                    <Image
                      source={{ uri: DOC_URL + item?.fileImg }}
                      style={styles.fileImgStyle}
                      resizeMode={"contain"}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
              <Text style={styles.timeTextStyle}>
                {moment(item.createdOn).format("DD MMM, HH:mm")}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };
  return (
    <WrapperContainer>
      <View style={styles.mainContainer}>
        <HeaderComp
          title={strings.SUPPORT_TICKET_DETAILS}
          icon={true}
          description={
            yourTicketsDeltails?.ticketNo ? yourTicketsDeltails?.ticketNo : null
            // 'hjhjh'
          }
          idIcon={yourTicketsDeltails?.ticketNo ? imagePath.openTickets : null}
          iconStyle={styles.headerIconStyle}
        />
        <ScrollView
          style={styles.bodyContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bodyTopContainer}>
            <Text style={styles.issueHeading}>
              {yourTicketsDeltails?.subject}{" "}
              {`(${yourTicketsDeltails?.tripCode})`}
            </Text>
            {/* {yourTicketsDeltails?.tripCode ? (
              <View style={styles.idContainer}>
                <Image source={imagePath.id_icon} style={styles.iconStyle} />
                <Text>({yourTicketsDeltails?.tripCode})</Text>
              </View>
            ) : null} */}
          </View>
          <FlatList
            data={yourTicketsDeltails?.requestMsg}
            showsVerticalScrollIndicator={false}
            renderItem={(element, index) => renderChatIssue(element, index)}
            keyExtractor={(item) => item?.id}
            onEndReachedThreshold={0.1}
            onScrollToTop={false}
          />
          <View style={styles.ticketStatusMainContainer}>
            <View style={styles.ticketStatusTopContainer}>
              <Image
                style={{
                  width: moderateScale(width / 22),
                  height: moderateScale(width / 22),
                }}
                source={
                  yourTicketsDeltails?.status?.toUpperCase()?.trim() ===
                    "OPEN" ||
                  yourTicketsDeltails?.status?.toUpperCase()?.trim() ===
                    "REOPEN"
                    ? imagePath?.openTickets
                    : imagePath.check_mark_green
                }
              />
              <Text
                style={
                  yourTicketsDeltails?.status?.toUpperCase()?.trim() ===
                    "OPEN" ||
                  yourTicketsDeltails?.status?.toUpperCase()?.trim() ===
                    "REOPEN"
                    ? { ...styles.ticketStatusText, color: colors?.blue }
                    : styles.ticketStatusText
                }
              >
                {yourTicketsDeltails?.status?.toUpperCase()?.trim() === "OPEN"
                  ? strings?.OPEN
                  : yourTicketsDeltails?.status?.toUpperCase()?.trim() ===
                    "REOPEN"
                  ? strings?.REOPEN
                  : strings.RESOLVED}
              </Text>
            </View>
            <View style={styles.ticketStatusDetailsContainer}>
              {yourTicketsDeltails?.createdOn ? (
                <View style={{ flex: 0.35 }}>
                  <Text style={styles.ticketStatusDetailsHeading}>
                    {strings.INITATED_ON}
                  </Text>
                  <Text style={styles.ticketStatusDetailsText}>
                    {moment(yourTicketsDeltails?.createdOn).format(
                      "MMM DD, HH:mm"
                    )}
                  </Text>
                </View>
              ) : null}
              {yourTicketsDeltails?.updatedOn != 0 ? (
                <View style={{ flex: 0.35 }}>
                  <Text style={styles.ticketStatusDetailsHeading}>
                    {strings.UPDATED_ON}
                  </Text>
                  <Text style={styles.ticketStatusDetailsText}>
                    {moment(yourTicketsDeltails?.createdOn).format(
                      "MMM DD, HH:mm"
                    )}
                  </Text>
                </View>
              ) : null}
              {yourTicketsDeltails?.assignedName ? (
                <View style={{ flex: 0.3 }}>
                  <Text style={styles.ticketStatusDetailsHeading}>
                    {strings.ASSIGN_TO}
                  </Text>
                  <Text
                    style={{
                      ...styles.ticketStatusDetailsText,
                      textTransform: "capitalize",
                    }}
                  >
                    {yourTicketsDeltails?.assignedName}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          {yourTicketsDeltails?.status?.toUpperCase()?.trim() === "CLOSED" ? (
            <View>
              <Text style={styles.quesHeadingText}>
                {strings.WAS_YOUR_ISSUE_RESOLVED}
              </Text>
              <View style={styles.ansMainContainer}>
                <TouchableOpacity
                  style={styles.ansContainerYes}
                  activeOpacity={0.7}
                  onPress={() => {
                    showSuccess(strings.THANKS_FEEDBACK);
                    navigation.goBack();
                  }}
                >
                  <Image source={imagePath.like} style={styles.likeImg} />
                  <Text style={styles.ansTextStyle}>
                    {strings.YES_MY_ISSUE_GOT_RESOLVED}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.ansContainerNo}
                  onPress={() => {
                    if (isCreatePermAllow) {
                      navigation.navigate(navigationStrings.WRITE_TO_US, {
                        issueHeading: yourTicketsDeltails,
                        helpTopic: yourTicketsDeltails,
                        tripDetails: yourTicketsDeltails,
                        helpTopicDetails: yourTicketsDeltails,
                        reopenTicket: true,
                      });
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Image source={imagePath.like} style={styles.disLikeImg} />
                  <Text style={styles.ansTextStyle}>
                    {strings.NO_MY_ISSUE_GOT_NOT_RESOLVED}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  bodyContainer: {
    backgroundColor: colors.white,
    marginHorizontal: moderateScale(10),
    flex: 1,
    marginTop: moderateScaleVertical(-45),
    borderRadius: moderateScale(5),
    paddingHorizontal: moderateScale(20),
  },
  bodyTopContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: moderateScaleVertical(10),
    marginBottom: moderateScaleVertical(5),
    // justifyContent: 'space-between',
  },
  issueHeading: {
    fontFamily: fontFamily.robotoRegular,
    fontSize: textScale(14),
    color: colors.black,
    // marginVertical: moderateScaleVertical(20),
  },
  initialIssueReply_emp: {
    flexDirection: "row",
    marginTop: moderateScaleVertical(15),
    // backgroundColor:'red'
  },
  initialIssueReply: {
    flexDirection: "row",
    // backgroundColor:'red'
    marginTop: moderateScaleVertical(15),
    justifyContent: "flex-end",
    // flexWrap:'wrap-reverse'
  },
  userImg: {
    width: moderateScale(width / 12),
    height: moderateScale(width / 12),
    marginLeft: moderateScale(10),
    borderRadius: moderateScale(50),
  },
  initialIssueReplyLeft: {
    borderWidth: moderateScale(0.5),
    borderColor: colors.lightGray,
    borderTopRightRadius: moderateScale(16),
    borderBottomEndRadius: moderateScale(16),
    borderBottomLeftRadius: moderateScale(16),
    // marginLeft: moderateScale(10),
    paddingHorizontal: moderateScale(10),
    // flex: 1,
    maxWidth: moderateScale(width / 1.8),
    paddingVertical: moderateScaleVertical(10),
  },
  headerIconStyle: {
    tintColor: colors.white,
  },
  initialIssueReplyRight: {
    borderWidth: moderateScale(0.5),
    borderColor: colors.lightGray,
    borderTopLeftRadius: moderateScale(16),
    borderBottomEndRadius: moderateScale(16),
    borderBottomLeftRadius: moderateScale(16),
    maxWidth: moderateScale(width / 1.5),
    paddingVertical: moderateScaleVertical(10),
    paddingHorizontal: moderateScale(10),
  },
  initialIssueReplyMsgContainer: {
    // borderBottomWidth:moderateScale(0.5),
    // borderBottomEndRadius: moderateScale(16),
    // borderBottomLeftRadius: moderateScale(16),
    // backgroundColor: colors.veryLightGray,
    // marginTop: moderateScaleVertical(10),
    // backgroundColor:'red'
  },
  iconStyle: {
    width: moderateScale(width / 22),
    height: moderateScale(width / 22),
    marginRight: moderateScale(5),
  },
  idContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginTop: moderateScaleVertical(10),
    marginLeft: moderateScale(5),
  },
  initialIssueReplyMsg: {
    fontSize: textScale(10),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    // backgroundColor:'green'
    // padding: moderateScale(10),
    // paddingHorizontal: moderateScale(10),
    // paddingVertical: moderateScaleVertical(5),
  },
  docContainer: {
    // marginHorizontal:moderateScale(10),
    marginVertical: moderateScale(10),
  },
  fileImgStyle: {
    height: moderateScale(width / 15),
    width: moderateScale(width / 15),
  },
  timeTextStyle: {
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    fontSize: textScale(12),
    // marginRight:moderateScale(10),
    textAlign: "right",
    // backgroundColor:'red'
  },
  initialIssueHeading: {
    fontFamily: fontFamily.robotoMedium,
    color: colors.black,
    fontSize: textScale(12),
    textTransform: "capitalize",
  },
  ticketStatusMainContainer: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScaleVertical(15),
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(0.5),
    borderColor: colors.lightGray,

    marginVertical: moderateScaleVertical(30),
  },
  ticketStatusTopContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ticketStatusText: {
    fontSize: textScale(16),
    color: colors.green,
    marginLeft: moderateScale(10),
    fontFamily: fontFamily.robotoRegular,
  },
  ticketStatusDetailsContainer: {
    flexDirection: "row",
    flex: 1,
    marginTop: moderateScaleVertical(10),
  },
  ticketStatusDetailsHeading: {
    fontSize: textScale(10),
    color: colors.gray,
    fontFamily: fontFamily.robotoRegular,
    marginBottom: moderateScaleVertical(5),
  },
  ticketStatusDetailsText: {
    fontSize: textScale(12),
    color: colors.black,
    fontFamily: fontFamily.robotoRegular,
  },
  quesHeadingText: {
    fontSize: textScale(16),
    color: colors.black,
    fontFamily: fontFamily.robotoRegular,
    textAlign: "center",
    marginBottom: moderateScaleVertical(20),
  },
  ansMainContainer: {
    borderWidth: moderateScale(0.5),
    padding: moderateScale(10),
    borderRadius: moderateScale(8),
    borderColor: colors.lightGray,
  },
  ansContainerYes: {
    flexDirection: "row",
    paddingBottom: moderateScaleVertical(10),
    borderBottomColor: colors.lightGray,
    alignItems: "center",
    borderBottomWidth: moderateScale(0.5),
  },
  ansContainerNo: {
    flexDirection: "row",
    marginTop: moderateScaleVertical(10),
    alignItems: "center",
  },
  ansTextStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    marginLeft: moderateScale(10),
  },
  likeImg: {
    width: moderateScale(width / 18),
    height: moderateScale(width / 18),
  },
  disLikeImg: {
    transform: [{ rotateX: "180deg" }],
    width: moderateScale(width / 18),
    height: moderateScale(width / 18),
  },
});

export default SupportTicketsDetail;

import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";
import fontFamily from "../../../styles/fontFamily";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../../../styles/responsiveSize";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  bodyContainer: {
    backgroundColor: colors.white,
    marginHorizontal: moderateScale(10),
    flex: 1,
    marginTop: moderateScaleVertical(-60),
    borderRadius: moderateScale(5),
  },
  bodyHeaderStyle: {
    paddingHorizontal: moderateScale(24),
    backgroundColor: colors.lightSkyBlue,
    paddingVertical: moderateScaleVertical(20),
    borderTopEndRadius: moderateScale(5),
    borderTopLeftRadius: moderateScale(5),
  },
  bodyHeaderTopStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bodyHeaderTopLeftStyle: {
    flex: 0.75,
  },
  bodyHeaderTopRightStyle: {
    flex: 0.25,
  },
  supportImg: {
    width: moderateScale(width / 5),
    height: moderateScale(width / 7),
  },
  needHelpHeading: {
    fontSize: textScale(16),
    fontFamily: fontFamily.robotoMedium,
    color: colors.darkSkyBlue,
  },
  needHelpText: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.gray,
    marginVertical: moderateScaleVertical(15),
    // width: moderateScale(width / 1.6),
  },

  rideDetailsTopContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    paddingVertical: moderateScaleVertical(10),
    paddingHorizontal: moderateScale(10),
    marginVertical: moderateScaleVertical(10),
  },
  routeTextStyle: {
    marginLeft: moderateScale(10),
    fontSize: textScale(10),
    color: colors.gray,
    // flex:1,
    width: moderateScale(width / 1.8),
    fontFamily: fontFamily.robotoRegular,
  },
  driverImg: {
    width: moderateScale(width / 8),
    height: moderateScale(width / 8),
    borderRadius: moderateScale(50),
  },
  tripStartFromContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rideDetailsTopLeftContainer: {
    marginHorizontal: moderateScale(10),
  },

  circleIcon: {
    width: moderateScale(width / 50),
    height: moderateScale(width / 50),
  },
  grayCircle: {
    width: moderateScale(width / 110),
    height: moderateScale(width / 110),
    marginVertical: moderateScaleVertical(1.5),
    marginLeft: moderateScale(2.5),
  },
  viewAllRidesBtn: {
    borderWidth: moderateScale(0.5),
    alignSelf: "center",
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScaleVertical(5),
    borderRadius: moderateScale(16),
    borderColor: colors.mediumGray,
    position: "absolute",
    bottom: moderateScale(-12),
    backgroundColor: colors.white,
  },
  viewAllRidesText: {
    fontFamily: fontFamily.robotoRegular,
    color: colors.gray,
    fontSize: textScale(11),
  },
  bodyCenterStyle: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScaleVertical(24),
    borderBottomWidth: moderateScale(0.5),
    borderBottomColor: colors.lightGray,
  },
  complaintsLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  yourComplaintsHeading: {
    fontSize: textScale(14),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
  },
  rightArrowIcon: {
    width: moderateScale(width / 20),
    height: moderateScale(width / 20),
  },
  complaintsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: moderateScaleVertical(20),
    alignItems: "center",
  },
  complaintsIcon: {
    width: moderateScale(width / 22),
    height: moderateScale(width / 22),
  },
  complaintsText: {
    marginLeft: moderateScale(10),
    fontSize: textScale(12),
    color: colors.black,
    fontFamily: fontFamily.robotoRegular,
  },
  viewAllComplaintsBtn: {
    borderWidth: moderateScale(0.5),
    alignSelf: "center",
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScaleVertical(3),
    borderRadius: moderateScale(16),
    borderColor: colors.mediumGray,
    position: "absolute",
    bottom: moderateScale(-12),
    backgroundColor: colors.white,
  },
  viewAllComplaintsText: {
    fontFamily: fontFamily.robotoRegular,
    color: colors.gray,
    fontSize: textScale(10),
  },
  bodyBottomStyle: {
    marginHorizontal: moderateScale(20),
    marginVertical: moderateScaleVertical(30),
  },
  otherHelpText: {
    fontSize: textScale(16),
    fontFamily: fontFamily.robotoMedium,
    color: colors.darkSkyBlue,
  },

  issuesMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: moderateScale(0.5),
    paddingBottom: moderateScaleVertical(15),
    borderBottomColor: colors.lightGray,
    marginTop: moderateScaleVertical(20),
    alignItems: "center",
  },
  issuesMenuLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 0.9,
  },
  issuesMenuTitle: {
    fontSize: textScale(14),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
  },
  issuesMenuDiscription: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.gray,
  },
  rightArrowIcon: {
    width: moderateScale(width / 25),
    height: moderateScale(width / 25),
  },
  skyCircleIcon: {
    width: moderateScale(width / 15),
    height: moderateScale(width / 15),
  },
  topicIcon: {
    width: moderateScale(width / 14),
    height: moderateScale(width / 14),
    borderRadius: moderateScale(50),
  },
  issuesMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: moderateScale(0.5),
    paddingBottom: moderateScaleVertical(15),
    borderBottomColor: colors.lightGray,
    marginTop: moderateScaleVertical(20),
    paddingHorizontal: moderateScale(20),
    alignItems: "center",
  },
  issuesMenuTitle: {
    fontSize: textScale(16),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
  },
  rightArrowIcon: {
    width: moderateScale(width / 22),
    height: moderateScale(width / 22),
  },
  quesContainerStyle: {
    paddingHorizontal: moderateScale(20),
    borderBottomWidth: moderateScale(0.5),
    paddingBottom: moderateScaleVertical(20),
    paddingTop: moderateScaleVertical(10),
    borderBottomColor: colors.lightGray,
  },
  quesTextStyle: {
    fontSize: textScale(14),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    marginBottom: moderateScale(10),
  },
  ansTextStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.gray,
    lineHeight: moderateScale(20),
  },
  btnContainer: {
    flexDirection: "row",
  },
  feedBackBtn: {
    fontSize: textScale(14),
    fontFamily: fontFamily.robotoRegular,
    color: colors.darkSkyBlue,
    marginRight: moderateScale(10),
  },
});

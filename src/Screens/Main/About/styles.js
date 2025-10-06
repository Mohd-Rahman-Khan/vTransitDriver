import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";
import {
  moderateScale,
  height,
  width,
  moderateScaleVertical,
  textScale,
} from "../../../styles/responsiveSize";
import fontFamily from "../../../styles/fontFamily";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  bodyContainer: {
    // paddingHorizontal: moderateScale(20),
    backgroundColor: colors.white,
    marginHorizontal: moderateScale(10),
    paddingVertical: moderateScaleVertical(10),
    flex: 1,
    marginTop: moderateScaleVertical(-65),
    borderRadius: moderateScale(4),
  },
  bodyHeaderContainer: {
    paddingHorizontal: moderateScale(20),
    marginTop: moderateScaleVertical(15),
    borderBottomWidth: moderateScale(0.5),
    borderBottomColor: colors.mediumGray,
  },
  titleTextStyle: {
    fontSize: textScale(15),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
  },
  versionTextStyle: {
    fontSize: textScale(13),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    lineHeight: moderateScaleVertical(35),
  },
  bodyContentContainer: {
    marginTop: moderateScaleVertical(20),
    paddingHorizontal: moderateScale(20),
  },
  bodyContentHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bodyContentHeaderRightContainer: {
    marginLeft: moderateScale(15),
  },
  bodyContentHeaderRightTitleText: {
    fontSize: textScale(15),
    fontFamily: fontFamily.robotoMedium,
    color: colors.black,
  },
  bodyContentHeaderRightDetailsText: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.gray,
    lineHeight: moderateScaleVertical(25),
  },
  termAndPrivacyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: moderateScale(20),
    marginTop: moderateScaleVertical(25),
    justifyContent: "space-between",
    // paddingBottom: moderateScaleVertical(10),
    // borderBottomWidth: moderateScale(0.5),
    // // borderStyle: 'dashed',
    // borderColor: colors.mediumGray,
  },
  divider: {
    borderWidth: moderateScale(0.5),
    borderStyle: "dashed",
    borderColor: colors.mediumGray,
    marginLeft: moderateScale(20),
    marginVertical: moderateScaleVertical(20),
  },
  termAndPrivacyContainer_2: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: moderateScale(20),
    justifyContent: "space-between",
  },
  termAndPrivacyIcon: {
    width: moderateScale(width / 20),
    height: moderateScale(width / 20),
    marginRight: moderateScale(10),
  },

  termAndPrivacyTextStyle: {
    fontSize: textScale(13),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    textTransform: "capitalize",
  },
  forwardIconStyle: {
    width: moderateScale(width / 25),
    height: moderateScale(width / 25),
  },
  termsOfServicesRow: { flexDirection: "row" },
  privacyPolicyRow: { flexDirection: "row" },
});

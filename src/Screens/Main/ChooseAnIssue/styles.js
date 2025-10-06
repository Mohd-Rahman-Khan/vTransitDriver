import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";
import fontFamily from "../../../styles/fontFamily";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
  height,
} from "../../../styles/responsiveSize";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.lightGary,
  },
  bodyContainer: {
    paddingHorizontal: moderateScale(20),
    backgroundColor: colors.white,
    marginHorizontal: moderateScale(10),
    paddingVertical: moderateScaleVertical(10),
    flex: 0.99,
    marginTop: moderateScaleVertical(-90),
    borderRadius: moderateScale(4),
  },

  issuesMenuContainer: {
    // flex:1,
    // paddingHorizontal: moderateScale(24),
  },
  issuesMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: moderateScale(0.5),
    paddingBottom: moderateScaleVertical(15),
    borderBottomColor: colors.lightGary,
    marginTop: moderateScaleVertical(20),
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
  otherHelpBtn: {
    // marginHorizontal: moderateScale(20),
    marginVertical: moderateScaleVertical(20),
  },
  otherHelpText: {
    fontSize: textScale(16),
    fontFamily: fontFamily.robotoMedium,
    color: colors.darkSkyBlue,
  },
});

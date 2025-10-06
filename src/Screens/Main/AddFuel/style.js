import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";
import {
  moderateScale,
  moderateScaleVertical,
  height,
  width,
  textScale,
} from "../../../styles/responsiveSize";
import fontFamily from "../../../styles/fontFamily";

export const styles = StyleSheet.create({
  bottomContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.lightGary,
    alignItems: "center",
  },
  contentSectionContainer: {
    flex: 1,
    width: width - 15,
    backgroundColor: colors.white,
    marginTop: -100,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  rowContainer: {
    marginTop: 20,
  },
  docContainer: {
    borderBottomColor: colors.lightGary,
    borderBottomWidth: moderateScale(0.5),
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    paddingVertical: moderateScaleVertical(10),
  },
  submitBtnStyle: {
    paddingVertical: moderateScaleVertical(8),
    paddingHorizontal: moderateScale(50),
    borderRadius: moderateScale(10),
    alignItems: "center",
    width: moderateScale(width / 1.5),
    backgroundColor: colors.themeColor,
  },
  submitBtnTextStyle: {
    color: colors.white,
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoMedium,
  },
  submitButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  disableBtn: {
    paddingVertical: moderateScaleVertical(8),
    paddingHorizontal: moderateScale(30),
    borderRadius: moderateScale(20),
    alignItems: "center",
    width: moderateScale(width / 1.5),
    backgroundColor: colors.lightBackground,
  },
});

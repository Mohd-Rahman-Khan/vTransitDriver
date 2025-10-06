import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";
import fontFamily from "../../../styles/fontFamily";
import {
  moderateScale,
  moderateScaleVertical,
  height,
  textScale,
  width,
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
    flex: 1,
    marginTop: moderateScaleVertical(-85),
    borderRadius: moderateScale(4),
  },
  settingMenuHeaderContainer: {
    marginTop: moderateScaleVertical(10),
  },
  settingMenuHeaderText: {
    backgroundColor: colors.lightGary,
    paddingVertical: moderateScaleVertical(5),
    paddingLeft: moderateScale(15),
    fontSize: textScale(14),
    fontFamily: fontFamily.robotoRegular,
    color: colors.gray,
    borderRadius: moderateScale(3),
  },
  settingMenuItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: moderateScale(10),
    paddingVertical: moderateScale(15),
    alignItems: "center",
    borderBottomWidth: moderateScale(0.3),
    borderBottomColor: colors.mediumGray,
  },
  settingMenuItemLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingMenuItemLeftIcon: {
    width: moderateScale(width / 22),
    height: moderateScale(width / 22),
  },
  settingMenuItemLeftText: {
    fontSize: textScale(14),
    color: colors.black,
    fontFamily: fontFamily.robotoRegular,
    marginLeft: moderateScale(15),
  },
  settingMenuItemRightBtn: {
    borderWidth: moderateScale(0.5),
    borderColor: colors.gray,
    borderRadius: moderateScale(5),
    paddingVertical: moderateScale(2),
    width: moderateScale(width / 6),
  },
  settingMenuItemRightBtnText: {
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    fontSize: textScale(12),
    textAlign: "center",
  },
  settingMenuItemDeleteAccountBtn: {
    borderRadius: moderateScale(5),
    backgroundColor: colors.darkRed,
    paddingVertical: moderateScale(2),
    width: moderateScale(width / 6),
  },
  settingMenuItemDeleteAccountBtnText: {
    fontFamily: fontFamily.robotoRegular,
    color: colors.white,
    fontSize: textScale(12),
    textAlign: "center",
  },

  modal: {
    justifyContent: "center",
    backgroundColor: colors.white,
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor: colors.white,
    width: moderateScale(width / 1.4),
    alignSelf: "center",
    alignItems: "center",
    paddingVertical: moderateScaleVertical(20),
    paddingHorizontal: moderateScale(20),
  },
  desaibleCancleBtnStyle: {
    borderRadius: moderateScale(24),
    paddingVertical: moderateScaleVertical(5),
    marginHorizontal: moderateScaleVertical(10),
    paddingHorizontal: moderateScale(20),
    borderWidth: moderateScale(0.5),
    borderColor: colors.darkRed,
  },
  desaibleCancleBtnTextStyle: {
    color: colors.darkRed,
    fontSize: textScale(14),
    fontFamily: fontFamily.robotoMedium,
    textTransform: "uppercase",
    textAlign: "center",
  },
  submitBtnStyle: {
    borderRadius: moderateScale(24),
    borderWidth: moderateScale(0.5),
    borderColor: colors.darkSkyBlue,
    paddingVertical: moderateScaleVertical(5),
    marginHorizontal: moderateScaleVertical(10),
    paddingHorizontal: moderateScale(20),
  },
  submitBtnTextStyle: {
    color: colors.darkSkyBlue,
    fontSize: textScale(14),
    fontFamily: fontFamily.robotoMedium,
    textTransform: "uppercase",
    textAlign: "center",
  },
  modalBtnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: moderateScaleVertical(30),
  },
  bottomSheetStyle: {
    wrapper: {
      backgroundColor: colors.lightBackground,
      // flex:1
    },
    draggableIcon: {
      backgroundColor: colors.mediumGray,
    },
    container: {
      borderTopLeftRadius: moderateScale(8),
      borderTopRightRadius: moderateScale(8),
      alignSelf: "center",
      height: moderateScaleVertical(height / 3),
      backgroundColor: colors.white,
      marginHorizontal: moderateScale(24),
    },
  },
  bottomSheetContainerStyle: {
    marginVertical: moderateScaleVertical(20),
    marginHorizontal: moderateScale(20),
  },
  headingStyle_1: {
    fontSize: textScale(20),
    color: colors.black,
    fontFamily: fontFamily.robotoRegular,
  },
  headingStyle_2: {
    fontSize: textScale(20),
    color: colors.darkSkyBlue,
    fontFamily: fontFamily.robotoRegular,
    marginTop: moderateScaleVertical(5),
  },
  textStyle: {
    fontSize: textScale(12),
    color: colors.black,
    fontFamily: fontFamily.robotoRegular,
    marginTop: moderateScaleVertical(10),
  },
  dangerImg: {
    width: moderateScale(width / 5),
    height: moderateScale(width / 5),
  },
  deleteAccountBtnStyle: {
    marginTop: moderateScaleVertical(50),
    backgroundColor: colors.darkRed,
    borderRadius: moderateScale(4),
  },
  deleteAccountBtnTextStyle: {
    color: colors.white,
    fontFamily: fontFamily.robotoRegular,
    fontSize: textScale(14),
    textAlign: "center",
    paddingVertical: moderateScaleVertical(10),
  },
  logoutAccountBtnStyle: {
    marginTop: moderateScaleVertical(50),
    backgroundColor: colors.darkBlue,
    borderRadius: moderateScale(4),
  },
  logoutAccountBtnTextStyle: {
    color: colors.white,
    fontFamily: fontFamily.robotoRegular,
    fontSize: textScale(14),
    textAlign: "center",
    paddingVertical: moderateScaleVertical(10),
  },
  cancleBtnStyle: {
    marginTop: moderateScaleVertical(10),
    borderRadius: moderateScale(4),
    borderWidth: moderateScale(0.5),
    borderColor: colors.mediumGray,
  },
  cancleBtnTextStyle: {
    color: colors.black,
    fontFamily: fontFamily.robotoRegular,
    fontSize: textScale(14),
    textAlign: "center",
    paddingVertical: moderateScaleVertical(10),
  },
  headerContainer: { height: 150 },
  rowContainer: { flexDirection: "row" },
});

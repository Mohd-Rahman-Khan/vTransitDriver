import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";
import fontFamily from "../../../styles/fontFamily";
import {
  textScale,
  width,
  height,
  moderateScale,
  moderateScaleVertical,
} from "../../../styles/responsiveSize";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.lightGary,
  },
  topContainer: {
    height: moderateScale(150),
  },
  disableBtn: {
    paddingVertical: moderateScaleVertical(8),
    paddingHorizontal: moderateScale(30),
    borderRadius: moderateScale(20),
    alignItems: "center",
    width: moderateScale(width / 1.5),
    backgroundColor: colors.lightBackground,
  },
  topContentContainer: {
    marginHorizontal: moderateScale(15),
    marginTop: moderateScaleVertical(10),
    marginBottom: moderateScaleVertical(20),
  },
  loginBgImgStyle: {
    height: height / 6,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScaleVertical(12),
  },
  screenTitleText: {
    marginTop: moderateScaleVertical(10),
    color: colors.white,
    fontSize: textScale(18),
    fontFamily: fontFamily.robotoRegular,
  },
  formContainer: {
    backgroundColor: colors.white,
    marginHorizontal: moderateScale(10),
    paddingTop: moderateScaleVertical(25),
    flex: 1,
    top: moderateScaleVertical(-90),
    borderRadius: moderateScale(8),
  },
  inputContainerStyle: {
    flex: 1,
    marginBottom: moderateScaleVertical(25),
    marginHorizontal: moderateScale(20),
    borderBottomWidth: moderateScale(0.5),
    borderBottomColor: colors.lightGary,
  },
  iconStyle: {
    width: moderateScale(width / 25),
    height: moderateScaleVertical(width / 20),
    marginLeft: moderateScale(5),
  },
  docContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    borderBottomColor: colors.lightGary,
    borderBottomWidth: moderateScale(0.5),
    marginTop: moderateScaleVertical(30),
  },
  editableInputStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    flex: 1,
    paddingHorizontal: moderateScale(0),
    paddingVertical: moderateScaleVertical(10),
    marginLeft: moderateScale(15),
  },
  desaibleInputStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.darkGray,
    flex: 1,
    paddingHorizontal: moderateScale(0),
    paddingVertical: moderateScaleVertical(10),
    marginLeft: moderateScale(15),
  },
  dropdown: {
    flex: 1,
    borderBottomColor: colors.lightGary,
    borderBottomWidth: moderateScale(0.5),
    // marginHorizontal:moderateScale(20),
    marginBottom: moderateScaleVertical(25),
    height: 60,
  },
  placeholderStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoMedium,
    color: colors.mediumGray,
    marginHorizontal: moderateScale(16),
    // textAlign: 'center',
  },
  selectedTextStyle: {
    fontSize: textScale(14),
    fontFamily: fontFamily.robotoMedium,
    color: colors.white,
    marginHorizontal: moderateScale(8),
  },
  itemStyle: {
    flex: 1,
    fontSize: textScale(14),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    // marginLeft: moderateScale(8),
    marginVertical: moderateScaleVertical(5),
    marginLeft: moderateScale(10),
  },
  vaccinationStatusText: {
    fontSize: textScale(15),
    fontFamily: fontFamily.robotoLight,
    color: colors.black,
  },
  bottomView: {
    marginBottom: moderateScaleVertical(130),
    marginTop: moderateScaleVertical(20),
    alignItems: "center",
  },
  submitBtnStyle: {
    paddingVertical: moderateScaleVertical(8),
    paddingHorizontal: moderateScale(30),
    borderRadius: moderateScale(20),
    alignItems: "center",
    width: moderateScale(width / 1.5),
    backgroundColor: colors.darkBlue,
  },
  submitBtnTextStyle: {
    color: colors.white,
    fontSize: textScale(15),
    fontFamily: fontFamily.robotoMedium,
    textTransform: "uppercase",
  },
  picPickerBtnStyle: {
    paddingVertical: moderateScaleVertical(8),
    width: moderateScale(width / 2.6),
    borderRadius: moderateScale(4),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.darkBlue,
    marginTop: moderateScaleVertical(10),
  },
  picPickerTextStyle: {
    color: colors.white,
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoMedium,
    // textTransform: 'uppercase',
  },
  bottomSheetStyle: {
    wrapper: {
      backgroundColor: "transparent",
    },

    draggableIcon: {
      backgroundColor: "#000",
    },
    container: {
      height: moderateScale(height / 4.5),
      backgroundColor: colors.whiteSmoke,
      borderTopEndRadius: moderateScale(24),
      borderTopLeftRadius: moderateScale(24),
    },
  },
  selectItemText: {
    textAlign: "center",
    fontSize: textScale(16),
    color: colors.themeColor,
  },
  itemContainer: {
    marginVertical: moderateScaleVertical(24),
    flexDirection: "row",
  },
  itemTextStyle: {
    fontSize: textScale(16),
    color: colors.themeColor,
    marginLeft: moderateScale(20),
  },
});

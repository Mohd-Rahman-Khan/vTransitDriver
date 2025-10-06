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
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeButtonStyle: {
    borderBottomWidth: 2,
    borderColor: colors.darkBlueColor,
    width: "50%",
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  deactiveButtonStyle: {
    borderBottomWidth: 2,
    borderColor: colors.lightGary,
    width: "50%",
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  activeTextStyle: {
    color: colors.darkBlueColor,
    fontSize: 16,
  },
  deactiveTextStyle: {
    color: colors.darkGray,
    fontSize: 16,
  },
  cardContainer: {
    borderColor: colors.lightBorderColor,
    borderWidth: 2,
    borderRadius: 14,
    marginTop: 15,
    marginHorizontal: 10,
  },
  detailRowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
    paddingVertical: 12,
  },
  commentConntainer: {
    height: 35,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  horizontalDevider: {
    height: 1,
    backgroundColor: colors.lightGary,
    width: "100%",
  },
  detailBox: { paddingHorizontal: 10, paddingVertical: 10 },
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
  actionIconStyle: { height: 13, width: 13, transform: [{ rotate: "270deg" }] },
  titleText: { fontSize: 13, color: colors.black },
  heading: {
    fontSize: 16,
    color: colors.black,
  },
  description: {
    fontSize: 14,
    color: colors.black,
  },
  detailContainer: {
    width: "60%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftBox: { width: "30%" },
  rightBox: { width: "70%" },
  iconConntainer: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconStyle: { height: 20, width: 20 },
  tripDetailContainer: {
    width: "73%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountDetailConntainer: {
    width: "25%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tripIconBox: { width: "15%" },
  tripDetailBox: { width: "83%" },
  tripIconStyle: { height: 30, width: 30 },
  verticalDevider: {
    height: 15,
    width: 2,
    backgroundColor: colors.lightGary,
    marginHorizontal: 5,
  },
  addressText: {
    fontSize: 11,
    color: colors.black,
  },
  tripDateAndIdText: {
    fontSize: 10,
    color: colors.black,
  },
  tripIdContainer: { flexDirection: "row", marginTop: 3 },
  tableListText: {
    color: colors.black,
    fontSize: 11,
    fontWeight: "500",
  },
  tableListDetailText: {
    color: colors.black,
    fontSize: 11,
  },
  statusIcon: {
    height: 20,
    width: 20,
  },
  rowContainer: {
    marginVertical: 10,
  },
  submitButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnStyle: {
    paddingVertical: moderateScaleVertical(8),
    paddingHorizontal: moderateScale(50),
    borderRadius: moderateScale(10),
    alignItems: "center",
    //width: moderateScale(width / 1.5),
    backgroundColor: colors.blueColor,
  },
  submitBtnTextStyle: {
    color: colors.white,
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoMedium,
  },
  notFoundContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  notFoundText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
  },
});

import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";
import fontFamily from "../../../styles/fontFamily";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
  height,
  scale,
} from "../../../styles/responsiveSize";

export const styles = StyleSheet.create({
  bottomContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  mainContainer: {
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
  topTabContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: moderateScale(0.5),
    borderBottomColor: colors.lightGray,
  },
  topTabTextContainer: {
    paddingBottom: moderateScaleVertical(20),
    flex: 0.5,
    alignItems: "center",
  },
  topTabTextStyle: {
    fontFamily: fontFamily.robotoRegular,
    fontSize: textScale(14),
    color: colors.black,
  },
  bottomTabContainer: {
    borderBottomColor: colors.themeColor,
    borderBottomWidth: moderateScale(2),
  },
  sectionListContainer: {
    paddingBottom: moderateScaleVertical(30),
  },
  sectionListHeader: {
    marginBottom: moderateScaleVertical(20),
    fontSize: textScale(14),
    color: colors.black,
    fontFamily: fontFamily.robotoRegular,
  },

  thumbnailContainer: {
    marginRight: moderateScale(10),
    width: moderateScale(width / 3),
  },
  playIconStyle: {
    height: moderateScaleVertical(width / 15),
    width: moderateScale(width / 15),
  },
  videoTitle: {
    marginVertical: moderateScaleVertical(5),
    fontSize: textScale(13),
    color: colors.black,
    fontFamily: fontFamily.robotoRegular,
  },
  videoDescription: {
    fontSize: textScale(11),
    color: colors.black,
    fontFamily: fontFamily.robotoRegular,
  },
  verticalScrollContainer: { flex: 1 },
  thumbnainImageContainerStyle: {
    borderRadius: moderateScale(10),
    height: moderateScaleVertical(height / 5),
    width: moderateScale(width / 3),
    marginBottom: moderateScaleVertical(5),
  },
  docIconStyle: {
    borderRadius: moderateScale(10),
    height: moderateScaleVertical(height / 6),
    width: moderateScale(width / 3.5),
    marginBottom: moderateScaleVertical(5),
  },
  mainContainer: { flex: 1 },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.modalColor,
    paddingHorizontal: 10,
  },
  modalInsideContainer: {},
  notFoundText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
  },
  notFoundContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});

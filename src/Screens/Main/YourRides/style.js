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
  topContainer: { height: 150 },
  bgImageStyle: { height: "100%", width: "100%" },

  bottomContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.lightGary,
    //justifyContent: "center",
    alignItems: "center",
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  headerTitleText: {
    color: colors.white,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomContainer: {
    height: "80%",
    width: "100%",
    backgroundColor: colors.lightGary,
    //justifyContent: "center",
    alignItems: "center",
  },
  contentSectionContainer: {
    flex: 1,
    width: "95%",
    backgroundColor: colors.white,
    marginTop: -80,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },

  dropdown: {
    backgroundColor: "transparent",
    borderRadius: moderateScale(8),
    maxWidth: moderateScale(width / 2.9),
    minWidth: moderateScale(width / 2.9),
    marginTop: 20,
  },
  itemStyle: {
    // flex: 1,
    fontSize: textScale(10),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    marginLeft: moderateScale(8),
    marginVertical: moderateScaleVertical(5),
    marginLeft: moderateScale(10),
  },
  placeholderStyle: {
    fontSize: textScale(9),
    fontFamily: fontFamily.robotoMedium,
    color: colors.black,
    marginLeft: moderateScale(8),
    textAlign: "center",
  },
  selectedTextStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoMedium,
    color: "transparent",
    marginLeft: moderateScale(4),
    textAlign: "center",
  },
  dropdownRightIconContainer: {
    height: 35,
    width: 40,
    borderWidth: 0.5,
    borderColor: colors.lightBackground,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.white,
    borderWidth: 1,
  },
  headerConntainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backArrowStyle: {
    width: moderateScale(width / 16),
    height: moderateScale(width / 16),
  },
  dropDownRenderItem: {
    marginVertical: moderateScaleVertical(5),
    flexDirection: "row",
    alignItems: "center",
  },
  pastRideNotFoundContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  notFoundText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
  },
  currentRideNotFoundContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
  },
  filterIconStyle: {
    height: 16,
    width: 16,
    tintColor: colors.white,
    marginRight: 5,
  },
});

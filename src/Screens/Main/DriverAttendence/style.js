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
    backgroundColor: colors.lightBorderColor,
    //justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "red",
  },
  contentSectionContainer: {
    flex: 1,
    width: "95%",
    backgroundColor: colors.white,
    marginTop: -100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    //paddingBottom: 20,
  },
  listContainer: {
    backgroundColor: colors.white,
    //paddingVertical: 20,
    paddingHorizontal: 10,
    flex: 1,
  },
  userDetailCoontainer: {
    backgroundColor: colors.white,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomWidth: 1,
    borderColor: colors.lightGary,
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconAndNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
  },
  greetingText: {
    fontSize: 15,
    color: colors.black,
  },
  nameStyle: {
    color: colors.mediumBlue,
    fontSize: 22,
    textTransform: "capitalize",
    fontWeight: "500",
  },
  nameAndGreetingContainer: {
    marginLeft: 10,
    width: "100%",
    alignSelf: "center",
    backgroundColor: "blue",
  },
  punchOutContainer: {
    width: "28%",
    alignItems: "center",
    alignSelf: "center",
  },
});

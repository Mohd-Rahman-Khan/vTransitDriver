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
  // bottomContainer: {
  //   flex: 1,
  //   width: "100%",
  //   backgroundColor: colors.lightGary,
  //   //justifyContent: "center",
  //   alignItems: "center",
  // },

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
    marginTop: -95,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },

  notFoundContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  notFoundtext: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
  },
});

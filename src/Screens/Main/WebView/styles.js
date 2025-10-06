import { StyleSheet } from "react-native";
import fontFamily from "../../../styles/fontFamily";
import {
  moderateScale,
  moderateScaleVertical,
  height,
  textScale,
  width,
} from "../../../styles/responsiveSize";
import colors from "../../../styles/colors";

export const styles = StyleSheet.create({
  bodyContainer: {
    paddingHorizontal: moderateScale(20),
    backgroundColor: colors.white,
    marginHorizontal: moderateScale(10),
    paddingVertical: moderateScaleVertical(10),
    flex: 0.99,
    marginTop: moderateScaleVertical(-65),
    borderRadius: moderateScale(4),
  },
  webviewContainer: { marginTop: 20 },
  mainCintainer: { flex: 1, backgroundColor: colors.lightGray },
});

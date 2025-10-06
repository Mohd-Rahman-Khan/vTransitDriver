import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";
import {
  moderateScale,
  height,
  width,
  moderateScaleVertical,
  textScale,
} from "../../../styles/responsiveSize";
import fontFamily from "../../../styles/fontFamily";

export const styles = StyleSheet.create({
  imgBg: {
    // flex: 1,
    height: height / 2.2,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor:'red'
  },
  logoContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: moderateScale(15),
    borderRadius: moderateScale(8),
    alignSelf: "center",
    marginBottom: moderateScaleVertical(20),
  },
  logoImg: {
    width: moderateScale(width / 1.5),
    height: moderateScale(width / 5),
    alignSelf: "center",
  },
  headingText: {
    fontSize: textScale(16),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    marginTop: moderateScaleVertical(5),
    // fontWeight: 'bold',
    // borderBottomWidth: 1,
    //textAlign: 'center',
  },
  inputContainerStyle: {
    marginTop: moderateScaleVertical(20),
    // marginHorizontal:moderateScale(10),
    flexDirection: "row",
    //backgroundColor: 'red',
    // height: 40,
  },
  inputStyle: {
    borderColor: colors.steel,
    borderWidth: 0.5,
    flex: 1,
    height: moderateScale(45),
    borderRadius: moderateScale(5),
    fontSize: textScale(10),
    fontFamily: fontFamily.robotoRegular,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScaleVertical(10),
    color: colors.black,
  },
  btnStyle: {
    paddingVertical: moderateScaleVertical(10),
    borderRadius: moderateScale(4),
    justifyContent: "center",
    alignItems: "center",
    //marginBottom: moderateScaleVertical(50),
    backgroundColor: colors.darkBlue,
  },
  btnTextStyle: {
    color: colors.white,
    fontSize: textScale(15),
    fontFamily: fontFamily.robotoMedium,
    textTransform: "uppercase",
  },
  cardView: {
    flex: 1,
    position: "absolute",
    height: "100%",
    justifyContent: "center",
    width: "95%",
    marginHorizontal: moderateScale(10),
    paddingHorizontal: moderateScale(10),
    // marginBottom:moderateScaleVertical(70)
  },

  loginCard: {
    borderRadius: 20,
    // elevation: 3,
    // shadowOffset: {height: 10, width: 10},
    // shadowOpacity: 0.3,
    // shadowColor: colors.steel,
    paddingHorizontal: moderateScale(20),
    backgroundColor: colors.white,
    justifyContent: "center",
    paddingTop: moderateScaleVertical(40),
    marginBottom: moderateScaleVertical(80),
  },

  socialLoginContainer: {
    borderWidth: moderateScale(0.5),
    borderRadius: moderateScale(4),
    borderColor: colors.mediumGray,
    alignItems: "center",
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    marginHorizontal: moderateScale(8),
    // width: "20%",
  },
  socialLoginIcon: {
    width: moderateScale(width / 25),
    height: moderateScale(width / 25),
  },
  socialLoginText: {
    fontSize: textScale(9),
    fontFamily: fontFamily.robotoRegular,
    color: colors.gray,
  },
  desaibleBtnStyle: {
    paddingVertical: moderateScaleVertical(10),
    borderRadius: moderateScale(4),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: moderateScaleVertical(20),
    backgroundColor: colors.darkGray,
  },
  scrollViewContainer: { flex: 1, backgroundColor: "transparent" },
  keyboardAvoidViewContainer: {
    height: "100%",
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: colors.white,
  },
  loginButtonContainer: { marginBottom: 5, marginTop: 20 },
  termsContainerStyle: {
    flexDirection: "row",
    justifyContent: "center",

    marginTop: 30,
    marginBottom: 15,
  },
  checkboxStyle: {
    width: 22,
    height: 22,
  },
  termsTextConatinerStyle: {
    flexDirection: "row",
    flex: 0.92,
    alignItems: "center",
  },
  normalText: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
  },
  linkBtn: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.skyBlue,

    alignItems: "center",
  },
});

import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import imagePath from "../constants/imagePath";
import colors from "../styles/colors";
import fontFamily from "../styles/fontFamily";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  height,
  width,
} from "../styles/responsiveSize";

const HeaderComp = ({
  title,
  setStep,
  step,
  icon,
  setIcon,
  state,
  description,
  loginBgImgStyle,
  idIcon,
  rightIcon,
  rightIconClick = () => {},
  innfoIconClick = () => {},
  centerIcon,
}) => {
  const navigation = useNavigation();
  const _goBack = () => {
    if (step == "2") {
      setStep(1);
      if (state?.status == "NONE") {
        setIcon(false);
      }
    } else if (step == "1") {
      navigation.goBack();
    } else {
      navigation.goBack();
    }
  };
  return (
    <View
      style={{ ...styles.loginBgImgStyle, ...loginBgImgStyle ,backgroundColor:colors.themeColor}}
    >
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          {icon ? (
            <TouchableOpacity onPress={_goBack} style={styles.backBtn}>
              <Image
                source={imagePath.backArrowIcon}
                style={styles.backBtnImg}
              />
            </TouchableOpacity>
          ) : null}
          <View>
            <Text style={styles.screenTitleText}>{title}</Text>
            {description ? (
              <View style={styles.descriptionContainer}>
                {idIcon ? (
                  <Image source={idIcon} style={styles.idIconStyle} />
                ) : null}
                <Text style={styles.screenDescriptionText}>{description}</Text>
              </View>
            ) : null}
          </View>
        </View>
        {centerIcon ? (
          <TouchableOpacity onPress={innfoIconClick}>
            <Image
              source={imagePath.informationIcon}
              style={{
                height: 20,
                width: 20,
                tintColor: colors.white,
                //marginTop: 20,
              }}
            />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={rightIconClick}
          style={styles.rightIconContainer}
        >
          <Image style={styles.rightIconStyle} source={rightIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginBgImgStyle: {
    height: moderateScale(120),
    paddingHorizontal: moderateScale(24),
    paddingVertical: moderateScaleVertical(12),
    backgroundColor:colors.themeColor
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  backBtn: {
    marginRight: moderateScale(10),
  },
  backBtnImg: {
    width: moderateScale(width / 16),
    height: moderateScale(width / 16),
  },
  screenTitleText: {
    color: colors.white,
    fontSize: textScale(18),
    fontFamily: fontFamily.robotoMedium,
    textTransform: "capitalize",
  },
  screenDescriptionText: {
    color: colors.white,
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: moderateScaleVertical(10),
  },
  idIconStyle: {
    width: moderateScale(width / 22),
    height: moderateScale(width / 22),
    marginRight: moderateScale(5),
  },
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  rightIconContainer: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  rightIconStyle: { height: 20, width: 20 },
});

export default HeaderComp;

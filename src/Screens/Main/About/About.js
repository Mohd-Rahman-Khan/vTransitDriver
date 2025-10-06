import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import WrapperContainer from "../../../Components/WrapperContainer";
import HeaderComp from "../../../Components/HeaderComp";
import colors from "../../../styles/colors";
import strings from "../../../constants/lang";
import InAppReview from "react-native-in-app-review";
import {
  moderateScale,
  moderateScaleVertical,
  width,
  height,
  textScale,
} from "../../../styles/responsiveSize";
import ButtonComp from "../../../Components/ButtonComp";
import { version } from "../../../../package.json";
import fontFamily from "../../../styles/fontFamily";
import imagePath from "../../../constants/imagePath";
import { PRIVACY_POLICY, TERMS_OF_USE } from "../../../config/urls";
import { useNavigation } from "@react-navigation/native";
import navigationStrings from "../../../navigation/navigationStrings";
import { styles } from "./styles";

const About = () => {
  const navigation = useNavigation();

  useEffect(() => {
    appReview();
  }, []);

  const appReview = () => {
    InAppReview.RequestInAppReview()
      .then((hasFlowFinishedSuccessfully) => {
        if (hasFlowFinishedSuccessfully) {
        }
      })
      .catch((error) => {});
  };
  return (
    <WrapperContainer>
      <View style={styles.container}>
        <HeaderComp title={strings.ABOUT} icon={imagePath.backIcon} />
        <View style={styles.bodyContainer}>
          <View style={styles.bodyHeaderContainer}>
            <Text style={styles.titleTextStyle}>
              {strings.MOBILITY_FOR_CORPORATES}
            </Text>
            <Text style={styles.versionTextStyle}>
              {strings.VERSION} {version}
            </Text>
          </View>
          <View style={styles.bodyContentContainer}>
            <View style={styles.bodyContentHeaderContainer}>
              <Image
                style={styles.sealedIconStyle}
                source={imagePath.securityIcon2}
              />
              <View style={styles.bodyContentHeaderRightContainer}>
                <Text style={styles.bodyContentHeaderRightTitleText}>
                  {strings.ADDITIONAL_INFO}
                </Text>
                <Text style={styles.bodyContentHeaderRightDetailsText}>
                  {strings.PRIVACY_POLICY_OTHER_INFO}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.termAndPrivacyContainer}
              onPress={() =>
                navigation.navigate(navigationStrings.WEBVIEW, {
                  data: {
                    uri: TERMS_OF_USE,
                    title: strings.TERMS_OF_SERVICE,
                  },
                })
              }
            >
              <View style={styles.termsOfServicesRow}>
                <Image
                  source={imagePath.termsIcon2}
                  style={styles.termAndPrivacyIcon}
                  resizeMode={"contain"}
                />
                <Text style={styles.termAndPrivacyTextStyle}>
                  {strings.TERMS_OF_SERVICE}
                </Text>
              </View>
              <Image
                source={imagePath.rightArrowIcon}
                style={styles.forwardIconStyle}
                resizeMode={"contain"}
              />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.termAndPrivacyContainer_2}
              onPress={() =>
                navigation.navigate(navigationStrings.WEBVIEW, {
                  data: {
                    uri: PRIVACY_POLICY,
                    title: strings.PRIVACY_POLICY,
                  },
                })
              }
            >
              <View style={styles.privacyPolicyRow}>
                <Image
                  source={imagePath.privacyPolicyIcon2}
                  style={styles.termAndPrivacyIcon}
                  resizeMode={"contain"}
                />
                <Text style={styles.termAndPrivacyTextStyle}>
                  {strings.PRIVACY_POLICY}
                </Text>
              </View>
              <Image
                source={imagePath.rightArrowIcon}
                style={styles.forwardIconStyle}
                resizeMode={"contain"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </WrapperContainer>
  );
};

export default About;

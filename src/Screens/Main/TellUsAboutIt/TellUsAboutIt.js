import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import WrapperContainer from "../../../Components/WrapperContainer";
import colors from "../../../styles/colors";
import fontFamily from "../../../styles/fontFamily";
import imagePath from "../../../constants/imagePath";
import {
  moderateScaleVertical,
  moderateScale,
  width,
  height,
  textScale,
} from "../../../styles/responsiveSize";
import HeaderComp from "../../../Components/HeaderComp";
import strings from "../../../constants/lang";
import ButtonComp from "../../../Components/ButtonComp";
import { useNavigation } from "@react-navigation/native";
import navigationStrings from "../../../navigation/navigationStrings";
import actions from "../../../redux/actions";
import { showSuccess } from "../../../utils/helperFunction";
import NavigationServices from "../../../navigation/NavigationServices";
import { useSelector } from "react-redux";
const TellUsAboutIt = ({ route }) => {
  const navigation = useNavigation();
  const selectedIssue = route?.params?.issue;
  const tripDetails = route?.params?.tripDetails;
  const helpTopicDetails = route?.params?.helpTopicDetails;
  const regex = /(<([^>]+)>)/gi;
  const [selectIssue, setSelectIssue] = useState({
    radioBtnsData: ["Ac was not working", "Cab was not clean"],
    checked: 0,
  });

  const [selectedHelp, setSelectedHelp] = useState();
  const getModulePermissionData = useSelector(
    (state) => state?.modulePermission?.modulePermissionData
  );
  const [isCreatePermAllow, setisCreatePermAllow] = useState(false);

  useEffect(() => {
    getPermission();
  }, []);
  const getPermission = () => {
    let checkSupport = getModulePermissionData?.permissions?.find(
      (item) => item?.moduleName == "Support"
    );

    if (checkSupport) {
      if (checkSupport?.actions) {
        let findCreatePerms = checkSupport?.actions?.find(
          (itemData) => itemData == "Create"
        );
        if (findCreatePerms) {
          setisCreatePermAllow(true);
        } else {
          setisCreatePermAllow(false);
        }
      } else {
        setisCreatePermAllow(false);
      }
    } else {
      setisCreatePermAllow(false);
    }
  };

  const _gotoWriteToUs = () => {
    if (isCreatePermAllow) {
      navigation.navigate(navigationStrings.WRITE_TO_US, {
        issueHeading: selectedIssue,
        helpTopic: selectedIssue,
        tripDetails: tripDetails?.tripId,
        helpTopicDetails: helpTopicDetails,
      });
    }
  };

  return (
    <WrapperContainer>
      <View style={styles.mainContainer}>
        <HeaderComp title={strings.TELL_US_ABOUT_IT} icon={true} />
        <View style={styles.bodyContainer}>
          {/* <RideDetails tripDetails={tripDetails} /> */}
          <View style={styles.issueContainer}>
            <Text style={styles.issueHeading}>{selectedIssue?.question}</Text>
            <Text style={styles.issueText}>
              {selectedIssue?.answer?.replace(regex, "")}
            </Text>
          </View>
          {/* <View style={styles.selectIssueContainer}>
            {selectIssue.radioBtnsData.map((data, index) => {
              return (
                <View key={index} style={styles.radioBtnContainer}>
                  {selectIssue.checked == index ? (
                    <TouchableOpacity style={styles.btn} activeOpacity={0.7}>
                      <Image
                        style={styles.img}
                        source={imagePath.selected_radio_button}
                      />
                      <Text style={styles.selectIssueText}>{data}</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectIssue({...selectIssue, checked: index});
                      }}
                      activeOpacity={0.7}
                      style={styles.btn}>
                      <Image
                        style={styles.img}
                        source={imagePath.unselected_radio_button}
                      />
                      <Text style={styles.selectIssueText}>{data}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
          <View style={styles.btnContainer}>
            <ButtonComp
              btnText={strings.SUBMIT}
              btnStyle={styles.btnStyle}
              btnTextStyle={styles.btnTextStyle}
            />
          </View> */}
          <Text
            style={{
              ...styles.issueHeading,
              marginTop: moderateScaleVertical(10),
            }}
          >
            {strings.WAS_THIS_ARTICLE_HELPFUL}
          </Text>
          <View style={styles.helpBtn}>
            <TouchableOpacity
              style={styles.unselectedHelpBtn}
              onPress={() => {
                setSelectedHelp("yes");
                showSuccess("thanks for your feedback");
                navigation.navigate(navigationStrings.HOME);
                //NavigationServices.reset(navigationStrings.RIDE);
              }}
            >
              <Text style={styles.unselectedHelpBtnText}>YES</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.unselectedHelpBtn}
              onPress={() => {
                setSelectedHelp("no");
                if (isCreatePermAllow) {
                  navigation.navigate(navigationStrings.WRITE_TO_US, {
                    issueHeading: selectedIssue,
                    helpTopic: selectedIssue,
                    tripDetails: tripDetails?.tripId,
                    helpTopicDetails: helpTopicDetails,
                  });
                }
              }}
            >
              <Text style={styles.unselectedHelpBtnText}>NO</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.additionalHelp}>
            <Text style={styles.issueHeading}>
              {strings.NEED_ADDITIONAL_HELP}
            </Text>
            <TouchableOpacity onPress={_gotoWriteToUs}>
              <Text style={styles.writeToUs}>{strings.WRITE_TO_US}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  bodyContainer: {
    paddingHorizontal: moderateScale(24),
    backgroundColor: colors.white,
    marginHorizontal: moderateScale(10),
    paddingVertical: moderateScaleVertical(20),
    flex: 0.99,
    marginTop: moderateScaleVertical(-60),
    borderRadius: moderateScale(4),
  },
  issueContainer: {
    borderBottomColor: colors.lightGray,
    borderBottomWidth: moderateScale(0.5),
    paddingBottom: moderateScaleVertical(20),
  },
  issueHeading: {
    fontSize: textScale(14),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    marginBottom: moderateScaleVertical(10),
  },
  issueText: {
    fontSize: textScale(12),
    //fontFamily: fontFamily.robotoLight,
    color: colors.black,
  },
  selectIssueContainer: {
    flexDirection: "row",
    marginVertical: moderateScaleVertical(20),
  },
  radioBtnContainer: {
    flexDirection: "row",
  },
  img: {
    height: moderateScale(width / 22),
    width: moderateScale(width / 22),
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: moderateScale(10),
  },
  selectIssueText: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    marginLeft: moderateScale(5),
  },
  btnStyle: {
    marginTop: moderateScaleVertical(20),
    borderRadius: moderateScale(20),
    justifyContent: "center",
    width: moderateScale(width / 3),
    alignItems: "center",
    backgroundColor: colors.darkBlue,
    paddingVertical: moderateScaleVertical(8),
  },
  btnTextStyle: {
    color: colors.white,
    fontSize: textScale(15),
    fontFamily: fontFamily.robotoRegular,
    // textTransform: 'uppercase',
  },
  btnContainer: {
    borderBottomColor: colors.lightGray,
    borderBottomWidth: moderateScale(0.5),
    paddingBottom: moderateScaleVertical(25),
    marginBottom: moderateScaleVertical(25),
  },
  helpBtn: {
    flexDirection: "row",
    borderBottomColor: colors.lightGray,
    borderBottomWidth: moderateScale(0.5),
    paddingBottom: moderateScaleVertical(20),
    marginTop: moderateScaleVertical(10),
  },
  unselectedHelpBtn: {
    borderColor: colors.mediumGray,
    marginLeft: moderateScale(10),
    borderWidth: moderateScale(0.5),
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScaleVertical(5),
  },
  unselectedHelpBtnText: {
    fontSize: textScale(12),
    color: colors.black,
    fontFamily: fontFamily.robotoRegular,
  },
  additionalHelp: {
    marginVertical: moderateScaleVertical(20),
  },
  writeToUs: {
    fontSize: textScale(14),
    fontFamily: fontFamily.robotoMedium,
    color: colors.darkBlue,
  },
});

export default TellUsAboutIt;

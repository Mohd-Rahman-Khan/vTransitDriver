import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import WrapperContainer from "../../../Components/WrapperContainer";
import HeaderComp from "../../../Components/HeaderComp";
import colors from "../../../styles/colors";
import imagePath from "../../../constants/imagePath";
import fontFamily from "../../../styles/fontFamily";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
  height,
} from "../../../styles/responsiveSize";
import { useNavigation } from "@react-navigation/native";
import navigationStrings from "../../../navigation/navigationStrings";
import actions from "../../../redux/actions";
import RideComp from "../../../Components/RideComp";

// const issueArray = ['I had an issue with the cab quality', 'My vehicle broke down during the ride', 'I left beloging in the vehicle']

const SelectedIssue = ({ route }) => {
  const navigation = useNavigation();
  const selectedIssue = route?.params?.selectedIssue;
  const helpTopicDetails = route?.params?.helpTopicDetails;
  const tripDetails = route?.params?.tripDetails;
  const [issueArray, setIssueArray] = useState([]);

  const goToTellUsAboutIt = (item) => {
    navigation.navigate(navigationStrings.TELL_US_ABOUT_IT, {
      issue: item,
      tripDetails: tripDetails,
      helpTopicDetails: helpTopicDetails,
    });
  };

  useEffect(() => {
    _getFAQBySubTopicId();
  }, []);

  const _getFAQBySubTopicId = () => {
    let subTopicId = selectedIssue?.id;
    actions
      .getFAQBySubtopicID(subTopicId)
      .then((response) => {
        let { status } = response;
        if (status == 200) {
          setIssueArray(response?.data);
        } else {
        }
      })
      .catch((error) => {});
  };

  const renderItem = ({ item, index }) => {
    const regex = /(<([^>]+)>)/gi;
    return (
      <TouchableOpacity
        key={index}
        style={styles.issuesMenu}
        onPress={() => goToTellUsAboutIt(item)}
      >
        <View>
          <Text style={styles.issuesMenuTitle}>{item?.question}</Text>
          <Text style={styles.issuesMenuDetailsText}>
            {item?.answer.replace(regex, "")}
          </Text>
        </View>
        {/* <Image
          style={styles.rightArrowIcon}
          source={imagePath.rightArrowIcon}
        /> */}
      </TouchableOpacity>
    );
  };

  return (
    <WrapperContainer>
      <View style={styles.mainContainer}>
        <HeaderComp title={selectedIssue?.subTopicName} icon={true} />
        <View style={styles.bodyContainer}>
          {/* <RideDetails tripDetails={tripDetails}/> */}
          <FlatList
            data={issueArray}
            showsVerticalScrollIndicator={false}
            renderItem={(element, index) => renderItem(element, index)}
            keyExtractor={(item) => item?.id}
            onEndReachedThreshold={0.1}
            onScrollToTop={false}
          />
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
    backgroundColor: colors.white,
    marginHorizontal: moderateScale(10),
    paddingVertical: moderateScaleVertical(10),
    flex: 0.99,
    marginTop: moderateScaleVertical(-60),
    borderRadius: moderateScale(4),
    paddingHorizontal: moderateScale(24),
  },
  issuesMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: moderateScale(0.5),
    paddingBottom: moderateScaleVertical(15),
    borderBottomColor: colors.lightGray,
    marginTop: moderateScaleVertical(5),

    alignItems: "center",
  },
  issuesMenuTitle: {
    fontSize: textScale(14),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
  },
  issuesMenuDetailsText: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    marginTop: moderateScaleVertical(5),
  },
});
export default SelectedIssue;

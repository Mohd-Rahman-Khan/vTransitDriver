import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import HeaderComp from "../../../Components/HeaderComp";
import WrapperContainer from "../../../Components/WrapperContainer";
import { DOC_URL } from "../../../config/urls";
import imagePath from "../../../constants/imagePath";
import strings from "../../../constants/lang";
import navigationStrings from "../../../navigation/navigationStrings";
import { styles } from "./styles";
import RideComp from "../../../Components/RideComp";
import ScreensHeader from "../../../Components/ScreensHeader";
import actions from "../../../redux/actions";

const issueList = [
  "Driver Related",
  "Ride Related",
  "Safety",
  "Emergency Health Pack",
];
const ChooseAnIssue = ({ route }) => {
  const navigation = useNavigation();
  const tripDetails = route?.params?.rideDetail;
  const helpTopicDetails = route?.params?.helpTopicDetails;
  const [subTopicIssueList, setSubTopicIssueList] = useState([]);
  const goToSelectedIssue = (item) => {
    navigation.navigate(navigationStrings.SELECTED_ISSUE, {
      selectedIssue: item,
      tripDetails: tripDetails,
      helpTopicDetails: helpTopicDetails,
    });
  };
  useEffect(() => {
    _getSubTopic();
  }, []);
  const _getSubTopic = () => {
    let helpTopicId = helpTopicDetails?.id;

    actions
      .getSubtopicByHelpTopicId(helpTopicId)
      .then((response) => {
        let { status } = response;
        if (status == 200) {
          setSubTopicIssueList(response?.data);
        } else {
        }
      })
      .catch((error) => {});
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.issuesMenu}
        onPress={() => goToSelectedIssue(item)}
      >
        <Text style={styles.issuesMenuTitle}>{item?.subTopicName}</Text>
        <Image
          style={styles.rightArrowIcon}
          source={imagePath.rightArrowIcon}
        />
      </TouchableOpacity>
    );
  };
  return (
    <WrapperContainer>
      <View style={styles.mainContainer}>
        <ScreensHeader
          title={strings.CHOOSE_AN_ISSUE}
          navigation={navigation}
        />
        <View style={styles.bodyContainer}>
          <RideComp
            item={tripDetails}
            screen={navigationStrings.CHOOSE_AN_ISSUE}
          />
          <View style={styles.issuesMenuContainer}>
            <FlatList
              data={subTopicIssueList}
              showsVerticalScrollIndicator={false}
              renderItem={(element, index) => renderItem(element, index)}
              keyExtractor={(item) => item}
              onEndReachedThreshold={0.1}
              onScrollToTop={false}
            />
          </View>
          <TouchableOpacity
            style={styles.otherHelpBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(navigationStrings.SUPPORT)}
          >
            <Text style={styles.otherHelpText}>Other Help Topics</Text>
          </TouchableOpacity>
        </View>
      </View>
    </WrapperContainer>
  );
};

export default ChooseAnIssue;

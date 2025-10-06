import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import HeaderComp from "../../../Components/HeaderComp";
import WrapperContainer from "../../../Components/WrapperContainer";
import imagePath from "../../../constants/imagePath";
import navigationStrings from "../../../navigation/navigationStrings";
import actions from "../../../redux/actions";
import { styles } from "./styles";

const SelectedSupportIssues = ({ route }) => {
  const navigation = useNavigation();
  const [subTopicIssueList, setSubTopicIssueList] = useState([]);
  const helpTopic = route?.params?.selectedIssue;

  useEffect(() => {
    _getSubTopic();
  }, [helpTopic]);

  const _getSubTopic = () => {
    let helpTopicId = helpTopic?.id;

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

  const goToNextedSupportIssue = (item) => {
    navigation.navigate(navigationStrings.NEXT_SUPPORT_ISSUE, {
      selectedIssue: item,
      helpTopic: helpTopic,
    });
  };
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.issuesMenu}
        onPress={() => goToNextedSupportIssue(item)}
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
        <HeaderComp title={helpTopic?.topicName} icon={true} />
        <View style={styles.bodyContainer}>
          <FlatList
            data={subTopicIssueList}
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

export default SelectedSupportIssues;

import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import HeaderComp from "../../../Components/HeaderComp";
import WrapperContainer from "../../../Components/WrapperContainer";
import navigationStrings from "../../../navigation/navigationStrings";
import actions from "../../../redux/actions";
import { styles } from "./styles";

const NextedSupportIssue = ({ route }) => {
  const navigation = useNavigation();
  const subTopicIssue = route?.params?.selectedIssue;
  const helpTopic = route?.params?.helpTopic;
  const [faqList, setFAQList] = useState([]);
  const _goToLearnMore = (item) => {
    navigation.navigate(navigationStrings.LEARN_MORE, {
      item: item,
      helpTopic: helpTopic,
      subTopicIssue: subTopicIssue,
    });
  };

  useEffect(() => {
    _getFAQBySubTopicId();
  }, [subTopicIssue]);

  const _getFAQBySubTopicId = () => {
    let subTopicId = subTopicIssue?.id;
    actions
      .getFAQBySubtopicID(subTopicId)
      .then((response) => {
        let { status } = response;
        if (status == 200) {
          setFAQList(response?.data);
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
        onPress={() => _goToLearnMore(item)}
      >
        <Text style={styles.issuesMenuTitle}>{item?.question}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <WrapperContainer>
      <View style={styles.mainContainer}>
        <HeaderComp title={subTopicIssue?.subTopicName} icon={true} />
        <View style={styles.bodyContainer}>
          <FlatList
            data={faqList}
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

export default NextedSupportIssue;

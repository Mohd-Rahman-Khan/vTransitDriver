import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import HeaderComp from "../../../Components/HeaderComp";
import WrapperContainer from "../../../Components/WrapperContainer";
import strings from "../../../constants/lang";
import navigationStrings from "../../../navigation/navigationStrings";
import NavigationServices from "../../../navigation/NavigationServices";
import { showSuccess } from "../../../utils/helperFunction";
import { styles } from "./styles";
import { useSelector } from "react-redux";
const LearnMore = ({ route }) => {
  const navigation = useNavigation();
  const item = route?.params?.item;
  const helpTopic = route?.params?.helpTopic;
  const subTopicIssue = route?.params?.subTopicIssue;
  const regex = /(<([^>]+)>)/gi;
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

  return (
    <WrapperContainer>
      <View style={styles.mainContainer}>
        <HeaderComp title="Learn More" icon={true} />
        <View style={styles.bodyContainer}>
          <View style={styles.quesContainerStyle}>
            <Text style={styles.quesTextStyle}>{item?.question}</Text>
            <Text style={styles.ansTextStyle}>
              {item?.answer.replace(regex, "")}
            </Text>
            <Image />
          </View>
          <View style={styles.quesContainerStyle}>
            <Text style={styles.quesTextStyle}>
              {strings.WAS_THIS_ARTICLE_HELPFUL}
            </Text>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={() => {
                  showSuccess("Thanks for your feedback");
                  navigation.navigate(navigationStrings.HOME);
                  //NavigationServices.reset(navigationStrings.RIDE);
                }}
              >
                <Text style={styles.feedBackBtn}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (isCreatePermAllow) {
                    navigation.navigate(navigationStrings.WRITE_TO_US, {
                      helpTopicDetails: helpTopic,
                      issueHeading: subTopicIssue,
                      helpTopic: subTopicIssue,
                    });
                  }
                }}
              >
                <Text style={styles.feedBackBtn}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </WrapperContainer>
  );
};

export default LearnMore;

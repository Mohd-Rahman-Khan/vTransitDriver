import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import WrapperContainer from "../../../Components/WrapperContainer";
import HeaderComp from "../../../Components/HeaderComp";
import { styles } from "./styles";
import strings from "../../../constants/lang";
import TrainingVideo from "./TrainingVideo";
import { useState } from "react";
import { moderateScale } from "../../../styles/responsiveSize";
import UserGuide from "./UserGuide";

const TrainingVideos = () => {
  const [selectType, setSelectType] = useState(strings.TRAINING_VIDEOS);
  const [isLoading, setisLoading] = useState(false);

  return (
    <WrapperContainer isLoading={isLoading} withModal={true}>
      <View style={styles.mainContainer}>
        <HeaderComp title={strings.TRAINING_VIDEOS} icon={true} />
        <View style={styles.bodyContainer}>
          <View style={styles.topTabContainer}>
            <TouchableOpacity
              style={
                selectType === strings.TRAINING_VIDEOS
                  ? [styles.topTabTextContainer, styles.bottomTabContainer]
                  : styles.topTabTextContainer
              }
              onPress={() => setSelectType(strings.TRAINING_VIDEOS)}
            >
              <Text style={styles.topTabTextStyle}>
                {strings.TRAINING_VIDEOS}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectType(strings.USER_GUIDE)}
              style={
                selectType === strings.USER_GUIDE
                  ? [styles.topTabTextContainer, styles.bottomTabContainer]
                  : styles.topTabTextContainer
              }
            >
              <Text style={styles.topTabTextStyle}>User Guide</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginHorizontal: moderateScale(20) }}>
            {selectType === strings.TRAINING_VIDEOS ? (
              <TrainingVideo
                setloader={(val) => {
                  setisLoading(val);
                }}
              />
            ) : (
              <UserGuide
                setloader={(val) => {
                  setisLoading(val);
                }}
              />
            )}
          </View>
        </View>
      </View>
    </WrapperContainer>
  );
};

export default TrainingVideos;

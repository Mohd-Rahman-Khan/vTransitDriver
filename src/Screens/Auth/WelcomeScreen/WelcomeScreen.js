import React from "react";
import {
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import WrapperContainer from "../../../Components/WrapperContainer";
import imagePath from "../../../constants/imagePath";
import strings from "../../../constants/lang";
import { styles } from "./styles";
import actions from "../../../redux/actions";

const WelcomeScreen = () => {
  const slides = [
    {
      bgImg: imagePath.welcomeImg_1,
    },
    {
      bgImg: imagePath.welcomeImg_2,
    },
    {
      bgImg: imagePath.welcomeImg_3,
    },
  ];
  const _renderItem = ({ item }) => {
    return (
      <ImageBackground
        source={item.bgImg}
        resizeMode={"stretch"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.welcomeTextStyle}>{strings.WELCOME_TEXT_1}</Text>
          <Text style={styles.welcomeTextStyle}>{strings.WELCOME_TEXT_2}</Text>
        </View>
      </ImageBackground>
    );
  };

  const _renderDoneButton = () => {
    return (
      <TouchableOpacity
        style={styles.doneTextBtn}
        onPress={() => actions.welcome(false)}
      >
        <Text style={styles.doneText}>{strings.DONE}</Text>
      </TouchableOpacity>
    );
  };

  const _renderNextButton = () => {
    return <Text style={styles.nextText}>{strings.NEXT}</Text>;
  };

  const _renderSkipButton = () => {
    return (
      <TouchableOpacity onPress={() => actions.welcome(false)}>
        <Text style={styles.nextText}>{strings.SKIP}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <WrapperContainer>
      <AppIntroSlider
        data={slides}
        renderItem={_renderItem}
        activeDotStyle={styles.activeDotStyle}
        renderNextButton={_renderNextButton}
        renderDoneButton={_renderDoneButton}
        renderSkipButton={_renderSkipButton}
        showSkipButton={true}
        dotStyle={styles.dotStyle}
      />
    </WrapperContainer>
  );
};

export default WelcomeScreen;

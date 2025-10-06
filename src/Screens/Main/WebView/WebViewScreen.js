import { View, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import React from "react";
import WrapperContainer from "../../../Components/WrapperContainer";
import { PRIVACY_POLICY } from "../../../config/urls";
import HeaderComp from "../../../Components/HeaderComp";
import { styles } from "./styles";
import colors from "../../../styles/colors";

const WebViewScreen = ({ route }) => {
  const data = route?.params?.data;
  return (
    <WrapperContainer>
      <View style={styles.mainCintainer}>
        <HeaderComp title={data?.title} icon={true} />
        <View style={styles.bodyContainer}>
          <WebView
            source={{
              uri: data?.uri,
            }}
            style={styles.webviewContainer}
          />
        </View>
      </View>
    </WrapperContainer>
  );
};

export default WebViewScreen;

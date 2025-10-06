import React from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
} from "react-native";
import ButtonComp from "../../../Components/ButtonComp";
import imagePath from "../../../constants/imagePath";
import strings from "../../../constants/lang";
import colors from "../../../styles/colors";
import { styles } from "./styles";
import CountryCodePicker from "../../../Components/CountryCodePicker";
import { PRIVACY_POLICY, TERMS_OF_USE } from "../../../config/urls";
import navigationStrings from "../../../navigation/navigationStrings";

const LoginModal = ({
  btnStyle = {},
  btnTextStyle = {},
  loginId,
  _handleLoginBtn = () => {},
  _onChangeText = () => {},
  googleLogin = () => {},
  microsoftLogin = () => {},
  appleLogin = () => {},
  isAgreeFun = () => {},
  isAgree = "",
  countryFlag = "",
  countryCode = "",
  setCountryCode,
  setCountryFlag,
  isNum,
  navigation,
}) => {
  return (
    <KeyboardAvoidingView>
      <View style={{}}>
        <Text style={styles.headingText}>{strings.LOGIN}</Text>
      </View>

      <View style={styles.inputContainerStyle}>
        {isNum ? (
          <CountryCodePicker
            countryCode={countryCode}
            countryFlag={countryFlag}
            setCountryCode={setCountryCode}
            setCountryFlag={setCountryFlag}
          />
        ) : null}
        <TextInput
          style={styles.inputStyle}
          placeholderTextColor={colors.steel}
          placeholder={strings.ENTER_YOUR_e_MAIL_ID}
          underlineColorAndroid={"transparent"}
          autoCapitalize="none"
          onChangeText={_onChangeText}
          maxLength={isNum ? 10 : 200}
        />
      </View>

      <View style={styles.termsContainerStyle}>
        <TouchableOpacity onPress={isAgreeFun} style={{ flex: 0.08 }}>
          <Image
            source={
              isAgree ? imagePath.checkbox_yellow : imagePath.checkbox_blank
            }
            style={styles.checkboxStyle}
          />
        </TouchableOpacity>
        <Text style={styles.termsTextConatinerStyle}>
          <Text style={styles.normalText}>{strings.YOU_AGREE_TO_THE}</Text>
          <Text
            onPress={() => {
              navigation.navigate(navigationStrings.WEBVIEW, {
                data: {
                  uri: TERMS_OF_USE,
                  title: strings.TERMS_OF_USE,
                },
              });
            }}
            style={styles.linkBtn}
          >
            {" "}
            {strings.TERMS_OF_USE}
          </Text>
          <Text style={styles.normalText}> {strings.AND_ACKNOWLEDGE_THE}</Text>

          <Text
            onPress={() => {
              navigation.navigate(navigationStrings.WEBVIEW, {
                data: {
                  uri: PRIVACY_POLICY,
                  title: strings.PRIVACY_POLICY,
                },
              });
            }}
            style={styles.linkBtn}
          >
            {" "}
            {strings.PRIVACY_POLICY}
          </Text>
        </Text>
      </View>

      <View style={styles.loginButtonContainer}>
        <ButtonComp
          disabled={!isAgree ? true : false}
          btnText={strings.NEXT}
          btnStyle={btnStyle}
          btnTextStyle={btnTextStyle}
          onPress={_handleLoginBtn}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginModal;

import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import ButtonComp from './ButtonComp';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import colors from '../styles/colors';
import strings from '../constants/lang';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import fontFamily from '../styles/fontFamily';

export default function VerifyOtpModal(props) {
  return (
    <Modal animationType="fade" transparent={true} visible={props.isVisible}>
      <TouchableWithoutFeedback onPress={props.closeModal} style={{flex: 1}}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalInsideContainer}>
            <View>
              <Text style={styles.verifyOTPText}>Verify Email Address</Text>
            </View>
            <View
              style={{
                //backgroundColor: "red",
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <SmoothPinCodeInput
                cellSize={33}
                // ref={this.pinInput}
                cellStyle={styles.cellStyle}
                textStyle={styles.textStyle}
                value={props.code}
                codeLength={6}
                cellStyleFocused={{
                  borderColor: colors.darkBlue,
                }}
                autoFocus={true}
                onTextChange={code => props.setCode(code)}
                keyboardType={'phone-pad'}
                // onFulfill={this._checkCode}
                onBackspace={() => console.log('No more back.')}
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                paddingHorizontal: 20,
                marginTop: 10,
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={props.resendOtp}
                //disabled={resendBtn}
              >
                <Text style={{fontSize: textScale(14), color: colors.darkBlue}}>
                  {' '}
                  {strings.RESEND_OTP}
                </Text>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.buttonRowContainer}>
              
              <View style={{width: 10}}></View>
              <View style={styles.TripModalbuttonContainer}>
                <ButtonComp
                  btnText="Verify"
                  btnStyle={styles.acceptButtonStyle}
                  btnTextStyle={styles.acceptButtonText}
                  onPress={props.verifyOtp}
                />
              </View>
            </View> */}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.modalColor,
  },
  modalInsideContainer: {
    // height: "32%",
    width: '80%',
    backgroundColor: colors.white,
    // borderWidth: 3,
    // borderColor: colors.blueBorderColor,
    borderRadius: 20,
    paddingVertical: 20,
  },
  cellStyle: {
    borderBottomColor: colors.darkBlue,
    borderBottomWidth: moderateScale(3),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScaleVertical(10),
  },
  textStyle: {
    fontSize: textScale(18),
    fontFamily: fontFamily.robotoRegular,
    color: colors.darkBlue,
  },
  buttonRowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  TripModalbuttonContainer: {width: '40%'},
  laterButtonStyle: {
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.greyBackgroundColor,
    paddingVertical: 10,
  },
  laterButtonText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fontFamily.robotoMedium,
    textTransform: 'uppercase',
  },
  acceptButtonStyle: {
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.themeColor,
  },
  acceptButtonText: {
    color: colors.themeColor,
    fontSize: 12,
    fontFamily: fontFamily.robotoMedium,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  verifyOTPText: {
    textAlign: 'center',
    fontSize: 18,
    color: colors.black,
    fontWeight: '400',
  },
});

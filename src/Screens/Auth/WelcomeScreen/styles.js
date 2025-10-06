import {StyleSheet} from 'react-native';
import colors from '../../../styles/colors';
import {
  moderateScale,
  width,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import fontFamily from '../../../styles/fontFamily';

export const styles = StyleSheet.create({
  container: {
    flex: 0.94,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  welcomeTextStyle: {
    color: colors.white,
    fontSize: textScale(16),
    fontFamily: fontFamily.robotoRegular,
  },
  doneTextBtn: {
    top: 30,
  },
  doneText: {
    color: colors.white,
    fontSize: textScale(18),
    fontFamily: fontFamily.robotoMedium,
  },
  nextText: {
    top: 30,
    color: colors.white,
    fontSize: textScale(18),
    fontFamily: fontFamily.robotoMedium,
  },
  activeDotStyle: {
    width: moderateScale(width / 64),
    height: moderateScale(width / 64),
    borderRadius: moderateScale(width / 128),
    marginHorizontal: moderateScale(10),
    backgroundColor: colors.darkGray,
    top: 15,
  },
  dotStyle: {
    width: moderateScale(width / 64),
    height: moderateScale(width / 64),
    borderRadius: moderateScale(width / 128),
    backgroundColor: colors.dotColor,
    marginHorizontal: moderateScale(10),
    top: 15,
  },
});

import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
  height,
} from "../styles/responsiveSize";
import imagePath from "../constants/imagePath";
import getDocUrl from "../utils/getDocUrl";
import fontFamily from "../styles/fontFamily";
import colors from "../styles/colors";
import strings from "../constants/lang";
import RBSheet from "react-native-raw-bottom-sheet";
import * as Progress from "react-native-progress";
import { openGallery, openCamera } from "../utils/imagePickerFun";
import { useSelector } from "react-redux";
import { DOC_URL } from "../config/urls";
import profileDataReducer from "../redux/reducers/profileDataReducer";
import { showError } from "../utils/helperFunction";

const StepperHeader = ({
  state,
  setState,
  title,
  nextScreen,
  step,
  setPhoto,
  photo,
  showclickePic,
  driverAppSettingData,
  setClickPicStatus = () => {},
}) => {
  var progress = step > 0 ? step / 2 : 0;
  const refRBSheet = useRef();

  const userData = useSelector((state) => state?.userData?.userData);
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );

  useEffect(() => {
    profileImg(state?.photo);
  }, []);

  const profileImg = async (pic) => {
    setPhoto({
      ...photo,
      uri: DOC_URL + pic,
    });
  };

  const _openGallery = async () => {
    try {
      const res = await openGallery();

      setPhoto({
        ...photo,
        uri: res?.path,
        name: `${(Math.random() + 1).toString(36).substring(7)}.jpg`,
        type: res?.mime,
      });
      setClickPicStatus(true);
      refRBSheet.current.close();
    } catch (error) {}
  };

  const _openCamera = async () => {
    try {
      const res = await openCamera();
      if (res?.height < 720) {
        showError(
          "The file you are trying to upload is less than 2MB. Please upload a file greater than 720px or Capture using your device camera"
        );
      } else {
        setPhoto({
          ...photo,
          uri: res?.path,
          name: `${(Math.random() + 1).toString(36).substring(7)}.jpg`,
          type: res?.mime,
        });
        setClickPicStatus(true);
        refRBSheet.current.close();
      }
    } catch (error) {}
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftHeader}>
        <TouchableOpacity
          disabled={driverAppSettingData?.includes("photo") ? true : false}
          activeOpacity={0.8}
          onPress={() => refRBSheet.current.open()}
        >
          {photo?.uri ? (
            photo?.uri == DOC_URL + profileData?.photo ? (
              <Image
                source={
                  profileData?.gender == "Male" || profileData?.gender == "M"
                    ? imagePath.maleAvatar
                    : profileData?.gender == "Female" ||
                      profileData?.gender == "F"
                    ? imagePath.femaleAvatar
                    : imagePath.userIcon
                }
                resizeMode={"contain"}
                style={styles.userImg}
              />
            ) : (
              <Image source={{ uri: photo?.uri }} style={styles.userImg} />
            )
          ) : state?.photo ? (
            <Image
              source={{ uri: DOC_URL + state?.photo }}
              style={styles.userImg}
            />
          ) : (
            <Image
              source={imagePath.userIcon}
              resizeMode={"contain"}
              style={styles.userImg}
            />
          )}

          <View style={styles.iconContainer}>
            <Image source={imagePath.editImg} style={styles.iconStyle} />
          </View>
        </TouchableOpacity>
        <View style={styles.stepperTitles}>
          <Text style={styles.titleStyle}>{title}</Text>
        </View>
      </View>
      <View>
        {step == 1 ? (
          <Image
            source={imagePath.circularProgressIcon}
            style={styles.progressIcon}
          />
        ) : (
          <Image
            source={imagePath.circularProgressIcon_2}
            style={styles.progressIcon}
          />
        )}
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={styles.bottomSheetStyle}
      >
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.selectItemText}>{strings.SELECT_ITEM}</Text>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => _openCamera()}
          >
            <Image source={imagePath.cameraIcon} />
            <Text style={styles.itemTextStyle}>{strings.OPEN_CAMERA}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.openGalleryButtonContainer}
            onPress={() => _openGallery()}
          >
            <Image source={imagePath.folderIcon} />
            <Text style={styles.itemTextStyle}>{strings.OPEN_GALLERY}</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: moderateScale(0.3),
    paddingBottom: moderateScaleVertical(20),
    borderBottomColor: colors.lightGary,
    paddingHorizontal: moderateScale(20),
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepperTitles: {
    marginLeft: moderateScale(15),
  },
  userImg: {
    width: width / 6,
    height: width / 6,
    borderRadius: moderateScale(50),
    borderWidth: moderateScale(0.1),
    borderColor: colors.mediumGray,
  },
  iconStyle: {
    width: width / 35,
    height: width / 35,
  },
  titleStyle: {
    fontSize: textScale(18),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
  },
  nextScreen: {
    color: colors.mediumGray,
    fontFamily: fontFamily.robotoRegular,
    fontSize: textScale(12),
    marginTop: moderateScaleVertical(5),
  },

  progressText: {
    fontSize: textScale(14),
    color: colors.lightGreen,
  },
  iconContainer: {
    width: width / 30,
    height: width / 30,
    backgroundColor: colors.white,
    padding: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(50),
    position: "absolute",
    bottom: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  bottomSheetStyle: {
    wrapper: {
      backgroundColor: "transparent",
    },

    draggableIcon: {
      backgroundColor: "#000",
    },
    container: {
      height: moderateScale(height / 4.5),
      backgroundColor: colors.whiteSmoke,
      borderTopEndRadius: moderateScale(24),
      borderTopLeftRadius: moderateScale(24),
    },
  },
  bottomSheetContainer: {
    marginHorizontal: moderateScale(24),
    borderTopLeftRadius: moderateScale(20),
    borderTopEndRadius: moderateScale(20),
  },
  selectItemText: {
    textAlign: "center",
    fontSize: textScale(16),
    color: colors.themeColor,
  },
  itemContainer: {
    marginVertical: moderateScaleVertical(24),
    flexDirection: "row",
  },
  itemTextStyle: {
    fontSize: textScale(16),
    color: colors.themeColor,
    marginLeft: moderateScale(20),
  },
  progressIcon: {
    width: width / 6,
    height: width / 6,
  },
  openGalleryButtonContainer: { flexDirection: "row" },
});
export default StepperHeader;

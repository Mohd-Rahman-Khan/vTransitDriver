import {
  Image,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Keyboard,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import imagePath from "../constants/imagePath";
import colors from "../styles/colors";
import strings from "../constants/lang";
import { Dropdown } from "react-native-element-dropdown";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../styles/responsiveSize";
import fontFamily from "../styles/fontFamily";
import ButtonComp from "./ButtonComp";
import { openCamera, openGallery } from "../utils/imagePickerFun";
import { imageCompress } from "../utils/imageCompressor";
import { uploadDoc } from "../utils/docPickerFun";
import { showError } from "../utils/helperFunction";
import { getFileExtension } from "../utils/utils";

export default function UploadDocInput(props) {
  const _openCamera = async (setState, item) => {
    var selectedFile;
    try {
      const res = await openCamera();

      if (res?.height < 720) {
        showError(
          "The file you are trying to upload is less than 2MB. Please upload a file greater than 720px or Capture using your device camera"
        );
      } else {
        props.setselectedDoc(res, "camera");
        props.setselectedDocName(res?.path);
      }
    } catch (error) {}
  };

  const _openGallery = async () => {
    try {
      const res = await uploadDoc();
      let getFIleType = getFileExtension(res?.name);

      if (
        getFIleType == "mp3" ||
        getFIleType == "mp4" ||
        getFIleType == "MP4" ||
        getFIleType == "MP3"
      ) {
        showError("Audio and video not allowed.");
      } else {
        props.setselectedDoc(res, "gallery");
        props.setselectedDocName(res?.name);
      }
    } catch (error) {}
  };
  return (
    <View>
      <View style={styles.rowContainer}>
        <View style={styles.uploadDocContainer}>
          <View style={styles.uploadDocPlaceholderContainer}>
            <Text style={styles.uploadScanText}>{props?.placeholder}</Text>
          </View>

          <View style={styles.uploadDocButtonContainer}>
            <TouchableOpacity
              onPress={() => {
                if (props?.loadingButton) {
                  showError("Document is already uploading");
                } else {
                  _openGallery();
                }
              }}
              style={styles.openGalleryButtonConatiner}
            >
              <View style={styles.uploadIconContainer}>
                <Image
                  style={styles.uploadIconStyle}
                  source={imagePath.cloudUpload}
                />
              </View>
              <View style={styles.uploadTextContainer}>
                <Text style={styles.uploadDocText}>Upload document</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.ortextContainerStyle}>
              <Text style={styles.orText}>Or</Text>
            </View>
            <TouchableOpacity
              //onPress={props?.openCamera}
              onPress={() => {
                if (props?.loadingButton) {
                  showError("Document is already uploading");
                } else {
                  _openCamera();
                }
              }}
              style={styles.openCameraButtonConatiner}
            >
              <View style={styles.cameraContainer}>
                <Image
                  source={imagePath.cameraIcon}
                  style={styles.cameraIcon}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {props?.documentUri ? (
        <View style={styles.rowContainer}>
          <View style={styles.showDocContainer}>
            <View style={styles.showDocContainerLeftBox}>
              <View style={styles.docImageContainer}>
                <Image
                  source={{
                    uri: props?.documentUri?.path
                      ? props?.documentUri?.path
                      : props?.documentUri?.uri,
                  }}
                  style={styles.documentStyle}
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text numberOfLines={1} style={styles.docNameStyle}>
                  {props.documentName}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={props.cleanSelection}
              style={styles.showDocContainerRightBox}
            >
              <Image source={imagePath.trash} style={styles.trashIcon} />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  modalMainContainer: { flex: 1 },
  bottomModalContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: colors.modalColor,
  },
  modalContentContainer: {
    width: "100%",
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    //height: "45%",
    paddingBottom: 50,
  },
  headingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  headingText: {
    color: colors.blueColor,
    fontSize: 18,
  },
  dropdown: {
    borderBottomColor: colors.lightGary,
    borderBottomWidth: moderateScale(0.5),
    height: 40,
  },
  itemStyle: {
    flex: 1,
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    marginVertical: moderateScaleVertical(5),
    marginLeft: moderateScale(10),
  },
  placeholderStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoMedium,
    color: colors.mediumGray,
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: textScale(14),
    fontFamily: fontFamily.robotoMedium,
    color: colors.white,
    marginHorizontal: moderateScale(8),
  },
  selectedTextStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
  },
  showDocContainer: {
    height: 40,
    borderColor: colors.lightGary,
    borderWidth: moderateScale(0.5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  uploadDocContainer: {
    height: 40,
    borderBottomColor: colors.lightGary,
    borderBottomWidth: moderateScale(0.5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //paddingHorizontal: 10,
  },
  rowContainer: {
    marginTop: 20,
  },
  showDocContainerLeftBox: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
  },
  showDocContainerRightBox: {
    width: "10%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  trashIcon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    tintColor: colors.black,
  },
  documentStyle: {
    height: 25,
    width: 55,
  },
  docNameStyle: {
    marginHorizontal: 25,
    fontSize: 14,
    color: colors.black,
  },
  docImageContainer: {
    borderColor: colors.lightGary,
    borderWidth: moderateScale(0.5),
  },
  uploadDocPlaceholderContainer: {
    width: "40%",
  },
  uploadDocButtonContainer: {
    width: "58%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  uploadScanText: {
    color: colors.mediumGray,
    fontSize: 12,
  },
  openGalleryButtonConatiner: {
    width: "58%",
    backgroundColor: colors.darkGrayBackground,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    paddingVertical: 5,
  },
  ortextContainerStyle: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
  },
  openCameraButtonConatiner: {
    width: "20%",
    justifyContent: "center",
  },
  uploadIconContainer: {
    // width: "20%",
  },
  uploadTextContainer: {
    //width: "80%",
  },
  uploadDocText: {
    fontSize: 10,
    color: colors.white,
  },
  uploadIconStyle: {
    height: 15,
    width: 15,
    tintColor: colors.white,
    marginRight: 5,
  },
  cameraContainer: {
    height: 25,
    width: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.lightBorderColor,
    borderRadius: 50,
  },
  cameraIcon: {
    height: 15,
    width: 15,
    resizeMode: "contain",
  },
  docContainer: {
    borderBottomColor: colors.lightGary,
    borderBottomWidth: moderateScale(0.5),
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    paddingVertical: moderateScaleVertical(10),
  },
  editableInputStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    flex: 1,
    paddingHorizontal: moderateScale(0),
    paddingVertical: moderateScaleVertical(10),
    marginLeft: moderateScale(15),
  },
  submitBtnStyle: {
    paddingVertical: moderateScaleVertical(8),
    paddingHorizontal: moderateScale(50),
    borderRadius: moderateScale(10),
    alignItems: "center",
    //width: moderateScale(width / 1.5),
    backgroundColor: colors.blueColor,
  },
  submitBtnTextStyle: {
    color: colors.white,
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoMedium,
  },
  submitButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  orText: { fontSize: 14, textTransform: "uppercase" },
});

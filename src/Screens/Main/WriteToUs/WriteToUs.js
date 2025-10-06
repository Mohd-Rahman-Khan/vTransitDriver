import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import { Dropdown } from "react-native-element-dropdown";
import RBSheet from "react-native-raw-bottom-sheet";
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../../../styles/responsiveSize";

import fontFamily from "../../../styles/fontFamily";
import validator from "../../../utils/validations";
import { showError, showSuccess } from "../../../utils/helperFunction";
import { useSelector } from "react-redux";
import actions from "../../../redux/actions";
import imagePath from "../../../constants/imagePath";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import navigationStrings from "../../../navigation/navigationStrings";
import { useRef } from "react";
import { openCamera, openGallery } from "../../../utils/imagePickerFun";
import { DOC_URL } from "../../../config/urls";
import WrapperContainer from "../../../Components/WrapperContainer";
import HeaderComp from "../../../Components/HeaderComp";
import strings from "../../../constants/lang";
import colors from "../../../styles/colors";
import TextInputComp from "../../../Components/TextInputComp";
import ButtonComp from "../../../Components/ButtonComp";
import ScreensHeader from "../../../Components/ScreensHeader";

const WriteToUs = ({ route }) => {
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const selectedIssue = route?.params?.issueHeading;
  const helpTopic = route?.params?.helpTopic;
  const tripId = route?.params?.tripDetails;
  const helpTopicDetails = route?.params?.helpTopicDetails;
  const reopenTicket = route?.params?.reopenTicket;
  const isRide = route?.params?.isRide;
  const userData = useSelector((state) => state?.userData?.userData?.data);
  const [helpTopicsList, setHelpTopicsList] = useState([]);
  const [selectedHelpTopic, setSelectedHelpTopic] = useState({
    value: "",
    lable: "",
    id: "",
  });
  const [subTopicIssueList, setSubTopicIssueList] = useState([]);
  const [selectedSubTopic, setSelectedSubTopic] = useState({
    value: "",
    lable: "",
    id: "",
  });
  const refRBSheet = useRef();

  const [feedback, setFeedback] = useState({
    subject: selectedIssue,
    mobileNo: profileData?.mobileNo,
    email: profileData?.emailId,
    topicDetails: "",
    fileImg: "",
    fileName: "",
  });

  useEffect(() => {
    _getHelpTopics();
  }, []);

  useEffect(() => {
    _getSubTopic();
  }, [selectedHelpTopic]);

  const { subject, mobileNo, email, topicDetails } = feedback;

  const isValidData = () => {
    const error = validator({
      email,
      mobileNo,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  const _openGallery = async () => {
    try {
      setLoading(true);
      const res = await openGallery();
      if (res) {
        uploadFileFun(res);
      }
      refRBSheet.current.close();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const _openCamera = async () => {
    try {
      setLoading(true);
      const res = await openCamera();
      if (res) {
        uploadFileFun(res);
      }
      refRBSheet.current.close();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const uploadFileFun = (res) => {
    setLoading(true);
    let data = new FormData();
    var prefix = "";
    if (Platform.OS == "android") {
      prefix = "file://";
    }
    if (res?.mime) {
      data.append("photo", {
        uri: res?.path,
        name: `${(Math.random() + 1).toString(36).substring(7)}.jpg`,
        type: res?.mime,
      });
    }
    actions
      .supportFileUpload(
        data,
        { "Content-Type": "multipart/form-data" },
        "formData"
      )
      .then((response) => {
        let { status } = response;
        if (status == 200) {
          setFeedback({
            ...feedback,
            fileImg: response?.data?.documentName,
            fileName: response?.data?.fileName,
          });
          setLoading(false);
        } else {
          showError("Something went wrong");
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);

        showError(err?.message);
      });
  };
  const _raiseComplaint = () => {
    const checkValid = isValidData();
    if (!selectedHelpTopic?.id && !helpTopicDetails?.id) {
      return showError("Please select help topic");
    } else if (!selectedSubTopic?.id && !helpTopic?.id) {
      return showError("Please select sub-help topic");
    } else if (!subject) {
      return showError("Please enter subject");
    } else if (!topicDetails) {
      return showError("Please enter topic Details");
    }

    if (!checkValid) {
      return;
    }
    let data = {
      userrole: "Driver",
      tripId: tripId ? tripId : null,
      driverId: profileData?.id,
      subject: subject,
      topicId: helpTopicDetails?.id
        ? helpTopicDetails?.id
        : selectedHelpTopic?.id,
      subTopicId: helpTopic?.id ? helpTopic?.id : selectedSubTopic?.id,
      requestMsg: [
        {
          fileImg: feedback?.fileImg,
          userName: profileData?.firstName + " " + profileData?.lastName,
          userId: profileData?.id,
          msg: feedback?.topicDetails,
          profileImg: profileData?.photo,
          userRole: "Driver",
          createdOn: Date.now(),
        },
      ],
      tanentId: profileData?.tanentId,
      topicName: helpTopicDetails?.id
        ? helpTopicDetails?.topicName
        : selectedHelpTopic?.lable,
      subTopicName: helpTopic?.id
        ? helpTopic?.subTopicName
        : selectedSubTopic?.lable,
      corporateId: profileData?.corporateId,
      personContactno: profileData?.mobileNo,
      personEmailId: profileData?.emailId,
      status: "PENDING",
      isRide: isRide == "NO" ? "NO" : "YES",
    };

    actions
      .raiseComplaint(data)
      .then((respose) => {
        if (respose?.status === 200) {
          showSuccess(strings.COMPLAINT_SUCCESS);
          navigation.navigate(navigationStrings.HOME);
        } else {
          showError("Network error.");
        }
      })
      .catch((error) => {});
  };

  const reopenTicketFun = () => {
    let data = helpTopicDetails;
    // data.status = "REOPEN";
    data.requestMsg.push({
      fileImg: feedback?.fileImg,
      userName: profileData?.employeeFullName,
      userId: profileData?.id,
      msg: feedback?.topicDetails,
      profileImg: profileData?.photo,
      userRole: "EMPLOYEE",
      createdOn: Date.now(),
    });

    actions
      .reopenTicket(data)
      .then((response) => {
        showSuccess(strings.COMPLAINT_SUCCESS);
        navigation.navigate(navigationStrings.RIDE);
      })
      .catch((error) => {});
  };
  const _getHelpTopics = () => {
    actions
      .getHelpTopics()
      .then((response) => {
        let { status } = response;
        let temArr = [...helpTopicsList];
        if (status == 200) {
          response?.data?.body?.HelpTopicList?.map((item, index) => {
            if (!temArr.includes(item?.id)) {
              temArr.push({
                label: item?.topicName,
                value: item?.topicName,
                id: item?.id,
              });
            }
          });
          setHelpTopicsList(temArr);
        }
      })
      .catch((error) => {});
  };

  const _getSubTopic = () => {
    let helpTopicId = selectedHelpTopic?.id;

    actions
      .getSubtopicByHelpTopicId(helpTopicId)
      .then((response) => {
        let { status } = response;
        let temArr = [];
        if (status == 200) {
          response?.data?.map((item, index) => {
            if (!temArr.includes(item?.id)) {
              temArr.push({
                label: item?.subTopicName,
                value: item?.subTopicName,
                id: item?.id,
              });
            }
          });
          setSubTopicIssueList(temArr);
        } else {
        }
      })
      .catch((error) => {});
  };

  return (
    <WrapperContainer isLoading={loading} withModal={loading}>
      <View style={styles.mainContainer}>
        <ScreensHeader title="Raise Complaint" navigation={navigation} />
        {/* <HeaderComp title="Raise Complaint" icon={true} /> */}
        <View style={styles.bodyContainer}>
          <View style={[styles.inputContainerStyle]}>
            {/* <Text style={styles.lableStyle}>{strings.PHONE_NUMBER}</Text> */}
            <TextInputComp
              editable={false}
              inputStyle={styles.desaibleInputStyle}
              placeholder={strings.PHONE_NUMBER}
              textInputContainer={styles.textInputContainer}
              autoCapitalize={"none"}
              onChangeText={(mobileNo) =>
                setFeedback({ ...feedback, mobileNo: mobileNo })
              }
              icon={imagePath.call}
              value={mobileNo}
            />
          </View>
          <View style={styles.inputContainerStyle}>
            {/* <Text style={styles.lableStyle}>{strings.EMAIL}</Text> */}
            <TextInputComp
              editable={true}
              inputStyle={styles.desaibleInputStyle}
              placeholder={strings.EMAIL}
              textInputContainer={styles.textInputContainer}
              autoCapitalize={"none"}
              onChangeText={(email) =>
                setFeedback({ ...feedback, email: email })
              }
              value={email}
              icon={imagePath.email_address}
            />
          </View>
          <View style={styles.inputContainerStyle}>
            {/* <Text style={styles.lableStyle}>{strings.HELP_TOPIC}</Text> */}
            {helpTopic?.helpTopicId || helpTopicDetails?.id ? (
              <TextInputComp
                editable={false}
                inputStyle={styles.editableInputStyle}
                placeholder={strings.HELP_TOPIC}
                textInputContainer={styles.textInputContainer}
                autoCapitalize={"none"}
                // onChangeText={email => setFeedback({...feedback, email: email})}
                value={helpTopicDetails?.topicName}
                icon={imagePath.helpTopic}
              />
            ) : (
              <Dropdown
                style={styles.dropdown}
                renderItem={(item) => (
                  <View
                    style={{
                      marginVertical: moderateScaleVertical(5),
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.itemStyle}>{item?.label}</Text>
                  </View>
                )}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                // inputSearchStyle={styles.inputSearchStyle}
                placeholder={strings.HELP_TOPIC}
                selectedTextProps={{ numberOfLines: 1 }}
                labelField="label"
                maxHeight={200}
                maxWidth={width}
                valueField="value"
                // placeholder={strings.}
                data={helpTopicsList}
                value={selectedHelpTopic?.lable}
                onChange={(item) => {
                  setSelectedHelpTopic({
                    ...selectedHelpTopic,
                    lable: item?.label,
                    value: item?.value,
                    id: item?.id,
                  });
                  setSelectedSubTopic("");
                }}
                renderLeftIcon={() => (
                  <Image
                    style={{
                      width: moderateScale(width / 22),
                      height: moderateScale(width / 22),
                    }}
                    source={imagePath?.helpTopic}
                  />
                )}
              />
            )}
          </View>
          <View style={styles.inputContainerStyle}>
            {/* <Text style={styles.lableStyle}>{strings.SUB_HELP_TOPIC}</Text> */}
            {helpTopic?.id ? (
              <TextInputComp
                editable={false}
                inputStyle={styles.editableInputStyle}
                placeholder={strings.HELP_TOPIC}
                textInputContainer={styles.textInputContainer}
                autoCapitalize={"none"}
                // onChangeText={email => setFeedback({...feedback, email: email})}
                value={helpTopic?.subTopicName}
                icon={imagePath.helpTopic}
              />
            ) : (
              <Dropdown
                style={styles.dropdown}
                renderItem={(item) => (
                  <View
                    style={{
                      marginVertical: moderateScaleVertical(5),
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.itemStyle}>{item?.label}</Text>
                  </View>
                )}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                // inputSearchStyle={styles.inputSearchStyle}
                placeholder={strings.SUB_HELP_TOPIC}
                selectedTextProps={{ numberOfLines: 1 }}
                labelField="label"
                maxHeight={200}
                maxWidth={width}
                valueField="value"
                // placeholder={strings.}
                data={subTopicIssueList}
                value={selectedSubTopic?.lable}
                onChange={(item) => {
                  setSelectedSubTopic({
                    ...selectedSubTopic,
                    lable: item?.label,
                    value: item?.value,
                    id: item?.id,
                  });
                }}
                renderLeftIcon={() => (
                  <Image
                    style={{
                      width: moderateScale(width / 22),
                      height: moderateScale(width / 22),
                    }}
                    source={imagePath?.helpTopic}
                  />
                )}
              />
            )}
          </View>
          <View style={styles.inputContainerStyle}>
            {/* <Text style={styles.lableStyle}>{strings.SUBJECT}</Text> */}
            <TextInputComp
              editable={reopenTicket ? false : true}
              inputStyle={styles.editableInputStyle}
              placeholder="Subject"
              textInputContainer={styles.textInputContainer}
              autoCapitalize={"none"}
              onChangeText={(text) => {
                setFeedback({ ...feedback, subject: text });
              }}
              value={reopenTicket ? helpTopicDetails?.subject : subject}
              multiline={false}
              numberOfLines={1}
              maxLength={40}
              icon={imagePath.subject}
            />
          </View>
          <View style={styles.inputContainerStyle}>
            {/* <Text style={styles.lableStyle}>{strings.SUBJECT}</Text> */}
            <TextInputComp
              editable={true}
              inputStyle={styles.editableInputStyle}
              placeholder="Topic Detail"
              textInputContainer={styles.textInputContainer}
              autoCapitalize={"none"}
              onChangeText={(text) =>
                setFeedback({ ...feedback, topicDetails: text })
              }
              value={topicDetails}
              multiline={true}
              numberOfLines={3}
              maxLength={110}
              icon={imagePath.topicDetails}
            />
          </View>
          {/* <Text style={styles.issueHeading}>{selectedIssue}</Text> */}
          {/* <View style={styles.inputContainerStyle}>
            <Text style={styles.lableStyle}>{strings.COMMENTS}</Text> */}
          {/* <TextInputComp
            // editable={false}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.editableInputStyle}
            placeholder={strings.COMMENTS}
            textInputContainer={styles.textInputContainer}
            autoCapitalize={'none'}
            multiline={true}
            numberOfLines={3}
            maxLength={110}
            onChangeText={text => setFeedback({...feedback, topicDetails: text})}
            value={topicDetails}
          /> */}
          {/* </View> */}
          <View style={styles.uploadFileContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => refRBSheet.current.open()}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Image
                source={
                  feedback?.fileImg
                    ? { uri: DOC_URL + feedback?.fileImg }
                    : imagePath.uploadFile
                }
                style={
                  feedback?.fileImg
                    ? styles.uploadFileImg
                    : { ...styles.uploadFileImg, tintColor: colors.darkBlue }
                }
              />

              <Text style={styles.browseText}>
                {feedback?.fileName ? feedback?.fileName : "Browse File"}
              </Text>
            </TouchableOpacity>
            {feedback?.fileName ? (
              <TouchableOpacity
                onPress={() =>
                  setFeedback({ ...feedback, fileImg: "", fileName: "" })
                }
              >
                <Image source={imagePath.close_red} style={styles.iconStyle} />
              </TouchableOpacity>
            ) : null}
          </View>
          <ButtonComp
            btnText={strings.SUBMIT}
            btnStyle={styles.submitBtnStyle}
            btnTextStyle={styles.submitBtnTextStyle}
            onPress={reopenTicket ? reopenTicketFun : _raiseComplaint}
          />
        </View>
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={styles.bottomSheetStyle}
      >
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.selectItemText}>
            {strings.SELECT_ITEM}
            {/* {item?.item} */}
          </Text>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => _openCamera()}
          >
            <Image source={imagePath.cameraIcon} />
            <Text style={styles.itemTextStyle}>{strings.OPEN_CAMERA}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => _openGallery()}
          >
            <Image source={imagePath.folderIcon} />
            <Text style={styles.itemTextStyle}>{strings.OPEN_GALLERY}</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  bodyContainer: {
    backgroundColor: colors.white,
    marginHorizontal: moderateScale(10),
    flex: 0.99,
    marginTop: moderateScaleVertical(-90),
    borderRadius: moderateScale(5),
    paddingHorizontal: moderateScale(20),
  },
  // inputBoxConatiner:{
  //   flex:1,
  //   marginHorizontal:moderateScale(20),
  //   // marginTop:moderateScaleVertical(20),
  // },
  textInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: moderateScale(0.3),
    borderBottomColor: colors.mediumGray,
  },
  inputContainerStyle: {
    marginTop: moderateScaleVertical(20),
    borderBottomWidth: moderateScale(0.3),
    borderBottomColor: colors.mediumGray,
  },
  desaibleInputStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.darkGray,
    flex: 1,
    paddingHorizontal: moderateScale(0),
    paddingVertical: moderateScaleVertical(10),
    marginLeft: moderateScale(15),
  },
  editableInputStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    flex: 1,
    paddingHorizontal: moderateScale(0),
    paddingVertical: moderateScaleVertical(10),
    marginLeft: moderateScale(15),
    // marginTop: moderateScaleVertical(5),
  },
  lableStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    textTransform: "capitalize",
    // marginTop: moderateScaleVertical(5),
  },
  uploadFileContainer: {
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(8),
    marginTop: moderateScaleVertical(30),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: moderateScaleVertical(10),
    borderStyle: "dashed",
    borderColor: colors.gray,
    paddingHorizontal: moderateScale(24),
  },
  uploadFileImg: {
    width: moderateScale(width / 10),
    height: moderateScale(width / 10),
    // marginBottom: moderateScaleVertical(5),
    marginRight: moderateScale(10),
    // tintColor:colors.darkBlue
  },
  iconStyle: {
    width: moderateScale(width / 22),
    height: moderateScale(width / 22),
  },
  uploadFileText: {
    color: colors.gray,
    fontSize: textScale(12),
    textAlign: "center",
    fontFamily: fontFamily.robotoRegular,
    // textTransform: '',
  },
  browseText: {
    color: colors.gray,
    fontSize: textScale(12),
    textAlign: "center",
    fontFamily: fontFamily.robotoMedium,
    // textDecorationLine: 'underline',
    lineHeight: moderateScaleVertical(20),
  },
  submitBtnStyle: {
    paddingVertical: moderateScaleVertical(8),
    paddingHorizontal: moderateScale(30),
    borderRadius: moderateScale(20),
    alignSelf: "center",
    marginTop: moderateScaleVertical(30),
    width: moderateScale(width / 1.5),
    backgroundColor: colors.darkBlue,
  },
  submitBtnTextStyle: {
    color: colors.white,
    fontSize: textScale(15),
    textAlign: "center",
    fontFamily: fontFamily.robotoMedium,
    textTransform: "uppercase",
  },
  issueHeading: {
    fontSize: textScale(14),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    marginTop: moderateScaleVertical(40),
  },
  dropdown: {
    borderBottomColor: colors.mediumGray,
    borderBottomWidth: moderateScale(0.3),
    // marginTop:moderateScaleVertical(20)
  },
  itemStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    marginLeft: moderateScale(15),
    marginTop: moderateScaleVertical(5),
  },
  placeholderStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.darkGray,
    marginLeft: moderateScale(15),
  },
  selectedTextStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    marginLeft: moderateScale(15),
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
  menuItemsStyleSecond: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(20),
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
});

export default WriteToUs;

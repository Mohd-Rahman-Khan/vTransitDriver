import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import WrapperContainer from "../../../Components/WrapperContainer";
import { styles } from "./styles";
import HeaderComp from "../../../Components/HeaderComp";
import strings from "../../../constants/lang";
import imagePath from "../../../constants/imagePath";
import {
  getItem,
  getUserData,
  removeUserData,
  setItem,
} from "../../../utils/utils";
import { showSuccess, showError } from "../../../utils/helperFunction";
import actions from "../../../redux/actions";
import { useSelector } from "react-redux";
//import Modal from 'react-native-modal';
import { useNavigation } from "@react-navigation/native";
import colors from "../../../styles/colors";
import ButtonComp from "../../../Components/ButtonComp";
import RBSheet from "react-native-raw-bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../../styles/responsiveSize";
import fontFamily from "../../../styles/fontFamily";
import DefaultMapComp from "../../../Components/DefaultMapComp";
import DeviceInfo from "react-native-device-info";
import {
  ASSOCIATE_CORPORATE,
  ASSOCIATE_CORPORATE_AND_VENDOR,
} from "../../../config/urls";
import { Dropdown } from "react-native-element-dropdown";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState("");
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [corporateList, setcorporateList] = useState([]);
  const deleteBottomSheet = useRef();
  const logoutBottomSheet = useRef();

  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );
  const showDefaultButton = useRef();
  useEffect(() => {
    getItem("loginType").then((res) => {
      if (res != null) {
        setLoginType(res);
      }
    });
  }, []);

  useEffect(() => {
    getCorporateList();
  }, []);

  const getCorporateList = () => {
    actions
      .corporateList(
        `${ASSOCIATE_CORPORATE_AND_VENDOR}?driverId=${profileData?.id}`
      )
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data?.associatedCorporateList?.length > 0) {
            setcorporateList(res?.data?.associatedCorporateList);
          } else {
            setcorporateList([]);
          }
        } else {
        }
      })
      .catch((err) => {});
  };

  const sendLogoutStatus = () => {
    return new Promise(async (resolve, reject) => {
      let data = {
        ipAddress: await DeviceInfo.getIpAddress().then((ip) => {
          return ip;
        }),
        deviceType: "mobile",
        deviceName: await DeviceInfo.getDeviceName().then((deviceName) => {
          return deviceName;
        }),
        oS: Platform?.OS,
        activeStatus: "NO",
      };

      actions
        .saveDeviceDetail(data)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          resolve(res);
        });
    });
  };
  const logout = async () => {
    ////====================
    AsyncStorage.removeItem("loginUserType2");
    AsyncStorage.removeItem("DynamicETA");
    AsyncStorage.removeItem("mapType");
    AsyncStorage.removeItem("DriverCurrentPoint");
    AsyncStorage.removeItem("DriverLastPoint");

    actions.logout();
    actions.logoutAccount(`${profileData?.id}`);
    showSuccess("Logout successfully");
    removeUserData("loginType");
  };

  const _deleteAccount = async () => {
    setLoading(true);

    setIsVisible(false);
    await actions
      .deleteDriverAccount(`${profileData?.id}/null`)
      .then((response) => {
        let { status } = response;

        if (status == 200) {
          setLoading(false);

          AsyncStorage.removeItem("loginUserType2");
          AsyncStorage.removeItem("DynamicETA");
          AsyncStorage.removeItem("mapType");
          AsyncStorage.removeItem("DriverCurrentPoint");
          AsyncStorage.removeItem("DriverLastPoint");

          actions.logout();
          actions.logoutAccount(`${profileData?.id}`);
          showSuccess("Your account has been deleted.");
          removeUserData("loginType");
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const setDefaultMapType = (type) => {
    let selectionTypeData = { selectionType: type };
    AsyncStorage.setItem("mapType", JSON.stringify(selectionTypeData));
    showSuccess("Default map set successfully.");
    showDefaultButton.current.close();
  };

  const changeCorporate = async (selectedItem) => {
    setLoading(true);

    await actions
      .changeCorporate(`${profileData?.id}/${selectedItem?.id}`)
      .then((response) => {
        let { status } = response;
        if (status == 200) {
          setLoading(false);
          showSuccess("Corrporate changed successfully.");
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  return (
    <WrapperContainer isLoading={loading} withModal={loading}>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <HeaderComp title={strings.SETTINGS} icon={true} />
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.settingMenuHeaderContainer}>
            <Text style={styles.settingMenuHeaderText}>
              {strings.USER_ACCOUNT}
            </Text>
            <View style={styles.settingMenuItemContainer}>
              <View style={styles.settingMenuItemLeftContainer}>
                <Image
                  source={imagePath.logout}
                  style={styles.settingMenuItemLeftIcon}
                  resizeMode={"contain"}
                />
                <Text style={styles.settingMenuItemLeftText}>
                  {strings.LOGOUT}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.settingMenuItemRightBtn}
                activeOpacity={0.7}
                onPress={() => logoutBottomSheet.current.open()}
              >
                <Text style={styles.settingMenuItemRightBtnText}>
                  {strings.LOGOUT}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.settingMenuItemContainer}>
              <View style={styles.settingMenuItemLeftContainer}>
                <Image
                  source={imagePath.removeIcon}
                  style={styles.settingMenuItemLeftIcon}
                  resizeMode={"contain"}
                />
                <Text style={styles.settingMenuItemLeftText}>
                  {strings.DELETE_ACCOUNT}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.settingMenuItemDeleteAccountBtn}
                activeOpacity={0.7}
                onPress={() => deleteBottomSheet.current.open()}
              >
                <Text style={styles.settingMenuItemDeleteAccountBtnText}>
                  {strings.DELETE}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.settingMenuItemContainer}>
              <View style={styles.settingMenuItemLeftContainer}>
                <Image
                  source={imagePath.google_maps}
                  style={styles.settingMenuItemLeftIcon}
                  resizeMode={"contain"}
                />
                <Text style={styles.settingMenuItemLeftText}>Default Map</Text>
              </View>

              <TouchableOpacity
                style={styles.settingMenuItemRightBtn}
                activeOpacity={0.7}
                onPress={() => showDefaultButton.current.open()}
              >
                <Text style={styles.settingMenuItemRightBtnText}>Change</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.settingMenuItemContainer}>
              <Dropdown
                style={{
                  flex: 1,
                  //borderBottomColor: colors.lightGary,
                  //borderBottomWidth: moderateScale(1.5),
                  // marginHorizontal:moderateScale(20),
                  //marginBottom: moderateScaleVertical(0),
                  height: 30,
                  //backgroundColor: colors.lightGary,
                  borderRadius: 5,
                }}
                renderItem={(item) => (
                  <View
                    style={{
                      marginVertical: moderateScaleVertical(5),
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        fontSize: textScale(14),
                        fontFamily: fontFamily.robotoRegular,
                        color: colors.black,
                        // marginLeft: moderateScale(8),
                        marginVertical: moderateScaleVertical(5),
                        marginLeft: moderateScale(10),
                      }}
                    >
                      {item?.companyName}
                    </Text>
                  </View>
                )}
                placeholderStyle={{
                  fontSize: textScale(12),
                  fontFamily: fontFamily.robotoMedium,
                  color: colors.mediumGray,
                  marginHorizontal: moderateScale(10),
                }}
                selectedTextStyle={[
                  styles.settingMenuItemLeftText,
                  { marginLeft: moderateScale(10) },
                ]}
                inputSearchStyle={styles.inputSearchStyle}
                labelField="companyName"
                maxHeight={500}
                valueField="id"
                iconColor={colors.darkGray}
                data={corporateList}
                value={profileData?.corporateId}
                placeholder={"Select Corporate"}
                onChange={(item) => {
                  changeCorporate(item);
                }}
                renderLeftIcon={() => (
                  <View style={{ marginRight: 5 }}>
                    <Image
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: colors.gray,
                      }}
                      source={imagePath.vendor}
                      resizeMode="contain"
                    />
                  </View>
                )}
              />
            </View> */}
          </View>
        </View>
      </View>

      <DefaultMapComp
        showDefaultButton={showDefaultButton}
        setDefaultMap={(type) => {
          setDefaultMapType(type);
        }}
      />
      <RBSheet
        ref={deleteBottomSheet}
        height={moderateScaleVertical(height / 3)}
        customStyles={styles.bottomSheetStyle}
      >
        <View style={styles.bottomSheetContainerStyle}>
          <View style={styles.rowContainer}>
            <View style={{ flex: 0.8 }}>
              <Text style={styles.headingStyle_1}>{strings.DO_YOU_WANT}</Text>
              <Text style={styles.headingStyle_2}>
                {strings.TO_DELETE_ACCOUNT}
              </Text>
              <Text style={styles.textStyle}>
                {strings.DELETE_ACCOUNT_WILL_REMOVE_ALL_YOUR_DATA}
              </Text>
            </View>
            <View style={{ flex: 0.2 }}>
              <Image source={imagePath.danger} style={styles.dangerImg} />
            </View>
          </View>

          <ButtonComp
            btnText={strings.CONFIRM_DELETE_ACCOUNT}
            btnStyle={styles.deleteAccountBtnStyle}
            btnTextStyle={styles.deleteAccountBtnTextStyle}
            onPress={() => _deleteAccount()}
          />
          <ButtonComp
            btnText={strings.CANCEL}
            btnStyle={styles.cancleBtnStyle}
            btnTextStyle={styles.cancleBtnTextStyle}
            onPress={() => deleteBottomSheet.current.close()}
          />
        </View>
      </RBSheet>
      <RBSheet
        ref={logoutBottomSheet}
        height={moderateScaleVertical(height / 3)}
        customStyles={styles.bottomSheetStyle}
      >
        <View style={styles.bottomSheetContainerStyle}>
          <View style={styles.rowContainer}>
            <View style={{ flex: 0.8 }}>
              <Text style={styles.headingStyle_1}>
                {strings.DO_YOU_WANT_TO_SIGN_OUT}
              </Text>
              <Text style={styles.textStyle}>
                {strings.STAY_SIGNED_IN_FOR_INFORMATIONS}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              marginTop: moderateScaleVertical(50),
              backgroundColor: colors.darkBlue,
              borderRadius: moderateScale(4),
            }}
            onPress={() => logout()}
            //disabled={disabled}
          >
            <Text
              style={{
                color: colors.white,
                fontFamily: fontFamily.robotoRegular,
                fontSize: textScale(14),
                textAlign: "center",
                paddingVertical: moderateScaleVertical(10),
              }}
            >
              {strings.CONFIRM_SIGN_OUT}
            </Text>
          </TouchableOpacity>

          {/* <ButtonComp
            btnText={strings.CONFIRM_SIGN_OUT}
            btnStyle={styles.logoutAccountBtnStyle}
            btnTextStyle={styles.logoutAccountBtnTextStyle}
            onPress={() => logout()}
          /> */}
          <ButtonComp
            btnText={strings.CANCEL}
            btnStyle={styles.cancleBtnStyle}
            btnTextStyle={styles.cancleBtnTextStyle}
            onPress={() => logoutBottomSheet.current.close()}
          />
        </View>
      </RBSheet>
    </WrapperContainer>
  );
};

export default Settings;

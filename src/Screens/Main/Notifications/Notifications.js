import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import React from "react";
import WrapperContainer from "../../../Components/WrapperContainer";
import HeaderComp from "../../../Components/HeaderComp";
import colors from "../../../styles/colors";
import fontFamily from "../../../styles/fontFamily";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
  height,
} from "../../../styles/responsiveSize";
import strings from "../../../constants/lang";
import imagePath from "../../../constants/imagePath";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import actions from "../../../redux/actions";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import navigationStrings from "../../../navigation/navigationStrings";
import NavigationServices from "../../../navigation/NavigationServices";
import ScreensHeader from "../../../Components/ScreensHeader";

const Notifications = () => {
  const navigation = useNavigation();
  const [notifyList, setNotifyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );
  const userData = useSelector((state) => state?.userData?.userData?.data);

  useEffect(() => {
    _getNotification();
  }, []);
  const _getNotification = () => {
    setLoading(true);
    actions
      .getAllNotification(profileData?.id)
      .then((res) => {
        let { status } = res;
        if (status == 200) {
          setNotifyList(res?.data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const navigationNotifyFun = (item) => {
    if (item?.title?.toUpperCase().trim() === "TRIP DETAILS") {
      navigation.navigate(navigationStrings.YOUR_RIDES);
    } else if (item?.title?.toUpperCase().trim() === "TRIP STARTED") {
      navigation.navigate(navigationStrings.LIVE_TRACKING);
    } else if (item?.title?.toUpperCase().trim() === "VERIFY AND UPDATE") {
      navigation.navigate(navigationStrings.VERIFY_AND_UPDATE_SECOND);
    } else if (item?.title?.toUpperCase().trim() === "DOCUMENT") {
      navigation.navigate(navigationStrings.COMPLIANCE);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.notificationsContainer}
        onPress={() => navigationNotifyFun(item)}
      >
        <Image
          source={
            item?.title?.toUpperCase().trim() === "TRIP DETAILS" ||
            item?.title?.toUpperCase().trim() === "TRIP STARTED"
              ? imagePath.trip_notify
              : item?.title?.toUpperCase().trim() === "VERIFY AND UPDATE"
              ? imagePath.account_notify
              : item?.title?.toUpperCase().trim() === "DOCUMENT"
              ? imagePath.notification_notify
              : imagePath.notification_notify
          }
          style={styles.notificationsIcon}
          resizeMode={"contain"}
        />
        <View style={styles.navigationMsgContainer}>
          <Text style={styles.navigationMsgText} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.dateStyle}>
            {moment(item?.time).format("DD MMM,HH:mm ")}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <WrapperContainer isLoading={loading} withModal={true}>
      <View style={styles.mainContainer}>
        <ScreensHeader navigation={navigation} title={strings.NOTIFICATIONS} />
        <View style={styles.bodyContainer}>
          {notifyList.length ? (
            <FlatList
              data={notifyList}
              contentContainerStyle={styles.renderItemStyle}
              showsVerticalScrollIndicator={false}
              renderItem={(element, index) => renderItem(element, index)}
              keyExtractor={(item) => item?.id}
              onEndReachedThreshold={0.1}
              onScrollToTop={false}
            />
          ) : (
            <View style={styles.noRecordContainer}>
              <Text style={styles.noRecordText}>{strings.NO_RECORD_FOUND}</Text>
            </View>
          )}
        </View>
      </View>
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
    paddingVertical: moderateScaleVertical(10),
    flex: 1,
    marginTop: moderateScaleVertical(-90),
    borderRadius: moderateScale(4),
  },
  notificationsContainer: {
    borderBottomColor: colors.lightGray,
    borderBottomWidth: moderateScale(0.5),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScaleVertical(10),
    flex: 1,
  },
  notificationsIcon: {
    width: moderateScale(width / 15),
    height: moderateScale(width / 15),
    flex: 0.1,
  },
  navigationMsgContainer: {
    marginLeft: moderateScale(12),
    flex: 0.9,
  },
  navigationMsgText: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
  },
  dateStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoRegular,
    color: colors.gray,
    marginTop: moderateScaleVertical(5),
  },
  noRecordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noRecordText: {
    fontSize: textScale(16),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
  },
});
export default Notifications;

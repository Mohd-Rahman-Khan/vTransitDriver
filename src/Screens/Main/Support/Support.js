import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderComp from "../../../Components/HeaderComp";
import WrapperContainer from "../../../Components/WrapperContainer";
import { DOC_URL, GET_PAST_RIDE } from "../../../config/urls";
import imagePath from "../../../constants/imagePath";
import strings from "../../../constants/lang";
import navigationStrings from "../../../navigation/navigationStrings";
import actions from "../../../redux/actions";
import { moderateScale } from "../../../styles/responsiveSize";
import { styles } from "./styles";
import RideComp from "../../../Components/RideComp";
import colors from "../../../styles/colors";
import { useSelector } from "react-redux";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import SimCardsManagerModule from "react-native-sim-cards-manager";
import { showError } from "../../../utils/helperFunction";
const Support = ({ route }) => {
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );
  const initialBack = route?.params?.initialBack;
  const isFocus = useIsFocused();
  const navigation = useNavigation();
  const [helpTopicsList, setHelpTopicsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pastRideData, setpastRideData] = useState([]);
  const [yourTickets, setYourTickets] = useState([]);
  const getModulePermissionData = useSelector(
    (state) => state?.modulePermission?.modulePermissionData
  );
  const [isCreatePermAllow, setisCreatePermAllow] = useState(false);
  useEffect(() => {
    if (isFocus) {
      _getHelpTopics();
      _getPastTrip();
      _getYourTickets();
      getPermission();
    }
  }, [isFocus]);

  const getPermission = () => {
    let checkSupport = getModulePermissionData?.permissions?.find(
      (item) => item?.moduleName == "Support"
    );

    if (checkSupport) {
      if (checkSupport?.actions) {
        let findCreatePerms = checkSupport?.actions?.find(
          (itemData) => itemData == "Create"
        );
        if (findCreatePerms) {
          setisCreatePermAllow(true);
        } else {
          setisCreatePermAllow(false);
        }
      } else {
        setisCreatePermAllow(false);
      }
    } else {
      setisCreatePermAllow(false);
    }
  };

  const _getHelpTopics = () => {
    actions
      .getHelpTopics()
      .then((response) => {
        let { status } = response;
        if (status == 200) {
          setHelpTopicsList(response?.data?.body?.HelpTopicList);
        }
      })
      .catch((error) => {});
  };

  const goToSelectedIssue = (item) => {
    navigation.navigate(navigationStrings.SELECTED_SUPPORT_ISSUE, {
      selectedIssue: item,
    });
  };

  const _getYourTickets = () => {
    actions
      .getYourTickets()
      .then((response) => {
        setYourTickets(response?.data);
      })
      .catch((error) => {});
  };

  const _getPastTrip = () => {
    setLoading(true);
    actions
      .getRide(`${GET_PAST_RIDE}?page=0&size=1`)
      .then((response) => {
        if (response.status === 200) {
          if (response?.data?.body?.TripList?.length > 0) {
            let arr = response?.data?.body?.TripList.map((item) => {
              item.isVisible = true;

              return { ...item };
            });

            setpastRideData(arr);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const getVendoerDetail = () => {
    actions
      .getVendorDetail(profileData?.vendorId)
      .then((response) => {
        if (response.status == 200) {
          if (Platform.OS === "android") {
            getSimnumbers(response?.data?.mobileNo);
          } else {
            let number = "";
            number = `tel:${response?.data?.mobileNo}`;
            Linking.openURL(number);
          }
        } else {
          showError("Network error.");
        }
      })
      .catch((error) => {
        showError("Network error.");
      });
  };
  const getCorpAdminDetail = () => {
    actions
      .getCorpAdminDetail(profileData?.corporateId)
      .then((response) => {
        if (response.status == 200) {
          if (Platform.OS === "android") {
            getSimnumbers(response?.data?.mobileNo);
          } else {
            let number = "";
            number = `tel:${response?.data?.mobileNo}`;
            Linking.openURL(number);
          }
        } else {
          showError("Network error.");
        }
      })
      .catch((error) => {
        showError("Network error.");
      });
  };
  const getSimnumbers = (mobNumber) => {
    SimCardsManagerModule.getSimCards({
      title: "vTransit Driver",
      message: "vTransit want to access your app for calling.",
      buttonNeutral: "Not now",
      buttonNegative: "Not OK",
      buttonPositive: "OK",
    })
      .then((array) => {
        if (array) {
          if (array.length == 1) {
            RNImmediatePhoneCall.immediatePhoneCall(mobNumber);
          } else {
            let number = "";
            number = `tel:${mobNumber}`;
            Linking.openURL(number);
          }
        } else {
          let number = "";
          number = `tel:${mobNumber}`;
          Linking.openURL(number);
        }
      })
      .catch((error) => {
        let number = "";
        number = `tel:${mobNumber}`;
        Linking.openURL(number);
      });
  };
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={item?.id}
        style={styles.issuesMenu}
        activeOpacity={0.7}
        onPress={() => {
          if (index == 0) {
            navigation.navigate(navigationStrings.FILTERED_RIDE, {
              tripType: "past",
              helpTopicDetails: item,
            });
          } else {
            goToSelectedIssue(item);
          }
        }}
      >
        <View style={styles.issuesMenuLeftContainer}>
          <Image
            source={{ uri: DOC_URL + item?.file }}
            style={styles.topicIcon}
          />
          <View style={{ marginLeft: moderateScale(15) }}>
            <Text style={styles.issuesMenuTitle}>{item.topicName}</Text>
            <Text style={styles.issuesMenuDiscription}>
              {item.topicDetails}
            </Text>
          </View>
        </View>
        <Image
          style={styles.rightArrowIcon}
          source={imagePath.rightArrowIcon}
        />
      </TouchableOpacity>
    );
  };
  return (
    <WrapperContainer>
      <View style={styles.mainContainer}>
        <HeaderComp title="Supports" icon={true} />
        <ScrollView
          style={styles.bodyContainer}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <View style={styles.bodyHeaderStyle}>
            <View style={styles.bodyHeaderTopStyle}>
              <View style={styles.bodyHeaderTopLeftStyle}>
                <Text style={styles.needHelpHeading}>
                  Need help with your rides ?
                </Text>
                <Text style={styles.needHelpText}>
                  Select a ride to get help with your driver or other ride
                  issues
                </Text>
              </View>
              <View style={styles.bodyHeaderTopRightStyle}>
                <Image
                  source={imagePath.support_img}
                  style={styles.supportImg}
                />
              </View>
            </View>
            {pastRideData?.length > 0 ? (
              <RideComp item={pastRideData[0]} />
            ) : null}

            {pastRideData?.length > 0 ? (
              <TouchableOpacity
                style={styles.viewAllRidesBtn}
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate(navigationStrings.FILTERED_RIDE);
                }}
              >
                <Text style={styles.viewAllRidesText}>View All Rides</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {yourTickets?.length ? (
            <View style={styles.bodyCenterStyle}>
              <Text style={styles.yourComplaintsHeading}>
                {strings.YOUR_COMPLAINTS}
              </Text>
              <View style={styles.complaintsContainer}>
                <View style={styles.complaintsLeftContainer}>
                  <Image
                    source={imagePath.ticketIcon}
                    style={styles.complaintsIcon}
                  />
                  <Text style={styles.complaintsText}>
                    {yourTickets?.[0]?.subject}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate(navigationStrings.TICKET_LISTING, {
                      yourTickets: yourTickets,
                    })
                  }
                >
                  <Image
                    source={imagePath.rightArrowIcon}
                    style={styles.rightArrowIcon}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.viewAllComplaintsBtn}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate(navigationStrings.TICKET_LISTING, {
                    yourTickets: yourTickets,
                  })
                }
              >
                <Text style={styles.viewAllComplaintsText}>
                  {strings.VIEW_ALL}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={styles.bodyBottomStyle}>
            <Text style={styles.otherHelpText}>
              {strings.OTHER_HELP_TOPICS}
            </Text>
            {helpTopicsList?.length > 0
              ? helpTopicsList.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={item?.id}
                      style={styles.issuesMenu}
                      activeOpacity={0.7}
                      onPress={() => {
                        if (index == 0) {
                          navigation.navigate(navigationStrings.FILTERED_RIDE, {
                            tripType: "past",
                            helpTopicDetails: item,
                          });
                        } else {
                          goToSelectedIssue(item);
                        }
                      }}
                    >
                      <View style={styles.issuesMenuLeftContainer}>
                        <Image
                          source={{ uri: DOC_URL + item?.file }}
                          style={styles.topicIcon}
                        />
                        <View style={{ marginLeft: moderateScale(15) }}>
                          <Text style={styles.issuesMenuTitle}>
                            {item.topicName}
                          </Text>
                          <Text style={styles.issuesMenuDiscription}>
                            {item.topicDetails}
                          </Text>
                        </View>
                      </View>
                      <Image
                        style={styles.rightArrowIcon}
                        source={imagePath.rightArrowIcon}
                      />
                    </TouchableOpacity>
                  );
                })
              : null}
            <TouchableOpacity
              key={1}
              style={[styles.issuesMenu]}
              activeOpacity={0.7}
              onPress={() => {
                if (isCreatePermAllow) {
                  navigation.navigate(navigationStrings.WRITE_TO_US, {
                    isRide: "NO",
                  });
                }
              }}
            >
              <View style={styles.issuesMenuLeftContainer}>
                <Image
                  source={imagePath.skyCircleIcon}
                  style={styles.skyCircleIcon}
                />
                <View style={{ marginLeft: moderateScale(15) }}>
                  <Text style={styles.issuesMenuTitle}>
                    {strings.WRITE_TO_US}
                  </Text>
                </View>
              </View>
              <Image
                style={styles.rightArrowIcon}
                source={imagePath.rightArrowIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              key={2}
              style={[styles.issuesMenu]}
              activeOpacity={0.7}
              onPress={() => {
                Alert.alert("Help Desk", "Are you sure you want to call?", [
                  {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  { text: "Yes", onPress: () => getCorpAdminDetail() },
                ]);
              }}
            >
              <View style={styles.issuesMenuLeftContainer}>
                <Image
                  source={imagePath.helpDesk}
                  style={styles.skyCircleIcon}
                />
                <View style={{ marginLeft: moderateScale(15) }}>
                  <Text style={styles.issuesMenuTitle}>Help Desk</Text>
                </View>
              </View>
              <View style={styles.iconBox}>
                <Image style={styles.rightArrowIcon} source={imagePath.call} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              key={3}
              style={[styles.issuesMenu, { marginBottom: 70 }]}
              activeOpacity={0.7}
              onPress={() => {
                Alert.alert("Help Desk", "Are you sure you want to call?", [
                  {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  { text: "Yes", onPress: () => getVendoerDetail() },
                ]);
              }}
            >
              <View style={styles.issuesMenuLeftContainer}>
                <Image
                  source={imagePath.helpDesk}
                  style={styles.skyCircleIcon}
                />
                <View style={{ marginLeft: moderateScale(15) }}>
                  <Text style={styles.issuesMenuTitle}>Call Vendor</Text>
                </View>
              </View>
              <View style={styles.iconBox}>
                <Image style={styles.rightArrowIcon} source={imagePath.call} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </WrapperContainer>
  );
};

export default Support;

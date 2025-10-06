import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import WrapperContainer from "../../../Components/WrapperContainer";
import colors from "../../../styles/colors";
import { styles } from "./style";
import imagePath from "../../../constants/imagePath";
import ButtonComp from "../../../Components/ButtonComp";
import strings from "../../../constants/lang";
import navigationStrings from "../../../navigation/navigationStrings";
import { Rating, AirbnbRating } from "react-native-ratings";
import { Dropdown } from "react-native-element-dropdown";
import Moment from "moment";
import { extendMoment } from "moment-range";
import Tooltip from "react-native-walkthrough-tooltip";

const moment = extendMoment(Moment);

import {
  moderateScale,
  moderateScaleVertical,
  width,
  textScale,
} from "../../../styles/responsiveSize";
import actions from "../../../redux/actions";
import {
  GET_PAST_RIDE,
  DRIVER_ONGOING_RIDE,
  DRIVER_SCHEDULED_RIDE,
} from "../../../config/urls";
import { showError } from "../../../utils/helperFunction";
import fontFamily from "../../../styles/fontFamily";
import { getDelayOrEarlyMinutes } from "../../../utils/utils";
import RideComp from "../../../Components/RideComp";
import InfoSheet from "../../../Components/InfoSheet";
const infoList = [
  {
    icon: imagePath.upTrip,
    name: "Login Shift",
  },
  {
    icon: imagePath.downTrip,
    name: "Logout Shift",
  },
  {
    icon: imagePath.escort,
    name: "Escort Trip",
  },
  {
    icon: imagePath.absentTripIcon,
    name: "Employee Absent Trip",
  },
  {
    icon: imagePath.cancelledTripIcon,
    name: "Employee Cancel Trip",
  },
  {
    icon: imagePath.noShowTripIcon,
    name: "Noshow Employee Trip",
  },
  {
    icon: imagePath.expiredTripIcon,
    name: "Expired",
  },
  {
    icon: imagePath.earlyIcon,
    name: "Early Trip",
  },
  {
    icon: imagePath.delayIcon,
    name: "Delay Trip",
  },
  {
    icon: imagePath.check_mark_circle,
    name: "Ontime Trip",
  },
  {
    icon: imagePath.avtarIcon,
    name: "Total employee",
  },
  {
    icon: imagePath.adhocBlackIcon,
    name: "Adhoc Trip",
  },
];

export default function YourRides({ route, navigation }) {
  const [selectRideType, setSelectRideType] = useState("Live/Upcoming");
  const [currentRide, setcurrentRide] = useState([]);
  const [pastRide, setpastRide] = useState([]);
  const [upcomingRide, setupcomingRide] = useState([]);
  const [corporateList, setcorporateList] = useState([]);
  const [vendorList, setvendorList] = useState([]);
  const [corporateName, setcorporateName] = useState("");
  const [vendorName, setvendorName] = useState("");
  const [showInfoList, setshowInfoList] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setisLoadingMore] = useState(false);
  const [noMoreText, setnoMoreText] = useState(false);
  const infoSheet = useRef();

  const ridesType = [
    {
      label: "Live/Upcoming",
      value: "Live/Upcoming",
    },
    {
      label: "Completed",
      value: "Completed",
    },
  ];

  useEffect(() => {
    setisLoading(true);
    //getPastRide();
    getCurrentRide();
    getUpcomingRide();
  }, []);

  const getUpcomingRide = () => {
    actions
      .getRide(DRIVER_SCHEDULED_RIDE)
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data?.length > 0) {
            setupcomingRide(res?.data);
          } else {
          }
        } else {
          showError("Something went wrong.");
        }
      })
      .catch((err) => {});
  };

  const getCurrentRide = () => {
    actions
      .getRide(DRIVER_ONGOING_RIDE)
      .then((res) => {
        setisLoading(false);
        if (res?.status === 200) {
          if (res?.data?.length > 0) {
            setcurrentRide(res?.data);
          } else {
          }
        } else {
          showError("Something went wrong.");
        }
      })
      .catch((err) => {
        setisLoading(false);
      });
  };

  const getPastRide = () => {
    actions
      .getRide(`${GET_PAST_RIDE}?page=0&size=10`)
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data?.body?.TripList?.length > 0) {
            let arr = res?.data?.body?.TripList.map((item) => {
              item.isVisible = true;

              return { ...item };
            });

            setpastRide(arr);
            setisLoading(false);
          } else {
            setisLoading(false);
          }
        } else {
          setisLoading(false);
          showError("Something went wrong.");
        }
      })
      .catch((err) => {
        setisLoading(false);
      });
  };

  const loadMore = () => {
    if (isLoadingMore) {
      return;
    }
    setisLoadingMore(true);
    const nextPage = currentPage + 1;

    actions
      .getRide(`${GET_PAST_RIDE}?page=${nextPage}&size=10`)
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data?.body?.TripList?.length > 0) {
            let arr = res?.data?.body?.TripList.map((item) => {
              item.isVisible = true;

              return { ...item };
            });

            setCurrentPage(nextPage);
            setisLoadingMore(false);

            setpastRide([...pastRide, ...arr]);
          } else {
            setnoMoreText(true);
          }
        } else {
        }
      })
      .catch((err) => {});
  };
  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        {isLoadingMore ? (
          noMoreText ? (
            pastRide?.length > 3 ? (
              <Text style={{ color: colors.black, fontSize: 16 }}>
                No More Rides.{" "}
              </Text>
            ) : null
          ) : (
            <ActivityIndicator
              size="large"
              color={colors.black}
              style={{ marginLeft: 8 }}
            />
          )
        ) : null}
      </View>
    );
  };
  const renderItem = ({ item, index }) => {
    return (
      <RideComp
        item={item}
        index={index}
        screen={navigationStrings.YOUR_RIDES}
        onPress={() => {
          navigation.navigate(navigationStrings.TRIP_DETAIL, {
            tripId: item.id,
          });
        }}
      />
    );
  };

  return (
    <WrapperContainer
      bgColor={colors.homeBg}
      isLoading={isLoading}
      withModal={true}
    >
      {showInfoList ? (
        <InfoSheet
          onClose={() => {
            setshowInfoList(false);
          }}
          infoList={infoList}
          infoSheet={infoSheet}
        />
      ) : null}
      <View style={styles.topContainer}>
        <View style={styles.bgImageStyle}>
          <View style={styles.headerConntainer}>
            <View style={styles.backButtonContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  source={imagePath.backArrowIcon}
                  style={styles.backArrowStyle}
                />
              </TouchableOpacity>
              <Text style={styles.headerTitleText}>{strings.YOUR_RIDE}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => {
                  setshowInfoList(true);
                  setTimeout(() => {
                    infoSheet.current.open();
                  }, 1000);
                }}
              >
                <Image
                  source={imagePath.informationIcon}
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: colors.white,
                    marginTop: 20,
                  }}
                />
              </TouchableOpacity>

              <Dropdown
                renderRightIcon={() => {
                  return (
                    <View style={styles.dropdownRightIconContainer}>
                      <Image
                        style={styles.filterIconStyle}
                        source={imagePath.filterIcon}
                      />
                    </View>
                  );
                }}
                style={styles.dropdown}
                renderItem={(item) => (
                  <View style={styles.dropDownRenderItem}>
                    <Text style={styles.itemStyle}>{item.label}</Text>
                  </View>
                )}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                labelField={null}
                maxHeight={200}
                valueField="value"
                placeholder={strings.SELECT_RIDE_TYPE}
                iconColor={colors.darkGray}
                data={ridesType}
                value={selectRideType}
                visibleSelectedItem={false}
                onChange={(item) => {
                  setSelectRideType(item.value);
                  setisLoading(true);
                  if (item.value === "Completed") {
                    getPastRide();
                    setpastRide([]);
                    setCurrentPage(1);
                    setisLoadingMore(false);
                    setnoMoreText(false);
                  } else {
                    getCurrentRide();
                    getUpcomingRide();
                  }
                }}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.contentSectionContainer}>
          {selectRideType === "Completed" ? (
            pastRide?.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={pastRide}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
              />
            ) : (
              <View style={styles.pastRideNotFoundContainer}>
                <Text style={styles.notFoundText}>Record not found.</Text>
              </View>
            )
          ) : (
            <View style={{ flex: 1 }}>
              {currentRide?.length === 0 && upcomingRide?.length === 0 ? (
                <View style={styles.currentRideNotFoundContainer}>
                  <Text style={styles.notFoundText}>Record not found.</Text>
                </View>
              ) : null}
              {currentRide?.length > 0 ? (
                <View style={{}}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={currentRide}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              ) : null}

              <FlatList
                showsVerticalScrollIndicator={false}
                data={upcomingRide}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
        </View>
      </View>
    </WrapperContainer>
  );
}

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
import React, { useEffect, useState, useRef, useCallback } from "react";
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
  ASSOCIATE_VENDOR,
  FILTER_RIDE_API,
  FILTERED_RIDE,
  ASSOCIATE_CORPORATE_AND_VENDOR,
} from "../../../config/urls";
import { showError } from "../../../utils/helperFunction";
import fontFamily from "../../../styles/fontFamily";
import { getDelayOrEarlyMinutes } from "../../../utils/utils";
import RideComp from "../../../Components/RideComp";
import InfoSheet from "../../../Components/InfoSheet";
import FilterRideComp from "../../../Components/FilterRideComp";
import { useSelector } from "react-redux";
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
  const [pastRide, setpastRide] = useState([]);
  const [corporateList, setcorporateList] = useState([]);
  const [vendorList, setvendorList] = useState([]);
  const [corporateData, setcorporateData] = useState("");
  const [vendorData, setvendorData] = useState("");
  const [showInfoList, setshowInfoList] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingMore, setisLoadingMore] = useState(false);
  const [noMoreText, setnoMoreText] = useState(false);
  const [showFilter, setshowFilter] = useState(false);
  const [selectedCorporateList, setselectedCorporateList] = useState([]);
  const [selectedVendorList, setselectedVendorList] = useState([]);
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );
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
    getPastRide();
    getCorporateAndVendorList();
  }, []);

  const getCorporateAndVendorList = () => {
    actions
      .corporateList(
        `${ASSOCIATE_CORPORATE_AND_VENDOR}?driverId=${profileData?.id}`
      )
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data?.associatedCorporateList?.length > 0) {
            //console.log("CORPLIST", res?.data?.associatedVendorList);
            setcorporateList(res?.data?.associatedCorporateList);
          } else {
            setcorporateList([]);
          }

          if (res?.data?.associatedVendorList?.length > 0) {
            setvendorList(res?.data?.associatedVendorList);
          } else {
            setvendorList([]);
          }
        } else {
          //showError("Something went wrong.");
        }
      })
      .catch((err) => {});
  };

  const getPastRide = () => {
    setisLoading(true);
    // actions
    //   .getRide(`${GET_PAST_RIDE}?page=0&size=10`)
    //   .then((res) => {
    //     if (res?.status === 200) {
    //       if (res?.data?.body?.TripList?.length > 0) {
    //         let arr = res?.data?.body?.TripList.map((item) => {
    //           item.isVisible = true;

    //           return { ...item };
    //         });

    //         setpastRide(arr);
    //         setisLoading(false);
    //       } else {
    //         setisLoading(false);
    //       }
    //     } else {
    //       setisLoading(false);
    //       showError("Something went wrong.");
    //     }
    //   })
    //   .catch((err) => {
    //     setisLoading(false);
    //   });

    let rideType;
    if (selectRideType == "Completed") {
      rideType = "NOSHOW,CANCLED,SCHEDULE,COMPLETED,ABSENT";
    } else {
      rideType = "SCHEDULE,STARTED";
    }

    let url = `${FILTERED_RIDE}?corporateId=${selectedCorporateList.join(
      ","
    )}&vendorId=${selectedVendorList.join(
      ","
    )}&status=${rideType}&page=0&size=10`;

    actions
      .getRide(url)
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
            setpastRide([]);
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

    // actions
    //   .getRide(`${GET_PAST_RIDE}?page=${nextPage}&size=10`)
    //   .then((res) => {
    //     if (res?.status === 200) {
    //       if (res?.data?.body?.TripList?.length > 0) {
    //         let arr = res?.data?.body?.TripList.map((item) => {
    //           item.isVisible = true;

    //           return { ...item };
    //         });

    //         setCurrentPage(nextPage);
    //         setisLoadingMore(false);

    //         setpastRide([...pastRide, ...arr]);
    //       } else {
    //         setnoMoreText(true);
    //       }
    //     } else {
    //     }
    //   })
    //   .catch((err) => {});

    let rideType;
    if (selectRideType == "Completed") {
      rideType = "NOSHOW,CANCLED,SCHEDULE,COMPLETED,ABSENT";
    } else {
      rideType = "SCHEDULE,STARTED";
    }

    let url = `${FILTERED_RIDE}?corporateId=&vendorId=&status=${rideType}&page=${nextPage}&size=10`;
    //console.log("callFilterRide", url);
    actions
      .getRide(url)
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

  const closeFilterRideCallback = useCallback(() => {
    setselectedCorporateList([]);
    setselectedVendorList([]);
    setshowFilter(false);
  }, []);

  const callFilterRide = () => {
    setCurrentPage(0);
    setpastRide([]);
    setselectedCorporateList([]);
    setselectedVendorList([]);
    setshowFilter(false);
    setTimeout(() => {
      getPastRide();
    }, 1000);
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

      {showFilter ? (
        <FilterRideComp
          showModal={showFilter}
          onClose={closeFilterRideCallback}
          ridesType={ridesType}
          selectRideType={selectRideType}
          onSelectRideType={(item) => {
            setSelectRideType(item.value);
          }}
          corporateList={corporateList}
          //corporateValue={corporateData?.corporateName}
          // selectCorporate={(item) => {
          //   //setcorporateData(item);
          // }}
          vendorList={vendorList}
          // vendorValue={vendorData?.vendorName}
          // selectVendor={(item) => {
          //   setvendorData(item);
          // }}
          selectedCorporrateList={(item) => {
            setselectedCorporateList(item);
          }}
          selectedCorporrateListValue={selectedCorporateList}
          selectedVendorList={(item) => {
            setselectedVendorList(item);
          }}
          selectedVendorListValue={selectedVendorList}
          submitFilter={callFilterRide}
        />
      ) : null}
      <View style={styles.topContainer}>
        <View style={styles.bgImageStyle}>
          <View style={styles.headerConntainer}>
            <View style={{ width: "60%" }}>
              <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Image
                    source={imagePath.backArrowIcon}
                    style={styles.backArrowStyle}
                  />
                </TouchableOpacity>
                <Text style={styles.headerTitleText}>{strings.YOUR_RIDE}</Text>
              </View>
            </View>
            <View style={{ width: "38%" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",

                  marginTop: 20,
                }}
              >
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
                      //marginTop: 20,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownRightIconContainer}
                  onPress={() => {
                    setshowFilter(true);
                  }}
                >
                  <Image
                    style={styles.filterIconStyle}
                    source={imagePath.filterIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.contentSectionContainer}>
          {pastRide?.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={pastRide}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              onEndReached={selectRideType == "Completed" ? loadMore : null}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderFooter}
            />
          ) : (
            <View style={styles.pastRideNotFoundContainer}>
              <Text style={styles.notFoundText}>Record not found.</Text>
            </View>
          )}
        </View>
      </View>
    </WrapperContainer>
  );
}

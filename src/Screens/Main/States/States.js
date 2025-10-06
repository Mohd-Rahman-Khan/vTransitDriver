import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  AppState,
} from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "./style";
import Header from "../../../Components/Header";
import WrapperContainer from "../../../Components/WrapperContainer";
import imagePath from "../../../constants/imagePath";
import { useSelector } from "react-redux";
import DashboardCard from "../../../Components/DashboardCard";
import colors from "../../../styles/colors";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { ScrollView } from "react-native-gesture-handler";
import actions from "../../../redux/actions";
import SelectDate from "./Components/SelectDate";
import { showError } from "../../../utils/helperFunction";
import navigationStrings from "../../../navigation/navigationStrings";
import { useIsFocused } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
const moment = extendMoment(Moment);

export default function Statics({ route, navigation }) {
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );
  const [selectFilterType, setselectFilterType] = useState("");
  const [showCalender, setshowCalender] = useState(false);
  const [todayDate, settodayDate] = useState("");
  const [markedDate, setmarkedDate] = useState({});
  const [selectedFromDate, setselectedFromDate] = useState("");
  const [selectedToDate, setselectedToDate] = useState("");
  const [todayDateText, settodayDateText] = useState("");
  const [todayTimeText, settodayTimeText] = useState("");
  const [data, setdata] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [count, setCount] = useState(30);
  const [passToDate, setpassToDate] = useState("");
  const [passFromDate, setpassFromDate] = useState("");
  const [totalDistance, settotalDistance] = useState(0);
  const isFocused = useIsFocused();

  const filterType = [
    {
      label: "Weekly",
      value: "Past 1 Week",
    },
    {
      label: "Fortnight",
      value: "Past 15 Days",
    },
    {
      label: "Custom",
      value: "Custom",
    },
  ];

  useEffect(() => {
    if (isFocused) {
      getTodayDate();
    }
  }, [isFocused]);

  useEffect(() => {
    setIsMounted(true);
    if ((isMounted, isFocused)) {
      getTodayDateAndTime();
      return () => {
        setIsMounted(false);
      };
    }
  }, [count, isFocused]);

  const getTodayDateAndTime = () => {
    setTimeout(() => {
      setCount(count + 1);
      var currentDate = moment(new Date()).format("D MMM YYYY H:mm");
      var getcurrentDate = moment(new Date()).format("D MMM YYYY");
      var getcurrentTime = moment(new Date()).format("H:mm");

      settodayTimeText(getcurrentTime);
    }, 10000);
  };

  const getTodayDate = () => {
    var currentDate = moment(new Date()).format("YYYY-MM-DD");

    settodayDate(currentDate);
    settodayTimeText(moment(new Date()).format("H:mm"));

    if (route?.params?.navigationData) {
      setpassFromDate(route?.params?.navigationData?.passFromDate);
      setpassToDate(route?.params?.navigationData?.passToDate);

      var getToDate = moment(route?.params?.navigationData?.passToDate).format(
        "D MMM YYYY"
      );
      var getFromDate = moment(
        route?.params?.navigationData?.passFromDate
      ).format("D MMM");
      settodayDateText(getFromDate + "-" + getToDate);
      callStaticsApi(
        route?.params?.navigationData?.passFromDate,
        route?.params?.navigationData?.passToDate
      );
    } else {
      setpassFromDate(currentDate);
      setpassToDate(currentDate);
      settodayDateText(moment(new Date()).format("D MMM YYYY"));
      callStaticsApi(currentDate, currentDate);
    }
  };

  const callStaticsApi = async (fromdate, toDate) => {
    // try {
    //   const response = await fetch(
    //     "https://api.etravelmate.com/user-reg/trip-driver/get-driver-statistics/2024-02-05/2024-02-05",
    //     {
    //       method: "POST", // or 'PUT'
    //       headers: {
    //         VTT_USER_SIGNATURE:
    //           "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2NGI2NWQ2YzUyMmJlNzY5ZDI2YjJlNTF-RFJJVkVSfjY0NmFmYTgyMjc4MWQ1NzBiZjIwZWE0N342NDZhZmQ0ZTI3ODFkNTcwYmYyMGVhNDl-IiwiZXhwIjoxNzM0MTI3MjI4LCJpYXQiOjE3MDcxMjcyMjh9.t6EuRxpXAwrItjBFddL_bXPZCi7M2KXx-yDB0Envn4KP6q3_blrba-R9TSjiTI7kwnru7nV_oPPcesP6lTbGTw",
    //       },
    //       body: {},
    //     }
    //   );

    //   const result = await response.json();
    //   console.log("Success:", result);
    // } catch (error) {
    //   console.error("Success:", error);
    // }
    setisLoading(true);
    actions
      .getStaticsData(fromdate, toDate, "Axios")
      .then((res) => {
        if (res?.status === 200) {
          setdata(res?.data);
          setselectedFromDate("");
          setselectedToDate("");
          setmarkedDate({});
          setisLoading(false);
          if (res?.data?.totalDistance) {
            let distanceInMeter = res?.data?.totalDistance;
            let distanceInKm = Math.round(distanceInMeter / 100) / 10;
            settotalDistance(distanceInKm);
          } else {
            settotalDistance(0);
          }
        } else {
          setisLoading(false);
          showError("Network error.");
        }
      })
      .catch((err) => {
        setisLoading(false);
      });
  };

  return (
    <WrapperContainer
      style={{ flex: 1 }}
      isLoading={isLoading}
      withModal={true}
    >
      {showCalender ? (
        <SelectDate
          closeModal={() => {
            setshowCalender(!showCalender);
          }}
          maxDate={todayDate}
          setselectedDate={(date, selectionType) => {
            if (selectionType === "fromDate") {
              if (selectedFromDate === "") {
                setselectedFromDate(date);
                let fromDateString = moment(
                  moment(date).add(0, "d").format("YYYY/MM/DD HH:mm:ss")
                );
                var dateInFormat = moment(fromDateString).format("YYYY-MM-DD");

                setpassFromDate(dateInFormat);
              } else {
                setselectedFromDate(date);
                let fromDateString = moment(
                  moment(date).add(0, "d").format("YYYY/MM/DD HH:mm:ss")
                );
                var dateInFormat = moment(fromDateString).format("YYYY-MM-DD");

                setpassFromDate(dateInFormat);
              }
            } else {
              setselectedToDate(date);
              let toDateString = moment(
                moment(date).add(0, "d").format("YYYY/MM/DD HH:mm:ss")
              );
              var dateInFormat = moment(toDateString).format("YYYY-MM-DD");

              setpassToDate(dateInFormat);
            }
          }}
          fromDate={selectedFromDate}
          toDate={selectedToDate}
          submitButtonClick={() => {
            setshowCalender(false);
            setTimeout(() => {
              callStaticsApi(passFromDate, passToDate);
            }, 1000);

            var getcurrentDate = moment(selectedFromDate).format("D MMM");
            var getcurrentDateTo = moment(selectedToDate).format("D MMM YYYY");

            settodayDateText(getcurrentDate + "-" + getcurrentDateTo);
            settodayTimeText(moment(new Date()).format("H:mm"));
          }}
          markedDate={markedDate}
        />
      ) : null}
      <View style={styles.mainContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            marginTop: 20,
            //backgroundColor: "red",
          }}
        >
          <View
            style={{
              width: "70%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={styles.drawerIconContainer}>
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                //style={styles.leftIconContainer}
              >
                <Image
                  source={imagePath.menuIcon}
                  style={{ width: 20, height: 20, tintColor: "black" }}
                  resizeMode={"contain"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.headerTitleRow}>
              <Text style={styles.titleText}>
                {profileData?.firstName + " " + profileData?.lastName}
              </Text>
              <View style={styles.vaccineIconContainer}>
                <Image
                  source={
                    profileData?.isVaccinated === "Fully Vaccinated" ||
                    profileData?.isVaccinated === "Vaccinated Fully"
                      ? imagePath.Vaccinated_green
                      : profileData?.isVaccinated === "Partially Vaccinated"
                      ? imagePath.partially_vaccinated_blue
                      : profileData?.isVaccinated === "Not Vaccinated"
                      ? imagePath.not_vaccinated_orange
                      : null
                  }
                  style={styles.vaccineIconStyle}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              width: "28%",
            }}
          >
            <Dropdown
              style={styles.dropdown}
              renderItem={(item) => (
                <View style={styles.dropdownRennderItemContainer}>
                  <Text style={styles.itemStyle}>{item.label}</Text>
                </View>
              )}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              labelField={null}
              maxHeight={200}
              valueField="value"
              data={filterType}
              value={selectFilterType}
              onChange={(item) => {
                //props.setSelectFilterType(item.value);
                let val = item.value;
                if (val === "Past 1 Week") {
                  var dateString = new Date();
                  var daysToBeSubtract = 7;
                  let daysToBeAdd = 0;

                  let toDateTimestamp = dateString.setDate(
                    dateString.getDate() - daysToBeSubtract
                  );
                  let fromDate = moment(toDateTimestamp).format("YYYY-MM-DD");

                  let toDateString = new Date().setDate(
                    new Date().getDate() + daysToBeAdd
                  );

                  var getcurrentDate = moment(toDateTimestamp).format("D MMM");
                  var getcurrentDateTo = moment(new Date()).format(
                    "D MMM YYYY"
                  );

                  settodayDateText(getcurrentDate + "-" + getcurrentDateTo);
                  settodayTimeText(moment(new Date()).format("H:mm"));

                  setpassFromDate(fromDate);
                  setpassToDate(moment(toDateString).format("YYYY-MM-DD"));

                  callStaticsApi(
                    fromDate,
                    moment(toDateString).format("YYYY-MM-DD")
                  );
                } else if (val === "Past 15 Days") {
                  var dateString = new Date();
                  var daysToBeSubtract = 15;
                  let daysToBeAdd = 0;

                  let toDateTimestamp = dateString.setDate(
                    dateString.getDate() - daysToBeSubtract
                  );
                  let fromDate = moment(toDateTimestamp).format("YYYY-MM-DD");
                  let getToDate = moment(new Date()).format("YYYY-MM-DD");

                  var getcurrentDate = moment(toDateTimestamp).format("D MMM");
                  var getcurrentDateTo = moment(new Date()).format(
                    "D MMM YYYY"
                  );

                  settodayDateText(getcurrentDate + "-" + getcurrentDateTo);
                  settodayTimeText(moment(new Date()).format("H:mm"));

                  let toDateString = new Date().setDate(
                    new Date().getDate() + daysToBeAdd
                  );

                  setpassFromDate(fromDate);
                  setpassToDate(moment(toDateString).format("YYYY-MM-DD"));

                  callStaticsApi(
                    fromDate,
                    moment(toDateString).format("YYYY-MM-DD")
                  );
                } else if (val === "Custom") {
                  setselectedFromDate("");
                  setselectedToDate("");
                  setmarkedDate({});
                  setshowCalender(true);
                } else {
                }

                setselectFilterType(val);
              }}
              visibleSelectedItem={false}
              renderRightIcon={() => {
                return (
                  <View style={styles.dropdownRightIconContainer}>
                    <Image
                      style={styles.dropdownIconStyle}
                      source={imagePath.filterIcon}
                    />
                  </View>
                );
              }}
            />
          </View>
        </View>
        {/* <Header
          setSelectFilterType={(val) => {
            if (val === "Past 1 Week") {
              var dateString = new Date();
              var daysToBeSubtract = 7;
              let daysToBeAdd = 0;

              let toDateTimestamp = dateString.setDate(
                dateString.getDate() - daysToBeSubtract
              );
              let fromDate = moment(toDateTimestamp).format("YYYY-MM-DD");

              let toDateString = new Date().setDate(
                new Date().getDate() + daysToBeAdd
              );

              var getcurrentDate = moment(toDateTimestamp).format("D MMM");
              var getcurrentDateTo = moment(new Date()).format("D MMM YYYY");

              settodayDateText(getcurrentDate + "-" + getcurrentDateTo);
              settodayTimeText(moment(new Date()).format("H:mm"));

              setpassFromDate(fromDate);
              setpassToDate(moment(toDateString).format("YYYY-MM-DD"));

              callStaticsApi(
                fromDate,
                moment(toDateString).format("YYYY-MM-DD")
              );
            } else if (val === "Past 15 Days") {
              var dateString = new Date();
              var daysToBeSubtract = 15;
              let daysToBeAdd = 0;

              let toDateTimestamp = dateString.setDate(
                dateString.getDate() - daysToBeSubtract
              );
              let fromDate = moment(toDateTimestamp).format("YYYY-MM-DD");
              let getToDate = moment(new Date()).format("YYYY-MM-DD");

              var getcurrentDate = moment(toDateTimestamp).format("D MMM");
              var getcurrentDateTo = moment(new Date()).format("D MMM YYYY");

              settodayDateText(getcurrentDate + "-" + getcurrentDateTo);
              settodayTimeText(moment(new Date()).format("H:mm"));

              let toDateString = new Date().setDate(
                new Date().getDate() + daysToBeAdd
              );

              setpassFromDate(fromDate);
              setpassToDate(moment(toDateString).format("YYYY-MM-DD"));

              callStaticsApi(
                fromDate,
                moment(toDateString).format("YYYY-MM-DD")
              );
            } else if (val === "Custom") {
              setselectedFromDate("");
              setselectedToDate("");
              setmarkedDate({});
              setshowCalender(true);
            } else {
            }

            setselectFilterType(val);
          }}
          filterType={filterType}
          selectFilterType={selectFilterType}
          filterButtonClick={() => {}}
          navigation={navigation}
          title={profileData?.firstName + " " + profileData?.lastName}
          vaccinationIcon={
            profileData?.isVaccinated === "Fully Vaccinated" ||
            profileData?.isVaccinated === "Vaccinated Fully"
              ? imagePath.Vaccinated_green
              : profileData?.isVaccinated === "Partially Vaccinated"
              ? imagePath.partially_vaccinated_blue
              : profileData?.isVaccinated === "Not Vaccinated"
              ? imagePath.not_vaccinated_orange
              : null
          }
          showFilterIcon={true}
          filterIcon={imagePath.filterIcon}
        /> */}

        <View style={styles.bodyDetailsContainer}>
          <View style={styles.devider}></View>
          {data === "" ? null : (
            <ScrollView
              style={styles.scrollContainerStyle}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.dateAndTimeContainer}>
                <Text style={styles.dateText}>
                  {todayDateText + " " + todayTimeText}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (data?.TripIDList?.length > 0) {
                    navigation.navigate(navigationStrings.FILTERED_RIDE, {
                      data: data?.TripIDList,
                      navigationData: {
                        passFromDate: passFromDate,
                        passToDate: passToDate,
                      },
                    });
                  } else {
                  }
                }}
                style={[styles.rosterDetailsContainer, styles.cardShadowProp]}
              >
                <Image
                  source={imagePath.Delivery_infographic}
                  style={styles.rosterImgStyle}
                />
                <View style={styles.rosterTextContainerStyle}>
                  <Text style={styles.rosterTextStyle}>Total Trips</Text>
                  <Text style={styles.rosterNumStyle}>
                    {data?.TripIDList?.length}
                  </Text>
                </View>
                <View style={styles.iconContainerStyle}>
                  <Image source={imagePath.route} style={styles.iconStyle} />
                </View>
              </TouchableOpacity>

              <View style={styles.cardMainContainer}>
                <View
                  style={[styles.rideDetailsContainer, styles.cardShadowProp]}
                >
                  <DashboardCard
                    showProgressBar={true}
                    count={data?.EscortTrips?.length}
                    title={"Escort Trips"}
                    icon={imagePath.escort_trips}
                    value={data?.EscortTrips?.length}
                    totalValue={data?.TripIDList?.length}
                    progressColor={"#6a96fa"}
                    onPress={() => {
                      if (data?.EscortTrips?.length > 0) {
                        navigation.navigate(navigationStrings.FILTERED_RIDE, {
                          data: data?.EscortTrips,
                          navigationData: {
                            passFromDate: passFromDate,
                            passToDate: passToDate,
                          },
                        });
                      }
                    }}
                  />
                </View>
                <View
                  style={[styles.rideDetailsContainer, styles.cardShadowProp]}
                >
                  <DashboardCard
                    showProgressBar={true}
                    count={data?.AdhocTrips?.length}
                    value={data?.AdhocTrips?.length}
                    totalValue={data?.TripIDList?.length}
                    title={"Adhoc Trip"}
                    icon={imagePath.adhocIcon}
                    progressColor={colors.rating_5}
                    onPress={() => {
                      if (data?.AdhocTrips?.length > 0) {
                        navigation.navigate(navigationStrings.FILTERED_RIDE, {
                          data: data?.AdhocTrips,
                          navigationData: {
                            passFromDate: passFromDate,
                            passToDate: passToDate,
                          },
                        });
                      }
                    }}
                  />
                </View>
              </View>
              <View style={styles.cardMainContainer}>
                <View
                  style={[styles.rideDetailsContainer, styles.cardShadowProp]}
                >
                  <DashboardCard
                    showProgressBar={true}
                    count={0}
                    title={"Number of Escalation"}
                    icon={imagePath.number_of_Escalation}
                    progressColor={"#fb372e"}
                    onPress={() => {}}
                  />
                </View>
                <View
                  style={[styles.rideDetailsContainer, styles.cardShadowProp]}
                >
                  <DashboardCard
                    showProgressBar={true}
                    count={data?.NoShow_Cancelled_Trips?.length}
                    title={"NoShow/Cancel Trips"}
                    value={data?.NoShow_Cancelled_Trips?.length}
                    totalValue={data?.TripIDList?.length}
                    icon={imagePath.add_noshow}
                    progressColor={colors.rating_2}
                    onPress={() => {
                      if (data?.NoShow_Cancelled_Trips?.length > 0) {
                        navigation.navigate(navigationStrings.FILTERED_RIDE, {
                          data: data?.NoShow_Cancelled_Trips,
                          navigationData: {
                            passFromDate: passFromDate,
                            passToDate: passToDate,
                          },
                        });
                      }
                    }}
                  />
                </View>
              </View>
              <View style={styles.cardMainContainer}>
                <View
                  style={[styles.rideDetailsContainer, styles.cardShadowProp]}
                >
                  <DashboardCard
                    showProgressBar={true}
                    count={0}
                    title={"Penalty"}
                    icon={imagePath.penalty}
                    progressColor={colors.rating_1}
                    onPress={() => {}}
                  />
                </View>
                <View
                  style={[styles.rideDetailsContainer, styles.cardShadowProp]}
                >
                  <DashboardCard
                    showProgressBar={true}
                    count={data?.DelayTrips?.length}
                    title={"Delay"}
                    icon={imagePath.delay}
                    value={data?.DelayTrips?.length}
                    totalValue={data?.TripIDList?.length}
                    progressColor={colors.rating_2}
                    onPress={() => {
                      if (data?.DelayTrips?.length > 0) {
                        navigation.navigate(navigationStrings.FILTERED_RIDE, {
                          data: data?.DelayTrips,
                          navigationData: {
                            passFromDate: passFromDate,
                            passToDate: passToDate,
                          },
                        });
                      }
                    }}
                  />
                </View>
              </View>
              <View
                style={[styles.cardMainContainer, styles.containerBottomMargin]}
              >
                <View
                  style={[styles.rideDetailsContainer, styles.cardShadowProp]}
                >
                  <DashboardCard
                    showProgressBar={true}
                    count={data?.AbsentTrips?.length}
                    title={"Absent"}
                    icon={imagePath.absent_emp_icon_blue}
                    value={data?.AbsentTrips?.length}
                    totalValue={data?.TripIDList?.length}
                    progressColor={"#16699b"}
                    onPress={() => {
                      if (data?.AbsentTrips?.length > 0) {
                        navigation.navigate(navigationStrings.FILTERED_RIDE, {
                          data: data?.AbsentTrips,
                          navigationData: {
                            passFromDate: passFromDate,
                            passToDate: passToDate,
                          },
                        });
                      }
                    }}
                  />
                </View>
                <View
                  style={[styles.rideDetailsContainer, styles.cardShadowProp]}
                >
                  <DashboardCard
                    showProgressBar={false}
                    count={totalDistance + " Km"}
                    title={"Total Distance"}
                    icon={imagePath.route}
                  />
                </View>
              </View>
              <View style={styles.devider}></View>
              <View
                style={[styles.cardMainContainer, styles.containerBottomMargin]}
              >
                <View
                  style={[styles.rideDetailsContainer, styles.cardShadowProp]}
                >
                  <DashboardCard
                    showProgressBar={true}
                    count={data?.VehicleCompliance}
                    title={"Vehicle Compliance"}
                    icon={imagePath.vehiclec_compliance}
                    value={data?.VehicleCompliance}
                    totalValue={data?.TotalVehicleComplianceCount}
                    progressColor={"#0c698c"}
                    onPress={() => {
                      navigation.navigate(navigationStrings.COMPLIANCE, {
                        data: {
                          vehicleCompliance: true,
                        },
                        navigationData: {
                          passFromDate: passFromDate,
                          passToDate: passToDate,
                        },
                      });
                    }}
                  />
                </View>
                <View
                  style={[styles.rideDetailsContainer, styles.cardShadowProp]}
                >
                  <DashboardCard
                    showProgressBar={true}
                    count={data?.DriverCompliance}
                    title={"Driver Compliance"}
                    icon={imagePath.driver_compliance}
                    value={data?.DriverCompliance}
                    totalValue={data?.TotalDriverComplianceCount}
                    progressColor={"#77a0fa"}
                    onPress={() => {
                      navigation.navigate(navigationStrings.COMPLIANCE, {
                        data: {
                          driverCompliance: true,
                        },
                        navigationData: {
                          passFromDate: passFromDate,
                          passToDate: passToDate,
                        },
                      });
                    }}
                  />
                </View>
              </View>
              <View
                style={[styles.cardMainContainer, styles.containerBottomMargin]}
              >
                <View
                  style={[styles.rideDetailsContainer, styles.cardShadowProp]}
                >
                  <DashboardCard
                    ratingCard={data?.AverageRatingPerc ? true : false}
                    showProgressBar={true}
                    AverageRatingPerc={data?.AverageRatingPerc}
                    count={data?.AverageRating}
                    title={"Average Rating"}
                    icon={imagePath.average_rating}
                    progressColor={"#32b10f"}
                    onPress={() => {
                      navigation.navigate(
                        navigationStrings.RATING_AND_FEEDBACK,
                        {
                          navigationData: {
                            passFromDate: passFromDate,
                            passToDate: passToDate,
                          },
                        }
                      );
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </WrapperContainer>
  );
}

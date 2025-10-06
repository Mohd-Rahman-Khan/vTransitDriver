import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useCallback } from "react";
import WrapperContainer from "../../../Components/WrapperContainer";
import ScreensHeader from "../../../Components/ScreensHeader";
import strings from "../../../constants/lang";
import { styles } from "./style";
import { useSelector } from "react-redux";
import imagePath from "../../../constants/imagePath";
import { DOC_URL } from "../../../config/urls";
import colors from "../../../styles/colors";
import IconBox from "./IconBox";
import DetailBox from "./DetailBox";
import ConfirmLocationModal from "./ConfirmLocationModal";
import { useEffect } from "react";
import Moment from "moment";
import { extendMoment } from "moment-range";
import SelectDate from "../States/Components/SelectDate";
import Geolocation from "react-native-geolocation-service";
import { showError, showSuccess } from "../../../utils/helperFunction";
import actions from "../../../redux/actions";
import { getDelayOrEarlyMinutes, getGreetings } from "../../../utils/utils";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { GOOGLE_MAP_APIKEY } from "../../../constants/googleMapKey";
import { BarIndicator } from "react-native-indicators";

const moment = extendMoment(Moment);

export default function DriverAttendence({ route, navigation }) {
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );
  const [loading, setloading] = useState(false);
  const [showLocationPopup, setshowLocationPopup] = useState(false);
  const [greetingMessage, setgreetingMessage] = useState("");
  const [selectFilterType, setselectFilterType] = useState("");
  const [showCalender, setshowCalender] = useState(false);
  const [markedDate, setmarkedDate] = useState({});
  const [todayDate, settodayDate] = useState("");
  const [selectedFromDate, setselectedFromDate] = useState("");
  const [selectedToDate, setselectedToDate] = useState("");
  const [passToDate, setpassToDate] = useState("");
  const [passFromDate, setpassFromDate] = useState("");
  const [driverAttendenceData, setdriverAttendenceData] = useState("");
  const [driverDistanceInMeter, setdriverDistanceInMeter] = useState(0);
  const [driverOrigin, setdriverOrigin] = useState({});
  const [filterDaysList, setfilterDaysList] = useState([]);
  const [address, setaddress] = useState("");
  const [todayPunchTime, settodayPunchTime] = useState("");
  const [isButtonDisable, setisButtonDisable] = useState(true);
  const isFocus = useIsFocused();

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
    var currentDate = moment(new Date()).format("YYYY-MM-DD");
    settodayDate(currentDate);
    let getGreetingsMessage = getGreetings();
    setgreetingMessage(getGreetingsMessage);
  }, []);

  useEffect(() => {
    if (isFocus) {
      getTodayDate();
    }
  }, [isFocus]);

  const getTodayDate = () => {
    var currentDate = moment(new Date()).format("YYYY-MM-DD");
    getDriverAttendenceList(currentDate, currentDate);
  };

  const getDriverAttendenceList = (fromDate, toDate) => {
    setloading(true);
    actions
      .getDriverAttendence(fromDate, toDate)
      .then((res) => {
        setloading(false);

        if (res?.status == 200) {
          setdriverAttendenceData(res?.data);
          if (res?.data?.swipeList?.length > 0) {
            let newArr = res?.data?.swipeList.map((item) => {
              item.isSeleted = false;
              return { ...item };
            });

            setfilterDaysList(newArr);

            let todaySwipeTime = res?.data?.lastPunchTime
              ? res?.data?.lastPunchTime
              : "--";

            if (todaySwipeTime == "--") {
              settodayPunchTime(todaySwipeTime);
            } else {
              var date = new Date();
              date.setHours(todaySwipeTime.substring(0, 2));
              date.setMinutes(todaySwipeTime.substring(3, 5));
              date.setSeconds(todaySwipeTime.substring(6, 8));

              settodayPunchTime(moment(date).format("hh:mm A"));
            }
          }

          if (!res?.data?.punchedIn && !res?.data?.punchedOut) {
            var time = res?.data?.todayShiftIn;
            //var time = "12:20";
            var date = new Date();
            date.setHours(time.substring(0, 2));
            date.setMinutes(time.substring(3, 5));
            date.setSeconds(time.substring(6, 8));
            let newTimeInMilisec = date.getTime();
            let driverCanLoginTime = moment(newTimeInMilisec).format("HH:mm");
            let dateString = new Date();
            let currentTime = moment(dateString).format("HH:mm");
            if (currentTime < driverCanLoginTime) {
            } else {
              Alert.alert(
                `Driver Attendance`,
                `Please punch in your attendance`,
                [
                  {
                    text: "OK",
                    onPress: () => {},
                  },
                ]
              );
            }
          }
        } else {
          //setloading(false);
          showError(res?.message);
        }
      })
      .catch((err) => {
        setloading(false);
        showError(err?.message);
      });
  };

  const selectItem = (selectedItem) => {
    let newArr = filterDaysList.map((item) => {
      if (item.id == selectedItem.id) {
        item.isSeleted = !item.isSeleted;
      } else {
        item.isSeleted = false;
      }
      return { ...item };
    });
    setfilterDaysList(newArr);
  };

  const renderItem = ({ item, index }) => {
    return (
      <DetailBox
        item={item}
        moment={moment}
        selectItem={() => {
          selectItem(item);
        }}
      />
    );
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        let driverPoint = {
          lat: position?.coords?.latitude,
          lng: position?.coords?.longitude,
        };
        let stopPoint = {
          lat: driverAttendenceData?.officeLocation?.latitude,
          lng: driverAttendenceData?.officeLocation?.longitude,
        };

        var ky = 40000 / 360;
        var kx = Math.cos((Math.PI * stopPoint.lat) / 180.0) * ky;
        var dx = Math.abs(stopPoint.lng - driverPoint.lng) * kx;
        var dy = Math.abs(stopPoint.lat - driverPoint.lat) * ky;

        let distanceInKM = Math.sqrt(dx * dx + dy * dy);
        let distanceInMeter = distanceInKM * 1000;

        setdriverDistanceInMeter(distanceInMeter);
        setdriverOrigin(position);
        let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position?.coords?.latitude},${position?.coords?.longitude}&sensor=false&key=${GOOGLE_MAP_APIKEY}`;
        actions
          .getDirection(url)
          .then((response) => {
            setaddress(response.results[0].formatted_address);
            setisButtonDisable(false);
          })
          .catch((error) => {
            showError(JSON.stringify(error));
          });
      },
      (error) => {
        showError(JSON.stringify(error));
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
      }
    );
  };

  const callDriverAttendence = () => {
    if (address) {
      setloading(true);
      var dateString = new Date();
      let currentDate = moment(dateString).format("YYYY-MM-DD");
      let currentTime = moment(dateString).format("HH:mm:ss");

      let sendingData;
      let punchType = driverAttendenceData?.punchedIn
        ? "OUT"
        : driverAttendenceData?.punchedOut
        ? "IN"
        : "IN";

      if (punchType == "IN") {
        sendingData = {
          // punchInTime: new Date().getTime(),
          punchInTime: currentTime,

          punchInLocation: {
            locName: address,
            latitude: driverOrigin?.coords?.latitude,
            longitude: driverOrigin?.coords?.longitude,
          },
          date: currentDate,
          distanceFromOffice: driverDistanceInMeter,
        };
      } else {
        sendingData = {
          // punchInTime: new Date().getTime(),
          punchOutTime: currentTime,

          punchOutLocation: {
            locName: address,
            latitude: driverOrigin?.coords?.latitude,
            longitude: driverOrigin?.coords?.longitude,
          },
          distanceFromOffice: driverDistanceInMeter,
          date: currentDate,
        };
      }

      actions
        .driverAttendence(sendingData, punchType)
        .then((res) => {
          setloading(false);
          if (res?.status == 200) {
            showSuccess("Your attendence marked successfully.");
            setshowLocationPopup(false);
            getTodayDate();
          } else {
            if (res?.message) {
              setshowLocationPopup(false);
              showError(res?.message);
            }
          }
        })
        .catch((err) => {
          setloading(false);
          showError(err?.message);
        });
    } else {
      showError("Please wait for the location.");
    }
  };

  return (
    <WrapperContainer
    //isLoading={loading} withModal={true}
    >
      {showLocationPopup ? (
        <ConfirmLocationModal
          isButtonDisable={isButtonDisable}
          address={address}
          showModal={showLocationPopup}
          closeModal={() => {
            setshowLocationPopup(false);
          }}
          onAccept={() => {
            if (address) {
              setshowLocationPopup(false);
            }

            setTimeout(() => {
              callDriverAttendence();
            }, 1000);
          }}
        />
      ) : null}

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
            getDriverAttendenceList(passFromDate, passToDate);
          }}
          markedDate={markedDate}
        />
      ) : null}

      <ScreensHeader
        title={strings.DRIVER_ATTENDENCE}
        navigation={navigation}
        showRightIcon={true}
        showDropDown={true}
        filterIcon={imagePath.filterIcon}
        filterType={filterType}
        selectFilterType={selectFilterType}
        setSelectFilterType={(val) => {
          if (val === "Past 1 Week") {
            var dateString = new Date();
            var daysToBeSubtract = 7;
            let daysToBeAdd = 0;

            let toDateTimestamp = dateString.setDate(
              dateString.getDate() - daysToBeSubtract
            );
            let toDateString = new Date().setDate(
              new Date().getDate() + daysToBeAdd
            );
            let fromDate = moment(toDateTimestamp).format("YYYY-MM-DD");
            let toDate = moment(toDateString).format("YYYY-MM-DD");

            getDriverAttendenceList(fromDate, toDate);
          } else if (val === "Past 15 Days") {
            var dateString = new Date();
            var daysToBeSubtract = 15;
            let daysToBeAdd = 0;

            let toDateTimestamp = dateString.setDate(
              dateString.getDate() - daysToBeSubtract
            );
            let fromDate = moment(toDateTimestamp).format("YYYY-MM-DD");
            let getToDate = moment(new Date()).format("YYYY-MM-DD");

            getDriverAttendenceList(fromDate, getToDate);
          } else if (val === "Custom") {
            setmarkedDate({});
            setshowCalender(true);
          } else {
          }

          setselectFilterType(val);
        }}
      />
      <View style={styles.bottomContainer}>
        <View style={styles.contentSectionContainer}>
          <View style={styles.userDetailCoontainer}>
            <View style={styles.detailContainer}>
              <View style={{ width: "20%" }}>
                {profileData?.photo ? (
                  <View
                    style={{
                      height: 60,
                      width: 60,
                      borderRadius: 50,
                      borderWidth: 1,
                      borderColor: colors.lightBackground,
                    }}
                  >
                    <Image
                      resizeMode="cover"
                      source={{ uri: DOC_URL + profileData?.photo }}
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: 50,
                      }}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      height: 60,
                      width: 60,
                      borderRadius: 50,
                      borderWidth: 1,
                      borderColor: colors.lightBackground,
                    }}
                  >
                    <Image
                      source={
                        profileData?.gender == "Male"
                          ? imagePath.maleAvatar
                          : profileData?.gender == "Female"
                          ? imagePath.femaleAvatar
                          : imagePath.userIcon
                      }
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: 50,
                      }}
                    />
                  </View>
                )}
              </View>
              <View
                style={{
                  width: "50%",
                  justifyContent: "center",
                  //paddingLeft: 15,
                }}
              >
                <Text style={styles.greetingText}>{greetingMessage} </Text>
                <Text style={styles.nameStyle}>
                  {profileData?.firstName + " " + profileData?.lastName}
                </Text>
              </View>
              <View
                style={{
                  width: "25%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setisButtonDisable(true);
                    setaddress("");
                    getCurrentLocation();
                    setshowLocationPopup(true);
                  }}
                >
                  <Image
                    source={imagePath.punchInOut}
                    style={{
                      height: 35,
                      width: 35,
                      tintColor: colors.mediumBlue,
                    }}
                  />
                </TouchableOpacity>

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.gray,
                  }}
                >
                  {driverAttendenceData?.punchedIn
                    ? "Punch out"
                    : driverAttendenceData?.punchedOut
                    ? "Punch In"
                    : "Punch In"}

                  {/* {driverAttendenceData?.todayPunchIn
                    ? "Punch out"
                    : "Punch In"} */}
                </Text>
                <Text style={{ color: colors.greyTextColor, fontSize: 12 }}>
                  Last swipe
                </Text>

                <Text style={{ color: colors.mediumBlue, fontSize: 14 }}>
                  {todayPunchTime}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              backgroundColor: colors.lightBorderColor,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingVertical: 20,
              }}
            >
              <IconBox
                //tintColor={colors.mediumBlue}
                title={"Late In"}
                value={driverAttendenceData?.noOfLateIn}
                icon={imagePath.lateIn}
                isThisDays={true}
              />
              <IconBox
                title={"Early Out"}
                value={driverAttendenceData?.noOfEarlyExit}
                icon={imagePath.earlyOut}
                isThisDays={true}
              />
              <IconBox
                title={"Deficit Hours"}
                value={driverAttendenceData?.deficitHours}
                icon={imagePath.deficitHours}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingVertical: 20,
              }}
            >
              <IconBox
                title={"Total WH"}
                value={driverAttendenceData?.totalWorkHours}
                icon={imagePath.totalWorkHour}
                //tintColor={colors.mediumBlue}
              />
              <IconBox
                title={"Days Worked"}
                value={driverAttendenceData?.totalDaysWorked}
                icon={imagePath.daysWork}
                //tintColor={colors.mediumBlue}
              />
              <IconBox
                title={"Avg. WH"}
                value={driverAttendenceData?.avgWorkHours}
                icon={imagePath.averageHours}
              />
            </View>
          </View>

          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BarIndicator size={25} color={colors.darkBlue} />
            </View>
          ) : (
            <View style={styles.listContainer}>
              <FlatList
                data={filterDaysList}
                showsVerticalScrollIndicator={false}
                renderItem={(element, index) => renderItem(element, index)}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.1}
                onScrollToTop={false}
              />
            </View>
          )}
        </View>
      </View>
    </WrapperContainer>
  );
}

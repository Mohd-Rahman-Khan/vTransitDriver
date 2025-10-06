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
import React, { useEffect, useState } from "react";
import WrapperContainer from "../../../Components/WrapperContainer";
import colors from "../../../styles/colors";
import { styles } from "./style";
import strings from "../../../constants/lang";
import navigationStrings from "../../../navigation/navigationStrings";
import Moment from "moment";
import { extendMoment } from "moment-range";
import RideComp from "../../../Components/RideComp";
import ScreensHeader from "../../../Components/ScreensHeader";

const moment = extendMoment(Moment);
import actions from "../../../redux/actions";
import { GET_PAST_RIDE } from "../../../config/urls";
import { showError } from "../../../utils/helperFunction";

export default function FilteredRide({ route, navigation }) {
  const [pastRide, setpastRide] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setisLoadingMore] = useState(false);
  const [noMoreText, setnoMoreText] = useState(false);
  useEffect(() => {
    getPastRide();
  }, []);

  const getPastRide = () => {
    setisLoading(true);
    actions
      .getRide(`${GET_PAST_RIDE}?page=0&size=100000000`)
      .then((res) => {
        setisLoading(false);
        if (res?.status === 200) {
          if (res?.data?.body?.TripList?.length > 0) {
            if (route.params?.data) {
              let filteredArr = [];
              for (let i = 0; i < route.params?.data?.length; i++) {
                let findTripId = res?.data?.body?.TripList.find(
                  (itemData) => itemData.id === route.params?.data[i]
                );
                if (findTripId) {
                  filteredArr.push(findTripId);
                }
              }

              setpastRide(filteredArr);
            } else {
              setpastRide(res?.data?.body?.TripList);
            }
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
            // let arr = res?.data?.body?.TripList.map((item) => {
            //   item.isVisible = true;

            //   return { ...item };
            // });

            // setCurrentPage(nextPage);
            // setisLoadingMore(false);

            // setpastRide([...pastRide, ...arr]);

            if (route.params?.data) {
              let filteredArr = [];
              for (let i = 0; i < route.params?.data?.length; i++) {
                let findTripId = res?.data?.body?.TripList.find(
                  (itemData) => itemData.id === route.params?.data[i]
                );
                if (findTripId) {
                  filteredArr.push(findTripId);
                }
              }

              //setpastRide(filteredArr);
              setpastRide([...pastRide, ...filteredArr]);
              setCurrentPage(nextPage);
              setisLoadingMore(false);
            } else {
              //setpastRide(res?.data?.body?.TripList);
              setpastRide([...pastRide, ...res?.data?.body?.TripList]);
              setCurrentPage(nextPage);
              setisLoadingMore(false);
            }
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
          if (route.params?.data) {
            navigation.navigate(navigationStrings.TRIP_DETAIL, {
              tripId: item.id,
            });
          } else {
            navigation.navigate(navigationStrings.CHOOSE_AN_ISSUE, {
              rideDetail: item,
              helpTopicDetails: route?.params?.helpTopicDetails,
            });
          }
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
      <ScreensHeader
        title={strings.YOUR_RIDE}
        navigation={navigation}
        data={route?.params?.navigationData}
      />
      <View style={styles.bottomContainer}>
        <View style={styles.contentSectionContainer}>
          {pastRide?.length === 0 ? (
            <View style={styles.notFoundContainer}>
              <Text style={styles.notFoundtext}>Record not found.</Text>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={pastRide}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              // onEndReached={loadMore}
              // onEndReachedThreshold={0.1}
              // ListFooterComponent={renderFooter}
            />
          )}
        </View>
      </View>
    </WrapperContainer>
  );
}

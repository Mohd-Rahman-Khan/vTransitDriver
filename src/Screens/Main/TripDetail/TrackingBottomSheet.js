import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import imagePath from "../../../constants/imagePath";
import colors from "../../../styles/colors";
import RBSheet from "react-native-raw-bottom-sheet";
import ButtonComp from "../../../Components/ButtonComp";
import strings from "../../../constants/lang";
import { Rating, AirbnbRating } from "react-native-ratings";
import { DOC_URL } from "../../../config/urls";
import Moment from "moment";
import { extendMoment } from "moment-range";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RatingGenderRow from "./Components/RatingGenderRow";
import ShowMoreComp from "./Components/ShowMoreComp";
import EmpHomeLocComp from "./Components/EmpHomeLocComp";
import NodlePointComp from "./Components/NodlePointComp";
import OfficeLocationComp from "./Components/OfficeLocationComp";
import { getDelayOrEarlyMinutes } from "../../../utils/utils";

const moment = extendMoment(Moment);

export default function TrackBottomSheet(props) {
  const renderItem = ({ item, index }) => {
    var delayMinutes;
    var color = colors.black;
    if (props?.tripStatus === "COMPLETED") {
      if (item?.actualArivalTime === 0) {
        if (props.tripType === "DOWNTRIP") {
          if (index === 0) {
            if (item?.actualArivalTime === 0) {
            } else {
              let date = new Date(props.rideDetail.startTimeInMiliSecStr);
              let milliseconds = date.getTime();
              let expected = milliseconds;
              let arrival = item?.actualArivalTime;

              delayMinutes = getDelayOrEarlyMinutes(expected, arrival);

              if (delayMinutes > 0) {
                color = colors.redColor;
              } else if (delayMinutes < 0) {
                color = colors.lightBlueColor;
              } else if (delayMinutes === 0) {
                color = colors.greenColor;
              } else {
                color = colors.black;
              }
            }
          } else {
            if (item?.actualArivalTime === 0) {
            } else {
              let expected = props.rideDetail.actualTripStartTime;
              let arrival = item?.actualArivalTime;

              delayMinutes = getDelayOrEarlyMinutes(expected, arrival);

              if (delayMinutes > 0) {
                color = colors.redColor;
              } else if (delayMinutes < 0) {
                color = colors.lightBlueColor;
              } else if (delayMinutes === 0) {
                color = colors.greenColor;
              } else {
                color = colors.black;
              }
            }
          }
        } else {
          if (item?.actualArivalTime === 0) {
          } else {
            if (item?.onBoardPassengers) {
              let expected = item?.expectedArivalTime;
              let arrival = item?.actualArivalTime;

              delayMinutes = getDelayOrEarlyMinutes(expected, arrival);

              if (delayMinutes > 0) {
                color = colors.redColor;
              } else if (delayMinutes < 0) {
                color = colors.lightBlueColor;
              } else if (delayMinutes === 0) {
                color = colors.greenColor;
              } else {
                color = colors.black;
              }
            } else {
              let expected = item?.deBoardPassengers[0]?.shiftInTime;
              let arrival = item?.actualArivalTime;

              delayMinutes = getDelayOrEarlyMinutes(expected, arrival);

              if (delayMinutes > 0) {
                color = colors.redColor;
              } else if (delayMinutes < 0) {
                color = colors.lightBlueColor;
              } else if (delayMinutes === 0) {
                color = colors.greenColor;
              } else {
                color = colors.black;
              }
            }
          }
        }
      } else {
        if (props.tripType === "DOWNTRIP") {
          let expected = item?.expectedArivalTime;
          let arrival = item?.actualArivalTime;

          delayMinutes = getDelayOrEarlyMinutes(expected, arrival);

          if (delayMinutes > 0) {
            color = colors.redColor;
          } else if (delayMinutes < 0) {
            color = colors.lightBlueColor;
          } else if (delayMinutes === 0) {
            color = colors.greenColor;
          } else {
            color = colors.black;
          }
        } else {
          if (item?.onBoardPassengers) {
            let expected = item?.expectedArivalTime;
            let arrival = item?.actualArivalTime;
            delayMinutes = getDelayOrEarlyMinutes(expected, arrival);

            if (delayMinutes > 0) {
              color = colors.redColor;
            } else if (delayMinutes < 0) {
              color = colors.lightBlueColor;
            } else if (delayMinutes === 0) {
              color = colors.greenColor;
            } else {
              color = colors.black;
            }
          } else {
            let expected = item?.deBoardPassengers[0]?.shiftInTime;
            let arrival = item?.actualArivalTime;
            delayMinutes = getDelayOrEarlyMinutes(expected, arrival);

            if (delayMinutes > 0) {
              color = colors.redColor;
            } else if (delayMinutes < 0) {
              color = colors.lightBlueColor;
            } else if (delayMinutes === 0) {
              color = colors.greenColor;
            } else {
              color = colors.black;
            }
          }
        }
      }
    }

    return props.tripType === "UPTRIP" ? (
      item?.onBoardPassengers === null ? (
        <OfficeLocationComp
          delayMinutes={delayMinutes}
          tripStatus={props.tripStatus}
          item={item}
          index={index}
          tripType={props.tripType}
          rideDetail={props.rideDetail}
          color={color}
          showMorePress={() => {
            props.showMorePress(item);
          }}
          driverAppSettingData={props?.driverAppSettingData}
        />
      ) : item?.onBoardPassengers?.length === 1 ? (
        <>
          <EmpHomeLocComp
            index={index}
            delayMinutes={delayMinutes}
            tripStatus={props.tripStatus}
            item={item}
            tripType={props.tripType}
            rideDetail={props.rideDetail}
            color={color}
            driverAppSettingData={props?.driverAppSettingData}
          />
        </>
      ) : (
        <>
          <NodlePointComp
            index={index}
            tripStatus={props.tripStatus}
            delayMinutes={delayMinutes}
            showMorePress={() => {
              props.showMorePress(item);
            }}
            item={item}
            tripType={props.tripType}
            rideDetail={props.rideDetail}
            color={color}
            driverAppSettingData={props?.driverAppSettingData}
          />
        </>
      )
    ) : item?.onBoardPassengers ? (
      <>
        <OfficeLocationComp
          index={index}
          tripStatus={props.tripStatus}
          item={item}
          showMoreShow={true}
          showMorePress={() => {
            props.showMorePress(item);
          }}
          tripType={props.tripType}
          rideDetail={props.rideDetail}
          delayMinutes={delayMinutes}
          color={color}
          driverAppSettingData={props?.driverAppSettingData}
        />
      </>
    ) : item?.deBoardPassengers?.length === 1 ? (
      <EmpHomeLocComp
        index={index}
        tripType={props.tripType}
        tripStatus={props.tripStatus}
        item={item}
        rideDetail={props.rideDetail}
        delayMinutes={delayMinutes}
        color={color}
        driverAppSettingData={props?.driverAppSettingData}
      />
    ) : item?.deBoardPassengers?.length > 0 ? (
      <>
        <NodlePointComp
          index={index}
          tripStatus={props.tripStatus}
          showMorePress={() => {
            props.showMorePress(item);
          }}
          item={item}
          tripType={props.tripType}
          rideDetail={props.rideDetail}
          delayMinutes={delayMinutes}
          color={color}
          driverAppSettingData={props?.driverAppSettingData}
        />
      </>
    ) : null;
  };
  return (
    <RBSheet
      closeOnDragDown={false}
      dragFromTopOnly={true}
      ref={props.showBottomSheet}
      height={500}
      openDuration={250}
      customStyles={styles.trackingBottomSheetCustomStyle}
    >
      <View style={styles.bottomSheetContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={props.empList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.trackingBottomSheetFlatListContainer}
        />
      </View>
    </RBSheet>
  );
}

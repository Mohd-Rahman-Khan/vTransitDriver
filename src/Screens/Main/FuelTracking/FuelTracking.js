import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TextInput,
  Linking,
} from "react-native";
import React, { useState, useRef } from "react";
import WrapperContainer from "../../../Components/WrapperContainer";
import { styles } from "./style";
import strings from "../../../constants/lang";
import imagePath from "../../../constants/imagePath";
import { height, moderateScale, width } from "../../../styles/responsiveSize";
import { useEffect } from "react";
import actions from "../../../redux/actions";
import { useSelector } from "react-redux";
import { showError, showSuccess } from "../../../utils/helperFunction";
import Moment from "moment";
import { extendMoment } from "moment-range";
import colors from "../../../styles/colors";
import ScreensHeader from "../../../Components/ScreensHeader";
import { useIsFocused } from "@react-navigation/native";
import { DOC_URL } from "../../../config/urls";
import navigationStrings from "../../../navigation/navigationStrings";
import fontFamily from "../../../styles/fontFamily";
import FuelTrackingCard from "./FuelTrackingCard";

const moment = extendMoment(Moment);

export default function FuelTracking({ route, navigation }) {
  const isFocused = useIsFocused();
  const [isLoading, setisLoading] = useState(false);
  const [fuelTrackingList, setfuelTrackingList] = useState([]);
  const [selectedData, setselectedData] = useState("");
  const [canAddFuel, setcanAddFuel] = useState(false);
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );
  const getModulePermissionData = useSelector(
    (state) => state?.modulePermission?.modulePermissionData
  );
  useEffect(() => {
    if (isFocused) {
      fetchFuelTrackingList();
      checkAddFuelPermission();
    }
  }, [isFocused]);

  const checkAddFuelPermission = () => {
    let checkFuelTracking = getModulePermissionData?.permissions?.find(
      (item) => item?.moduleName == "Fuel Tracking"
    );

    if (checkFuelTracking) {
      if (checkFuelTracking?.actions) {
        let findViewPerm = checkFuelTracking?.actions?.find(
          (itemData) => itemData == "Create"
        );
        if (findViewPerm) {
          setcanAddFuel(true);
        } else {
          setcanAddFuel(false);
        }
      } else {
        setcanAddFuel(false);
      }
    } else {
      setcanAddFuel(false);
    }
  };

  const fetchFuelTrackingList = () => {
    setisLoading(true);
    actions
      .getFuelTrackingList(`${profileData?.id}/ALL`)
      .then((res) => {
        setisLoading(false);
        if (res?.status === 200 || res?.status === "200") {
          let newArr = res?.data.map((item, index) => {
            item.isSelected = false;
            if (item?.mileage) {
            } else {
              let getlastFuelReading = res?.data[index - 1];
              let currentReading = item?.odoMeterReadin;
              let pastReading = getlastFuelReading?.odoMeterReadin;
              let diffInKm = currentReading - pastReading;
              let pastFuelVolume = getlastFuelReading?.fuelVolume;
              let milegeAvrg = diffInKm / pastFuelVolume;
              item.mileage = milegeAvrg;
            }

            return { ...item };
          });

          setfuelTrackingList(newArr);
        } else {
          showError("Network error");
        }
      })
      .catch((err) => {
        setisLoading(false);
        showError("Network error");
      });
  };
  const selectedItem = (selectedItem) => {
    let newArr = fuelTrackingList.map((item, index) => {
      if (item?.id === selectedItem?.id) {
        item.isSelected = item.isSelected === true ? false : true;
      } else {
        item.isSelected = false;
      }
      return { ...item };
    });
    // setNewData(newArr)
    setfuelTrackingList(newArr);
  };
  const renderItem = ({ item, index }) => {
    return (
      <FuelTrackingCard
        onPress={() => {
          setselectedData(item);
          selectedItem(item);
        }}
        item={item}
        moment={moment}
      />
    );
  };
  return (
    <WrapperContainer isLoading={isLoading} withModal={true}>
      <ScreensHeader title={strings.FUEL_TRACKING} navigation={navigation} />
      <View style={styles.bottomContainer}>
        <View style={styles.contentSectionContainer}>
          {fuelTrackingList?.length > 0 ? (
            <FlatList
              data={fuelTrackingList}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <View style={styles.notFoundContainer}>
              <Text style={styles.notFoundText}>Record not found.</Text>
            </View>
          )}
        </View>
      </View>
      {canAddFuel ? (
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(navigationStrings.ADD_FUEL, {
                fuelTrackingList: fuelTrackingList,
              });
            }}
            style={styles.addButtonStyle}
          >
            <Image source={imagePath.plus_icon} style={styles.addButtonIcon} />
          </TouchableOpacity>
        </View>
      ) : null}
    </WrapperContainer>
  );
}

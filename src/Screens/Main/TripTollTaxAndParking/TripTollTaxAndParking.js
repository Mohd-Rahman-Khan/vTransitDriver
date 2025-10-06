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
import { moderateScale, width } from "../../../styles/responsiveSize";
import { useEffect } from "react";
import actions from "../../../redux/actions";
import { useSelector } from "react-redux";
import { showError, showSuccess } from "../../../utils/helperFunction";
import Moment from "moment";
import { extendMoment } from "moment-range";
import colors from "../../../styles/colors";
import ScreensHeader from "../../../Components/ScreensHeader";
import TripDetailCard from "./TripDetailCard";
import EditTollTaxAndParkingModal from "../../../Components/EditTollTaxAndParkingModal";

export default function TripTollTaxAndParking({ route, navigation }) {
  const [isLoading, setisLoading] = useState(false);
  const [toolTax, settoolTax] = useState(true);
  const [parking, setparking] = useState(false);
  const [openEditSheet, setopenEditSheet] = useState(false);
  const [editchargeCategory, seteditchargeCategory] = useState("");
  const [editamount, seteditamount] = useState("");
  const [editdocumentUri, seteditdocumentUri] = useState("");
  const [editdocumentName, seteditdocumentName] = useState("");

  const [tollTaxList, settollTaxList] = useState([]);

  useEffect(() => {
    getTollTaxAndParking();
  }, []);

  const getTollTaxAndParking = () => {
    setisLoading(true);
    actions
      .getTollTaxAnndParking()
      .then((res) => {
        setisLoading(false);
        if (res?.status === 200 || res?.status === "200") {
          let newArr = res?.data.map((item) => {
            item.isSelected = false;
            return { ...item };
          });

          settollTaxList(newArr);
        } else {
          showError("Network error");
        }
      })
      .catch((err) => {
        setisLoading(false);
        showError("Network error");
      });
  };

  const expandItem = (selectedItem) => {
    let newArr = tollTaxList.map((item, index) => {
      if (item?.id === selectedItem?.id) {
        item.isSelected = item.isSelected === true ? false : true;
      } else {
        item.isSelected = false;
      }
      return { ...item };
    });
    settollTaxList(newArr);
  };

  const renderItem = ({ item }) => {
    if (parking) {
      let getParkingList = item.tollParkingData.find(
        (itemData) => itemData.type === "Parking"
      );
      if (getParkingList) {
        return (
          <TripDetailCard
            toolTax={toolTax}
            parking={parking}
            item={item}
            onPress={() => {
              expandItem(item);
            }}
            editIconnClick={() => {
              setopenEditSheet(true);
            }}
          />
        );
      } else return null;
    } else if (toolTax) {
      let getTollTaxList = item?.tollParkingData.find(
        (itemData) => itemData.type === "Toll Tax"
      );

      if (getTollTaxList) {
        return (
          <TripDetailCard
            toolTax={toolTax}
            parking={parking}
            item={item}
            onPress={() => {
              expandItem(item);
            }}
            editIconnClick={() => {
              setopenEditSheet(true);
            }}
          />
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  return (
    <WrapperContainer isLoading={isLoading} withModal={true}>
      {openEditSheet ? (
        <EditTollTaxAndParkingModal
          closeModal={() => {
            setopenEditSheet(false);
          }}
          selectChargeType={(item) => {
            seteditchargeCategory(item?.value);
          }}
          chargeCategory={editchargeCategory}
          amount={editamount}
          documentUri={editdocumentUri}
          settollAmount={(text) => {
            seteditamount(text);
          }}
          setselectedDoc={(uri) => {
            seteditdocumentUri(uri);
          }}
          setselectedDocName={(docName) => {
            seteditdocumentName(docName);
          }}
          documentName={editdocumentName}
          cleanSelection={() => {
            seteditdocumentName("");
            seteditdocumentUri("");
          }}
          submitCharges={() => {
            setopenEditSheet(false);
          }}
        />
      ) : null}
      <ScreensHeader
        title={strings.TOLL_TAX_AND_PARKING}
        navigation={navigation}
      />
      <View style={styles.bottomContainer}>
        <View style={styles.contentSectionContainer}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => {
                settoolTax(true);
                setparking(false);
                getTollTaxAndParking();
              }}
              style={
                toolTax ? styles.activeButtonStyle : styles.deactiveButtonStyle
              }
            >
              <Text
                style={
                  toolTax ? styles.activeTextStyle : styles.deactiveTextStyle
                }
              >
                Toll Tax
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                settoolTax(false);
                setparking(true);
                getTollTaxAndParking();
              }}
              style={
                parking ? styles.activeButtonStyle : styles.deactiveButtonStyle
              }
            >
              <Text
                style={
                  parking ? styles.activeTextStyle : styles.deactiveTextStyle
                }
              >
                Parking
              </Text>
            </TouchableOpacity>
          </View>
          {tollTaxList.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={tollTaxList}
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
    </WrapperContainer>
  );
}

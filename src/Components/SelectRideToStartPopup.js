import {
  Image,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import React, { memo } from "react";
import Divider from "./Divider";
import IconTextComp from "./IconTextComp";
import imagePath from "../constants/imagePath";
import ButtonComp from "./ButtonComp";
import colors from "../styles/colors";
import {
  moderateScale,
  moderateScaleVertical,
  height,
  width,
  textScale,
} from "../styles/responsiveSize";
import fontFamily from "../styles/fontFamily";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { FlatList } from "react-native-gesture-handler";
import RideComp from "./RideComp";
const moment = extendMoment(Moment);

export default function SelectRideToStartPopup(props) {
  const renderItem = ({ item, index }) => {
    return (
      <RideComp
        item={item}
        showStartButton={true}
        onPress={() => {
          props.onPress(item);
        }}
      />
    );
  };
  return (
    <Modal animationType="fade" transparent={true} visible={props.showModal}>
      <TouchableWithoutFeedback
        onPress={props.closeModal}
        style={styles.mainContainer}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalInsideConntainer}>
            {/* <Text>ok</Text> */}
            <FlatList
              showsVerticalScrollIndicator={false}
              data={props.data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.modalColor,
    //paddingHorizontal: 10,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },

  modalInsideConntainer: {
    //flex: 1,
    //justifyContent: "flex-end",
    //alignItems: "flex-end",
    backgroundColor: colors.white,
    height: 400,
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 5,
  },
});

import {
  Image,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { memo } from "react";
import colors from "../styles/colors";

export default function FullAddressPopUp(props) {
  return (
    <Modal animationType="fade" transparent={true} visible={props.showModal}>
      <TouchableWithoutFeedback
        onPress={props.onClose}
        style={styles.mainContainer}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalInsideContainer}
          >
            <Text style={styles.addressText}>{props?.address}</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.modalColor,
    paddingHorizontal: 10,
  },
  modalInsideContainer: {
    width: "85%",
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.blueBorderColor,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  addressText: { color: colors.black },
});

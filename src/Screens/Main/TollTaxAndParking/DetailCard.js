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
import React from "react";
import { styles } from "./style";
import colors from "../../../styles/colors";
import imagePath from "../../../constants/imagePath";
import ButtonComp from "../../../Components/ButtonComp";
import strings from "../../../constants/lang";
import { getFileName } from "../../../utils/utils";

export default function DetailCard({
  item,
  onPress = () => {},
  openUpdateSheet = () => {},
  editTollTaxAndParking,
}) {
  let color;

  if (item.status === "PENDING") {
    color = colors.pendingComplianceBlueColor;
  } else if (item.status === "APPROVED") {
    color = colors.metStatusColor;
  } else if (item.status === "REJECTED") {
    color = colors.expiredLightRedColor;
  } else {
    color = colors.pendingComplianceBlueColor;
  }
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (editTollTaxAndParking) {
            onPress();
          }
        }}
        style={[
          styles.detailRowStyle,
          {
            backgroundColor: color,
            borderBottomLeftRadius: item?.isSelected ? 0 : 10,
            borderBottomRightRadius: item?.isSelected ? 0 : 10,
          },
        ]}
      >
        <View style={styles.detailContainer}>
          <View style={styles.leftBox}>
            <Text numberOfLines={1} style={styles.titleText}>
              {item?.tollName}
            </Text>
          </View>
          <View style={styles.rightBox}>
            <Text numberOfLines={1} style={styles.titleText}>
              {/* {item?.photo} */}
              {getFileName(item?.photo)}
            </Text>
          </View>
        </View>
        <View style={styles.iconConntainer}>
          <Text style={styles.titleText}>{item?.amount}</Text>
          {item?.status === "PENDING" ? (
            <Image
              style={[styles.statusIcon]}
              source={imagePath.expireIcon_Blue}
            />
          ) : item?.status === "APPROVED" ? (
            <Image
              style={[styles.statusIcon]}
              source={imagePath.check_mark_circle}
            />
          ) : item?.status === "REJECTED" ? (
            <Image style={[styles.statusIcon]} source={imagePath.warningIcon} />
          ) : (
            <Image style={[styles.statusIcon]} source={imagePath.check_mark} />
          )}

          {item?.status === "PENDING" ||
          item?.status === "APPROVED" ? null : editTollTaxAndParking ? (
            <View style={styles.actionIconContainer}>
              <Image
                source={
                  item?.isSelected ? imagePath.rightAngel : imagePath.editGray
                }
                style={styles.actionIconStyle}
              />
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
      {item?.isSelected ? (
        <View>
          <View style={styles.commentConntainer}>
            <Text style={styles.heading}>Comment</Text>
          </View>
          <View style={styles.horizontalDevider}></View>
          <View style={styles.detailBox}>
            <Text style={styles.description}>{item?.remarks}</Text>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.submitButtonContainer}>
              <ButtonComp
                btnText={strings.UPDATE}
                btnStyle={styles.submitBtnStyle}
                btnTextStyle={styles.submitBtnTextStyle}
                onPress={openUpdateSheet}
              />
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

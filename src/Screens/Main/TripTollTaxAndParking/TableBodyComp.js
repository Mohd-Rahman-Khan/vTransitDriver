import { View, Text, Image } from "react-native";
import React from "react";
import imagePath from "../../../constants/imagePath";
import { styles } from "./style";
import colors from "../../../styles/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getFileName } from "../../../utils/utils";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

export default function TableBodyComp(props) {
  return (
    <>
      <View
        style={{
          height: 1,
          backgroundColor: colors.lightGary,
          width: "100%",
        }}
      ></View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 10,
          paddingHorizontal: 10,
          height: 40,
        }}
      >
        <View
          style={{
            width: "21%",
          }}
        >
          <Text style={styles.tableListDetailText}>
            {props.listItem?.tollName}
          </Text>
        </View>
        <View
          style={{
            width: "21%",
          }}
        >
          <Text style={styles.tableListDetailText} numberOfLines={1}>
            {/* {props.listItem?.photo} */}
            {getFileName(props.listItem?.photo)}
          </Text>
        </View>
        <View
          style={{
            width: "21%",
          }}
        >
          <Text style={styles.tableListDetailText}>
            {props.listItem?.amount}
          </Text>
        </View>
        <View
          style={{
            width: "12%",
          }}
        >
          {props.listItem?.status === "PENDING" ? (
            <Image
              style={[styles.statusIcon]}
              source={imagePath.expireIcon_Blue}
            />
          ) : props.listItem?.status === "APPROVED" ? (
            <Image
              style={[styles.statusIcon]}
              source={imagePath.check_mark_circle}
            />
          ) : props.listItem?.status === "REJECTED" ? (
            <Image style={[styles.statusIcon]} source={imagePath.warningIcon} />
          ) : (
            <Image style={[styles.statusIcon]} source={imagePath.check_mark} />
          )}
        </View>

        <View onPress={props.editIconnClick} style={{ width: "21%" }}>
          <Text style={styles.tableListDetailText}>
            {/* {props.listItem?.amount} */}
            {moment(props.listItem?.createdOn).format("DD-MM-YYYY HH:mm")}
          </Text>
        </View>
      </View>
    </>
  );
}

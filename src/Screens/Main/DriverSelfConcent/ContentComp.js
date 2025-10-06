import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "./style";
import { Children } from "react";
import imagePath from "../../../constants/imagePath";
import { color } from "react-native-reanimated";
import colors from "../../../styles/colors";

export default function ContentComp(props) {
  return (
    <>
      <View style={styles.contentRow}>
        <TouchableOpacity
          onPress={props.checkBoxClick}
          style={styles.checkboxContainer}
        >
          {props.check ? (
            <Image
              source={imagePath.checkbox_yellow}
              style={styles.checkIconStyle}
            />
          ) : (
            <Image
              source={imagePath.checkbox_blank}
              style={styles.uncheckIconStyle}
            />
          )}
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>{props.content}</Text>
          {props.showchild ? (
            <View>
              <Text style={styles.requiredText}>* Required by local laws</Text>
              <View style={styles.takePhotoTextContainer}>
                <Text style={styles.varificationText}>
                  {props?.item?.description}
                </Text>
                <Image
                  style={styles.alertIconStyle}
                  source={imagePath.yellow_alert}
                />
              </View>
            </View>
          ) : null}
        </View>
        <TouchableOpacity
          onPress={props.expandIconClick}
          style={styles.iconContainer}
        >
          <View style={styles.iconStyle}>
            {props.isExpand ? (
              <Image
                style={styles.plusIconStyle}
                source={imagePath.minusIcon_black}
              />
            ) : (
              <Image
                style={styles.plusIconStyle}
                source={imagePath.plus_icon}
                resizeMode="cover"
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
      {props.isExpand ? (
        props.showImages ? (
          props.withMaskImage === "" || props.withoutMaskImage === "" ? null : (
            <View style={styles.maskImagesContainer}>
              <View style={styles.showMaskImagesContainer}>
                <Image
                  style={styles.maskImageStyle}
                  source={{ uri: props.withMaskImage }}
                />
              </View>
              <View style={styles.showMaskImagesContainer}>
                <Image
                  style={styles.maskImageStyle}
                  source={{ uri: props.withoutMaskImage }}
                />
              </View>
            </View>
          )
        ) : (
          <View style={styles.expanContainer}>
            <Text style={{ color: colors.black }}>
              {props?.item?.description}
            </Text>
          </View>
        )
      ) : null}

      <View style={styles.divider}></View>
    </>
  );
}

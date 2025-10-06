import { View, Text, StyleSheet, Image } from "react-native";
import React, { memo } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../styles/responsiveSize";
import colors from "../styles/colors";
import fontFamily from "../styles/fontFamily";
import imagePath from "../constants/imagePath";
import { FlatList } from "react-native-gesture-handler";

const InfoSheet = ({ infoSheet, infoList = [], onClose = () => {} }) => {
  const renderItem = ({ item }) => {
    return (
      <View style={styles.renderItemConatiner}>
        <Image
          resizeMode={"contain"}
          source={item?.icon}
          style={{ ...styles.renderItemImage, tintColor: item?.tintColor }}
        />
        <Text style={styles.renderItemText}>{item?.name}</Text>
      </View>
    );
  };
  return (
    <RBSheet
      onClose={onClose}
      ref={infoSheet}
      closeOnDragDown={true}
      closeOnPressMask={true}
      height={
        infoList?.length <= 3
          ? moderateScaleVertical(height / 5)
          : infoList?.length <= 5
          ? moderateScaleVertical(height / 4)
          : infoList?.length <= 8
          ? moderateScaleVertical(height / 3.5)
          : infoList?.length <= 10
          ? moderateScaleVertical(height / 3)
          : infoList?.length <= 15
          ? moderateScaleVertical(height / 2.5)
          : moderateScaleVertical(height / 2)
      }
      dragFromTopOnly={true}
      customStyles={styles.bottomSheetStyle}
    >
      <View style={styles.bottomSheetContainer}>
        <FlatList
          data={infoList}
          numColumns={2} // set number of columns
          columnWrapperStyle={styles.row}
          //   nestedScrollEnabled={true}
          style={{ marginBottom: moderateScaleVertical(50) }}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          renderItem={(item, index) => renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetStyle: {
    wrapper: {
      //   backgroundColor: colors.lightBackground,
    },

    draggableIcon: {
      backgroundColor: "#000",
    },
    container: {
      // height: info moderateScale(height /2),

      backgroundColor: colors.white,
      borderTopEndRadius: moderateScale(24),
      borderTopLeftRadius: moderateScale(24),
    },
  },
  bottomSheetContainer: {
    marginHorizontal: moderateScale(24),
    borderTopLeftRadius: moderateScale(20),
    borderTopEndRadius: moderateScale(20),
  },
  renderItemConatiner: {
    flexDirection: "row",
    marginTop: moderateScaleVertical(20),
    flex: 0.46,
    alignItems: "center",
    borderBottomWidth: moderateScale(0.5),
    paddingBottom: moderateScaleVertical(3),
    borderBottomColor: colors.lightGray,
  },
  renderItemImage: {
    width: moderateScale(width / 20),
    height: moderateScale(width / 20),
    marginRight: moderateScale(5),
  },
  renderItemText: {
    fontSize: textScale(10),
    color: colors.black,
    fontFamily: fontFamily.robotoRegular,
    flex: 1,
    textTransform: "capitalize",
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
    // marginBottom:moderateScaleVertical(100)
  },
});

export default memo(InfoSheet);

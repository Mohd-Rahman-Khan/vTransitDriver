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
import { Dropdown } from "react-native-element-dropdown";
import fontFamily from "../styles/fontFamily";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../styles/responsiveSize";
import strings from "../constants/lang";
import imagePath from "../constants/imagePath";
import ButtonComp from "./ButtonComp";
import { MultiSelect } from "react-native-element-dropdown";
import MultiSelectDropDown from "./MultiSelectDropDown";
import { ScrollView } from "react-native-gesture-handler";

export default function FilterRideComp(props) {
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
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ marginVertical: 10 }}>
                <Dropdown
                  style={{
                    //flex: 1,
                    borderBottomColor: colors.lightGary,
                    borderBottomWidth: moderateScale(1.5),
                    // marginHorizontal:moderateScale(20),
                    marginBottom: moderateScaleVertical(0),
                    height: 40,
                    //backgroundColor: colors.lightGary,
                    borderRadius: 5,
                  }}
                  renderItem={(item) => (
                    <View
                      style={{
                        marginVertical: moderateScaleVertical(5),
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontSize: textScale(14),
                          fontFamily: fontFamily.robotoRegular,
                          color: colors.black,
                          // marginLeft: moderateScale(8),
                          marginVertical: moderateScaleVertical(5),
                          marginLeft: moderateScale(10),
                        }}
                      >
                        {item?.value}
                      </Text>
                    </View>
                  )}
                  placeholderStyle={{
                    fontSize: textScale(12),
                    fontFamily: fontFamily.robotoMedium,
                    color: colors.mediumGray,
                    marginHorizontal: moderateScale(10),
                  }}
                  selectedTextStyle={{
                    fontSize: textScale(12),
                    fontFamily: fontFamily.robotoRegular,
                    color: colors.black,

                    paddingHorizontal: moderateScale(0),

                    marginLeft: moderateScale(15),
                  }}
                  inputSearchStyle={styles.inputSearchStyle}
                  labelField="value"
                  maxHeight={500}
                  valueField="value"
                  iconColor={colors.darkGray}
                  data={props?.ridesType}
                  value={props?.selectRideType}
                  placeholder={"Select Ride"}
                  onChange={(item) => {
                    props?.onSelectRideType(item);
                  }}
                  renderLeftIcon={() => (
                    <View style={{ marginRight: 5 }}>
                      <Image
                        style={{
                          height: 20,
                          width: 20,
                          tintColor: colors.gray,
                        }}
                        source={imagePath.trip_notify}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                />
              </View>
              <View style={{ marginVertical: 10 }}>
                <MultiSelectDropDown
                  dropdownStyle={styles.dropDownStyle}
                  placeholderStyle={{
                    fontSize: textScale(12),
                    fontFamily: fontFamily.robotoMedium,
                    color: colors.mediumGray,
                    marginHorizontal: moderateScale(10),
                  }}
                  selectedTextStyle={{
                    fontSize: textScale(12),
                    fontFamily: fontFamily.robotoRegular,
                    color: colors.black,

                    paddingHorizontal: moderateScale(0),

                    marginLeft: moderateScale(15),
                  }}
                  data={props?.corporateList}
                  labelField="companyName"
                  valueField="id"
                  placeholder="Select Corporate"
                  value={props.selectedCorporrateListValue}
                  onChange={(item) => {
                    props.selectedCorporrateList(item);
                  }}
                  renderLeftIcon={() => (
                    <Image
                      style={{ height: 20, width: 20 }}
                      source={imagePath.vendor}
                      resizeMode="contain"
                    />
                  )}
                  selectedStyle={{
                    borderRadius: 12,
                  }}
                  renderItem={(item, selected) => (
                    <View
                      style={{
                        marginVertical: moderateScaleVertical(5),
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 10,
                      }}
                    >
                      {selected ? (
                        <Image
                          style={{ height: 20, width: 20 }}
                          source={imagePath.check_mark}
                          resizeMode="contain"
                        />
                      ) : null}
                      <Text
                        style={{
                          flex: 1,
                          fontSize: textScale(14),
                          fontFamily: fontFamily.robotoRegular,
                          color: colors.black,
                          // marginLeft: moderateScale(8),
                          marginVertical: moderateScaleVertical(5),
                          marginLeft: moderateScale(10),
                        }}
                      >
                        {item?.companyName}
                      </Text>
                    </View>
                  )}
                />
              </View>

              <View style={{ marginVertical: 10 }}>
                <MultiSelectDropDown
                  dropdownStyle={styles.dropDownStyle}
                  placeholderStyle={{
                    fontSize: textScale(12),
                    fontFamily: fontFamily.robotoMedium,
                    color: colors.mediumGray,
                    marginHorizontal: moderateScale(10),
                  }}
                  selectedTextStyle={{
                    fontSize: textScale(12),
                    fontFamily: fontFamily.robotoRegular,
                    color: colors.black,

                    paddingHorizontal: moderateScale(0),

                    marginLeft: moderateScale(15),
                  }}
                  data={props?.vendorList}
                  labelField="vendorName"
                  valueField="id"
                  placeholder="Select vendor"
                  value={props.selectedVendorListValue}
                  onChange={(item) => {
                    props.selectedVendorList(item);
                  }}
                  renderLeftIcon={() => (
                    <Image
                      style={{ height: 20, width: 20 }}
                      source={imagePath.vendor}
                      resizeMode="contain"
                    />
                  )}
                  selectedStyle={{
                    borderRadius: 12,
                  }}
                  renderItem={(item, selected) => (
                    <View
                      style={{
                        marginVertical: moderateScaleVertical(5),
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 10,
                      }}
                    >
                      {selected ? (
                        <Image
                          style={{ height: 20, width: 20 }}
                          source={imagePath.check_mark}
                          resizeMode="contain"
                        />
                      ) : null}
                      <Text
                        style={{
                          flex: 1,
                          fontSize: textScale(14),
                          fontFamily: fontFamily.robotoRegular,
                          color: colors.black,
                          // marginLeft: moderateScale(8),
                          marginVertical: moderateScaleVertical(5),
                          marginLeft: moderateScale(10),
                        }}
                      >
                        {item?.vendorName}
                      </Text>
                    </View>
                  )}
                />
              </View>

              {/* <View style={{ marginVertical: 10 }}>
              <Dropdown
                style={styles.dropDownStyle}
                renderItem={(item) => (
                  <View
                    style={{
                      marginVertical: moderateScaleVertical(5),
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        fontSize: textScale(14),
                        fontFamily: fontFamily.robotoRegular,
                        color: colors.black,
                        // marginLeft: moderateScale(8),
                        marginVertical: moderateScaleVertical(5),
                        marginLeft: moderateScale(10),
                      }}
                    >
                      {item?.vendorName}
                    </Text>
                  </View>
                )}
                placeholderStyle={{
                  fontSize: textScale(12),
                  fontFamily: fontFamily.robotoMedium,
                  color: colors.mediumGray,
                  marginHorizontal: moderateScale(10),
                }}
                selectedTextStyle={{
                  fontSize: textScale(12),
                  fontFamily: fontFamily.robotoRegular,
                  color: colors.black,

                  paddingHorizontal: moderateScale(0),

                  marginLeft: moderateScale(15),
                }}
                inputSearchStyle={styles.inputSearchStyle}
                labelField="vendorName"
                maxHeight={500}
                valueField="vendorName"
                iconColor={colors.darkGray}
                data={props?.vendorList}
                value={props?.vendorValue}
                placeholder={"Select Vendor"}
                onChange={(item) => {
                  props?.selectVendor(item);
                }}
                renderLeftIcon={() => (
                  <View style={{ marginRight: 5 }}>
                    <Image
                      style={{ height: 20, width: 20 }}
                      source={imagePath.vendor}
                      resizeMode="contain"
                    />
                  </View>
                )}
              />
            </View> */}
              <View
                style={{
                  marginVertical: 10,
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <View style={{ width: "48%" }}>
                  <ButtonComp
                    btnText={strings.Later}
                    btnStyle={styles.laterButtonStyle}
                    btnTextStyle={styles.laterButtonText}
                    onPress={props.onClose}
                  />
                </View>
                <View style={{ width: "48%" }}>
                  <ButtonComp
                    btnText="Submit"
                    btnStyle={styles.buttonStyle}
                    btnTextStyle={styles.buttonText}
                    onPress={props.submitFilter}
                  />
                </View>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  modalContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.modalColor,
    paddingHorizontal: 10,
  },
  modalInsideContainer: {
    width: "100%",
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    height: "50%",
  },
  addressText: { color: colors.black },
  dropdownRightIconContainer: {
    height: 35,
    width: 40,
    borderWidth: 0.5,
    borderColor: colors.lightBackground,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.white,
    borderWidth: 1,
  },
  filterIconStyle: {
    height: 16,
    width: 16,
    tintColor: colors.white,
    marginRight: 5,
  },
  dropdown: {
    backgroundColor: "transparent",
    borderRadius: moderateScale(8),
    maxWidth: moderateScale(width / 2.9),
    minWidth: moderateScale(width / 2.9),
    marginTop: 20,
  },
  dropDownRenderItem: {
    marginVertical: moderateScaleVertical(5),
    flexDirection: "row",
    alignItems: "center",
  },
  itemStyle: {
    // flex: 1,
    fontSize: textScale(10),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
    marginLeft: moderateScale(8),
    marginVertical: moderateScaleVertical(5),
    marginLeft: moderateScale(10),
  },
  placeholderStyle: {
    fontSize: textScale(9),
    fontFamily: fontFamily.robotoMedium,
    color: colors.black,
    marginLeft: moderateScale(8),
    textAlign: "center",
  },
  selectedTextStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.robotoMedium,
    color: "transparent",
    marginLeft: moderateScale(4),
    textAlign: "center",
  },
  buttonStyle: {
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.themeColor,
    paddingVertical: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fontFamily.robotoMedium,
    textTransform: "uppercase",
    fontWeight: "400",
  },
  dropDownStyle: {
    //flex: 1,
    borderBottomColor: colors.lightGary,
    borderBottomWidth: moderateScale(1.5),
    // marginHorizontal:moderateScale(20),
    marginBottom: moderateScaleVertical(0),
    height: 40,
    //backgroundColor: colors.lightGary,
    borderRadius: 5,
  },
  laterButtonStyle: {
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: colors.greyBackgroundColor,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.greyBackgroundColor,
  },
  laterButtonText: {
    color: colors.greyBackgroundColor,
    fontSize: 10,
    fontFamily: fontFamily.robotoMedium,
    textTransform: "uppercase",
    fontWeight: "bold",
  },

  // multi select
});

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
import React, { memo, useState } from "react";
import { Calendar } from "react-native-calendars";
import Moment from "moment";
import { extendMoment } from "moment-range";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../../../styles/responsiveSize";
import colors from "../../../../styles/colors";
import ButtonComp from "../../../../Components/ButtonComp";
import imagePath from "../../../../constants/imagePath";
import fontFamily from "../../../../styles/fontFamily";
import { TextInput } from "react-native-gesture-handler";
import { showError, showSuccess } from "../../../../utils/helperFunction";
import strings from "../../../../constants/lang";

const moment = extendMoment(Moment);

function SelectDate(props) {
  const [showCalender, setshowCalender] = useState(false);
  const [selectionType, setselectionType] = useState("");
  return (
    <Modal animationType="fade" transparent={true} visible={props.showModal}>
      <TouchableWithoutFeedback onPress={() => {}} style={{ flex: 1 }}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalInsideContainer}
          >
            <View style={styles.selectDateContainer}>
              <View style={styles.dateContainer}>
                <Text style={styles.datelabelStyle}>From Date</Text>
                <TouchableOpacity
                  onPress={() => {
                    setshowCalender(true);
                    setselectionType("fromDate");
                  }}
                  style={styles.dateTextContainer}
                >
                  <Text style={styles.selectedDateStyle}>
                    {props.fromDate
                      ? moment(props.fromDate).format("DD-MM-YYYY")
                      : props.fromDate}
                  </Text>
                  {/* <Text style={styles.selectedDateStyle}>{props.fromDate}</Text> */}
                </TouchableOpacity>
              </View>
              <View style={styles.dateContainer}>
                <Text style={styles.datelabelStyle}>To Date</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (props?.fromDate === "") {
                      showError("Please select from date first.");
                    } else {
                      setshowCalender(true);
                      setselectionType("toDate");
                    }
                  }}
                  style={styles.dateTextContainer}
                >
                  <Text style={styles.selectedDateStyle}>
                    {/* {props?.toDate} */}
                    {props?.toDate
                      ? moment(props?.toDate).format("DD-MM-YYYY")
                      : props?.toDate}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {showCalender ? (
              <Calendar
                markedDates={props.markedDate}
                initialDate={props.minDate}
                minDate={props.minDate}
                maxDate={props.maxDate}
                onDayPress={(day) => {
                  if (selectionType === "toDate") {
                    if (day.dateString < props?.fromDate) {
                      showError("To date should be greater than from date.");
                    } else {
                      props.setselectedDate(day.dateString, selectionType);
                      setshowCalender(false);
                    }
                  } else {
                    if (props?.toDate === "") {
                      props.setselectedDate(day.dateString, selectionType);
                      setshowCalender(false);
                    } else {
                      if (day.dateString < props?.toDate) {
                        props.setselectedDate(day.dateString, selectionType);
                        setshowCalender(false);
                      } else {
                        showError("To date should be greater than from date.");
                      }
                    }
                  }
                }}
                onDayLongPress={(day) => {}}
                monthFormat={"yyyy MM"}
                onMonthChange={(month) => {}}
                hideArrows={false}
                renderArrow={(direction) => {
                  if (direction === "left") {
                    return (
                      <View>
                        <Image
                          source={imagePath.leftArrow}
                          style={styles.calenderArrowStyle}
                        />
                      </View>
                    );
                  } else if (direction === "right") {
                    return (
                      <View>
                        <Image
                          source={imagePath.rightArrow}
                          style={styles.calenderArrowStyle}
                        />
                      </View>
                    );
                  }
                }}
                hideExtraDays={true}
                disableMonthChange={false}
                firstDay={1}
                hideDayNames={false}
                showWeekNumbers={false}
                onPressArrowLeft={(subtractMonth) => subtractMonth()}
                onPressArrowRight={(addMonth) => addMonth()}
                disableArrowLeft={false}
                disableArrowRight={false}
                disableAllTouchEventsForDisabledDays={false}
                renderHeader={(date) => {
                  let dateObj = new Date(date);
                  let momentObj = moment(dateObj);
                  let momentString = momentObj.format("MMMM");
                  return (
                    <View>
                      <Text style={styles.calenderHeaderText}>
                        {momentString}
                      </Text>
                    </View>
                  );
                }}
                enableSwipeMonths={false}
              />
            ) : null}

            <View style={styles.buttonContainer}>
              <View style={styles.buttonBox}>
                <ButtonComp
                  btnText={strings.CANCEL}
                  btnStyle={styles.laterButtonStyle}
                  btnTextStyle={styles.laterButtonText}
                  onPress={() => {
                    props.closeModal();
                  }}
                />
              </View>
              <View style={styles.buttonBox}>
                <ButtonComp
                  btnText={strings.SUBMIT}
                  btnStyle={styles.acceptButtonStyle}
                  btnTextStyle={styles.acceptButtonText}
                  onPress={() => {
                    if (props.fromDate === "" || props?.toDate === "") {
                      showError("From and to date required.");
                    } else {
                      props.submitButtonClick();
                    }
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.modalColor,
    paddingHorizontal: 10,
  },
  modalInsideContainer: {
    //height: "32%",
    width: "85%",
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.blueBorderColor,
    borderRadius: 20,
    paddingVertical: 20,
  },
  rowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    //marginTop: 15,
  },
  dateTimeContainer: {
    width: "35%",
  },
  timeContainer: {
    flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: colors.lightBorderColor,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: 8,
  },
  timeText: {
    fontSize: textScale(18),
    color: colors.black,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  dateContainer: {
    backgroundColor: "#0b698c",
    width: "100%",
    height: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  dateText: { color: colors.white, fontSize: textScale(12) },
  fromToContainer: { width: "60%" },
  fromAddressContainer: {
    flexDirection: "row",
    alignItems: "center",
    //marginBottom: 1,
  },
  toAddressIndicator: {
    height: 6,
    width: 6,
    backgroundColor: colors.greenColor,
    borderRadius: 10,
  },
  addressText: { fontSize: textScale(10), marginLeft: 5, color: colors.black },
  dotIndicator: {
    height: 5,
    width: 5,
    backgroundColor: colors.lightGray,
    // marginLeft: 1,
    borderRadius: 10,
    marginVertical: 1,
  },
  toAddressContainer: {
    flexDirection: "row",
    //marginTop: 2,
    alignItems: "center",
  },
  fromAddressIndicator: {
    height: 6,
    width: 6,
    backgroundColor: colors.orangeColor,
    borderRadius: 10,
  },
  adhocButtonContainer: { marginHorizontal: 10, marginTop: 5, width: 70 },
  adhocButtonStyle: {
    borderRadius: moderateScale(5),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.orangeColor,
    paddingVertical: 2,
  },
  regularButtonStyle: {
    borderRadius: moderateScale(5),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b698c",
    paddingVertical: 2,
  },

  newRow: { marginVertical: 10 },
  mainIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f4f4f4",
    paddingBottom: 10,
    paddingTop: 10,
    //borderStyle: 'dotted',
  },
  buttonRowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  TripModalbuttonContainer: { width: "40%" },
  laterButtonStyle: {
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.greyBackgroundColor,
    paddingVertical: 10,
  },
  laterButtonText: {
    color: colors.white,
    fontSize: textScale(10),
    fontFamily: fontFamily.robotoMedium,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  acceptButtonStyle: {
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.greenColor,
    paddingVertical: 10,
  },
  acceptButtonText: {
    color: colors.white,
    fontSize: textScale(10),
    fontFamily: fontFamily.robotoMedium,
    textTransform: "uppercase",
    fontWeight: "400",
  },
  selectDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(10),
  },
  dateContainer: {
    width: "48%",
  },
  dateTextContainer: {
    height: 40,
    width: "100%",
    //backgroundColor: "red",
    borderWidth: 0.5,
    borderColor: colors.lightBackground,
    borderRadius: 5,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  selectedDateStyle: {
    color: colors.black,
  },
  datelabelStyle: {
    marginBottom: 5,
    color: "black",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(10),
    marginTop: moderateScaleVertical(10),
  },
  buttonBox: {
    width: "48%",
  },
  calenderArrowStyle: { height: 20, width: 20 },
  calenderHeaderText: { color: colors.black },
});

export default SelectDate;

import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
  PanResponder,
  StyleSheet,
  Platform,
  ImageBackground,
  InteractionManager,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import React, { memo } from "react";
import colors from "../../../../styles/colors";
import EmpDetailComp from "./EmpDetailComp";
import { showError } from "../../../../utils/helperFunction";
import RBSheet from "react-native-raw-bottom-sheet";

function EmpListForCall(props) {
  const renderList = ({ item, index }) => {
    if (item?.status === "SCHEDULE") {
      return (
        <EmpDetailComp
          index={index}
          item={item}
          driverAppSettingData={props?.driverAppSettingData}
          callingEmp={true}
          permissionForCall={() => {
            if (item?.passType === "ESCORT") {
              if (item?.escortMobileNo) {
                props.permissionForCall(item);
              } else {
                showError("Mobile number is not available for this employee.");
              }
            } else {
              if (item?.mobileNo) {
                props.permissionForCall(item);
              } else {
                showError("Mobile number is not available for this employee.");
              }
            }
          }}
        />
      );
    }
  };

  return (
    // <Modal
    //   animationType="fade"
    //   transparent={true}
    //   visible={props.showEmpDetailModal}
    // >
    //   <TouchableWithoutFeedback
    //     onPress={props.closeModal}
    //     style={styles.container}
    //   >
    //     <View style={styles.modalContainer}>
    //       <View
    //         style={[
    //           styles.modalInsideContainer,
    //           {
    //             height:
    //               props.empList?.length < 2
    //                 ? 140
    //                 : props.empList?.length < 3
    //                 ? 220
    //                 : props.empList?.length < 4
    //                 ? 340
    //                 : props.empList?.length < 5
    //                 ? 430
    //                 : 500,
    //           },
    //         ]}
    //       >
    //         <View style={styles.container}>
    //           <Text style={styles.shiftText}>
    //             Shift time({props.empList[0]?.shiftTime})
    //           </Text>
    //           <FlatList
    //             data={props.empList}
    //             renderItem={renderList}
    //             keyExtractor={(item, index) => index.toString()}
    //           />
    //         </View>
    //       </View>
    //     </View>
    //   </TouchableWithoutFeedback>
    // </Modal>
    <RBSheet
      onClose={props.closeModal}
      closeOnDragDown={false}
      dragFromTopOnly={true}
      ref={props.empListForCalling}
      height={
        props.empList?.length < 2
          ? 140
          : props.empList?.length < 3
          ? 220
          : props.empList?.length < 4
          ? 340
          : props.empList?.length < 5
          ? 430
          : 500
      }
      openDuration={250}
      customStyles={{
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      }}
    >
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalInsideContainer,
            {
              height:
                props.empList?.length < 2
                  ? 140
                  : props.empList?.length < 3
                  ? 220
                  : props.empList?.length < 4
                  ? 340
                  : props.empList?.length < 5
                  ? 430
                  : 500,
            },
          ]}
        >
          <View style={styles.container}>
            <Text style={styles.shiftText}>
              Shift time({props.empList[0]?.shiftTime})
            </Text>
            <FlatList
              data={props.empList}
              renderItem={renderList}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </View>
    </RBSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.modalColor,
  },
  modalInsideContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },
  genderAndVaccineIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  vaccineIconContainer: {
    height: 25,
    width: 25,
    borderWidth: 2,
    borderColor: colors.lightGary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
  },
  vaccineIconStyle: { height: 15, width: 15 },
  genderIconContainer: {
    height: 25,
    width: 25,
    borderWidth: 2,
    borderColor: colors.lightGary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  genderIconStyle: { height: 15, width: 15 },
  noShowOutsideContainer: {
    height: 50,
    width: 50,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.darkYellow,
    justifyContent: "center",
    alignItems: "center",
  },
  noShowInsieContainer: {
    height: 40,
    width: 40,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.darkOrange,
    justifyContent: "center",
    alignItems: "center",
  },
  noTextStyle: {
    color: colors.black,
    fontSize: 8,
    fontWeight: "500",
  },
  crossIconStyle: {
    height: 20,
    width: 20,
    tintColor: colors.SOSSwipeBottonColor1,
  },
  shiftText: {
    textAlign: "center",
    color: colors.black,
    paddingBottom: 10,
    fontSize: 14,
  },
  renderListContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  renderListDotIndicator: {
    height: 4,
    width: 4,
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    marginVertical: 1,
  },
  renderListLeftContainer: { width: "10%", alignItems: "center" },
  listItemUserThumbnailContainer: {
    height: 50,
    width: 50,
    borderWidth: 1,
    borderColor: colors.lightGary,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  listItemUserImageStyle: { height: 45, width: 45, borderRadius: 30 },
  listItemDotIndicatorContainer: {
    alignItems: "center",
    marginTop: 2,
    marginBottom: 2,
  },
  listItemMiddleContainer: {
    width: "90%",
    borderBottomColor: colors.dividerColor,
    borderBottomWidth: 1,
    paddingLeft: 20,
    justifyContent: "center",
  },
  listItemMiddleContainerRow: { flexDirection: "row" },
  listItemMiddleContainerLeftBox: {
    width: "75%",
  },
  listItemMiddleContainerRightBox: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
  },
  listItemEmployeeNameText: {
    fontSize: 18,
    color: colors.black,
  },
  listItemRatingAndVaccineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  verticalDivider: {
    height: 20,
    width: 1,
    backgroundColor: colors.lightGary,
    marginHorizontal: 10,
  },
  listItemAlignNoShowConntent: {
    alignItems: "center",
    justifyContent: "center",
  },
  listItemEmpBoardingDeboardingTime: { color: colors.black },
  listItemEmpTimeText: {
    color: colors.black,
    fontSize: 10,
    textAlign: "right",
  },
  listItemAbsentStatusContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  listItemAbsentIconnStyle: { height: 45, width: 45 },
  listItemAbsentEmpText: { color: colors.black, fontSize: 10 },
  listItemEmpTimeTextCenter: {
    color: "black",
    fontSize: 10,
    textAlign: "center",
  },
  listItemSkipIconStyle: { height: 25, width: 25 },
  listItemEmpStatusContainer: {
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.SOSSwipeBottonColor1,
  },
  listItemEmpStatusText: {
    color: colors.white,
    fontSize: 12,
    textTransform: "capitalize",
  },
});

export default memo(EmpListForCall);

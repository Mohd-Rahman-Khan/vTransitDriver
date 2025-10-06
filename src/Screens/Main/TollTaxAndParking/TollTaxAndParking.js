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
import { height, moderateScale, width } from "../../../styles/responsiveSize";
import { useEffect } from "react";
import actions from "../../../redux/actions";
import { useSelector } from "react-redux";
import { showError, showSuccess } from "../../../utils/helperFunction";
import Moment from "moment";
import { extendMoment } from "moment-range";
import colors from "../../../styles/colors";
import ScreensHeader from "../../../Components/ScreensHeader";
import DetailCard from "./DetailCard";
import EditTollTaxAndParkingModal from "../../../Components/EditTollTaxAndParkingModal";
import TollTaxAndParkingModal from "../../../Components/TollTaxAndParkingModal";
import { useIsFocused } from "@react-navigation/native";
import { DOC_URL } from "../../../config/urls";
import { imageCompress } from "../../../utils/imageCompressor";

export default function TollTaxAndParking({ route, navigation }) {
  const [toolTax, settoolTax] = useState(true);
  const [parking, setparking] = useState(false);
  const [showUpdateBottomSheet, setshowUpdateBottomSheet] = useState(false);
  const [addTollTaxAndParkingSheet, setaddTollTaxAndParkingSheet] =
    useState(false);
  const [chargeCategory, setchargeCategory] = useState("");
  const [amount, setamount] = useState("");
  const [documentUri, setdocumentUri] = useState("");
  const [documentName, setdocumentName] = useState("");

  const [editchargeCategory, seteditchargeCategory] = useState("");
  const [editamount, seteditamount] = useState("");
  const [editdocumentUri, seteditdocumentUri] = useState("");
  const [editdocumentName, seteditdocumentName] = useState("");
  const [networkUri, setnetworkUri] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const [tollTaxList, settollTaxList] = useState([]);
  const [parkingList, setparkingList] = useState([]);
  const [loadingButton, setloadingButton] = useState(false);
  const [editTollTaxAndParking, seteditTollTaxAndParking] = useState(false);
  const [createTollTaxAndParking, setcreateTollTaxAndParking] = useState(false);
  const [tollName, settollName] = useState("");
  const [editTollName, seteditTollName] = useState("");
  const isFocused = useIsFocused();
  const getModulePermissionData = useSelector(
    (state) => state?.modulePermission?.modulePermissionData
  );

  useEffect(() => {
    if (isFocused) {
      getTollTaxAndParking();
      getTollAndParkingPermission();
    }
  }, [isFocused]);
  useEffect(() => {
    if (route?.params?.selectionType) {
      if (route?.params?.selectionType === "Toll Tax") {
        settoolTax(true);
        setparking(false);
        setchargeCategory("Toll Tax");
      } else {
        setchargeCategory("Parking");
        settoolTax(false);
        setparking(true);
      }
    }
  }, []);
  const getTollAndParkingPermission = () => {
    let checkTollTaxAndParking = getModulePermissionData?.permissions?.find(
      (item) => item?.moduleName == "Toll And Parking"
    );

    if (checkTollTaxAndParking) {
      if (checkTollTaxAndParking?.actions) {
        let findViewPerm = checkTollTaxAndParking?.actions?.find(
          (itemData) => itemData == "Edit"
        );
        if (findViewPerm) {
          seteditTollTaxAndParking(true);
        } else {
          seteditTollTaxAndParking(false);
        }
      } else {
        seteditTollTaxAndParking(false);
      }
    } else {
      seteditTollTaxAndParking(false);
    }
    if (checkTollTaxAndParking) {
      if (checkTollTaxAndParking?.actions) {
        let findAddPerm = checkTollTaxAndParking?.actions.find(
          (itemData) => itemData == "Create"
        );
        if (findAddPerm) {
          setcreateTollTaxAndParking(true);
        } else {
          setcreateTollTaxAndParking(false);
        }
      } else {
        setcreateTollTaxAndParking(false);
      }
    } else {
      setcreateTollTaxAndParking(false);
    }
  };

  const getTollTaxAndParking = () => {
    setisLoading(true);
    actions
      .getTollTaxAnndParking()
      .then((res) => {
        setisLoading(false);

        let findTripTollTax = res?.data.find(
          (itemData) => itemData.tripId === route.params.tripId
        );

        if (findTripTollTax) {
          let findTollTaxList = findTripTollTax?.tollParkingData.find(
            (itemData) => itemData.type === "Toll Tax"
          );
          let findParkingList = findTripTollTax?.tollParkingData.find(
            (itemData) => itemData.type === "Parking"
          );

          let newArr = findTripTollTax?.tollParkingData.map((item) => {
            item.isSelected = false;

            return { ...item };
          });

          if (findTollTaxList) {
            settollTaxList(newArr);
          }

          if (findParkingList) {
            setparkingList(newArr);
          }
        }
      })
      .catch((err) => {
        setisLoading(false);
        showError("Network error");
      });
  };

  const expandItem = (selectedItem) => {
    if (
      selectedItem?.status === "PENDING" ||
      selectedItem?.status === "APPROVED"
    ) {
    } else {
      if (toolTax) {
        let newArr = tollTaxList.map((item, index) => {
          if (item?.id === selectedItem?.id) {
            item.isSelected = item.isSelected === true ? false : true;
          } else {
            item.isSelected = false;
          }
          return { ...item };
        });
        settollTaxList(newArr);
      } else if (parking) {
        let newArr = parkingList.map((item, index) => {
          if (item?.id === selectedItem?.id) {
            item.isSelected = item.isSelected === true ? false : true;
          } else {
            item.isSelected = false;
          }
          return { ...item };
        });
        setparkingList(newArr);
      } else {
      }
    }
  };

  const renderItem = ({ item }) => {
    if (toolTax) {
      if (item?.type === "Toll Tax") {
        return (
          <DetailCard
            editTollTaxAndParking={editTollTaxAndParking}
            item={item}
            onPress={() => {
              expandItem(item);
            }}
            openUpdateSheet={() => {
              setshowUpdateBottomSheet(true);

              seteditchargeCategory(item?.type);
              seteditamount(item?.amount);
              seteditdocumentName(item?.photo);
              seteditdocumentUri(DOC_URL + item?.photo);
              seteditTollName(item?.tollName);
            }}
          />
        );
      }
    } else if (parking) {
      if (item?.type === "Parking") {
        return (
          <DetailCard
            editTollTaxAndParking={editTollTaxAndParking}
            item={item}
            onPress={() => {
              expandItem(item);
            }}
            openUpdateSheet={() => {
              setshowUpdateBottomSheet(true);
              seteditchargeCategory(item?.type);
              seteditamount(item?.amount);
              seteditdocumentName(item?.photo);
              seteditdocumentUri(DOC_URL + item?.photo);
              seteditTollName(item?.tollName);
            }}
          />
        );
      }
    }
  };

  const submitFile = async (res, selectionType) => {
    setloadingButton(true);
    let formData = new FormData();

    if (selectionType == "camera") {
      let getCompImg = await imageCompress(res?.path);
      // if (res?.type) {
      //   formData.append("photo", {
      //     uri: res?.uri,
      //     name: res?.name,
      //     type: res?.type,
      //   });
      // } else {
      //   formData.append("photo", {
      //     uri: res?.path,
      //     name: "photo",
      //     type: res?.mime,
      //   });
      // }

      if (getCompImg) {
        if (res?.type) {
          formData.append("photo", {
            uri: getCompImg,
            name: res?.name,
            type: res?.type,
          });
        } else {
          formData.append("photo", {
            uri: getCompImg,
            name: "photo",
            type: res?.mime,
          });
        }
      } else {
        if (res?.type) {
          formData.append("photo", {
            uri: res?.uri,
            name: res?.name,
            type: res?.type,
          });
        } else {
          formData.append("photo", {
            uri: res?.path,
            name: "photo",
            type: res?.mime,
          });
        }
      }
    } else {
      if (res?.type) {
        formData.append("photo", {
          uri: res?.uri,
          name: res?.name,
          type: res?.type,
        });
      } else {
        formData.append("photo", {
          uri: res?.path,
          name: "photo",
          type: res?.mime,
        });
      }
    }

    actions
      .saveFuelFile(
        formData,
        {
          "Content-Type": "multipart/form-data",
        },
        "formData"
      )
      .then((res) => {
        setloadingButton(false);
        if (res?.status === 200) {
          setnetworkUri(res?.data?.documentName);
        } else {
          showError("Error in file upload.");
        }
      })
      .catch((err) => {
        setloadingButton(false);
        showError("Error in file upload.");
      });

    // actions
    //   .uploadTollTaxParkingFile(
    //     formData,
    //     {
    //       "Content-Type": "multipart/form-data",
    //     },
    //     "formData"
    //   )
    //   .then((res) => {
    //     setloadingButton(false);
    //     if (res?.status === 200) {
    //       setnetworkUri(res?.data?.documentName);
    //     } else {
    //       showError("Error in file upload.");
    //     }
    //   })
    //   .catch((err) => {
    //     setloadingButton(false);
    //     showError("Error in file upload.");
    //   });
  };

  const submitCharges = (type) => {
    if (type === "create") {
      if (
        chargeCategory === "" ||
        amount === "" ||
        documentUri === "" ||
        tollName === ""
      ) {
        showError("Please fill all inputs.");
      } else {
        setloadingButton(true);
        let sendingData = {
          tripId: route.params?.tripId,
          tollParkingData: [
            {
              type: chargeCategory,
              amount: amount,
              photo: networkUri,
              tollName: tollName,
            },
          ],
        };

        actions
          .submitTollTaxAndParking(sendingData)
          .then((res) => {
            setloadingButton(false);
            setaddTollTaxAndParkingSheet(false);
            setshowUpdateBottomSheet(false);
            setTimeout(() => {
              getTollTaxAndParking();
            }, 1000);
            if (res?.status === 200 || res?.status === "200") {
              showSuccess(`${chargeCategory} submitted successfully.`);
            } else {
              showError("Network error");
            }
          })
          .catch((err) => {
            setisLoading(false);
            showError("Network error");
          });
      }
    } else {
      if (
        editchargeCategory === "" ||
        editamount === "" ||
        editdocumentName === "" ||
        editTollName === ""
      ) {
        showError("Please fill all inputs.");
      } else {
        setloadingButton(true);
        let sendingData = {
          tripId: route.params?.tripId,
          tollParkingData: [
            {
              type: editchargeCategory,
              amount: editamount,
              photo: networkUri === "" ? editdocumentName : networkUri,
              tollName: editTollName,
            },
          ],
        };

        actions
          .submitTollTaxAndParking(sendingData)
          .then((res) => {
            setloadingButton(false);
            setaddTollTaxAndParkingSheet(false);
            setshowUpdateBottomSheet(false);
            setTimeout(() => {
              getTollTaxAndParking();
            }, 1000);
            if (res?.status === 200 || res?.status === "200") {
              showSuccess("Tool tax or parking submitted successfully.");
            } else {
              showError("Network error");
            }
          })
          .catch((err) => {
            setisLoading(false);
            showError("Network error");
          });
      }
    }
  };
  return (
    <WrapperContainer isLoading={isLoading} withModal={true}>
      {showUpdateBottomSheet ? (
        <EditTollTaxAndParkingModal
          closeModal={() => {
            setshowUpdateBottomSheet(false);
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
            submitCharges("edit");
          }}
          loadingButton={loadingButton}
          tollName={editTollName}
          changeTollName={(text) => {
            seteditTollName(text);
          }}
        />
      ) : null}
      {addTollTaxAndParkingSheet ? (
        <TollTaxAndParkingModal
          closeModal={() => {
            setaddTollTaxAndParkingSheet(false);
          }}
          selectChargeType={(item) => {
            setchargeCategory(item?.value);
          }}
          chargeCategory={chargeCategory}
          amount={amount}
          documentUri={documentUri}
          settollAmount={(text) => {
            setamount(text);
          }}
          setselectedDoc={(uri, selectionType) => {
            submitFile(uri, selectionType);
            setdocumentUri(uri);
          }}
          setselectedDocName={(docName) => {
            setdocumentName(docName);
          }}
          documentName={documentName}
          cleanSelection={() => {
            setdocumentName("");
            setdocumentUri("");
          }}
          submitCharges={() => {
            submitCharges("create");
          }}
          loadingButton={loadingButton}
          tollName={tollName}
          changeTollName={(text) => {
            settollName(text);
          }}
        />
      ) : null}
      <ScreensHeader title={"Toll tax and Parking"} navigation={navigation} />
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
          {toolTax ? (
            tollTaxList?.length > 0 ? (
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
            )
          ) : null}

          {parking ? (
            parkingList?.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={parkingList}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <View style={styles.notFoundContainer}>
                <Text style={styles.notFoundText}>Record not found.</Text>
              </View>
            )
          ) : null}
        </View>
        {createTollTaxAndParking ? (
          <View
            style={{
              backgroundColor: "transparent",
              position: "absolute",
              bottom: 0,
              justifyContent: "flex-end",
              alignItems: "flex-end",
              width: "100%",
              paddingHorizontal: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (toolTax) {
                  setchargeCategory("Toll Tax");
                } else {
                  setchargeCategory("Parking");
                }
                setaddTollTaxAndParkingSheet(true);
                setamount("");
                setdocumentName("");
                setdocumentUri("");
                settollName("");
              }}
              style={{
                width: 40,
                height: 40,
                shadowColor: colors.black,
                shadowOpacity: 0.4,
                shadowRadius: 2,
                shadowOffset: {
                  height: 1,
                  width: 1,
                },
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.white,
                borderRadius: 50,
                marginBottom: 10,
                marginRight: 10,
                borderWidth: 1,
                borderColor: colors.lightBorderColor,
              }}
            >
              <Image
                source={imagePath.plus_icon}
                style={{ height: 20, width: 20 }}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </WrapperContainer>
  );
}

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import WrapperContainer from "../../../Components/WrapperContainer";
import HeaderComp from "../../../Components/HeaderComp";
import colors from "../../../styles/colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
  height,
} from "../../../styles/responsiveSize";
import strings from "../../../constants/lang";
import fontFamily from "../../../styles/fontFamily";
import imagePath from "../../../constants/imagePath";
import { useNavigation } from "@react-navigation/native";
import navigationStrings from "../../../navigation/navigationStrings";
import moment from "moment";

const openTickets = [
  "I had an issue with the cab quality",
  "I had an issue with the cab quality",
];

const pendingTickets = [
  "I had an issue with the cab quality",
  "I had an issue with the cab quality",
];

const closeTickets = [
  "I had an issue with the cab quality",
  "I had an issue with the cab quality",
];

const TicketListing = ({ route }) => {
  const navigation = useNavigation();
  const yourTickets = route?.params?.yourTickets;
  const [closeTickets, setCloseTickets] = useState([]);
  const [reopenTicket, setReopenTicket] = useState([]);
  const [openTickets, setOpenTickets] = useState([]);
  const [chooseTicketList, setChooseTicketList] = useState([
    strings?.OPEN,
    strings?.CLOSE,
    strings?.REOPEN,
  ]);
  const [selectedTickets, setSelectedTickets] = useState(strings?.OPEN);

  useEffect(() => {
    _handleTickets();
  }, []);

  const _handleTickets = () => {
    let openTicketsArr = [];
    let reopenTicketsArr = [];
    let closeTicketsArr = [];
    yourTickets?.map((item, index) => {
      if (item?.status?.toUpperCase()?.trim() === "OPEN") {
        openTicketsArr.push(item);
      } else if (item?.status?.toUpperCase()?.trim() === "CLOSED") {
        closeTicketsArr.push(item);
      } else if (item?.status?.toUpperCase()?.trim() === "REOPEN") {
        reopenTicketsArr.push(item);
      }
    });
    setOpenTickets(openTicketsArr);
    setCloseTickets(closeTicketsArr);
    setReopenTicket(reopenTicketsArr);
  };

  const renderTicketsFun = ({ item, index }) => {
    // console.
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(navigationStrings.SUPPORT_TICKETS_DETAILS, {
            yourTicketsDeltails: item,
          })
        }
        style={styles.complaintsContainer}
        key={index}
      >
        <View style={styles.complaintsLeftContainer}>
          <Image source={imagePath.ticketIcon} style={styles.complaintsIcon} />
          <View style={{ width: width / 1.4 }}>
            <Text style={styles.complaintsText} numberOfLines={1}>
              {item?.subject}
            </Text>
            <Text style={styles.complaintsDateText}>
              {moment(item?.createdOn).format("MMM DD, HH:mm")}
            </Text>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Image
            source={imagePath.rightArrowIcon}
            style={styles.rightArrowIcon}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // const renderPendingTickets = ({item, index}) => {
  //   return (
  //     <>
  //     {item?.status?.toUpperCase()?.trim() === 'PENDDING'  ?
  //      <View>
  //      <View style={styles.complaintsContainer} key={index}>
  //        <View style={styles.complaintsLeftContainer}>
  //          <Image source={imagePath.chat} style={styles.complaintsIcon} />
  //          <View style={{width: width / 1.4}}>
  //            <Text style={styles.complaintsText} numberOfLines={1}>
  //              {item?.requestMsg?.[0]}
  //            </Text>
  //            <Text style={styles.complaintsDateText}>{moment(item?.updatedOn).format('DD/MM/YYYY')}</Text>
  //          </View>
  //        </View>
  //        <TouchableOpacity
  //          activeOpacity={0.7}
  //          onPress={() =>
  //            navigation.navigate(navigationStrings.SUPPORT_TICKETS_DETAILS)
  //          }>
  //          <Image
  //            source={imagePath.rightArrowIcon}
  //            style={styles.rightArrowIcon}
  //          />
  //        </TouchableOpacity>
  //      </View>
  //      </View>
  //     : null}
  //     </>
  //   );
  // };

  const renderCloseTickets = ({ item, index }) => {
    console?.log(item, "renderYourTickets");
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(navigationStrings.SUPPORT_TICKETS_DETAILS, {
            yourTicketsDeltails: item,
          })
        }
        style={styles.complaintsContainer}
        key={index}
      >
        <View style={styles.complaintsLeftContainer}>
          <Image source={imagePath.chat} style={styles.complaintsIcon} />
          <View style={{ width: width / 1.4 }}>
            <Text style={styles.complaintsText} numberOfLines={1}>
              {item?.requestMsg?.[0]}
            </Text>
            <Text style={styles.complaintsDateText}>
              {moment(item?.updatedOn).format("MMM DD, HH:mm")}
            </Text>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Image
            source={imagePath.rightArrowIcon}
            style={styles.rightArrowIcon}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  return (
    <WrapperContainer>
      <View style={styles.mainContainer}>
        <HeaderComp title={strings.YOUR_SUPPORT_TICKET} icon={true} />
        <ScrollView
          style={styles.bodyContainer}
          contentContainerStyle={{ paddingBottom: moderateScaleVertical(40) }}
          showsVerticalScrollIndicator={false}
        >
          {/* <View style={styles.issueTicketsContainer}>
            <Text style={styles.pendeingTicketsHeading}>
              {strings.PENDING_TICKETS}
            </Text>
            <FlatList
              data={pendingTickets}
              showsVerticalScrollIndicator={false}
              renderItem={(element, index) =>
                renderPendingTickets(element, index)
              }
              keyExtractor={item => item?.id}
              onEndReachedThreshold={0.1}
              onScrollToTop={false} />
          </View> */}

          <View style={styles.issueTicketsContainer}>
            {/* <TouchableOpacity activeOpacity={0.7} onPress={()=> setOpenTicketDropdown(!openTicketDropdown)} style={{flexDirection: 'row', alignItems:'center'}}>
                <Text style={styles.openTicketsHeading}>
                 {chooseTicketList}
                </Text>
                <Image
                  source={imagePath.forword_black}
                  style={openTicketDropdown ? styles.dropdownStyle_2 : styles?.dropdownStyle}
                />
              </TouchableOpacity>
              {openTicketDropdown ? 
              
              <Text onPress={()=> {
                  if(chooseTicketList === strings.OPEN_TICKETS){
                    setChooseTicketList(strings.CLOSE_TICKETS)
                    setOpenTicketDropdown(!openTicketDropdown)
                  }else{
                    setChooseTicketList(strings.OPEN_TICKETS)
                    setOpenTicketDropdown(!openTicketDropdown)
                  }
              }} style={{...styles.openTicketsHeading, marginTop:moderateScale(5)}}>
                  { chooseTicketList === strings.OPEN_TICKETS ? strings.CLOSE_TICKETS : strings.OPEN_TICKETS}
                </Text>
                : null} */}

            <FlatList
              data={chooseTicketList}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
              contentContainerStyle={styles.topTabStyle}
              renderItem={(element, index) => {
                return (
                  <TouchableOpacity
                    style={
                      selectedTickets === element?.item
                        ? {
                            ...styles.selectedTabStyle,
                            ...styles.unselectedTabStyle,
                          }
                        : styles.unselectedTabStyle
                    }
                    onPress={() => setSelectedTickets(element?.item)}
                  >
                    <Text style={styles.menuTitleStyle}>{element?.item}</Text>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item) => item?.id}
              onEndReachedThreshold={0.1}
              onScrollToTop={false}
            />
            {selectedTickets === strings?.OPEN ? (
              <>
                {openTickets?.length ? (
                  <FlatList
                    data={openTickets}
                    showsVerticalScrollIndicator={false}
                    renderItem={(element, index) =>
                      renderTicketsFun(element, index)
                    }
                    keyExtractor={(item) => item?.id}
                    onEndReachedThreshold={0.1}
                    onScrollToTop={false}
                  />
                ) : (
                  <View style={styles.noRecordContainer}>
                    <Text style={styles.noRecordText}>
                      {strings.NO_RECORD_FOUND}
                    </Text>
                  </View>
                )}
              </>
            ) : null}

            {selectedTickets === strings?.CLOSE ? (
              <>
                {closeTickets?.length ? (
                  <FlatList
                    data={closeTickets}
                    showsVerticalScrollIndicator={false}
                    renderItem={(element, index) =>
                      renderTicketsFun(element, index)
                    }
                    keyExtractor={(item) => item?.id}
                    onEndReachedThreshold={0.1}
                    onScrollToTop={false}
                  />
                ) : (
                  <View style={styles.noRecordContainer}>
                    <Text style={styles.noRecordText}>
                      {strings.NO_RECORD_FOUND}
                    </Text>
                  </View>
                )}
              </>
            ) : null}

            {selectedTickets === strings?.REOPEN ? (
              <>
                {reopenTicket?.length ? (
                  <FlatList
                    data={reopenTicket}
                    showsVerticalScrollIndicator={false}
                    renderItem={(element, index) =>
                      renderTicketsFun(element, index)
                    }
                    keyExtractor={(item) => item?.id}
                    onEndReachedThreshold={0.1}
                    onScrollToTop={false}
                  />
                ) : (
                  <View style={styles.noRecordContainer}>
                    <Text style={styles.noRecordText}>
                      {strings.NO_RECORD_FOUND}
                    </Text>
                  </View>
                )}
              </>
            ) : null}
          </View>

          {/* {closeTickets?.length ?
          <View style={styles.issueTicketsContainer}>
            <Text style={styles.closeTicketsHeading}>
              {strings.CLOSE_TICKETS}
            </Text>
            <FlatList
              data={closeTickets}
              showsVerticalScrollIndicator={false}
              renderItem={(element, index) =>
                renderCloseTickets(element, index)
              }
              keyExtractor={item => item?.id}
              onEndReachedThreshold={0.1}
              onScrollToTop={false}/>
          </View>
          : null} */}
        </ScrollView>
      </View>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  bodyContainer: {
    backgroundColor: colors.white,
    marginHorizontal: moderateScale(10),
    flex: 1,
    marginTop: moderateScaleVertical(-65),
    borderRadius: moderateScale(5),
    paddingHorizontal: moderateScale(20),
  },
  complaintsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: moderateScaleVertical(20),
    alignItems: "center",
    // marginHorizontal:moderateScale(20),
    borderBottomColor: colors.lightGray,
    borderBottomWidth: moderateScale(0.5),
    paddingBottom: moderateScaleVertical(10),
  },
  complaintsLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  complaintsIcon: {
    width: moderateScale(width / 15),
    height: moderateScale(width / 15),
    marginRight: moderateScale(10),
  },
  complaintsText: {
    fontSize: textScale(12),
    color: colors.black,
    // flex:0.7,
    fontFamily: fontFamily.robotoRegular,
  },
  rightArrowIcon: {
    width: moderateScale(width / 25),
    height: moderateScale(width / 25),
  },
  complaintsDateText: {
    marginTop: moderateScaleVertical(5),
    fontSize: textScale(12),
    color: colors.gray,
    fontFamily: fontFamily.robotoRegular,
  },
  openTicketsHeading: {
    fontFamily: fontFamily.robotoRegular,
    fontSize: textScale(14),
    color: colors.black,
  },
  pendeingTicketsHeading: {
    fontFamily: fontFamily.robotoRegular,
    fontSize: textScale(14),
    color: colors.orange,
  },
  closeTicketsHeading: {
    fontFamily: fontFamily.robotoRegular,
    fontSize: textScale(14),
    color: colors.gray,
  },
  issueTicketsContainer: {
    marginTop: moderateScaleVertical(20),
  },
  noRecordContainer: {
    height: height / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  noRecordText: {
    fontSize: textScale(16),
    fontFamily: fontFamily.robotoRegular,
    color: colors.black,
  },
  topTabStyle: {
    flexDirection: "row",
    marginVertical: moderateScaleVertical(5),
    borderBottomColor: colors.lightGray,
    borderBottomWidth: moderateScale(1),
    // paddingBottom:moderateScaleVertical(10)
  },
  selectedTabStyle: {
    borderBottomColor: colors.darkBlue,
    borderBottomWidth: moderateScale(2),
    paddingBottom: moderateScaleVertical(10),
    alignItems: "center",
  },
  menuTitleStyle: {
    fontFamily: fontFamily.robotoRegular,
    fontSize: textScale(12),
    color: colors.black,
  },
  unselectedTabStyle: {
    width: moderateScale(width / 3.6),
    alignItems: "center",
    paddingBottom: moderateScaleVertical(10),
  },
});

export default TicketListing;

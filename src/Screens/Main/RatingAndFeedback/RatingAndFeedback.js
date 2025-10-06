import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { styles } from "./style";
import WrapperContainer from "../../../Components/WrapperContainer";
import imagePath from "../../../constants/imagePath";
import strings from "../../../constants/lang";
import { Rating, AirbnbRating } from "react-native-ratings";
import colors from "../../../styles/colors";
import { textScale } from "../../../styles/responsiveSize";
import ProgressRating from "./Components/ProgressRating";
import actions from "../../../redux/actions";
import { showError } from "../../../utils/helperFunction";
import { useSelector } from "react-redux";
import { DOC_URL } from "../../../config/urls";
import Moment from "moment";
import { extendMoment } from "moment-range";
import navigationStrings from "../../../navigation/navigationStrings";
const moment = extendMoment(Moment);

export default function RatingAndFeedback({ route, navigation }) {
  const profileData = useSelector(
    (state) => state?.profileDataReducer?.profileData
  );

  const [loading, setloading] = useState(false);
  const [overview, setoverview] = useState(true);
  const [reviews, setreviews] = useState(false);
  const [ratingOverviewData, setratingOverviewData] = useState("");
  const [totalReview, settotalReview] = useState("");
  const [averageRating, setaverageRating] = useState(0);
  const [empList, setempList] = useState([]);
  const [ratingCatList, setratingCatList] = useState([]);

  useEffect(() => {
    getRatingOverview();
  }, []);

  const getRatingOverview = () => {
    actions
      .getRatingOvervieStatus()
      .then((res) => {
        let data = res?.data;
        if (res?.status === 200) {
          setratingOverviewData(data?.ratingMap);
          setaverageRating(data?.averageRating);
          settotalReview(
            parseInt(data?.ratingMap?.Excellent) +
              parseInt(data?.ratingMap?.Poor) +
              parseInt(data?.ratingMap?.Average) +
              parseInt(data?.ratingMap?.Good) +
              parseInt(data?.ratingMap?.BelowAverage)
          );
          setempList(data?.passList);
          let catList = [];

          for (const key in data?.categoryRatingMap) {
            let objectKey = key;
            let objectValue = data?.categoryRatingMap[key];
            let catobj = {
              [objectKey]: objectValue,
            };

            catList.push(catobj);
          }

          setratingCatList(catList);
        } else {
          showError("Server error");
        }
      })
      .catch((error) => {});
  };

  const renderItem = ({ item, index }) => {
    let color;
    if (item?.rating === 1) {
      color = colors.rating_1;
    } else if (item?.rating === 2) {
      color = colors.rating_2;
    } else if (item?.rating === 3) {
      color = colors.rating_3;
    } else if (item?.rating === 4) {
      color = colors.rating_4;
    } else if (item?.rating === 5) {
      color = colors.rating_5;
    } else {
      color = null;
    }

    let dateObj = new Date(item?.ratedDate);
    let momentObj = moment(dateObj);
    let momentString = momentObj.format("MMM D, YYYY");

    return (
      <View style={styles.listItemContainer}>
        <View style={styles.listItemThumbnailIconContainer}>
          {item?.ratedByPassengerPhoto ? (
            <Image
              resizeMode="cover"
              source={{ uri: DOC_URL + item?.ratedByPassengerPhoto }}
              style={styles.listItemThumbnail}
            />
          ) : (
            <Image
              resizeMode="contain"
              source={imagePath.userIcon}
              style={styles.listItemThumbnail}
            />
          )}
        </View>
        <View style={styles.listItemDetailContainer}>
          <Text style={styles.listItemName}>{item?.ratedByPassengerName}</Text>
          <AirbnbRating
            isDisabled={true}
            starContainerStyle={styles.starContainerStyle}
            ratingContainerStyle={styles.ratingContainerStyle}
            reviews={[
              `${strings.BAD}`,
              `${strings.OK}`,
              `${strings.GOOD}`,
              `${strings.VERY_GOOD}`,
              `${strings.AMAZING}`,
            ]}
            reviewColor="transparent"
            reviewSize={textScale(10)}
            ratingCount={5}
            defaultRating={item.rating}
            selectedColor={color}
            size={15}
          />

          <Text style={styles.listItemDateText}>{momentString}</Text>
        </View>
      </View>
    );
  };

  const renderRatingCategory = ({ item, index }) => {
    let getKey = Object.keys(item);
    let getValue = Object.values(item);

    return (
      <View style={styles.categoryContainer}>
        <View style={styles.categoryLeftBox}>
          <Text style={styles.categoryName}>{getKey[0]}</Text>
        </View>
        <View style={styles.categoryRightBox}>
          <View style={styles.rightBoxRow}>
            <Text style={styles.numberOfTimesRated}>
              ({getValue[0]?.categoryNoOfTimesRated})
            </Text>
            <Rating
              type="custom"
              ratingCount={5}
              startingValue={getValue[0]?.categoryPerc}
              ratingBackgroundColor={colors.white}
              imageSize={12}
              readonly
            />
          </View>
        </View>
      </View>
    );
  };
  return (
    <WrapperContainer isLoading={loading}>
      <View style={styles.topContainer}>
        <View style={styles.headerBackgroundImage}>
          <View style={styles.titleAndIconContainer}>
            <View style={styles.backButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (route?.params?.navigationData) {
                    navigation.navigate(navigationStrings.STATES, {
                      navigationData: route?.params?.navigationData,
                    });
                  } else {
                    navigation.goBack();
                  }
                }}
              >
                <Image
                  source={imagePath.backArrowIcon}
                  style={styles.backIcon}
                />
              </TouchableOpacity>
              <Text style={styles.headerTitleText}>
                {strings.RATING_AND_FEEDBACK}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.contentSectionContainer}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => {
                setoverview(true);
                setreviews(false);
                getRatingOverview();
              }}
              style={
                overview ? styles.activeButtonStyle : styles.deactiveButtonStyle
              }
            >
              <Text
                style={
                  overview ? styles.activeTextStyle : styles.deactiveTextStyle
                }
              >
                Overview
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setoverview(false);
                setreviews(true);
              }}
              style={
                reviews ? styles.activeButtonStyle : styles.deactiveButtonStyle
              }
            >
              <Text
                style={
                  reviews ? styles.activeTextStyle : styles.deactiveTextStyle
                }
              >
                Reviews
              </Text>
            </TouchableOpacity>
          </View>
          {overview ? (
            <View
              showsVerticalScrollIndicator={false}
              style={styles.overviewContainer}
            >
              <View style={styles.overviewAverageRatingContainer}>
                <Text style={styles.overallRatingText}>Overall Rating</Text>
                <View style={styles.overallRatingTextContainer}>
                  <Text style={styles.ratingTextStyle}>{averageRating}</Text>
                  <Rating
                    type="custom"
                    ratingCount={5}
                    startingValue={parseFloat(averageRating)}
                    ratingBackgroundColor={colors.white}
                    imageSize={32}
                    readonly
                  />
                  <Text style={styles.overviewTotalReviewText}>
                    Based on {totalReview} reviews
                  </Text>
                </View>
              </View>
              <View style={styles.progressRatingContainer}>
                <ProgressRating
                  totalReview={totalReview}
                  data={ratingOverviewData}
                />
              </View>

              <View style={styles.devider}></View>

              {ratingCatList.length > 0 ? (
                <View style={styles.feedbackSummaryContainer}>
                  <Text style={styles.feedbackText}>Feedback Summary</Text>
                  <Text style={styles.skillAndCompetenceText}>
                    Personal skills and competences
                  </Text>

                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={ratingCatList}
                    renderItem={renderRatingCategory}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              ) : null}
            </View>
          ) : (
            <>
              <View style={styles.driverDetailContainer}>
                <View style={styles.nameAndIconContainer}>
                  {profileData?.photo ? (
                    <Image
                      style={styles.thumbnailIcon}
                      source={{ uri: DOC_URL + profileData?.photo }}
                    />
                  ) : (
                    <Image
                      style={styles.thumbnailIcon}
                      source={imagePath.userIcon}
                    />
                  )}

                  <Text style={styles.driverNameStyle}>
                    {profileData?.firstName + " " + profileData?.lastName}
                  </Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Text style={styles.overallRatingText}>Overall Rating</Text>
                  <View style={styles.ratingDetailContainer}>
                    <View style={styles.ratingTextContainer}>
                      <Text style={styles.ratingTextStyle}>
                        {averageRating}
                      </Text>
                    </View>
                    <View style={styles.ratingStarContainer}>
                      <Rating
                        type="custom"
                        ratingCount={5}
                        startingValue={parseFloat(averageRating)}
                        ratingBackgroundColor={colors.white}
                        imageSize={18}
                        readonly
                      />
                      <Text style={styles.totalReviewText}>
                        Based on {totalReview} reviews
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.progressRatingContainer}>
                <ProgressRating
                  totalReview={totalReview}
                  data={ratingOverviewData}
                />
              </View>
              <View style={styles.devider}></View>

              <View style={styles.ratingListContainer}>
                <Text style={styles.reviewText}>Review</Text>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={empList}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </>
          )}
        </View>
      </View>
    </WrapperContainer>
  );
}

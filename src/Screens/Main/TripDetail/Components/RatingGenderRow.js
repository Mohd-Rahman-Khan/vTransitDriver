import { View, Text, Image } from "react-native";
import React from "react";
import { styles } from "../style";
import { AirbnbRating } from "react-native-ratings";
import imagePath from "../../../../constants/imagePath";
import colors from "../../../../styles/colors";

export default function RatingGenderRow({ item }) {
  return item?.deBoardPassengers ? (
    <View style={styles.genderRatingVaccineRowStyle}>
      <View style={styles.ratingContainer}>
        <AirbnbRating
          showRating={false}
          count={5}
          defaultRating={item?.deBoardPassengers[0]?.passRating}
          size={10}
          isDisabled={true}
          selectedColor={colors.green}
        />
      </View>
      <View style={styles.verticalDeviderContainer}>
        <View style={styles.verticalDivier}></View>
      </View>
      <View style={styles.genderAndVaccineIconContainer}>
        {item?.deBoardPassengers[0]?.vaccineStatus ? (
          <View style={styles.vaccineIconContainer}>
            {item?.deBoardPassengers[0]?.vaccineStatus === "Fully Vaccinated" ||
            item?.deBoardPassengers[0]?.vaccineStatus === "Vaccinated Fully" ? (
              <Image
                style={styles.vaccineIconStyle}
                source={imagePath.Vaccinated_green}
              />
            ) : item?.deBoardPassengers[0]?.vaccineStatus ===
              "Partially Vaccinated" ? (
              <Image
                style={styles.vaccineIconStyle}
                source={imagePath.partially_vaccinated_blue}
              />
            ) : item?.deBoardPassengers[0]?.vaccineStatus ===
              "Not Vaccinated" ? (
              <Image
                style={styles.vaccineIconStyle}
                source={imagePath.not_vaccinated_orange}
              />
            ) : null}
          </View>
        ) : null}

        <View style={styles.genderIconContainer}>
          {item.deBoardPassengers[0]?.gender === "Male" ? (
            <Image style={styles.genderIconStyle} source={imagePath.male} />
          ) : item.deBoardPassengers[0]?.gender === "Female" ? (
            <Image style={styles.genderIconStyle} source={imagePath.female} />
          ) : (
            <Image style={styles.genderIconStyle} source={imagePath.other} />
          )}
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.genderRatingVaccineRowStyle}>
      <View style={styles.ratingContainer}>
        <AirbnbRating
          showRating={false}
          count={5}
          defaultRating={item?.onBoardPassengers[0]?.passRating}
          size={10}
          isDisabled={true}
          selectedColor={colors.green}
        />
      </View>
      <View style={styles.verticalDeviderContainer}>
        <View style={styles.verticalDivier}></View>
      </View>
      <View style={styles.genderAndVaccineIconContainer}>
        {item?.onBoardPassengers[0]?.vaccineStatus ? (
          <View style={styles.vaccineIconContainer}>
            {item?.onBoardPassengers[0]?.vaccineStatus === "Fully Vaccinated" ||
            item?.onBoardPassengers[0]?.vaccineStatus === "Vaccinated Fully" ? (
              <Image
                style={styles.vaccineIconStyle}
                source={imagePath.Vaccinated_green}
              />
            ) : item?.onBoardPassengers[0]?.vaccineStatus ===
              "Partially Vaccinated" ? (
              <Image
                style={styles.vaccineIconStyle}
                source={imagePath.partially_vaccinated_blue}
              />
            ) : item?.onBoardPassengers[0]?.vaccineStatus ===
              "Not Vaccinated" ? (
              <Image
                style={styles.vaccineIconStyle}
                source={imagePath.not_vaccinated_orange}
              />
            ) : null}
          </View>
        ) : null}

        <View style={styles.genderIconContainer}>
          {item.onBoardPassengers[0]?.gender === "Male" ? (
            <Image style={styles.genderIconStyle} source={imagePath.male} />
          ) : item.onBoardPassengers[0]?.gender === "Female" ? (
            <Image style={styles.genderIconStyle} source={imagePath.female} />
          ) : (
            <Image style={styles.genderIconStyle} source={imagePath.other} />
          )}
        </View>
      </View>
    </View>
  );
}

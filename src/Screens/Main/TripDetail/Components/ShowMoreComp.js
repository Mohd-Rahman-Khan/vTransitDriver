import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import colors from "../../../../styles/colors";
import { AirbnbRating } from "react-native-ratings";
import imagePath from "../../../../constants/imagePath";
import { styles } from "../style";
import { DOC_URL } from "../../../../config/urls";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { getDelayOrEarlyMinutes } from "../../../../utils/utils";

const moment = extendMoment(Moment);

export default function ShowMoreComp(props) {
  return (
    <View>
      <View style={styles.showMoreDetailContainer}>
        <TouchableOpacity
          onPress={() => {
            props.showMorePress();
          }}
          style={styles.shoeMoreLeftBox}
        >
          <Image
            style={styles.showMoreGroupIcon}
            source={imagePath.group_icon}
          />
          <Text style={styles.showMoreNumberEmpText}>
            {props?.item?.onBoardPassengers
              ? props.item?.onBoardPassengers?.length
              : props.item?.deBoardPassengers?.length}
          </Text>
        </TouchableOpacity>

        <View>
          {props?.delayMinutes > 0 ? (
            <View style={styles.showMoreRightBox}>
              <Image
                source={imagePath.vehicleDelay}
                style={styles.vehicleDelayAndOnTimeIcon}
                resizeMode="contain"
              />
            </View>
          ) : null}
          {props?.item?.actualWaitingTimeInSec > 0 ? (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 12, color: "black" }}>
                {/* WT- {Math.floor(props?.item?.actualWaitingTimeInSec / 60)} Min */}
                WT- {(props?.item?.actualWaitingTimeInSec / 60).toFixed(2)} Min
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {props.item?.showMore
        ? props.item?.onBoardPassengers
          ? props.item?.onBoardPassengers.map((listItem) => {
              let employeeDelay = false;
              if (
                props.item?.expectedArivalTime > 0 &&
                listItem?.actualPickUpDateTime > 0
              ) {
                let getDelayTime = getDelayOrEarlyMinutes(
                  props.item?.expectedArivalTime,
                  listItem?.actualPickUpDateTime
                );
                if (getDelayTime > 0) {
                  employeeDelay = true;
                } else {
                  employeeDelay = false;
                }
              }
              return (
                <View
                  key={listItem?.id}
                  style={styles.showMoreEmpDetailContainer}
                >
                  <View style={styles.showMoreEmpDetailLeftBox}>
                    <View>
                      {props?.driverAppSettingData
                        ?.canDriverViewEmployeesPhoto == "YES" ? (
                        listItem?.photo ? (
                          <Image
                            style={styles.empImageStyle}
                            source={{ uri: DOC_URL + listItem?.photo }}
                          />
                        ) : (
                          <Image
                            //source={imagePath.userIcon}
                            source={
                              listItem?.passType == "ESCORT"
                                ? imagePath.maleAvatar
                                : listItem?.gender == "Male" ||
                                  listItem?.gender == "M"
                                ? imagePath.maleAvatar
                                : listItem?.gender == "Female" ||
                                  listItem?.gender == "F"
                                ? imagePath.femaleAvatar
                                : imagePath.userIcon
                            }
                            style={styles.empImageStyle}
                          />
                        )
                      ) : (
                        <Image
                          //source={imagePath.userIcon}
                          source={
                            listItem?.passType == "ESCORT"
                              ? imagePath.maleAvatar
                              : listItem?.gender == "Male" ||
                                listItem?.gender == "M"
                              ? imagePath.maleAvatar
                              : listItem?.gender == "Female" ||
                                listItem?.gender == "F"
                              ? imagePath.femaleAvatar
                              : imagePath.userIcon
                          }
                          style={styles.empImageStyle}
                        />
                      )}
                    </View>
                    <View style={styles.showMoreEmpNameContainer}>
                      <Text style={styles.showMoreEmpNameText}>
                        {listItem.name}
                      </Text>
                      <View style={styles.showMoreRatingAndIconContainer}>
                        <View style={styles.showMoreRatingAndIconContainer}>
                          <AirbnbRating
                            showRating={false}
                            count={5}
                            defaultRating={listItem?.passRating}
                            size={10}
                            isDisabled={true}
                            selectedColor={colors.green}
                          />
                        </View>
                        <View style={styles.verticalDeviderContainer}>
                          <View style={styles.verticalDivier}></View>
                        </View>
                        <View style={styles.genderAndVaccineIconContainer}>
                          {listItem?.vaccineStatus ? (
                            <View style={styles.vaccineIconContainer}>
                              {listItem?.vaccineStatus === "Fully Vaccinated" ||
                              listItem?.vaccineStatus === "Vaccinated Fully" ? (
                                <Image
                                  style={styles.vaccineIconStyle}
                                  source={imagePath.Vaccinated_green}
                                />
                              ) : listItem?.vaccineStatus ===
                                "Partially Vaccinated" ? (
                                <Image
                                  style={styles.vaccineIconStyle}
                                  source={imagePath.partially_vaccinated_blue}
                                />
                              ) : listItem?.vaccineStatus ===
                                "Not Vaccinated" ? (
                                <Image
                                  style={styles.vaccineIconStyle}
                                  source={imagePath.not_vaccinated_orange}
                                />
                              ) : null}
                            </View>
                          ) : null}

                          <View style={styles.genderIconContainer}>
                            {listItem?.gender === "Male" ? (
                              <Image
                                style={styles.genderIconStyle}
                                source={imagePath.male}
                              />
                            ) : listItem?.gender === "Female" ? (
                              <Image
                                style={styles.genderIconStyle}
                                source={imagePath.female}
                              />
                            ) : (
                              <Image
                                style={styles.genderIconStyle}
                                source={imagePath.other}
                              />
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.showMoreEmpDetailRightBox}>
                    {listItem?.status === "ABSENT" ? (
                      <>
                        <Image
                          source={imagePath.absent}
                          style={styles.absentIconStyle}
                          resizeMode="contain"
                        />
                        <Text style={styles.absentTimeStyle}>
                          {listItem.absentDateTime === 0
                            ? null
                            : moment
                                .utc(listItem.absentDateTime)
                                .local()
                                .format("HH:mm")}
                        </Text>
                      </>
                    ) : listItem?.status === "BOARDED" ? (
                      <Text style={styles.absentTimeStyle}>
                        {listItem?.actualPickUpDateTime === 0
                          ? null
                          : moment(listItem?.actualPickUpDateTime).format(
                              "HH:mm"
                            )}
                      </Text>
                    ) : listItem?.status === "COMPLETED" ? (
                      <>
                        <Text style={styles.absentTimeStyle}>
                          {listItem?.actualPickUpDateTime === 0
                            ? null
                            : moment(listItem?.actualPickUpDateTime).format(
                                "HH:mm"
                              )}
                        </Text>
                        <Text style={styles.absentTimeStyle}>
                          {listItem?.actualDropDateTime === 0
                            ? null
                            : moment(listItem?.actualDropDateTime).format(
                                "HH:mm"
                              )}
                        </Text>
                      </>
                    ) : listItem?.status === "CANCLED" ? (
                      <>
                        <Image
                          source={imagePath.crossIcon}
                          style={styles.crossIconStyle}
                        />
                        {listItem?.cancelDateTime === 0 ? null : (
                          <Text style={styles.absentTimeStyle}>
                            {moment(listItem?.cancelDateTime).format("HH:mm")}
                          </Text>
                        )}
                      </>
                    ) : listItem?.status === "SCHEDULE" ? (
                      <Text style={styles.absentTimeStyle}>
                        {listItem?.actualDropDateTime === 0
                          ? null
                          : moment(listItem?.actualDropDateTime).format(
                              "HH:mm"
                            )}
                      </Text>
                    ) : listItem?.status === "NOSHOW" ? (
                      <>
                        <Image
                          source={imagePath.noShowIcon}
                          style={styles.skipAndNoShowEmpIcon}
                          resizeMode="contain"
                        />
                        {listItem?.noShowMarkTime === 0 ? null : (
                          <Text style={styles.absentTimeStyle}>
                            {moment(listItem?.noShowMarkTime).format("HH:mm")}
                          </Text>
                        )}
                      </>
                    ) : listItem?.status === "SKIPPED" ? (
                      <>
                        <Image
                          source={imagePath.skippedIcon}
                          style={styles.skipAndNoShowEmpIcon}
                          resizeMode="contain"
                        />
                        {listItem?.escortSkippedTime ? (
                          listItem?.escortSkippedTime === 0 ? null : (
                            <Text style={styles.absentTimeStyle}>
                              {moment(listItem?.escortSkippedTime).format(
                                "HH:mm"
                              )}
                            </Text>
                          )
                        ) : null}
                      </>
                    ) : (
                      <View style={styles.empStatusContainer}>
                        <Text style={styles.empStatusText}>
                          {listItem?.status}
                        </Text>
                      </View>
                    )}
                  </View>
                  {employeeDelay ? (
                    <View style={styles.empDelayContainer}>
                      <Image
                        source={imagePath.delayIcon}
                        style={styles.delayAndEarlyIconStyle}
                        resizeMode="contain"
                      />
                    </View>
                  ) : null}
                </View>
              );
            })
          : props.item?.deBoardPassengers.map((listItem) => {
              let employeeDelay = false;
              if (
                props.item?.expectedArivalTime > 0 &&
                listItem?.actualPickUpDateTime > 0
              ) {
                let getDelayTime = getDelayOrEarlyMinutes(
                  props.item?.expectedArivalTime,
                  listItem?.actualPickUpDateTime
                );

                if (getDelayTime > 0) {
                  employeeDelay = true;
                } else {
                  employeeDelay = false;
                }
              }
              return (
                <View
                  key={listItem?.id}
                  style={styles.showMoreEmpDetailContainer}
                >
                  <View style={styles.showMoreEmpDetailLeftBox}>
                    <View>
                      {props?.driverAppSettingData
                        ?.canDriverViewEmployeesPhoto == "YES" ? (
                        listItem?.photo ? (
                          <Image
                            style={styles.empImageStyle}
                            source={{ uri: DOC_URL + listItem?.photo }}
                          />
                        ) : (
                          <Image
                            //source={imagePath.userIcon}
                            source={
                              listItem?.passType == "ESCORT"
                                ? imagePath.maleAvatar
                                : listItem?.gender == "Male" ||
                                  listItem?.gender == "M"
                                ? imagePath.maleAvatar
                                : listItem?.gender == "Female" ||
                                  listItem?.gender == "F"
                                ? imagePath.femaleAvatar
                                : imagePath.userIcon
                            }
                            style={styles.empImageStyle}
                          />
                        )
                      ) : (
                        <Image
                          //source={imagePath.userIcon}
                          source={
                            listItem?.passType == "ESCORT"
                              ? imagePath.maleAvatar
                              : listItem?.gender == "Male" ||
                                listItem?.gender == "M"
                              ? imagePath.maleAvatar
                              : listItem?.gender == "Female" ||
                                listItem?.gender == "F"
                              ? imagePath.femaleAvatar
                              : imagePath.userIcon
                          }
                          style={styles.empImageStyle}
                        />
                      )}
                    </View>
                    <View style={styles.showMoreEmpNameContainer}>
                      <Text style={styles.showMoreEmpNameText}>
                        {listItem.name}
                      </Text>
                      <View style={styles.showMoreRatingAndIconContainer}>
                        <View style={styles.showMoreRatingAndIconContainer}>
                          <AirbnbRating
                            showRating={false}
                            count={5}
                            defaultRating={listItem?.passRating}
                            size={10}
                            isDisabled={true}
                            selectedColor={colors.green}
                          />
                        </View>
                        <View style={styles.verticalDeviderContainer}>
                          <View style={styles.verticalDivier}></View>
                        </View>
                        <View style={styles.genderAndVaccineIconContainer}>
                          {listItem?.vaccineStatus ? (
                            <View style={styles.vaccineIconContainer}>
                              {listItem?.vaccineStatus === "Fully Vaccinated" ||
                              listItem?.vaccineStatus === "Vaccinated Fully" ? (
                                <Image
                                  style={styles.vaccineIconStyle}
                                  source={imagePath.Vaccinated_green}
                                />
                              ) : listItem?.vaccineStatus ===
                                "Partially Vaccinated" ? (
                                <Image
                                  style={styles.vaccineIconStyle}
                                  source={imagePath.partially_vaccinated_blue}
                                />
                              ) : listItem?.vaccineStatus ===
                                "Not Vaccinated" ? (
                                <Image
                                  style={styles.vaccineIconStyle}
                                  source={imagePath.not_vaccinated_orange}
                                />
                              ) : null}
                            </View>
                          ) : null}

                          <View style={styles.genderIconContainer}>
                            {listItem?.gender === "Male" ? (
                              <Image
                                style={styles.genderIconStyle}
                                source={imagePath.male}
                              />
                            ) : listItem?.gender === "Female" ? (
                              <Image
                                style={styles.genderIconStyle}
                                source={imagePath.female}
                              />
                            ) : (
                              <Image
                                style={styles.genderIconStyle}
                                source={imagePath.other}
                              />
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.showMoreEmpDetailRightBox}>
                    {listItem?.status === "ABSENT" ? (
                      <>
                        <Image
                          source={imagePath.absent}
                          style={styles.absentIconStyle}
                          resizeMode="contain"
                        />
                        <Text style={styles.absentTimeStyle}>
                          {listItem.absentDateTime === 0
                            ? null
                            : moment
                                .utc(listItem.absentDateTime)
                                .local()
                                .format("HH:mm")}
                        </Text>
                      </>
                    ) : listItem?.status === "BOARDED" ? (
                      <Text style={styles.absentTimeStyle}>
                        {listItem?.actualPickUpDateTime === 0
                          ? null
                          : moment(listItem?.actualPickUpDateTime).format(
                              "HH:mm"
                            )}
                      </Text>
                    ) : listItem?.status === "COMPLETED" ? (
                      <>
                        <Text style={styles.absentTimeStyle}>
                          {listItem?.actualPickUpDateTime === 0
                            ? null
                            : moment(listItem?.actualPickUpDateTime).format(
                                "HH:mm"
                              )}
                        </Text>
                        <Text style={styles.absentTimeStyle}>
                          {listItem?.actualDropDateTime === 0
                            ? null
                            : moment(listItem?.actualDropDateTime).format(
                                "HH:mm"
                              )}
                        </Text>
                      </>
                    ) : listItem?.status === "CANCLED" ? (
                      <>
                        <Image
                          source={imagePath.crossIcon}
                          style={styles.crossIconStyle}
                        />
                        {listItem?.cancelDateTime === 0 ? null : (
                          <Text style={styles.absentTimeStyle}>
                            {moment(listItem?.cancelDateTime).format("HH:mm")}
                          </Text>
                        )}
                      </>
                    ) : listItem?.status === "SCHEDULE" ? (
                      <Text style={styles.absentTimeStyle}>
                        {listItem?.actualDropDateTime === 0
                          ? "--"
                          : moment(listItem?.actualDropDateTime).format(
                              "HH:mm"
                            )}
                      </Text>
                    ) : listItem?.status === "NOSHOW" ? (
                      <>
                        <Image
                          source={imagePath.noShowIcon}
                          style={styles.skipAndNoShowEmpIcon}
                          resizeMode="contain"
                        />
                        {listItem?.noShowMarkTime === 0 ? null : (
                          <Text style={styles.absentTimeStyle}>
                            {moment(listItem?.noShowMarkTime).format("HH:mm")}
                          </Text>
                        )}
                      </>
                    ) : listItem?.status === "SKIPPED" ? (
                      <>
                        <Image
                          source={imagePath.skippedIcon}
                          style={styles.skipAndNoShowEmpIcon}
                          resizeMode="contain"
                        />
                        {listItem?.escortSkippedTime ? (
                          listItem?.escortSkippedTime === 0 ? null : (
                            <Text style={styles.absentTimeStyle}>
                              {moment(listItem?.escortSkippedTime).format(
                                "HH:mm"
                              )}
                            </Text>
                          )
                        ) : null}
                      </>
                    ) : (
                      <View style={styles.empStatusContainer}>
                        <Text style={styles.empStatusText}>
                          {listItem?.status}
                        </Text>
                      </View>
                    )}
                  </View>
                  {employeeDelay ? (
                    <View style={styles.empDelayContainer}>
                      <Image
                        source={imagePath.delayIcon}
                        style={styles.delayAndEarlyIconStyle}
                        resizeMode="contain"
                      />
                    </View>
                  ) : null}
                </View>
              );
            })
        : null}
    </View>
  );
}

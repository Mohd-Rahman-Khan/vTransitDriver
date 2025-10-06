import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SectionList,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
//import Modal from "react-native-modal";
import YoutubePlayer from "react-native-youtube-iframe";
import actions from "../../../redux/actions";
import {
  height,
  moderateScaleVertical,
  width,
} from "../../../styles/responsiveSize";
import { styles } from "./styles";
import imagePath from "../../../constants/imagePath";

export default function TrainingVideo({
  route,
  navigation,
  setloader = () => {},
}) {
  const [playing, setPlaying] = useState(false);
  const [link, setLink] = useState("");
  const isFocused = useIsFocused();
  const [trainingVideosList, setTrainingVideosList] = useState([]);
  useEffect(() => {
    if (isFocused) {
      _getTrainingVideos();
    }
  }, [isFocused]);

  const _getTrainingVideos = () => {
    setloader(true);
    actions
      .trainingVideos()
      .then((response) => {
        setloader(false);
        let { status } = response;
        if (status == 200) {
          let temArr = [...response?.data];
          temArr?.map((ele, index) => {
            ele?.data?.map((element, ind) => {
              let res = element?.youtubeURL?.split("/");

              if (temArr?.[index]?.data?.[ind]?.youtubeURL) {
                temArr[index].data[ind].youtubeURL = res?.[res?.length - 1];
              }
            });
          });

          setTrainingVideosList(temArr);
        } else {
        }
      })
      .catch((error) => {
        setloader(false);
      });
  };

  const ListItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setPlaying(true);
          setLink(item?.youtubeURL);
        }}
        style={styles.thumbnailContainer}
      >
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Image
            source={
              item?.thumbnailURL
                ? { uri: item?.thumbnailURL }
                : item?.thumbnail
                ? { uri: DOC_URL + item?.thumbnail }
                : { uri: `http://img.youtube.com/vi/${item?.youtubeURL}/0.jpg` }
            }
            style={styles.thumbnainImageContainerStyle}
            resizeMode={"cover"}
          />
          <View style={{ position: "absolute" }}>
            <Image
              source={imagePath.playVideoIcon}
              style={styles.playIconStyle}
            />
          </View>
        </View>
        <Text style={styles.videoTitle}>{item?.title}</Text>
        <Text style={styles.videoDescription} numberOfLines={2}>
          {item?.description}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {trainingVideosList?.length > 0 ? (
        <SectionList
          contentContainerStyle={styles.sectionListContainer}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          getItemCount={(item) => item?.length}
          sections={trainingVideosList}
          renderSectionHeader={({ section }) => (
            <View style={{ marginTop: moderateScaleVertical(20) }}>
              <Text style={styles.sectionListHeader}>{section?.title}</Text>
              {section?.data?.length > 0 ? (
                <FlatList
                  horizontal
                  data={section.data}
                  renderItem={({ item }) => <ListItem item={item} />}
                  showsHorizontalScrollIndicator={false}
                />
              ) : null}
            </View>
          )}
          renderItem={({ item, section }) => {
            return null;
          }}
        />
      ) : (
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Record not found.</Text>
        </View>
      )}

      <Modal animationType="fade" transparent={true} visible={playing}>
        <TouchableWithoutFeedback
          onPress={() => {
            setPlaying(false);
          }}
          style={styles.mainContainer}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalInsideContainer}
            >
              <YoutubePlayer
                height={height / 3.5}
                width={width / 1.05}
                play={true}
                videoId={link}
              />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

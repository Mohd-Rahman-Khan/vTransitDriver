import { useIsFocused, useNavigation } from "@react-navigation/native";
import { string } from "is_js";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SectionList,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Linking,
  Platform,
} from "react-native";
//import Modal from "react-native-modal";
import YoutubePlayer from "react-native-youtube-iframe";
import { DOC_URL } from "../../../config/urls";
import imagePath from "../../../constants/imagePath";
import navigationStrings from "../../../navigation/navigationStrings";
import actions from "../../../redux/actions";
import {
  height,
  moderateScaleVertical,
  width,
} from "../../../styles/responsiveSize";
import { styles } from "./styles";

const UserGuide = ({ setloader = () => {} }) => {
  const isFocused = useIsFocused();
  const [userGuidList, setUserGuidList] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    if (isFocused) {
      _getUserGuide();
    }
  }, [isFocused]);

  const _getUserGuide = () => {
    setloader(true);
    actions
      .userGuide()
      .then((response) => {
        setloader(false);
        let { status } = response;
        if (status == 200) {
          setUserGuidList(response?.data);
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
          if (Platform.OS == "android") {
            Linking.openURL(
              `https://drive.google.com/viewerng/viewer?embedded=true&url=${
                DOC_URL + item?.doc
              }`
            );
          } else {
            Linking.openURL(DOC_URL + item?.doc);
          }
          // navigation.navigate(navigationStrings.WEBVIEW, {
          //   data: {
          //     title: item?.title,
          //     uri: `https://drive.google.com/viewerng/viewer?embedded=true&url=${
          //       DOC_URL + item?.doc
          //     }`,
          //   },
          // });
        }}
        style={styles.thumbnailContainer}
      >
        <Image
          source={
            item?.doc?.split(".").pop() === "pdf"
              ? imagePath.pdfIcon
              : imagePath.xlsIcon
          }
          style={styles.docIconStyle}
          resizeMode={"cover"}
        />
        <Text style={styles.videoTitle}>{item?.title}</Text>
        <Text style={styles.videoDescription} numberOfLines={2}>
          {item?.description}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <>
      {userGuidList?.length > 0 ? (
        <SectionList
          contentContainerStyle={styles.sectionListContainer}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          getItemCount={(item) => item?.length}
          sections={userGuidList}
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
    </>
  );
};

export default UserGuide;

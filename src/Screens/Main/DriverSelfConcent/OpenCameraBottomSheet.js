import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { Component } from "react";
import { RNCamera, FaceDetector } from "react-native-camera";
import BottomSheet from "react-native-gesture-bottom-sheet";
import ButtonComp from "../../../Components/ButtonComp";
import colors from "../../../styles/colors";
import RBSheet from "react-native-raw-bottom-sheet";
import imagePath from "../../../constants/imagePath";
import { imageCompress } from "../../../utils/imageCompressor";
import { styles } from "./style";

export default class OpenCameraBottomSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frontCam: true,
      withMask: "",
      withoutMask: "",
      imageClicks: false,
      showImage: false,
      title: "Photo with mask",
      loading: false,
    };
  }
  takePicture = async (picType) => {
    if (this.camera) {
      this.setState({
        loading: true,
      });
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      let getCompImg = await imageCompress(data?.uri);

      if (getCompImg) {
        if (picType === "withMask") {
          this.setState({
            withMask: getCompImg,
            showImage: true,
            loading: false,
          });
        } else {
          this.setState({
            withoutMask: getCompImg,
            showImage: true,
            loading: false,
          });
        }
      }
    }
  };
  render() {
    return (
      <View style={styles.openCamerasheetMainContainer}>
        <RBSheet
          height={710}
          ref={this.props.showbottomSheet}
          closeOnDragDown={false}
          closeOnPressMask={true}
          customStyles={styles.cameraSheetCustomStyle}
        >
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.heaingStyle}>{this.state.title}</Text>
            </View>
            <View style={styles.cameraContainer}>
              <View style={styles.showImageContainer}>
                {this.state.showImage ? (
                  <Image
                    style={styles.imageStyle}
                    source={{
                      uri:
                        this.state.withoutMask === ""
                          ? this.state.withMask
                          : this.state.withoutMask,
                    }}
                  />
                ) : (
                  <View style={styles.cameraViewContainer}>
                    <RNCamera
                      ref={(ref) => {
                        this.camera = ref;
                      }}
                      ratio="2:2"
                      captureAudio={false}
                      style={styles.preview}
                      type={
                        this.state.frontCam
                          ? RNCamera.Constants.Type.front
                          : RNCamera.Constants.Type.back
                      }
                      flashMode={RNCamera.Constants.FlashMode.on}
                      androidCameraPermissionOptions={{
                        title: "vTransit",
                        message:
                          "This app want to capture your photo to update profile photo",
                        buttonPositive: "Ok",
                        buttonNegative: "Cancel",
                      }}
                    >
                      <View style={styles.rotateCameraButtonContainer}>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              frontCam: !this.state.frontCam,
                            });
                          }}
                          style={styles.rotateCameraButton}
                        >
                          <Image
                            source={imagePath.rotateCamera}
                            style={styles.rotateCameraIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    </RNCamera>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.buttonsContainer}>
              <View style={styles.submitButtonContainerRow}>
                <View style={styles.buttonBoxContainer}>
                  <ButtonComp
                    btnText="Cancel"
                    btnStyle={styles.cancelButtonStyle}
                    btnTextStyle={styles.cancelButtonText}
                    onPress={() => {
                      this.props.cancelClick();
                      this.setState({
                        withMask: "",
                        withoutMask: "",
                        imageClicks: false,
                        showImage: false,
                        title: "Photo with mask",
                      });
                    }}
                  />
                </View>
                <View style={styles.buttonBoxContainer}>
                  {this.state.showImage ? (
                    <ButtonComp
                      btnText={this.state.withoutMask === "" ? "Next" : "Done"}
                      btnStyle={styles.nextButtonStyle}
                      btnTextStyle={styles.btnTextStyle}
                      onPress={() => {
                        if (this.state.withoutMask === "") {
                          this.setState({
                            showImage: false,
                            title: "Photo without mask",
                          });
                        } else {
                          this.props.cancelClick();
                          this.props.data(
                            this.state.withMask,
                            this.state.withoutMask
                          );
                          this.setState({
                            withMask: "",
                            withoutMask: "",
                            imageClicks: false,
                            showImage: false,
                            title: "Photo with mask",
                          });
                        }
                      }}
                    />
                  ) : this.state.withMask === "" ? (
                    this.state.loading ? (
                      <View style={styles.loaderContainer}>
                        <ActivityIndicator size="small" color={colors.white} />
                      </View>
                    ) : (
                      <ButtonComp
                        btnText="With mask"
                        btnStyle={styles.withMaskButton}
                        btnTextStyle={styles.btnTextStyle}
                        onPress={this.takePicture.bind(this, "withMask")}
                      />
                    )
                  ) : this.state.loading ? (
                    <View style={styles.loaderContainer}>
                      <ActivityIndicator size="small" color={colors.white} />
                    </View>
                  ) : (
                    <ButtonComp
                      btnText="Without mask"
                      btnStyle={styles.withoutMaskButton}
                      btnTextStyle={styles.btnTextStyle}
                      onPress={this.takePicture.bind(this, "withoutMask")}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
        </RBSheet>
      </View>
    );
  }
}

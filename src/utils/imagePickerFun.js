// import ImageCropPicker from 'react-native-image-crop-picker';

// export const openGallery = data => {
//   return new Promise((resolve, reject) => {
//     ImageCropPicker.openPicker({
//       width: 400,
//       height: 400,
//       cropping: true,
//     })
//       .then(res => {
//         resolve(res);
//       })
//       .catch(errr => {
//         reject(errr);
//       });
//   });
// };

// export const openCamera = data => {
//   return new Promise((resolve, reject) => {
//     ImageCropPicker.openCamera({
//       width: 400,
//       height: 400,
//       cropping: true,
//     })
//       .then(res => {
//         resolve(res);
//       })
//       .catch(errr => {
//         reject(errr);
//       });
//   });
// };

import ImageCropPicker from "react-native-image-crop-picker";
import * as permissions from "react-native-permissions";
import { request, PERMISSIONS } from "react-native-permissions";
import { showError } from "./helperFunction";

export const openGallery = (data) => {
  return new Promise((resolve, reject) => {
    request(
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA
    ).then((result) => {
      //if (result === 'granted') {
      ImageCropPicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((errr) => {
          reject(errr);
        });
      // } else {
      //   showError('Please give permission for access your media gallery');
      // }
    });
  });
};

export const openCamera = (data) => {
  return new Promise((resolve, reject) => {
    request(
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA
    ).then((result) => {
      // ImageCropPicker.openCamera({
      //   width: 400,
      //   height: 400,
      //   cropping: true,
      // })
      ImageCropPicker.openCamera({
        // width: 400,
        // height: 400,
        cropping: false,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((errr) => {
          reject(errr);
        });
    });
  });
};

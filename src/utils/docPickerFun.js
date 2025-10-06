import DocumentPicker from "react-native-document-picker";

export const uploadDoc = (data) => {
  return new Promise((resolve, reject) => {
    DocumentPicker.pickSingle({})
      .then((res) => {
        resolve(res);
      })
      .catch((errr) => {
        reject(errr);
      });
  });
};

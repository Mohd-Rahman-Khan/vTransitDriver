import {Image} from 'react-native-compressor';
export const imageCompress = async uri => {
  const result = await Image.compress(uri, {
    //compressionMethod: 'auto',
    maxWidth: 400,
    maxHeight: 400,
  });

  return result;
};

export const snapShotImageCompress = async uri => {
  const result = await Image.compress(uri, {
    //compressionMethod: 'auto',
    maxWidth: 600,
    maxHeight: 600,
  });

  return result;
};

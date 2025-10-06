import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import colors from '../styles/colors';
import Loader from './Loader'


const WrapperContainer = ({
  children,
  bgColor = '',
  statusBarColor = colors.statusBarColor,
  barStyle = 'light-content',
  withModal="",
  isLoading="",
}) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:statusBarColor
      }}>
      <StatusBar backgroundColor={statusBarColor} barStyle={barStyle} />
      <Loader isLoading={isLoading} withModal={withModal}/>
      <View style={{ flex: 1 , backgroundColor:bgColor}}>{children}</View>
    </SafeAreaView>
  );
};

export default React.memo(WrapperContainer);

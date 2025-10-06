import { View, Text } from 'react-native'
import React from 'react'
import colors from '../styles/colors';

export default function Divider() {
  return (
    <View style={{height:0.5,width:'100%',backgroundColor:colors.lightGray}}></View>
  )
}
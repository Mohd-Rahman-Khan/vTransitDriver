import React from 'react'
import { WelcomeScreen } from '../Screens/index'
import navigationStrings from './navigationStrings'

const WelcomeStack = (Stack) => {
  return (
   <Stack.Navigator screenOptions={{ headerShown:false }}>
       <Stack.Screen name={navigationStrings.WELCOME_SCREEN} component={WelcomeScreen}/>
   </Stack.Navigator>
  )
}

export default WelcomeStack
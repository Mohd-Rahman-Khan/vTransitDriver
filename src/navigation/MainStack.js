import React from 'react';
import HomeStack from './HomeStack';
import navigationStrings from './navigationStrings';

const MainStack = Stack => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={navigationStrings.HOME_STACK}
          component={HomeStack}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </>
  );
};

export default MainStack;

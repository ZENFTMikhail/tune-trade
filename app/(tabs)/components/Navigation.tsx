import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './Main';
import ProfileSeting from './ProfileSeting';
import Navbar from './Navbar';
import Favorites from './Favorites';
import Backet from './Backet';
import FullPost from './FullPost';
import AudioPlayer from './AudioPlayer';

export type RootStackParamList = {
  Main: undefined;
  ProfileSeting: undefined;
  Favorites: undefined;
  Backet: undefined;
  FullPost: {id: string, price: string, title: string, artist: string, cover: string, inFavorite: boolean, audioUrl: string, trackIndex: number};
};

export type RootTrack = {
  id: string;
  price: string
}

const Stack = createStackNavigator<RootStackParamList>();

const Tab = createBottomTabNavigator();

const MainStack = ({ onLogout }: { onLogout: () => void }) => (
  <Stack.Navigator screenOptions={{
    headerShown: false, 
    gestureEnabled: true, // Включает жесты для удобного возврата
    cardStyleInterpolator: ({ current }) => ({
      cardStyle: {
        opacity: current.progress, // Плавное появление компонента
      },
    }),
  }}>
    <Stack.Screen name="Main" component={Main}>
    </Stack.Screen>
    <Stack.Screen name="FullPost" component={FullPost} >

    </Stack.Screen>
    <Stack.Screen name="ProfileSeting">
      {(props) => <ProfileSeting {...props} onLogout={onLogout} />}
    </Stack.Screen>
    <Stack.Screen name="Favorites" component={Favorites} >
    </Stack.Screen>
    <Stack.Screen name="Backet" component={Backet}>

    </Stack.Screen>
  </Stack.Navigator>
);


const Navigation = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <NavigationIndependentTree>
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="MainStack">
          {(props) => <MainStack {...props} onLogout={onLogout} />}
        </Tab.Screen>
      </Tab.Navigator>


      <Navbar />
    </NavigationContainer>
    </NavigationIndependentTree>
  );
};

export default Navigation;
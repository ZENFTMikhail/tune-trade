import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated,Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RootState } from '@/redux/store';
import { setDarkMode } from '@/redux/themeSlice';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './Navigation';
import { CommonActions } from '@react-navigation/native';


const Navbar = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const cartTracks = useSelector((state: RootState) => state.tracks.cart);
  

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();


  const goToHome = (): void => {
    navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{name: 'Main'}]
        })
    )
  }


  // Анимированное значение для движения индикатора
  const translateX = useRef(new Animated.Value(isDarkMode ? 18 : 0)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isDarkMode ? 16 : 0, // Двигаем индикатор
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    dispatch(setDarkMode(!isDarkMode));
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
      {/* Аватар */}
      <TouchableOpacity onPress={() => navigation.navigate('ProfileSeting')}>
        <View style={styles.imgContainer}>
          <Image source={require('./../../../assets/images/ava.jpg')} style={styles.avatar} />
        </View>
      </TouchableOpacity>

      {/* Иконки */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={goToHome}>
          <Ionicons name="home" size={32} color={isDarkMode ? "gray" : "white"} />
        </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Backet')}>
            <View>
              <Ionicons name="basket" size={32} color={isDarkMode ? "gray" : "white"} />
              {cartTracks.length > 0 && (
                <Text 
                  style={{
                    top: -3, 
                    right: 1,
                    position: 'absolute', 
                    color: 'red',   
                    fontFamily: 'RubikGlitch_400Regular',
                  }}>
                  {cartTracks.length}
                </Text>
              )}
            </View>
    </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
          <Ionicons name="heart" size={32} color={isDarkMode ? "gray" : "white"} />
        </TouchableOpacity>
      </View>

      {/* Переключатель темы */}
      <TouchableOpacity onPress={handleThemeToggle} style={styles.toggleContainer}>
        <Animated.View style={[styles.indicator, { transform: [{ translateX }] }]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  dark: {
    backgroundColor: '#070e1e',
    borderTopColor: 'gray',
  },
  light: {
    backgroundColor: '#778899',
    borderTopColor: '#ccc',
  },
  imgContainer: {
    width: 35,
    height: 35,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'green',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
    paddingLeft: '2%'
  },
  toggleContainer: {
    width: 40,
    height: 25,
    borderRadius: 15,
    backgroundColor: '#ccc',
    borderWidth: 0.5,
    borderColor: 'gray',
    justifyContent: 'center',
    paddingHorizontal: 1
  },
  indicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
  },
});

export default Navbar;

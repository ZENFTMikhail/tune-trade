import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, StyleSheet, StatusBar, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, RubikGlitch_400Regular } from '@expo-google-fonts/rubik-glitch';
import CustomButton from './CustomButton';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '@/redux/authSlice';
import { RootState } from '@/redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  email: string;
  password: string;
  username: string;
}

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess })  => {
  const [visibleButton, setVisibleButton] = useState<boolean>(true);
  const [visibleLogin, setVisibleLogin] = useState<boolean>(false);
  const [visibleSign, setVisibleSign] = useState<boolean>(false);
  const [errorForgotPas, setErrorForgotPas] = useState<string|null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string|undefined>('');
 
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [formData, setFormData] = useState<User>({ email: '', password: '', username: '' });

  const handleChange = (key: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const textAnim = useSharedValue(0);
  const textAnim2 = useSharedValue(0);
  const loginAnim = useSharedValue(0);
  const signAnim = useSharedValue(0);
  const errorForgot = useSharedValue(1);

  const pushTextAnim = useCallback(() => {
    textAnim.value = withTiming(-500, {
      duration: 1000,
      easing: Easing.inOut(Easing.ease)
    });
    setTimeout(() => {
      textAnim2.value = withTiming(-500, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease)
      });
      setVisibleButton(false);
    }, 500);

  }, [textAnim, textAnim2]);

  const handleLogin = useCallback(() => {
    pushTextAnim();
    setVisibleLogin(true);

    setTimeout(() => {
      loginAnim.value = withTiming(1, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease)
      });
      
    }, 1000)
  }, [pushTextAnim, loginAnim]);

  const handleSignUp = useCallback(() => {
    pushTextAnim();
    setVisibleLogin(false);
    setVisibleSign(true);
    setTimeout(() => {
      signAnim.value = withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease)
      });
    }, 1000)
    
  }, [pushTextAnim, signAnim]);

  const changeLogin = () => {
    setVisibleSign(false);
    setVisibleLogin(true);
    loginAnim.value = withTiming(1, {
      duration: 1500,
      easing: Easing.inOut(Easing.ease)
    });
  };

  const forgotPassword = () => {
    if (!formData.email.trim()) {
      setErrorForgotPas('Please type your email.');
      errorForgot.value = withTiming(1, { 
        duration: 300, 
        easing: Easing.inOut(Easing.ease) 
      });
      setTimeout(() => {
        errorForgot.value = withTiming(0, { 
          duration: 1000, 
          easing: Easing.inOut(Easing.ease) 
        });
        setTimeout(() => {
          setErrorForgotPas(null);
        }, 1000);
      }, 2000);
    } else {
      console.log('Отправим ссылку на сброс пароля');
    }
  };

  const handleRegister = async () => {
    if(confirmPassword === formData.password) {
      try {
        const response = await fetch('http://192.168.0.101:5001/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password, username: formData.username }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }

        setFormData({ email: '', password: '', username: '' });
        setConfirmPassword('');
      } catch (error) {
        console.error('Ошибка регистрации:', error);
      }
    } else {
      Alert.alert('Пароли не совпадают')
    }
  };

  const authoriseUser = async () => {
    try {
      const response = await fetch('http://192.168.0.100:5001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      await AsyncStorage.setItem('token', data.token);

      setFormData({ email: '', password: '', username: '' });
      onAuthSuccess();

      
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      Alert.alert('Ошибка', 'Неверный email или пароль');
    }
  };


  const textStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: textAnim.value }]
  }));

  const textStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateX: textAnim2.value }]
  }));

  const loginStyle = useAnimatedStyle(() => ({
    opacity: loginAnim.value
  }));

  const errStyle = useAnimatedStyle(() => ({
    opacity: errorForgot.value
  }));

  const signStyle = useAnimatedStyle(() => ({
    opacity: signAnim.value
  }));

  const [fontsLoaded] = useFonts({
    RubikGlitch_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient colors={['#070e1e', '#060a16', '#008080']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={style.maincontainer}>
          <StatusBar backgroundColor="#070e1e" hidden={false} />
          <View style={style.log}>
            <Image style={{ resizeMode: 'contain', width: 120 }} source={require('../../../assets/images/ime.png')} />
            <Text style={{ fontSize: 37, paddingVertical: 2, fontFamily: 'RubikGlitch_400Regular', color: '#2F4F4F', padding: 5, position: 'absolute', top: 160 }}>TuneTrade</Text>
          </View>

          <View style={style.auth}>
            <Animated.Text style={[style.authtext, textStyle]}>
              Welcome, TuneTrader! Let's make some deals.
            </Animated.Text>
            <Animated.Text style={[style.authtext, textStyle2]}>
              Please authorize in the app to continue.
            </Animated.Text>
          </View>

          {visibleButton && (
            <View style={{ padding: 40, paddingTop: 90, flexDirection: 'row', justifyContent: 'space-around' }}>
              <CustomButton title='Log in' onPress={handleLogin} buttonStyle={{ backgroundColor: '#5F9EA0', borderWidth: 0.5, width: '39%' }} />
              <CustomButton title='Sign up' onPress={handleSignUp} buttonStyle={{ backgroundColor: '#5F9EA0', borderWidth: 0.5, width: '40%' }} />
            </View>
          )}

          {visibleLogin && (
            <Animated.View style={[style.formContainer, loginStyle]}>
              <View style={style.loginView}>
                <View style={style.login}>
                  <TextInput placeholder='email' value={formData.email} onChangeText={(text) => handleChange('email', text)}/>
                </View>
                <View style={style.login}>
                  <TextInput placeholder='password' secureTextEntry value={formData.password} onChangeText={(text) => handleChange('password', text)}/>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#C0C0C0', fontFamily: 'RubikGlitch_400Regular', marginLeft: '20%' }}>
                  Not account?
                </Text>
                <TouchableOpacity onPress={handleSignUp}>
                  <Text style={{ color: 'white', fontFamily: 'RubikGlitch_400Regular', marginLeft: '20%' }}>
                    Sign UP
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={forgotPassword}>
                  <Text style={{ color: 'white', fontFamily: 'RubikGlitch_400Regular', marginLeft: '22%', marginTop: '5%' }}>
                    Forgot your password?
                  </Text>
                </TouchableOpacity>
                {errorForgotPas && <Animated.View style={[{top: '-555%', marginLeft: '27%', position: 'absolute'}, errStyle]}>
                  <Text style={{color: 'red'}}>
                    {errorForgotPas}
                  </Text>
                </Animated.View>}
              </View>
              <CustomButton title='Enter' onPress={authoriseUser} buttonStyle={{ backgroundColor: '#5F9EA0', margin: 30, marginTop: '28%' }} />
            </Animated.View>
          )}

          {visibleSign && (
            <Animated.View style={[style.formContainer, signStyle]}>
              <View style={style.signUpView}>
                <View style={style.signUp}>
                  <TextInput placeholder='email' value={formData.email} onChangeText={(value) => handleChange('email', value)}/>
                </View>
                <View style={style.signUp}>
                  <TextInput placeholder='username' value={formData.username} onChangeText={(value) => handleChange('username', value )} />
                </View>
                <View style={style.signUp}>
                  <TextInput placeholder='password' secureTextEntry value={formData.password} onChangeText={(value) => handleChange('password', value)} />
                </View>
                <View style={[style.signUp, { marginBottom: '5%' }]}>
                  <TextInput placeholder='confirm password' secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
                </View>
              </View>
              <TouchableOpacity onPress={changeLogin}>
                <Text style={{ color: 'white', fontFamily: 'RubikGlitch_400Regular', marginLeft: '42%', marginTop: '-5%' }}>
                  Login
                </Text>
              </TouchableOpacity>
              <CustomButton title='Sign Up' onPress={handleRegister} buttonStyle={{ backgroundColor: '#5F9EA0', margin: 30 }} />
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const style = StyleSheet.create({
  maincontainer: {
    height: '100%',
  },
  log: {
    justifyContent: 'center',
    margin: 10,
    alignItems: 'center'
  },
  auth: {
    margin: 30,
    padding: 15,
    alignItems: 'center'
  },
  authtext: {
    fontSize: 18,
    color: '#F5F5DC',
    fontFamily: 'RubikGlitch_400Regular',
  },
  formContainer: {
    position: 'absolute',
    width: '100%',
    top: '43%',
    paddingHorizontal: 20,
  },
  loginView: {
    borderWidth: 1,
    borderRadius: 10,
    margin: 20,
    borderColor: '#2F4F4F',
    paddingBottom: '5%',
  },
  login: {
    marginRight: '5%',
    marginLeft: '5%',
    marginTop: '5%',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: '#A9A9A9'
  },
  signUpView: {
    borderWidth: 1,
    borderRadius: 10,
    margin: 20,
    borderColor: '#2F4F4F',
  },
  signUp: {
    marginRight: '5%',
    marginLeft: '5%',
    marginTop: '5%',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: '#A9A9A9'
  },
});

export default Auth;
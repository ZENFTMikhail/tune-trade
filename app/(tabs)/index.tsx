import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import store  from './../../redux/store';
import Auth from './components/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import Navigation from './components/Navigation';
import { enableScreens } from 'react-native-screens';

enableScreens();


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  const handleAuthChange = (authStatus: boolean) => {
    setIsAuthenticated(authStatus);
  };

  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        {isAuthenticated ? <Navigation onLogout={() => handleAuthChange(false)} /> : <Auth onAuthSuccess={() => handleAuthChange(true)} />}
      </View>
    </Provider>
  );
}

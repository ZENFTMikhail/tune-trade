import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { UseSelector, useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";



const Favorites: React.FC = () => {

    const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode)


    return (
        <View style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
            <View/>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        height: '100%',

    },

    dark: {
        backgroundColor: '#070e2e',
      },
      light: {
        backgroundColor: '#ffffff',
      },

})

export default Favorites;

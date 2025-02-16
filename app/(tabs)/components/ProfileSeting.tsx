import React, {useState} from "react";
import { View, StyleSheet, Image, Dimensions, Text, TouchableOpacity, TextInput } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';




const { width, height } = Dimensions.get("window"); // Получаем размеры экрана

interface ProfileSettingProps {
  onLogout: () => void;
}

const Logout = async (onLogout: () => void) => {
  await AsyncStorage.removeItem('token');
  onLogout(); 
};



const ProfileSetting: React.FC<ProfileSettingProps> = ({ onLogout }: { onLogout: () => void }) => {

  const [currency, setCurrency] = useState<string>("USD");
  const [email, setEmail] = useState<string>("Try@gmail.com");
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  return (
    <View style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
      {/* Верхняя часть фона */}
      <View style={styles.headerBackground} />
      <Image source={require('./../../../assets/images/back.jpg')} style={styles.imgHeader}/>

      {/* Фото профиля */}
      <View style={styles.profileImageContainer}>
        <Image
          source={require('../../../assets/images/ava.jpg')}
          style={styles.profileImage}
        />
        <Text style={[styles.userName, isDarkMode ? styles.dark : styles.light]}>Mishkon</Text>
      </View>

      {/* Контент под аватаркой */}
      <View style={styles.contentContainer}>
      <View style={[styles.infoBlock]}>
      <Text style={[isDarkMode ? styles.textInfoDark : styles.textInfoLight]}>
        Email:
      </Text>
      <Text style={[isDarkMode ? styles.textInfoDark : styles.textInfoLight]}>
        Try@gmail.com
      </Text>
      </View>
      <View style={[styles.infoBlock]}>
      <Text style={[isDarkMode ? styles.textInfoDark : styles.textInfoLight]}>
        Username:
      </Text>
      <TouchableOpacity>
      <Text style={[isDarkMode ? styles.textInfoDark : styles.textInfoLight]}>
        change
      </Text>
      </TouchableOpacity>
      </View>
      <View style={[styles.infoBlock]}>
      <Text style={[isDarkMode ? styles.textInfoDark : styles.textInfoLight]}>
        Password:
      </Text>
      <TouchableOpacity>
      <Text style={[isDarkMode ? styles.textInfoDark : styles.textInfoLight]}>
        change
      </Text>
      </TouchableOpacity>
      </View>
      <View style={styles.infoBlock}>
      <Text style={[isDarkMode ? styles.textInfoDark : styles.textInfoLight]}>
        Profile Img:
      </Text>
      <TouchableOpacity>
      <Text style={[isDarkMode ? styles.textInfoDark : styles.textInfoLight]}>
        change
      </Text>
      </TouchableOpacity>
      </View>
      <View style={styles.infoBlock}>
      <Text style={[isDarkMode ? styles.textInfoDark : styles.textInfoLight]}>
      Currency:
      </Text>

            <Picker
              selectedValue={currency}
              onValueChange={(itemValue) => setCurrency(itemValue)}
              style={[isDarkMode ? styles.picker : styles.pickerLight]}
            >
              <Picker.Item label="USD" value="USD"/>
              <Picker.Item label="EUR" value="EUR" />
              <Picker.Item label="GBP" value="GBP" />
              <Picker.Item label="JPY" value="JPY" />
            </Picker>

          </View>
      </View>
      <View style={styles.infoBlockLog}>
        <TouchableOpacity onPress={() => Logout(onLogout)}>
        <Text style={[isDarkMode ? styles.textInfoDark : styles.textInfoLight]}>
        Logout
          </Text>
        </TouchableOpacity>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInfoDark: {
    fontFamily: 'RubikGlitch_400Regular',
    fontSize: 15,
    color: '#FFFFF0'

  },

  textInfoLight: {
    fontFamily: 'RubikGlitch_400Regular',
    fontSize: 15,
    color: 'black'

  },

  dark: {
    backgroundColor: "#070e2e",
  },
  light: {
    backgroundColor: "#ffffff",
    color: 'black'
  },
  pickerContainer: {
    width: "40%",
  },

  picker: {
  width: '35%',
  top: '-33%',
  marginLeft: '10%',
  color: 'white',
  fontFamily: 'RubikGlitch_400Regular',
  left: '20%'


  },
  pickerLight: {
    width: '35%',
    top: '-33%',
    marginLeft: '10%',
    fontFamily: 'RubikGlitch_400Regular',
    left: '20%'


  },

  // Верхний фон (шапка)
  headerBackground: {
    width: "100%",
    height: height * 0.2,
    backgroundColor: "#0a1931",
    position: "absolute",
    top: 0,
  },

  // Контейнер для фото профиля
  profileImageContainer: {
    alignItems: "center",
    marginTop: height * -0.1, // Смещение вниз для перекрытия
  },

  // Фото профиля
  profileImage: {
    width: width * 0.3, // 30% от ширины экрана
    height: width * 0.3,
    borderRadius: width * 0.15, // Делаем круглым
    borderWidth: 4,
    borderColor: "#ffffff",
  },

  // Контейнер для остального контента
  contentContainer: {
    paddingTop: '2%'
  },
  userName : {
    fontFamily: 'RubikGlitch_400Regular',
    fontSize: 16,
    color: '#FFFFF0'
  },
  imgHeader: {
    width: '100%',
    height: '28%',

  },
  infoBlock: {

    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '5%',
  },
  infoBlockLog: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: '3%',
  }
});

export default ProfileSetting;

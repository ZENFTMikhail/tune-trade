import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '@/redux/store';
import { setDarkMode } from '@/redux/themeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Audio } from "expo-av";
import { Ionicons } from '@expo/vector-icons'; // Импортируем иконки
import { addToCart } from '@/redux/trackSlice';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './Navigation';
import { setCurrentTrack, play } from '@/redux/slicePlayer';




const genres = [
  "All",
  "Techno",
  "House",
  "Hip-Hop",
  "Chillout",
  "Dubstep",
  "Pop",
];

const Main: React.FC = () => {
  const allTracks = useSelector((state: RootState) => state.tracks.list);
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [filteredTracks, setFilteredTracks] = useState<Track[]>(allTracks);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);


const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()



  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        dispatch(setDarkMode(JSON.parse(savedTheme)));
      }
    };
    loadTheme();
  }, [dispatch]);

  useEffect(() => {
    if (selectedGenre === "All") {
      setFilteredTracks(allTracks);
    } else {
      setFilteredTracks(allTracks.filter((track) => track.genre === selectedGenre));
    }
  }, [selectedGenre, allTracks]);

  const toggleTheme = () => {
    dispatch(setDarkMode(!isDarkMode));
  };

  const handlePlayPause = async (track: Track) => {
    if (playingTrack === track.id) {
      sound?.pauseAsync();
      setPlayingTrack(null);

    } else {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: track.audioUrl });
      setSound(newSound);
      await newSound.playAsync();
      setPlayingTrack(track.id);
    }
  };




  const addTrackBacket = (id: string) => {
    dispatch(addToCart(id))
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.dark : styles.light]}>

      <StatusBar backgroundColor={'#070e1e'} hidden={false} />

      <View style={[styles.genreContainer, isDarkMode ? styles.darkTop : styles.lightBut]}>
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre}
            style={[styles.genreButton, selectedGenre === genre && styles.activeGenre]}
            onPress={() => setSelectedGenre(genre)}
          >
            <Text style={[styles.genreText, isDarkMode ? styles.darkText : styles.lightTextBut]}>{genre}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        style={{marginBottom: 30}}
        data={filteredTracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('FullPost', {id: item.id, price: item.price, title: item.title, artist: item.artist, cover: item.cover, audioUrl: item.audioUrl, inFavorite: item.isFavorite, trackIndex: item.trackIndex}) }>
          <View style={[styles.trackCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
            <Image source={{ uri: item.cover }} style={styles.trackImage} />
            <View style={styles.trackInfo}>
              <Text style={[styles.trackTitle, isDarkMode ? styles.darkText : styles.lightText]}>{item.title}</Text>
              <Text style={[styles.trackArtist, isDarkMode ? styles.darkText : styles.lightText]}>{item.artist}</Text>
            </View>
            <TouchableOpacity onPress={() => handlePlayPause(item)}>
              <Ionicons name={playingTrack === item.id ? "pause" : "play"} size={24} color={isDarkMode ? "#ff8c00" : "#000"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.favoriteButton} onPress={() => addTrackBacket(item.id)}>
              <Ionicons name="add" size={24} color={isDarkMode ? "#ff8c00" : "#000"} />
            </TouchableOpacity>
          </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  darkTop: {
    backgroundColor: '#070e1e'
  },
  dark: {
    backgroundColor: '#070e2e',
  },
  light: {
    backgroundColor: '#ffffff',
  },
  genreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    padding: 10,
    

  },
  genreButton: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    backgroundColor: "#444",

  },
  activeGenre: {
    backgroundColor: "#ff8c00",
  },
  genreText: {
    fontSize: 14,
  },
  darkText: {
    color: '#ffffff',
  },
  lightText: {
    color: '#ccccc',
  },
  lightTextBut: {
    color: 'white',
  },
  trackCard: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#333",

  },
  lightBut: {
    backgroundColor: '#778899',

  },

  darkCard: {
    backgroundColor: "#333",
  },
  lightCard: {
    backgroundColor: "#f0f0f0",
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 10,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trackArtist: {
    fontSize: 14,
  },
  favoriteButton: {
    marginLeft: 10,
  },
});

export default Main;
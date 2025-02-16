import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '@/redux/store';
import { Audio } from 'expo-av';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './Navigation';
import { setCurrentTrack, play, pause, updateDuration, updatePosition, setVolume } from '@/redux/slicePlayer';

type FullPostRouteProp = RouteProp<RootStackParamList, 'FullPost'>;

interface FullPostProp {
  route: FullPostRouteProp;
}

const FullPost: React.FC<FullPostProp> = ({ route }) => {
  const { trackIndex, id, title, artist, cover, audioUrl, price } = route.params; // Получаем переданный индекс трека

  const allTracks = useSelector((state: RootState) => state.tracks.list);
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const dispatch = useDispatch();


  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(1);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(trackIndex); // Устанавливаем начальный индекс

  const currentTrack = allTracks[currentTrackIndex];

  

  const loadTrack = async () => {
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: currentTrack.audioUrl },
      { shouldPlay: isPlaying },
      onPlaybackStatusUpdate
    );
    setSound(newSound);
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);
    }
  };

 

  const handlePlayPause = async () => {
    if (sound) {

      
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    }
  };

  const handleSeek = async (value: any) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const handleVolumeChange = async (value: any) => {
    if (sound) {
      await sound.setVolumeAsync(value);
      setVolume(value);
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % allTracks.length);
  };

  const handlePreviousTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + allTracks.length) % allTracks.length);
  };

  useEffect(() => {
    loadTrack();
    setCurrentTrack(currentTrack)
  }, [currentTrackIndex]);

  return (
    <View style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
      <Image source={{ uri: currentTrack.cover }} style={styles.cover} />
      <Text style={styles.title}>{currentTrack.title}</Text>
      <Text style={styles.artist}>{currentTrack.artist}</Text>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={handleSeek}
        minimumTrackTintColor="#FF0000"
        maximumTrackTintColor="#555"
        thumbTintColor="#FF0000"
      />

      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePreviousTrack}>
          <Ionicons name="play-skip-back" size={30} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePlayPause}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={30} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNextTrack}>
          <Ionicons name="play-skip-forward" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <Slider
        style={styles.volumeSlider}
        minimumValue={0}
        maximumValue={1}
        value={volume}
        onValueChange={handleVolumeChange}
        minimumTrackTintColor="#FF0000"
        maximumTrackTintColor="#555"
        thumbTintColor="#FF0000"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dark: {
    backgroundColor: '#070e2e',
  },
  light: {
    backgroundColor: '#ffffff',
  },
  cover: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  artist: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  volumeSlider: {
    width: '80%',
    height: 40,
    marginTop: 20,
  },
});

export default FullPost;

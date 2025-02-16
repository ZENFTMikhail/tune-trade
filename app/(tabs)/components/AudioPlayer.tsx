import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { Audio } from 'expo-av';
import { play, pause, updatePosition, updateDuration, setVolume } from '@/redux/slicePlayer';
import { Ionicons } from '@expo/vector-icons';

const AudioPlayer: React.FC = () => {
  const { currentTrack, isPlaying, position, duration, volume } = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    if (currentTrack) {
      loadTrack();
    }

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [currentTrack]);

  const loadTrack = async () => {
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: currentTrack!.audioUrl },
      { shouldPlay: isPlaying },
      onPlaybackStatusUpdate
    );
    setSound(newSound);

    const status = await newSound.getStatusAsync();

    if (status.isLoaded) {
      dispatch(updateDuration(status.durationMillis || 0));
    }
  };

  const handleSeek = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      dispatch(updatePosition(status.positionMillis));
      if (status.durationMillis) {
        dispatch(updateDuration(status.durationMillis));
      }
      if (status.isPlaying !== isPlaying) {
        dispatch(status.isPlaying ? play() : pause());
      }
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

  return currentTrack ? (
    <View style={styles.container}>
      <Image source={{ uri: currentTrack.cover }} style={styles.cover} />
      <View style={styles.info}>
        <Text style={styles.title}>{currentTrack?.title || ''}</Text>
        <Text style={styles.artist}>{currentTrack?.artist || ''}</Text>
      </View>
      <Slider
        style={styles.slider}
        onSlidingComplete={handleSeek}
        value={position}
        minimumValue={0}
        maximumValue={duration}
        minimumTrackTintColor="#FF0000"
        maximumTrackTintColor="#555"
        thumbTintColor="#FF0000"
      />
      <TouchableOpacity onPress={handlePlayPause}>
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={30} color="#000" />
      </TouchableOpacity>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'white',
    bottom: '5.5%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    height: 60,
  },
  slider: {
    width: '70%',
  },
  cover: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  artist: {
    fontSize: 14,
    color: '#666',
  },
});

export default AudioPlayer;

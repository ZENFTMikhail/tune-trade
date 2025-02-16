import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlayerState {
    currentTrack: {
    id: string;
    title:string;
    artist: string;
    cover: string;
    audioUrl: string
    } | null;
    isPlaying: boolean;
    position: number;
    duration: number;
    volume: number;
} 

const initialState: PlayerState = {
    currentTrack: null,
    isPlaying: false,
    volume: 1,
    position: 0,
    duration: 0
}

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setCurrentTrack(state, action:  PayloadAction<PlayerState['currentTrack']>) {
            state.currentTrack = action.payload
            state.position = 0
        },
        play(state) {state.isPlaying = true},
        pause(state) {state.isPlaying = false},
        updatePosition(state, action: PayloadAction<number>) { 
            state.position = action.payload
        },
        updateDuration(state, action: PayloadAction<number>) {
            state.duration = action.payload
        }, 
        setVolume(state, action: PayloadAction<number>) {
            state.volume = action.payload
        }

    }
})


export const {setCurrentTrack, play, pause, updateDuration, updatePosition, setVolume } = playerSlice.actions;
export default playerSlice.reducer
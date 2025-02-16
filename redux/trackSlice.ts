import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";




interface TrackState {
  list: Track[];
  cart:  Track[];
}

const initialState: TrackState = {
  list: [
    {
      id: "1",
      title: "Stil",
      artist: "Acid Arab",
      genre: "Techno",
      cover: "data:image/jpeg;base64,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",
      audioUrl: "https://www.dropbox.com/scl/fi/ez9koc797swmzuh7s1qc9/vksaver_Acid-Arab-Stil.mp3?rlkey=a9vqlx2cyxvc46wcaivoaqinj&st=jmkmdunq&dl=1",
      isFavorite: false,
      inCart: false,
      price: '2.5',
      trackIndex: 0
    },
    {
        id: "2",
        title: "Vergangene Tage",
        artist: "Acid Ara",
        genre: "Techno",
        cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiuw7l670TBWaeBezAzzVozRzX9Z-hCPU5bA&s',
        audioUrl: "https://www.dropbox.com/scl/fi/4d39kavgrbf2jd31mlz00/Acid-Ara-Vergangene-Tage-Bm.mp3?rlkey=m6czozkhxus8pawxav5of3d8v&st=hrebgrp6&dl=1",
        isFavorite: false,
        inCart: false,
        price: '2',
        trackIndex: 1
      },
      {
        id: "3",
        title: "Black-Fire",
        artist: "Rihanna",
        genre: "Pop",
        cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM__6L2lakYO-gSr3qvCjuHOtexWPkxktDQw&s',
        audioUrl: "https://www.dropbox.com/scl/fi/lb5wv9979c89y0jyvs9zr/vksaver_Rihanna-BlackFire.mp3?rlkey=yh0pl3227oipgpquw5dma8vam&st=xyqzzccq&dl=1",
        isFavorite: false,
        inCart: false,
        price: '3',
        trackIndex: 2
      },
      {
        id: "4",
        title: "Shake That Shit",
        artist: "Snoop Dog",
        genre: "Hip-Hop",
        cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL-qzo_krCAJd9Av1ameGtH9Ohu_vAeXoEaQ&s',
        audioUrl: "https://www.dropbox.com/scl/fi/xm13gd3zsbe5xskylholv/vksaver_Snoop-Dogg-Shake-That-Shit.mp3?rlkey=o8jn21nn11ixmyf8os0bpwtz1&st=5312zm63&dl=1",
        isFavorite: false,
        inCart: false,
        price: '3',
        trackIndex: 3
      },
      {
        id: "5",
        title: "FarCry 4",
        artist: "Noisia",
        genre: "Dubstep",
        cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4cyQ88EiGMradd5HbeLOoHg-FUFN5LKRm_A&s',
        audioUrl: "https://www.dropbox.com/scl/fi/7uiqmc9x4dun73mmc9u62/vksaver_Noisia-Machine-Gun-16bit-Remix-OST-FarCry-4-Dubstep.mp3?rlkey=w9iv4dmo22h76z5ns8fl0h4dv&st=n6w916sb&dl=1",
        isFavorite: false,
        inCart: false,
        price: '3',
        trackIndex: 4
      },
      {
        id: "6",
        title: "House",
        artist: "Deeper",
        genre: "House",
        cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUAWUJQm0gBBimkk8L9wcXYHUFImb4ZXYg7Q&s',
        audioUrl: "https://www.dropbox.com/scl/fi/1dix97bxwhfz7h4wo9q5w/vksaver_Deep-House.mp3?rlkey=cb8ongp04kiybzsmtai1pi5xj&st=yn5dlw6x&dl=1",
        isFavorite: false,
        inCart: false,
        price: '2.5',
        trackIndex: 5
      },
      {
        id: "7",
        title: "Calling Your Name",
        artist: "Art of Trance",
        genre: "Chillout",
        cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVUmAi2RlLe2FVjEb8svduBn5n88tv_zq9eQ&s',
        audioUrl: "https://www.dropbox.com/scl/fi/xctuldgk4g1hsweyz2npu/vksaver_Art-Of-Trance-Calling-Your-Name.mp3?rlkey=8b6gota58h6th0qcdw977og3d&st=ivvxtmq8&dl=1",
        isFavorite: false,
        inCart: false,
        price: '2.5',
        trackIndex: 6
      },

  ],

  cart: []
};

export const loadCartFromStorage = createAsyncThunk("tracks/loadCart", async () => {
  try {
    const storedCart = await AsyncStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Ошибка загрузки корзины:", error);
    return [];
  }
});

const trackSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    setTracks: (state, action: PayloadAction<Track[]>) => {
      state.list = action.payload;
    },
    addToCart: (state, action: PayloadAction<string>) => {
      const track = state.list.find((t) => t.id === action.payload);
      if (track && !state.cart.some((t) => t.id === action.payload)) {
        state.cart.push({ ...track, inCart: true });
        AsyncStorage.setItem("cart", JSON.stringify(state.cart)); // Сохранение в AsyncStorage
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter((t) => t.id !== action.payload);
      AsyncStorage.setItem("cart", JSON.stringify(state.cart)); // Обновляем AsyncStorage
    },
    clearCart: (state) => {
      state.cart = [];
      AsyncStorage.removeItem("cart"); // Удаляем из AsyncStorage
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCartFromStorage.fulfilled, (state, action) => {
      state.cart = action.payload;
    });
  },
});

export const {  addToCart, removeFromCart, clearCart } = trackSlice.actions;
export default trackSlice.reducer;
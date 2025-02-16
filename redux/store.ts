import {configureStore} from '@reduxjs/toolkit';
import  authReducer  from './authSlice';
import themeReducer from './themeSlice';
import trackReducer, {loadCartFromStorage} from './trackSlice';
import playerReducer from './slicePlayer'



const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        tracks: trackReducer,
        player: playerReducer

    }
})

store.dispatch(loadCartFromStorage()); // Загружаем корзину при старте


export type RootState = ReturnType  <typeof store.getState>;

export type AppDispatch =  typeof store.dispatch;

export default store;
// #region Imports
import { configureStore } from '@reduxjs/toolkit';
import singletonHelperReducer from 'Redux/slices/singletonHelperSlice.ts';
// #endregion

const store = configureStore({
    reducer: {
        singletonHelper: singletonHelperReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
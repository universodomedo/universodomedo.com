// #region Imports
import { configureStore } from '@reduxjs/toolkit';
import fichaHelperReducer, { obterTiposDano, obterPersonagem } from 'Redux/slices/fichaHelperSlice.ts';
// #endregion

const store = configureStore({
    reducer: {
        fichaHelper: fichaHelperReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
    }),
});

store.dispatch(obterTiposDano());
store.dispatch(obterPersonagem());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
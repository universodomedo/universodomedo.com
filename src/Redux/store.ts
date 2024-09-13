// #region Imports
import { configureStore } from '@reduxjs/toolkit';
import fichaHelperReducer, { obterTiposDano, carregaDemo } from 'Redux/slices/fichaHelperSlice.ts';
import singletonHelperReducer from 'Redux/slices/singletonHelperSlice.ts';
// import fichaHelperReducer, { obterTiposDano, selectPersonagemCarregado } from 'Redux/slices/fichaHelperSlice2.ts';
// #endregion

const store = configureStore({
    reducer: {
        singletonHelper: singletonHelperReducer,
        fichaHelper: fichaHelperReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
    }),
});

// store.dispatch(obterTiposDano());
// store.dispatch(selectPersonagemCarregado());
store.dispatch(carregaDemo());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
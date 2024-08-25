// src/Pages/Ficha/container_page.tsx
import React from 'react';
import { Provider } from 'react-redux';
import store from 'Redux/store.ts';
import Ficha from 'Pages/Ficha/page.tsx';

const container_page: React.FC = () => {
    return (
        <Provider store={store}>
            <Ficha />
        </Provider>
    );
};

export default container_page;
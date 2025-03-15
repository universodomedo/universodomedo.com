'use client';

import styles from './styles.module.css';

// import BotaoAcessarComDiscord from 'App/(deslogado)/acessar/botao-discord';

export default function Acessar() {
    const handleLogin = () => {
        window.location.href = 'https://back.universodomedo.com/auth/login';
    };

    return (
        <>
            <h1>Acessar</h1>
            <button onClick={handleLogin} style={{padding: '.6vh'}}>Login</button>
            {/* <BotaoAcessarComDiscord /> */}
        </>
    );
};
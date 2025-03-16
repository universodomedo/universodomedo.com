'use client';

import styles from './styles.module.css';

export default function Acessar() {
    const handleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`;
    };

    return (
        <>
            <h1>Acessar</h1>
            <button onClick={handleLogin} style={{padding: '.6vh'}}>Acessar</button>
        </>
    );
};
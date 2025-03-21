'use client';

import { useState } from "react";
import { authCheck } from "Uteis/ApiConsumer/ConsumerMiddleware";

export default function PaginaAuthCheck() {
    const [emailUser, setEmailUser] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const login = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`;
    };

    async function aplicaAuth() {
        const response = await authCheck();

        if (response.sucesso && response.dados) {
            setEmailUser(response.dados);
        } else {
            setEmailUser('');
            setError(response.erro!);
        }
    }

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>React Discord OAuth</h1>
            {!emailUser ? (
                <button onClick={login} >Login with Discord</button>
            ) : (
                <div>
                    <h2>Welcome, {emailUser}</h2>
                </div>
            )}
            <br /><br />
            <button onClick={aplicaAuth}>Check Auth</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};
"use client";

import { signIn } from 'next-auth/react';

export default function BotaoAcessarComDiscord() {
    return (
        <button onClick={() => signIn('discord')}>
            Continuar com Discord
        </button>
    );
}
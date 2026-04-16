'use client';

import { createContext, useContext } from 'react';
import { TIPOS_ARQUIVO } from 'types-nora-api';

import RecipienteUploader from "Contextos/ContextoUploadImagem/contexto";

interface Contexto__PaginaArtista_AdicionarAvatarDePersonagem__Props {

};

const Contexto__PaginaArtista_AdicionarAvatarDePersonagem = createContext<Contexto__PaginaArtista_AdicionarAvatarDePersonagem__Props | undefined>(undefined);

export const useContexto__PaginaArtista_AdicionarAvatarDePersonagem = (): Contexto__PaginaArtista_AdicionarAvatarDePersonagem__Props => {
    const context = useContext(Contexto__PaginaArtista_AdicionarAvatarDePersonagem);
    if (!context) throw new Error('useContexto__PaginaArtista_AdicionarAvatarDePersonagem precisa estar dentro de um Contexto__PaginaArtista_AdicionarAvatarDePersonagem');
    return context;
};

export default function RecipienteAdicionarAvatarDePersonagem({ idPersonagem }: { idPersonagem: number }) {
    return (
        <Contexto__PaginaArtista_AdicionarAvatarDePersonagem__Provider idPersonagem={idPersonagem} />
    );
};

export const Contexto__PaginaArtista_AdicionarAvatarDePersonagem__Provider = ({ idPersonagem }: { idPersonagem: number }) => {
    return (
        <Contexto__PaginaArtista_AdicionarAvatarDePersonagem.Provider value={{}}>
            <RecipienteUploader tipoArquivo={TIPOS_ARQUIVO.AVATAR_PERSONAGEM} camposExtrasFixos={{ idPersonagem: idPersonagem }} />
        </Contexto__PaginaArtista_AdicionarAvatarDePersonagem.Provider>
    );
};
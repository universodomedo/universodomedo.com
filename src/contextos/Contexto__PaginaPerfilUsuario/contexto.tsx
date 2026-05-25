'use client';

import { PROTOTIPO_LUIZ__recupera_capa_perfil_usuario } from '@/uteis/ApiConsumer/ConsumerMiddleware';
import { createContext, useContext, useEffect, useState } from 'react';
import { CaminhoArquivoArte } from 'types-nora-api';

interface Contexto__PaginaPerfilUsuario__Props {
    caminhoArquivoCapa: CaminhoArquivoArte;
};

const Contexto__PaginaPerfilUsuario = createContext<Contexto__PaginaPerfilUsuario__Props | undefined>(undefined);

export const useContexto__PaginaPerfilUsuario = (): Contexto__PaginaPerfilUsuario__Props => {
    const context = useContext(Contexto__PaginaPerfilUsuario);
    if (!context) throw new Error('useContexto__PaginaPerfilUsuario precisa estar dentro de um Contexto__PaginaPerfilUsuario');
    return context;
};

export const Contexto__PaginaPerfilUsuario__Provider = ({ children }: { children: React.ReactNode }) => {
    const [caminhoArquivoCapa, setCaminhoCapa] = useState<CaminhoArquivoArte | null>(null)

    async function obtemCaminhoCapa() {
        setCaminhoCapa(await PROTOTIPO_LUIZ__recupera_capa_perfil_usuario())
    }

    useEffect(() => {
        obtemCaminhoCapa()
    }, []);

    if (!caminhoArquivoCapa) return;

    return (
        <Contexto__PaginaPerfilUsuario.Provider value={{ caminhoArquivoCapa }}>
            {children}
        </Contexto__PaginaPerfilUsuario.Provider>
    );
};
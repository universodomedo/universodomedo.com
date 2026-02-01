'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ArquivoDto, TIPOS_ARQUIVO } from 'types-nora-api';

import RecipienteUploader from "Contextos/ContextoUploadImagem/contexto";
import { me_obtemArquivoPendente } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import ImagemPendente from 'Componentes/ElementosVisuais/ImagemPendente/ImagemPendente';

interface ContextoPaginaArtistaAdicionarImagemProps {

};

const ContextoPaginaArtistaAdicionarImagem = createContext<ContextoPaginaArtistaAdicionarImagemProps | undefined>(undefined);

export const useContextoPaginaArtistaAdicionarImagem = (): ContextoPaginaArtistaAdicionarImagemProps => {
    const context = useContext(ContextoPaginaArtistaAdicionarImagem);
    if (!context) throw new Error('useContextoPaginaArtistaAdicionarImagem precisa estar dentro de um ContextoPaginaArtistaAdicionarImagem');
    return context;
};

export default function RecipienteUploadArquivoImagemArtista() {
    return (
        <ContextoPaginaArtistaAdicionarImagemProvider />
    );
};

export const ContextoPaginaArtistaAdicionarImagemProvider = () => {
    const [carregando, setCarregando] = useState<string | null>('');
    const [arquivoPendente, setArquivoPendente] = useState<ArquivoDto | null>(null);

    const existeArquivoPendente = !carregando && arquivoPendente;

    async function buscaArquivosPendentes() {
        setCarregando('Verificando sem existem arquivos pendentes');

        try {
            setArquivoPendente(await me_obtemArquivoPendente());
        } catch {
            setArquivoPendente(null);
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        buscaArquivosPendentes();
    }, []);

    if (carregando) return <div>{carregando}</div>;

    return (
        <ContextoPaginaArtistaAdicionarImagem.Provider value={{}}>
            {existeArquivoPendente
                ? <ImagemPendente arquivoPendente={arquivoPendente} />
                : <RecipienteUploader tipoArquivo={TIPOS_ARQUIVO.IMAGEM_ESPECIAL_ARTISTA} />
            }
        </ContextoPaginaArtistaAdicionarImagem.Provider>
    );
};
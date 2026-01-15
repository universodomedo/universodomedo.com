'use client';

import { useEffect, useState } from 'react';
import { RegrasUploadArquivo } from 'types-nora-api';

import { ContextoUploadImagemProvider } from 'Contextos/ContextoUploadImagem/contexto';
import { buscaRegrasPorTipoUpload } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export const ContextoPaginaUplodImagemArtistaProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>('');
    const [regras, setRegras] = useState<RegrasUploadArquivo | null>(null);


    async function buscaAventurasListadas() {
        setCarregando('Buscando Regras para Upload de Imagens');

        try {
            setRegras(await buscaRegrasPorTipoUpload('ImagensArtista'));
        } catch {
            setRegras(null);
        } finally {
            setCarregando(null);
        }
    }
    
    useEffect(() => {
        buscaAventurasListadas();
    }, []);

    if (carregando) return <div>{carregando}</div>;
    if (!regras) return <div>Não foi possível carregar as regras de upload</div>;

    return (
        <ContextoUploadImagemProvider regras={regras} onEnviar={async (arquivo) => { console.log('Upload artista (placeholder):', { nome: arquivo.name, tipo: arquivo.type, tamanhoBytes: arquivo.size }); }}>
            {children}
        </ContextoUploadImagemProvider>
    );
};
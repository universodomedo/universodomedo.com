import { useEffect, useState } from 'react';

import { obtemImagemCapaArte3D } from 'Funcionalidades/ArteDeCapa/arteDeCapa.api';

// Cache (por idProjeto) das imagens base64 de capa, compartilhado entre o item do Orbital e o fundo da página.
// Evita re-buscar a cada re-render/animação, duplicar entre itens iguais, e garante que o fundo apareça instantâneo (sem piscar) quando a capa já foi carregada no orbital.
const cacheImagensCapaArte = new Map<number, string | null>();

export function useImagemCapaArte(idProjeto: number | null): string | null {
    const [imagem, setImagem] = useState<string | null>(() => idProjeto !== null ? cacheImagensCapaArte.get(idProjeto) ?? null : null);

    useEffect(() => {
        if (idProjeto === null) { setImagem(null); return; }
        if (cacheImagensCapaArte.has(idProjeto)) { setImagem(cacheImagensCapaArte.get(idProjeto) ?? null); return; }
        let ativo = true;
        obtemImagemCapaArte3D(idProjeto).then(projeto => {
            const base64 = projeto?.imagemBase64 ?? null;
            cacheImagensCapaArte.set(idProjeto, base64);
            if (ativo) setImagem(base64);
        }).catch(() => { });
        return () => { ativo = false; };
    }, [idProjeto]);

    return imagem;
};

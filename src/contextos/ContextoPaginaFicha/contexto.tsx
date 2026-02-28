'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { FichaDto } from 'types-nora-api';

import { PAGINAS_VISUALIZA_FICHA, PAGINAS_SPA__VISUALIZA_FICHA } from 'Componentes/FluxosSPA/VisualizaFicha/types';
import { useContextoPaginaFichas } from 'Contextos/ContextoPaginaFichas/contexto';
import { toast } from 'Hooks/useToast';
import { me_deleteFichaTemporaria } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaFichaProps {
    navegarPara: (pagina: PAGINAS_SPA__VISUALIZA_FICHA) => void;
    fichaSelecionada: FichaDto;
    podeDeletarFichaTemporaria: boolean;
    deletaFichaTemporaria: () => void;
};

const ContextoPaginaFicha = createContext<ContextoPaginaFichaProps | undefined>(undefined);

export const useContextoPaginaFicha = (): ContextoPaginaFichaProps => {
    const context = useContext(ContextoPaginaFicha);
    if (!context) throw new Error('useContextoPaginaFicha precisa estar dentro de um ContextoPaginaFicha');
    return context;
};

export function SPA_PaginaFicha() { return <ContextoPaginaFichaProvider /> };

const ContextoPaginaFichaProvider = () => {
    const { fichaSelecionada } = useContextoPaginaFichas();

    const [paginaAtual, setPaginaAtual] = useState<PAGINAS_SPA__VISUALIZA_FICHA>('INICIAL');

    const podeDeletarFichaTemporaria: boolean = fichaSelecionada?.fichaTemporaria?.detalheSessaoUnicaAmarrada === null;

    async function deletaFichaTemporaria() {
        const typedFichaTemporariaSelecionada = fichaSelecionada?.paiTipo === 'TEMPORARIA' ? fichaSelecionada.fichaTemporaria : null;

        if (fichaSelecionada?.paiTipo !== 'TEMPORARIA') {
            await toast.erro('Você não pode deletar Personagem');
            return;
        }

        if (!typedFichaTemporariaSelecionada) return;

        const confirmou = window.confirm(`Deseja realmente deletar a ${fichaSelecionada.nomeComDetalhe}?`);

        if (!confirmou) return;

        try {
            await me_deleteFichaTemporaria(typedFichaTemporariaSelecionada);
            await toast.sucesso('Ficha Temporária deletada!', `A ${fichaSelecionada.nomeComDetalhe} foi deletada com sucesso!`, { recarregaPagina: true });
        } catch (e) { await toast.erro('Falha ao deletar arquivo', e instanceof Error ? e.message : 'Falha ao deletar arquivo'); }
    };

    
    function navegarPara(pagina: PAGINAS_SPA__VISUALIZA_FICHA) { setPaginaAtual(pagina); }
    const Pagina = PAGINAS_VISUALIZA_FICHA[paginaAtual];

    if (!fichaSelecionada) return;

    return (
        <ContextoPaginaFicha.Provider value={{ navegarPara, fichaSelecionada, podeDeletarFichaTemporaria, deletaFichaTemporaria }}>
            <Pagina />
        </ContextoPaginaFicha.Provider>
    );
};
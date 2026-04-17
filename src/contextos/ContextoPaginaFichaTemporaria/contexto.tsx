'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { FichaTemporariaVisualizacaoDetalhadaDto } from 'types-nora-api';

import { PAGINAS_SPA__VISUALIZA_FICHA, PAGINAS_VISUALIZA_FICHA } from 'Componentes/FluxosSPA/VisualizaFicha/types';
import { me_deleteFichaTemporaria } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';
import SPA__PaginaFichaTemporaria__Base from 'Componentes/FluxosSPA/VisualizaFicha/paginas/base';

interface ContextoPaginaFichaTemporariaProps {
    navegarPara: (pagina: PAGINAS_SPA__VISUALIZA_FICHA) => void;
    fichaTemporaria: FichaTemporariaVisualizacaoDetalhadaDto;
    podeDeletarFichaTemporaria: boolean;
    podeEvoluirFichaTemporaria: boolean;
    deletaFichaTemporaria: () => void;
    iniciaProcessoEvolucaoFicha: () => void;
};

const ContextoPaginaFichaTemporaria = createContext<ContextoPaginaFichaTemporariaProps | undefined>(undefined);

export const useContextoPaginaFichaTemporaria = (): ContextoPaginaFichaTemporariaProps => {
    const context = useContext(ContextoPaginaFichaTemporaria);
    if (!context) throw new Error('useContextoPaginaFichaTemporaria precisa estar dentro de um ContextoPaginaFichaTemporaria');
    return context;
};

export const ContextoPaginaFichaTemporariaProvider = ({ fichaTemporaria, iniciaProcessoEvolucaoFicha }: { fichaTemporaria: FichaTemporariaVisualizacaoDetalhadaDto; iniciaProcessoEvolucaoFicha: () => void; }) => {
    const [paginaAtual, setPaginaAtual] = useState<PAGINAS_SPA__VISUALIZA_FICHA>('INICIAL');
    
    const fichaEstaAmarrada: boolean = fichaTemporaria.detalheSessaoUnicaAmarrada !== null;
    const podeDeletarFichaTemporaria: boolean = !fichaEstaAmarrada;
    const podeEvoluirFichaTemporaria: boolean = !fichaEstaAmarrada && (fichaTemporaria.nivel.id < 3);

    async function deletaFichaTemporaria() {
        const confirmou = window.confirm(`Deseja realmente deletar a Ficha ${fichaTemporaria.nome}?`);

        if (!confirmou) return;

        try {
            await me_deleteFichaTemporaria(fichaTemporaria);
            await toast.sucesso('Ficha Temporária deletada!', `A ${fichaTemporaria.nome} foi deletada com sucesso!`, { recarregaPagina: true });
        } catch (e) { await toast.erro('Falha ao deletar arquivo', e instanceof Error ? e.message : 'Falha ao deletar arquivo'); }
    };

    
    function navegarPara(pagina: PAGINAS_SPA__VISUALIZA_FICHA) { setPaginaAtual(pagina); }
    const Pagina = PAGINAS_VISUALIZA_FICHA[paginaAtual];

    return (
        <ContextoPaginaFichaTemporaria.Provider value={{ navegarPara, fichaTemporaria, podeDeletarFichaTemporaria, podeEvoluirFichaTemporaria, deletaFichaTemporaria, iniciaProcessoEvolucaoFicha }}>
            <SPA__PaginaFichaTemporaria__Base>
                <Pagina />
            </SPA__PaginaFichaTemporaria__Base>
        </ContextoPaginaFichaTemporaria.Provider>
    );
};
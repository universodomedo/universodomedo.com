'use client';

import { createContext, useContext, useMemo, useState } from 'react';

import { useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';
import { PAGINAS_EDITA_FICHA, PAGINAS_SPA__EDITA_FICHA } from 'Componentes/FluxosSPA/EditaFicha/types';
import RecipientePagina_SPA_EdicaoFicha from 'Componentes/PaginasFicha/EvolucaoFicha/componentes';
import { EtapaGanhoEvolucao_Atributos, EtapaGanhoEvolucao_Classes, EtapaGanhoEvolucao_Estatisticas, EtapaGanhoEvolucao_HabilidadesElementais, EtapaGanhoEvolucao_HabilidadesEspeciais, EtapaGanhoEvolucao_HabilidadesParanormais, EtapaGanhoEvolucao_Pericias, EtapaGanhoEvolucao_ValorMaxAtributo, GanhosEvolucao } from 'Contextos/ContextoEdicaoFicha/classes';

interface ContextoEdicaoFicha_GanhosCarregadosProps {
    stateControl: number;
    executaEAtualiza: (execucao: () => void | Promise<void>) => void;
};

function obtemPaginaAtual(ganhos: GanhosEvolucao): PAGINAS_SPA__EDITA_FICHA {
    if (ganhos.estaAbertoResumoInicial) return 'RESUMO_INICIAL';
    if (ganhos.estaAbertoResumoFinal) return 'RESUMO_FINAL';
    if (ganhos.etapaAtual instanceof EtapaGanhoEvolucao_Classes) return 'SELECAO_CLASSE';
    if (ganhos.etapaAtual instanceof EtapaGanhoEvolucao_ValorMaxAtributo) return 'AUMENTO_MAX_ATRIBUTO';
    if (ganhos.etapaAtual instanceof EtapaGanhoEvolucao_Estatisticas) return 'EDICAO_ESTATISTICAS';
    if (ganhos.etapaAtual instanceof EtapaGanhoEvolucao_Atributos) return 'EDICAO_ATRIBUTOS';
    if (ganhos.etapaAtual instanceof EtapaGanhoEvolucao_Pericias) return 'EDICAO_PERICIAS';
    if (ganhos.etapaAtual instanceof EtapaGanhoEvolucao_HabilidadesEspeciais) return 'INFORME_PONTOS_HABILIDADE_ESPECIAL';
    if (ganhos.etapaAtual instanceof EtapaGanhoEvolucao_HabilidadesParanormais) return 'EDICAO_HABILIDADES_PARANORMAIS';
    if (ganhos.etapaAtual instanceof EtapaGanhoEvolucao_HabilidadesElementais) return 'EDICAO_HABILIDADES_ELEMENTAIS';
    return 'RESUMO_INICIAL';
};

const ContextoEdicaoFicha_GanhosCarregados = createContext<ContextoEdicaoFicha_GanhosCarregadosProps | undefined>(undefined);

export const useContextoEdicaoFicha_GanhosCarregados = (): ContextoEdicaoFicha_GanhosCarregadosProps => {
    const context = useContext(ContextoEdicaoFicha_GanhosCarregados);
    if (!context) throw new Error('useContextoEdicaoFicha_GanhosCarregados precisa estar dentro de um ContextoEdicaoFicha_GanhosCarregados');
    return context;
};

export function SPA_EdicaoFicha() { return <ContextoEdicaoFicha_GanhosCarregadosProvider />; }

const ContextoEdicaoFicha_GanhosCarregadosProvider = () => {
    const { ganhos } = useContextoEdicaoFicha();
    const [stateControl, setStateControl] = useState(0);

    async function executaEAtualiza(execucao: () => void | Promise<void>) {
        await Promise.resolve(execucao());
        setStateControl(state => state + 1);
    };


    const paginaAtual = useMemo(() => obtemPaginaAtual(ganhos), [ganhos, stateControl]);
    const Pagina = PAGINAS_EDITA_FICHA[paginaAtual];

    return (
        <ContextoEdicaoFicha_GanhosCarregados.Provider value={{ stateControl, executaEAtualiza }}>
            <RecipientePagina_SPA_EdicaoFicha>
                <Pagina />
            </RecipientePagina_SPA_EdicaoFicha>
        </ContextoEdicaoFicha_GanhosCarregados.Provider>
    );
};
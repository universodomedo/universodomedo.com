// #region Imports
import { createContext, useContext, useEffect, useState } from 'react';

import { valoresRituaisPericias } from './DadosRituaisPericia.ts';
import { SingletonHelper } from 'Classes/classes_estaticas.ts';
import { ArgsRitual, Pericia } from 'Classes/ClassesTipos/index.ts';

import { useContextoCriaRitual } from 'Contextos/ContextoCriacaoRitual/contexto.tsx';
// #endregion Imports

interface ContextoRitualPericiaProps {
    opcoesPericias: { id: number; texto: string }[];
    selecionaPericia: (idNivel: number) => void;
    periciaSelecionada: Pericia | undefined;
}

export const ContextoRitualPericia = createContext<ContextoRitualPericiaProps | undefined>(undefined);

export const useContextoRitualPericia = (): ContextoRitualPericiaProps => {
    const context = useContext(ContextoRitualPericia);

    if (!context) throw new Error('useContextoRitualPericia precisa estar dentro de um ContextoRitualPericia');

    return context;
};

export const ContextoRitualPericiaProvider = ({ children }: { children: React.ReactNode }) => {
    const { elementoSelecionado, nivelSelecionado, setDadosRitual } = useContextoCriaRitual();

    const valoresDesseElementoNivelCirculo = valoresRituaisPericias.find((ritual) => elementoSelecionado !== undefined && nivelSelecionado !== undefined && ritual.idElemento === elementoSelecionado.id)?.circulosNivel.find((nivel) => nivel.idCirculoNivel === nivelSelecionado?.id)?.pericias.map((pericia) => ({idPericia: pericia.idPericia, valorPE: pericia.valorPE, valorBonus: pericia.valorBonus,})) || [];

    const [opcoesPericias, setOpcoesPericias] = useState<{ id: number; texto: string }[]>([]);

    useEffect(() => {
        const pericias = SingletonHelper.getInstance().pericias;
        setOpcoesPericias(
            valoresDesseElementoNivelCirculo.map(valor => ({
                id: valor.idPericia,
                texto: pericias.find((pericia) => pericia.id === valor.idPericia)!.nome,
            }))
        );
    }, []);

    const [idPericiaSelecionada, setIdPericiaSelecionada] = useState(0);
    const selecionaPericia = (idPericia: number) => setIdPericiaSelecionada(idPericia);
    const periciaSelecionada = SingletonHelper.getInstance().pericias.find(pericia => pericia.id === idPericiaSelecionada);

    const valoresDesseElementoNivelCirculoPericia = valoresDesseElementoNivelCirculo.find(valor => valor.idPericia === periciaSelecionada?.id);

    useEffect(() => {
        setDadosRitual(
            elementoSelecionado === undefined || nivelSelecionado === undefined || periciaSelecionada === undefined || valoresDesseElementoNivelCirculoPericia === undefined
            ? undefined
            : {
                args: { nome: `Aprimorar ${periciaSelecionada.nome}` },
                dadosComportamentos: {
                    dadosComportamentoRitual: { idElemento: elementoSelecionado.id, idCirculoNivel: nivelSelecionado.id }
                },
                dadosAcoes: [ {
                    args: { nome: 'Usar Ritual', idTipoAcao: 1 },
                    dadosComportamentos: {},
                    custos: { custoPE: { valor: valoresDesseElementoNivelCirculoPericia.valorPE }, custoExecucao: [{ idExecucao: 2, valor: 1 }], custoComponente: true },
                    modificadores: [
                        {
                            props: {
                                nome: `Aprimorar ${periciaSelecionada.nome}`,
                                idDuracao: 3,
                                quantidadeDuracaoMaxima: 1,
                                dadosEfeitos: [
                                    {
                                        idLinhaEfeito: periciaSelecionada.refLinhaEfeito.id,
                                        idTipoEfeito: 1,
                                        dadosValoresEfeitos: { valorBonusAdicional: valoresDesseElementoNivelCirculoPericia.valorBonus }
                                    }
                                ],
                                dadosComportamentos: { dadosComportamentoAtivo: [] },
                            }
                        }
                    ],
                    requisitos: [1],
                } ],
            }
        )
    }, [periciaSelecionada])

    return (
        <ContextoRitualPericia.Provider value={{ opcoesPericias, selecionaPericia, periciaSelecionada }}>
            {children}
        </ContextoRitualPericia.Provider>
    );
}
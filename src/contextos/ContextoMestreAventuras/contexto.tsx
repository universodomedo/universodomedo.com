'use client';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { createContext, useContext, useEffect, useState } from 'react';
import { GrupoAventuraDto } from 'types-nora-api';
import { obtemGruposPorMestre } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface EstadoBusca {
    ordenacao: { comparador: ((a: GrupoAventuraDto, b: GrupoAventuraDto) => number) | null; };
    filtros: { predicado: (item: GrupoAventuraDto) => boolean; }[];
}

interface ContextoMestreAventurasProps {
    aventurasFiltradas: GrupoAventuraDto[];
    atualizarBusca: (tipo: 'ordenacao' | 'filtro', operacao: 'adicionar' | 'remover', valor: { comparador?: (a: GrupoAventuraDto, b: GrupoAventuraDto) => number; predicado?: (item: GrupoAventuraDto) => boolean; }) => void;
}

const ContextoMestreAventuras = createContext<ContextoMestreAventurasProps | undefined>(undefined);

export const useContextoMestreAventuras = (): ContextoMestreAventurasProps => {
    const context = useContext(ContextoMestreAventuras);
    if (!context) throw new Error('useContextoMestreAventuras precisa estar dentro de um ContextoMestreAventuras');
    return context;
};

export const ContextoMestreAventurasProvider = ({ children }: { children: React.ReactNode }) => {
    const { usuarioLogado } = useContextoAutenticacao();
    const [gruposAventurasListadas, setGruposAventurasListadas] = useState<GrupoAventuraDto[] | null>(null);

    const [estadoBusca, setEstadoBusca] = useState<EstadoBusca>({
        ordenacao: { comparador: null },
        filtros: []
    });

    const atualizarBusca = (tipo: 'ordenacao' | 'filtro', operacao: 'adicionar' | 'remover', valor: { predicado?: (item: GrupoAventuraDto) => boolean; comparador?: (a: GrupoAventuraDto, b: GrupoAventuraDto) => number; }) => {
        setEstadoBusca(prev => {
            if (tipo === 'ordenacao') return {
                ...prev,
                ordenacao: { comparador: operacao === 'adicionar' ? valor.comparador || null : null }
            };

            const novoPredicado = valor.predicado;

            if (operacao === 'adicionar' && novoPredicado) {
                const codigoPredicado = novoPredicado.toString();

                const predicadoExistenteIndex = prev.filtros.findIndex(f => {
                    const codigoExistente = f.predicado.toString();

                    return codigoExistente.split('.includes(')[0] === codigoPredicado.split('.includes(')[0] || codigoExistente.split('===')[0] === codigoPredicado.split('===')[0];
                });

                if (predicadoExistenteIndex >= 0) {
                    const novosFiltros = [...prev.filtros];
                    novosFiltros[predicadoExistenteIndex] = { predicado: novoPredicado };

                    return {
                        ...prev,
                        filtros: novosFiltros
                    };
                }

                return {
                    ...prev,
                    filtros: [...prev.filtros, { predicado: novoPredicado }]
                };
            } else if (operacao === 'remover') {
                return {
                    ...prev,
                    filtros: []
                };
            }

            return prev;
        });
    };

    const aventurasFiltradas = (() => {
        if (!gruposAventurasListadas || gruposAventurasListadas.length === 0) return [];

        let resultado = gruposAventurasListadas.filter(item => estadoBusca.filtros.every(f => f.predicado(item)));

        if (estadoBusca.ordenacao.comparador) resultado = [...resultado].sort(estadoBusca.ordenacao.comparador);

        return resultado;
    })();

    async function buscaGruposAventuras() {
        setGruposAventurasListadas(await obtemGruposPorMestre(usuarioLogado!.id));
    }

    useEffect(() => {
        buscaGruposAventuras();
    }, []);

    return (
        <ContextoMestreAventuras.Provider value={{ aventurasFiltradas, atualizarBusca }}>
            {children}
        </ContextoMestreAventuras.Provider>
    );
};
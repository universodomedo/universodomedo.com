'use client';

import { EstiloSessaoMestradaDto, RascunhoCompletaDto } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { ContextoPaginaRascunhosMestreProvider, useContextoPaginaRascunhosMestre } from 'Contextos/ContextoPaginaRascunhosMestreProvider/contexto';
import { ContextoPaginaRascunhosMestre__ComRascunhoSelecionadoProvider } from 'Contextos/ContextoPaginaRascunhosMestre__ComRascunhoSelecionado/contexto';
import { ContextoPaginaRascunhosMestre__SemRascunhoSelecionadoProvider } from 'Contextos/ContextoPaginaRascunhosMestre__SemRascunhoSelecionado/contexto';

export default function Conteiner__PaginaRascunhos({ ehSessaoUnica }: { ehSessaoUnica: boolean }) {
    return (
        <ContextoPaginaRascunhosMestreProvider ehSessaoUnica={ehSessaoUnica}>
            <Conteiner__PaginaRascunhos__Interno />
        </ContextoPaginaRascunhosMestreProvider>
    );
};

const Conteiner__PaginaRascunhos__Interno = criaConteiner<PropsConteiner__PaginaRascunhos>({ useEstado, resolveSaida });

type PropsConteiner__PaginaRascunhos = {
    estilosSessaoMestrada: EstiloSessaoMestradaDto[];
    rascunhos: RascunhoCompletaDto[];
    setIdRascunhoSelecionado: (v: number) => void;
    deselecionaRascunho: () => void;
    idRascunhoSelecionado: number | null;
};

function resolveSaida(props: PropsConteiner__PaginaRascunhos): SaidaConteiner {
    if (props.idRascunhoSelecionado) return criaSaidaConteiner(ContextoPaginaRascunhosMestre__ComRascunhoSelecionadoProvider, { idRascunho: props.idRascunhoSelecionado, deselecionaRascunho: props.deselecionaRascunho });

    return criaSaidaConteiner(ContextoPaginaRascunhosMestre__SemRascunhoSelecionadoProvider, { estilosSessaoMestrada: props.estilosSessaoMestrada, rascunhos: props.rascunhos, selecionaRascunho: props.setIdRascunhoSelecionado });
};

function useEstado(): PropsConteiner__PaginaRascunhos {
    const { estilosSessaoMestrada, rascunhos, setIdRascunhoSelecionado, deselecionaRascunho, idRascunhoSelecionado } = useContextoPaginaRascunhosMestre();

    return { estilosSessaoMestrada, rascunhos, setIdRascunhoSelecionado, deselecionaRascunho, idRascunhoSelecionado };
};
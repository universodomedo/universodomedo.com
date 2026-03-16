'use client';

import { AventuraCompletaDto, AventuraParaAssistirDto } from 'types-nora-api';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { useContextoPaginaAssistir } from 'Contextos/ContextoPaginaAssistir/contexto';
import { ContextoMenuAssistirProvider } from 'Contextos/ContextoMenuAssistir/contexto';

export const Conteiner__MenuAssistir = criaConteiner<PropsConteiner__MenuAssistir>({ useEstado, resolveSaida });

type PropsConteiner__MenuAssistir = {
    aventurasListadas: AventuraParaAssistirDto[];
};

function resolveSaida(props: PropsConteiner__MenuAssistir): SaidaConteiner {
    return criaSaidaConteiner(ContextoMenuAssistirProvider, { aventuras: props.aventurasListadas });
};

function useEstado(): PropsConteiner__MenuAssistir {
    const { aventurasListadas } = useContextoPaginaAssistir();

    return { aventurasListadas };
};